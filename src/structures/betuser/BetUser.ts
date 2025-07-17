import { isKeyObject } from "util/types";
import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Daily, Items, Optional, ProfileCard } from "../../types/api";
import { APIGuildBetUser } from "../../types/api/APIGuildBetUser";
import { Guild } from "../guild/Guild";

export class BetUser implements APIGuildBetUser {
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

  /** User's items */
  items: Items[];

  /** User's profile card */
  profileCard: ProfileCard;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;

  /**
   * Bet user
   * @param data  The user's data
   * @param guild The guild
   * @param rest The rest client
   */
  constructor(data: APIGuildBetUser, guild: Guild, rest: REST) {
    this.name = data.name;
    this.id = data.id;
    this.credit = data.credit;
    this.wins = data.wins;
    this.mvps = data.mvps;
    this.losses = data.losses;
    this.coins = data.coins;
    this.blacklist = data.blacklist;
    this.items = data.items;
    this.betsPlayed = data.betsPlayed;
    this.profileCard = data.profileCard;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    this.guild = guild;
    this.rest = rest;
  }

  /**
   * Fetches the user
   * @returns New Instance of the user
   */
  async fetch() {
    const route = Routes.guilds.betUsers.get(this.guild.id, this.id);
    const response = await this.rest.request<APIGuildBetUser, {}>({
      method: "get",
      url: route,
    });
    return new BetUser(response, this.guild, this.rest);
  }

  /**
   * Add a propery
   * @param key The desired key
   * @param value The desired value
   * @returns BetUser
   */
  async add<K extends keyof BetUserAddOptions, V extends BetUserAddOptions[K]>(
    key: K,
    value: V
  ) {
    const route = Routes.guilds.betUsers.resource(this.guild.id, this.id, key);
    const payload = { [key]: value, name: this.name };
    console.log({ payload });

    const resp = await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    this[key] = resp[key];
    return this;
  }

  /**
   * Set the user blacklist
   * @param value Value to set to
   * @returns BetUser
   */
  async setBlacklist(value: boolean) {
    const route = Routes.guilds.betUsers.resource(
      this.guild.id,
      this.id,
      "blacklist"
    );
    const payload = { value, name: this.name };
    await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.blacklist = value;
    return this;
  }

  /**
   * Update certain property
   * @param data The new data to update with
   * @returns
   */
  async update(
    data: Omit<Optional<APIGuildBetUser>, "daily"> & { type?: "add" | "remove" }
  ) {
    const route = Routes.guilds.betUsers.get(this.guild.id, this.id);
    const payload: Record<string, any> = {};

    const numericFields = [
      "coins",
      "wins",
      "credit",
      "losses",
      "mvps",
    ] as const;
    const arrayFields = ["items", "betsPlayed"] as const;

    if (data.type === "add" || data.type === "remove") {
      for (const key in data) {
        if (key === "type") continue;

        const value = data[key as keyof typeof data];

        if (numericFields.includes(key as any)) {
          const current = this[key as keyof typeof this] as number;
          const num = value as number;
          payload[key] = Math.max(
            0,
            data.type === "add" ? current + num : num - current
          );
        } else if (key === "blacklist") {
          payload["blacklist"] = value;
        } else if (arrayFields.includes(key as any)) {
          const current = this[key as keyof typeof this] as any[];
          const incoming = value as any[];

          payload[key] =
            data.type === "add"
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

    return this;
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
