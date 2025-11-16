import { REST, Routes } from "../../rest";
import { Collection, MinesGame } from "../../structures";
import { APIMinesGame, Optional } from "../../types";

interface FetchOptions {
  cache?: boolean;
  gameId?: string;
}
export class MinesGameManager {
  cache: Collection<string, MinesGame>;

  readonly rest: REST;
  constructor(rest: REST) {
    this.cache = new Collection<string, MinesGame>("minesgames");
    this.rest = rest;
  }

  async create(data: Optional<APIMinesGame>) {
    const route = "/minesgames";
    const response = await this.rest.request<APIMinesGame[], {}>({
      method: "POST",
      url: route,
      payload: data,
    });
    return this.set(response) as MinesGame;
  }
  async delete(gameId: string) {
    const route = `/minesgames/${gameId}`;
    const response = await this.rest.request<unknown, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.delete(gameId);
    return response;
  }
  async fetch(options?: FetchOptions) {
    if (options && options.cache) return this.cache;
    if (options && options.gameId) {
      const route = `/minesgames/${options.gameId}`;
      const response = await this.rest.request<APIMinesGame, {}>({
        method: "GET",
        url: route,
      });
      const game = new MinesGame(response, this);
      this.set(game);
      return game as MinesGame;
    }

    const route = "/minesgames";
    const response = await this.rest.request<APIMinesGame[], {}>({
      method: "GET",
      url: route,
    });
    return this.set(response);
  }
  set(data: APIMinesGame | APIMinesGame[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _game of data) {
        const game = new MinesGame(_game, this);
        this.cache.set(game._id, game);
      }
      return this.cache;
    } else {
      const game = new MinesGame(data, this);
      this.cache.set(game._id, game);
      return game;
    }
  }
}
