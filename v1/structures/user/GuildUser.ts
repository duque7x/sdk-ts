import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Accessory, Daily, Items, Optional, OriginalChannels, ProfileCard } from "../../types/api";
import { APIGuildUser } from "../../types/api/APIGuildUser";
import { GuildUserManager } from "../../managers/user/GuildUserManager";

export class GuildUser implements APIGuildUser {
  /** User's id */
  id: string;

  /** User name */
  name: string;

  /** User's daily */
  daily: Omit<Daily, "credit">;

  /** User's points */
  points: number;

  /** User's wins */
  wins: number;

  /** User's mvps */
  mvps: number;

  /** User's losses */
  losses: number;

  /** User's games */
  games: number;

  /** If user is blacklisted */
  blacklist: boolean;

  /** User's accessories such as double point */
  accessories: Accessory[];

  /** User's original channels */
  originalChannels: OriginalChannels;

  /** User's items */
  items: Items;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given manager */
  readonly manager: GuildUserManager;

  /** The rest client */
  readonly rest: REST;

  /**
   * Bet user
   * @param data  The user's data
   * @param manager The manager
   * @param rest The rest client
   */
  constructor(data: APIGuildUser, manager: GuildUserManager, rest: REST) {
    this.name = data.name;
    this.id = data.id;
    this.wins = data.wins;
    this.mvps = data.mvps;
    this.losses = data.losses;
    this.blacklist = data.blacklist;
    this.items = data.items;
    this.points = data.points;
    this.mvps = data.mvps;
    this.losses = data.losses;
    this.originalChannels = data.originalChannels;
    this.games = data.games;
    this.accessories = data.accessories;
    this.items = data.items;
    this.daily = data?.daily;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.manager = manager;
    this.rest = rest;
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
    const route = Routes.guilds.users.get(this.manager.guild.id, this.id);
    const response = await this.rest.request<APIGuildUser, {}>({
      method: "get",
      url: route,
    });
    const user = new GuildUser(response, this.manager, this.rest);

    this.manager.cache.set(user.id, user);
    this.rest.users.set(user.id, user);
    return user;
  }

  /**
   * Add a propery
   * @param key The desired key
   * @param value The desired value
   * @returns GuildUser
   */
  async add<K extends keyof UserAddOptions, V extends UserAddOptions[K]>(key: K, value: V) {
    const route = Routes.guilds.users.resource(this.manager.guild.id, this.id, key);
    const payload = { [key]: value, name: this.name };

    const resp = await this.rest.request<APIGuildUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    (this as any)[key] = resp[key as keyof APIGuildUser];

    this.manager.cache.set(this.id, this);
    this.rest.users.set(this.id, this);
    return this;
  }

  /**
   * Set the user blacklist
   * @param value Value to set to
   * @returns GuildUser
   */
  async setBlacklist(value: boolean) {
    const route = Routes.guilds.users.resource(this.manager.guild.id, this.id, "blacklist");
    const payload = { value, name: this.name };
    await this.rest.request<APIGuildUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.blacklist = value;
    this.manager.cache.set(this.id, this);
    this.rest.users.set(this.id, this);
    return this;
  }
  async reset() {
    const route = Routes.guilds.users.get(this.manager.guild.id, this.id);
    const payload = { reset: true };
    const response = await this.rest.request<APIGuildUser, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.#updateData(response);
    return this;
  }
  #updateData(data: Optional<APIGuildUser | GuildUser>) {
    for (const k in data) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = data[k as keyof APIGuildUser];
        (this as any).data[k] = data[k as keyof APIGuildUser];
      }
    }
  }
  /**
   * Update certain property
   * @param data The new data to update with
   * @returns
   */
  async update(data: Omit<Optional<APIGuildUser>, "daily"> & { type?: "add" | "remove" }) {
    if (!data.type) data.type = "add";

    const route = Routes.guilds.users.get(this.manager.guild.id, this.id);
    const payload: Record<string, any> = {};

    const numericFields = ["coins", "wins", "points", "losses", "mvps", "games"] as const;
    const arrayFields = ["items", "originalChannels"] as const;

    if (data.type === "add" || data.type === "remove") {
      for (const key in data) {
        if (key === "type") continue;

        const value = data[key as keyof typeof data];

        if (numericFields.includes(key as any)) {
          const current = this[key as keyof typeof this] as number;
          const num = value as number;
          payload[key] = Math.max(0, data.type === "add" ? current + num : num - current);
        } else if (key === "blacklist") {
          payload["blacklist"] = value;
        } else if (arrayFields.includes(key as any)) {
          if (key === "originalChannels") {
            const current = this.originalChannels;
            const fromData = data["originalChannels"];
            let channels: OriginalChannels = [];

            if (data.type === "add") {
              const existingIds = new Set(current.map((ch) => ch.matchId));
              channels = [...current, ...fromData.filter((ch) => !existingIds.has(ch.matchId))];
            } else if (data.type === "remove") {
              const idsToRemove = new Set(fromData.map((ch) => ch.matchId));
              channels = current.filter((ch) => !idsToRemove.has(ch.matchId));
            }

            payload["originalChannels"] = channels;
            continue;
          }

          const current = this[key as keyof typeof this] as any[];
          const incoming = value as any[];

          payload[key] =
            data.type === "add"
              ? [...new Set([...current, ...incoming])]
              : current.filter((x) => !incoming.includes(x));
        }
      }
    }
    const response = await this.rest.request<APIGuildUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGuildUser];
      }
    }
    this.rest.users.set(this.id, this);
    this.manager.cache.set(this.id, this);
    return this;
  }
 
  async delete() {
    const route = Routes.guilds.users.delete(this.manager.guild.id, this.id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.rest.emit("betUserDelete", this);
    this.manager.cache.delete(this.id);
    this.rest.users.set(this.id, this);
    return response;
  }
  toJSON() {
    let json: Record<keyof GuildUser, unknown>;
    for (const [key, value] of Object.entries(this)) {
      if (typeof value !== "function") {
        (json as any)[key] = value;
      }
    }
    return json;
  }
}

export interface UserAddOptions extends APIGuildUser {
  coins: number;
  points: number;
  wins: number;
  losses: number;
  mvps: number;
}
