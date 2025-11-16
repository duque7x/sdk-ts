import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Accessory, Daily, Items, Optional, OriginalChannel, OriginalChannels } from "../../types/api";
import { APIGuildUser, Profile } from "../../types/api/APIGuildUser";
import { GuildUserManager } from "../../managers/user/GuildUserManager";

export class GuildUser implements APIGuildUser {
  /** User's id */
  id: string;
  guild_id: string;

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
  original_channels: OriginalChannels;
  profile: Profile;
  creations: number;
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
  constructor(data: APIGuildUser, manager: GuildUserManager) {
    this.id = data?.id;
    this.guild_id = data?.guild_id;
    this.manager = manager;
    this.rest = manager.rest;

    this.wins = data?.wins;
    this.losses = data?.losses;
    this.mvps = data?.mvps;
    this.points = data?.points;
    this.creations = data?.creations;

    this.daily = data?.daily;
    this.games = data?.games;

    this.blacklist = data?.blacklist;
    this.accessories = data?.accessories;
    this.original_channels = data?.original_channels;
    this.items = data?.items;
    this.profile = data?.profile;

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
    const route = Routes.guilds.users.get(this.manager.guild.id, this.id);
    const response = await this.rest.request<APIGuildUser, {}>({
      method: "get",
      url: route,
    });
    const user = new GuildUser(response, this.manager);

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
    const payload = { set: value };

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
    const payload = { set: value };
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

    this._updateInternals(response);
    return this;
  }
  _updateInternals(data: Optional<APIGuildUser>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIGuildUser];
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
  async update(data: Omit<Optional<APIGuildUser>, "daily"> & { type?: "add" | "remove" }) {
    if (!data?.type) data.type = "add";

    const route = Routes.guilds.users.get(this.manager.guild.id, this.id);
    let payload: Record<string, any> = {};

    const numericFields = ["coins", "wins", "points", "losses", "mvps", "games"] as const;
    const arrayFields = ["items", "original_channels"] as const;
    if (data?.type === "add" || data?.type === "remove") {
      for (const key in data) {
        if (key === "type") continue;

        const value = data[key as keyof typeof data];

        if (numericFields.includes(key as any)) {
          const current = this[key as keyof typeof this] as number;
          const num = value as number;
          payload[key] = Math.max(0, data?.type === "add" ? current + num : current - num);
        } else if (key === "blacklist") {
          payload["blacklist"] = value;
        } else if (key === "profile") {
          payload["profile"] = value;
        } else if (arrayFields.includes(key as any)) {
          if (key === "original_channels") {
            const current = this.original_channels;
            const fromData = data["original_channels"];
            let channels: OriginalChannels = [];

            if (data?.type === "add") {
              const existingIds = new Set(current.map((ch) => ch.matchId));
              channels = [...current, ...fromData.filter((ch: OriginalChannel) => !existingIds.has(ch.matchId))];
            } else if (data?.type === "remove") {
              const idsToRemove = new Set(fromData.map((ch: OriginalChannel) => ch.matchId));
              channels = current.filter((ch) => !idsToRemove.has(ch.matchId));
            }

            payload["original_channels"] = channels;
            continue;
          }

          const current = this[key as keyof typeof this] as any[];
          const incoming = value as any[];

          payload[key] =
            data?.type === "add"
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
    this.updatedAt = response?.updatedAt ? new Date(response?.updatedAt) : new Date();
    this.createdAt = response?.createdAt ? new Date(response?.createdAt) : new Date();

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

    this.rest.emit("userDelete", this);
    this.manager.cache.delete(this.id);

    return response;
  }
  toJSON(): Optional<APIGuildUser> {
    let json: { [K in keyof GuildUser]?: GuildUser[K] } = {};

    for (const [key, value] of Object.entries(this)) {
      const exclude = ["rest", "guilds", "manager"];
      if (exclude.includes(key)) continue;

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
