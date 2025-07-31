import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Daily, Items, Optional, ProfileCard } from "../../types/api";
import { APIGuildBetUser } from "../../types/api/APIGuildBetUser";
import { GuildBetUserManager } from "../../managers/betuser/GuildBetUserManager";

export class GuildBetUser implements APIGuildBetUser {
  /** User daily */
  daily: Omit<Daily, "points">;

  /** User's name */
  name: string;

  /** User's name */
  id: string;

  /** User's credit */
  credit: number;

  /** User's wins */
  wins: number;

  /** User's mvps */
  mvps: number;

  /** User's losses */
  losses: number;

  /** User's bets played */
  betsPlayed: string[];

  /** User's blacklist */
  blacklist: boolean;

  /** User's coins */
  coins: number;
  games: number;
  /** User's items */
  items: Items;

  /** User's profile card */
  profileCard: ProfileCard;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given manager */
  readonly manager: GuildBetUserManager;

  /** The rest client */
  readonly rest: REST;

  /**
   * Bet user
   * @param data  The user's data
   * @param manager The manager
   * @param rest The rest client
   */
  constructor(data: APIGuildBetUser, manager: GuildBetUserManager, rest: REST) {
    this.name = data?.name;
    this.id = data?.id;
    this.credit = data?.credit;
    this.wins = data?.wins;
    this.mvps = data?.mvps;
    this.losses = data?.losses;
    this.games = data?.games;
    this.coins = data?.coins;
    this.blacklist = data?.blacklist;
    this.items = data?.items;
    this.betsPlayed = data?.betsPlayed;
    this.profileCard = data?.profileCard;
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
    const route = Routes.guilds.betUsers.get(this.manager.guild.id, this.id);
    const response = await this.rest.request<APIGuildBetUser, {}>({
      method: "get",
      url: route,
    });
    const user = new GuildBetUser(response, this.manager, this.rest);

    this.manager.cache.set(user.id, user);
    this.rest.betUsers.set(user.id, user);
    return user;
  }

  /**
   * Add a propery
   * @param key The desired key
   * @param value The desired value
   * @returns GuildBetUser
   */
  async add<K extends keyof BetUserAddOptions, V extends BetUserAddOptions[K]>(key: K, value: V) {
    const route = Routes.guilds.betUsers.resource(this.manager.guild.id, this.id, key);
    const payload = { [key]: value, name: this.name };

    const resp = await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    this[key] = resp[key];
    this.manager.cache.set(this.id, this);
    this.rest.betUsers.set(this.id, this);
    return this;
  }
  async reset() {
    const route = Routes.guilds.betUsers.get(this.manager.guild.id, this.id);
    const payload = { reset: true };
    const response = await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.#updateData(response);
    return this;
  }
  #updateData(data: Optional<APIGuildBetUser | GuildBetUser>) {
    for (const k in data) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = data[k as keyof APIGuildBetUser];
        (this as any).data[k] = data[k as keyof APIGuildBetUser];
      }
    }
  }
  /**
   * Set the user blacklist
   * @param value Value to set to
   * @returns GuildBetUser
   */
  async setBlacklist(value: boolean) {
    const route = Routes.guilds.betUsers.resource(this.manager.guild.id, this.id, "blacklist");
    const payload = { value, name: this.name };
    await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.blacklist = value;
    this.manager.cache.set(this.id, this);
    this.rest.betUsers.set(this.id, this);
    return this;
  }

  /**
   * Update certain property
   * @param data The new data to update with
   * @returns
   */
  async update(data: Omit<Optional<APIGuildBetUser>, "daily"> & { type?: "add" | "remove" }) {
    const route = Routes.guilds.betUsers.get(this.manager.guild.id, this.id);
    const payload: Record<string, any> = {};

    const numericFields = ["coins", "wins", "credit", "losses", "mvps", "games"] as const;
    const arrayFields = ["items", "betsPlayed"] as const;

    if (data?.type === "add" || data?.type === "remove") {
      for (const key in data) {
        if (key === "type") continue;

        const value = data[key as keyof typeof data];

        if (numericFields.includes(key as any)) {
          const current = this[key as keyof typeof this] as number;
          const num = value as number;
          payload[key] = Math.max(0, data?.type === "add" ? current + num : num - current);
        } else if (key === "blacklist") {
          payload["blacklist"] = value;
        } else if (arrayFields.includes(key as any)) {
          const current = this[key as keyof typeof this] as any[];
          const incoming = value as any[];

          payload[key] =
            data?.type === "add"
              ? [...new Set([...current, ...incoming])]
              : current.filter((x) => !incoming.includes(x));
        }
      }
    }

    const response = await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGuildBetUser];
      }
    }
    this.updatedAt = new Date();
    this.rest.betUsers.set(this.id, this);
    this.manager.cache.set(this.id, this);
    return this;
  }
  async delete() {
    const route = Routes.guilds.betUsers.delete(this.manager.guild.id, this.id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.rest.emit("betUserDelete", this);
    this.manager.cache.delete(this.id);
    this.rest.betUsers.set(this.id, this);
    return response;
  }
  toJSON() {
    const json: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this)) {
      if (typeof value !== "function") {
        json[key] = value;
      }
    }
    return json;
  }
}

export type BetUserAddOptions = {
  coins: number;
  credit: number;
  wins: number;
  losses: number;
  mvps: number;
};
