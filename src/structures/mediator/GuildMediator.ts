import { GuildMediatorManager } from "../../managers/mediator/GuildMediatorManager";
import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Accessory, APIAdvert, Daily, Optional, OriginalChannel, OriginalChannels, Profile } from "../../types/api";
import { APIGuildMediator } from "../../types/api/APIGuildMediator";
import { Guild } from "../guild/Guild";

export class GuildMediator implements APIGuildMediator {
  /** User's name */
  id: string;
  guild_id: string;

  /** User's games */
  games: number;

  paypal: string;
  revolut: string;
  mbway: string;
  external_links: string[];
  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
  /** The given manager */
  readonly manager: GuildMediatorManager;

  /** The rest client */
  readonly rest: REST;
  readonly guild: Guild;

  /**
   * Bet user
   * @param data  The user's data
   * @param manager The manager
   * @param rest The rest client
   */
  constructor(data: APIGuildMediator, manager: GuildMediatorManager) {
    this.id = data?.id;
    this.guild_id = data?.guild_id;
    this.manager = manager;
    this.rest = manager.rest;
    this.guild = manager.guild;

    this.games = data?.games;
    this.paypal = data?.paypal;
    this.revolut = data?.revolut;
    this.mbway = data?.mbway;
    this.external_links = data?.external_links;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
  }
  /** String representation of this user */
  toString() {
    return `<@${this.id}>`;
  }
  /**
   * Fetches the user
   * @returns New Instance of the user
   */
  async fetch() {
    const route = Routes.guilds.mediators.get(this.manager.guild.id, this.id);
    const response = await this.rest.request<APIGuildMediator, {}>({
      method: "get",
      url: route,
    });
    const user = new GuildMediator(response, this.manager);

    this.manager.cache.set(user.id, user);
    this.rest.mediators.set(user.id, user);
    return user;
  }

  async reset() {
    const route = Routes.guilds.mediators.get(this.manager.guild.id, this.id);
    const payload = { reset: true };
    const response = await this.rest.request<APIGuildMediator, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    return this._updateInternals(response);
  }

  _updateInternals(data: Optional<APIGuildMediator>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIGuildMediator];
      }
    }

    this.updatedAt = new Date();
    this.createdAt = new Date(data.createdAt);

    this.manager.set(this);
    return this;
  }

  /**
   * Update certain property
   * @param data The new data to update with
   * @returns
   */
  async update(data: Optional<APIGuildMediator>) {
    const route = Routes.guilds.mediators.get(this.manager.guild.id, this.id);
    let payload: Record<string, any> = data;

    const response = await this.rest.request<APIGuildMediator, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setPaymentlink(type: string, link: string) {
    const route = Routes.guilds.mediators.get(this.manager.guild.id, this.id);
    let payload: Record<string, any> = { [type]: link };

    const response = await this.rest.request<APIGuildMediator, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async delete() {
    const route = Routes.guilds.mediators.delete(this.manager.guild.id, this.id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.manager.cache.delete(this.id);

    return response;
  }
  toJSON(): Optional<APIGuildMediator> {
    let json: { [K in keyof GuildMediator]?: GuildMediator[K] } = {};

    for (const [key, value] of Object.entries(this)) {
      const exclude = ["rest", "guilds", "guild", "manager"];
      if (exclude.includes(key)) continue;

      if (typeof value !== "function") {
        (json as any)[key] = value;
      }
    }
    return json;
  }
}
