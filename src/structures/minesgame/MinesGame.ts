import { MinesGameManager } from "../../managers/minesgame/MinesGameManager";
import { REST, Routes } from "../../rest";
import { APIMinesGame, Optional } from "../../types";

export class MinesGame {
  guild_id: string;
  _id: string;
  creatorId: string;
  maxMines: number;
  bombs: number;

  bombsPosition: number[];
  bet: number;
  multiplier: number;
  status: "created" | "won" | "lost" | "expired";

  createdAt: Date;
  updatedAt: Date;
  readonly rest: REST;
  readonly manager: MinesGameManager;

  constructor(data: APIMinesGame, manager: MinesGameManager) {
    this.manager = manager;
    this.rest = manager.rest;

    this.guild_id = data?.guild_id;
    this.bombsPosition = data?.bombsPosition;
    this._id = data?._id;
    this.multiplier = data?.multiplier;
    this.creatorId = data?.creatorId;
    this.maxMines = data?.maxMines;
    this.bombs = data?.bombs;
    this.bet = data?.bet;
    this.status = data?.status;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
  }

  async fetch() {
    const route = `/${Routes.fields("minesgames", this._id)}`;
    const response = await this.rest.request<APIMinesGame, {}>({
      method: "GET",
      url: route,
    });
    return this._updateInternals(response);
  }
  async delete() {
    const route = `/${Routes.fields("minesgames", this._id)}`;
    const response = await this.rest.request<APIMinesGame, {}>({
      method: "delete",
      url: route,
    });
    return this._updateInternals(response);
  }
  async update(data: Optional<APIMinesGame>) {
    const route = `/${Routes.fields("minesgames", this._id)}`;
    const response = await this.rest.request<APIMinesGame, {}>({
      method: "PATCH",
      url: route,
      payload: data,
    });
    return this._updateInternals(response);
  }
  _updateInternals(data: Optional<APIMinesGame>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIMinesGame];
      }
    }
    this.updatedAt = new Date();
    this.manager.set(this);
    return this;
  }
}
