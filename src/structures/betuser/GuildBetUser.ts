import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Accessory, APIAdvert, Daily, Optional, OriginalChannel, OriginalChannels, Profile } from "../../types/api";
import { APIGuildBetUser } from "../../types/api/APIGuildBetUser";
import { GuildBetUserManager } from "../../managers/betuser/GuildBetUserManager";

export class GuildBetUser implements APIGuildBetUser {
  /** User daily */
  daily: Omit<Daily, "points">;

  profile: Profile;

  /** User's name */
  id: string;
  guild_id: string;

  /** User's credit */
  credit: number;

  /** User's wins */
  wins: number;

  /** User's mvps */
  mvps: number;

  /** User's losses */
  losses: number;

  /** User's games */
  games: number;

  /** User's blacklist */
  blacklist: boolean;

  /** User's coins */
  coins: number;

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
  constructor(data: APIGuildBetUser, manager: GuildBetUserManager) {
    this.id = data?.id;
    this.guild_id = data?.guild_id;
    this.manager = manager;
    this.rest = manager.rest;

    this.wins = data?.wins;
    this.losses = data?.losses;

    this.daily = data?.daily;
    this.games = data?.games;

    this.blacklist = data?.blacklist;

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
    const route = Routes.guilds.betusers.get(this.manager.guild.id, this.id);
    const response = await this.rest.request<APIGuildBetUser, {}>({
      method: "get",
      url: route,
    });
    const user = new GuildBetUser(response, this.manager);

    this.manager.cache.set(user.id, user);
    this.rest.betusers.set(user.id, user);
    return user;
  }

  /**
   * Set the user blacklist
   * @param value Value to set to
   * @returns GuildBetUser
   */
  async setBlacklist(value: boolean) {
    const route = Routes.guilds.betusers.resource(this.manager.guild.id, this.id, "blacklist");
    const payload = { set: value };
    await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.blacklist = value;
    this.manager.cache.set(this.id, this);
    this.rest.betusers.set(this.id, this);
    return this;
  }
  async reset() {
    const route = Routes.guilds.betusers.get(this.manager.guild.id, this.id);
    const payload = { reset: true };
    const response = await this.rest.request<APIGuildBetUser, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this._updateInternals(response);
    return this;
  }
  async updateProfile(data: Optional<Profile>) {
    const _data: { profile: Profile } = {
      profile: {
        avatarUrl: data.avatarUrl || this.profile.avatarUrl || "",
        bannerUrl: data.bannerUrl || this.profile.bannerUrl || "",
        bio: data.bio || this.profile.bio || "Melhor da minha aldeia (use !bio para alterar)",
        name: data.name || this.profile.name || "",

        textColor: data.textColor || this.profile.textColor || "#ffffff",
        primaryColor: data.primaryColor || this.profile.primaryColor || "#272727",
        secondaryColor: data.secondaryColor || this.profile.secondaryColor || "#151515",
      },
    };
    const route = Routes.guilds.betusers.update(this.manager.guild.id, this.id);
    const response = await this.rest.request<APIGuildBetUser, {}>({
      method: "patch",
      url: route,
      payload: _data,
    });

    this._updateInternals(response);
    return this;
  }
  _updateInternals(data: Optional<APIGuildBetUser>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIGuildBetUser];
      }
    }

    this.updatedAt = new Date();
    this.createdAt = new Date(data.createdAt);

    this.manager.set(this);
    this.rest.emit("betuserUpdate", this);
    return this;
  }

  /**
   * Update certain property
   * @param data The new data to update with
   * @returns
   */
  async update(data: Omit<Optional<APIGuildBetUser>, "daily"> & { type?: "add" | "remove" }) {
    if (!data?.type) data.type = "add";

    const route = Routes.guilds.betusers.get(this.manager.guild.id, this.id);
    let payload: Record<string, any> = {};

    const numericFields = ["wins", "credit", "losses", "mvps", "games"] as const;
    const arrayFields = ["items", "original_channels", "adverts", "accessories"] as const;
    if (data?.type === "add" || data?.type === "remove") {
      for (const key in data) {
        if (key === "type") continue;

        const value = data[key as keyof typeof data];

        if (numericFields.includes(key as any)) {
          const current = (this[key as keyof typeof this] || 0) as number;
          const num = (value || 0) as number;
          payload[key] = Math.max(0, data?.type === "add" ? current + num : current - num);
        } else if (key === "blacklist") {
          payload["blacklist"] = value;
        } else if (key === "profile") {
          payload["profile"] = value;
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
    this._updateInternals(response);
    return this;
  }

  async delete() {
    const route = Routes.guilds.betusers.delete(this.manager.guild.id, this.id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.rest.emit("betuserDelete", this);
    this.manager.cache.delete(this.id);

    return response;
  }
  toJSON(): Optional<APIGuildBetUser> {
    let json: { [K in keyof GuildBetUser]?: GuildBetUser[K] } = {};

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
