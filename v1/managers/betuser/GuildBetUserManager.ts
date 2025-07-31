import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GuildBetUser } from "../../structures/betuser/GuildBetUser";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIPlayer, Optional } from "../../types";
import { APIGuildBetUser } from "../../types/api/APIGuildBetUser";
import { Assertion } from "../../utils/Assertion";

export class GuildBetUserManager {
  /** A cache of users */
  cache: Collection<string, GuildBetUser>;

  /** The rest client */
  rest: REST;

  /** Bet user guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;
    this.rest = rest;

    this.cache = new Collection<string, GuildBetUser>("betUsers");
  }
  async updateMany(data: Optional<APIPlayer>[]) {
    const route = Routes.guilds.resources(this.guild.id, "betUsers", "bulk");
    const payload = { betUsers: data };
    const response = await this.rest.request<APIGuildBetUser[], typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.setAll(response);
    return this.cache;
  }
  async update(id: string, data: Optional<APIGuildBetUser> & { type: "add" | "remove" }) {
    const route = Routes.guilds.betUsers.update(this.guild.id, id);
    const payload: Record<string, any> = {};

    const numericFields = ["coins", "wins", "credit", "losses", "mvps", "games"] as const;
    const arrayFields = ["items", "betsPlayed"] as const;

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
    const user = new GuildBetUser(response, this, this.rest);
    this.cache.set(user.id, user);
    return user;
  }
  set(data: APIGuildBetUser): Collection<string, GuildBetUser> {
    if (!data?.id) return;
    const user = new GuildBetUser(data, this, this.rest);
    this.rest.betUsers.set(user.id, user);
    return this.cache.set(user.id, user);
  }
  setAll(data: APIGuildBetUser[]): Collection<string, GuildBetUser> {
    if (!data) return this.cache;
    for (let user of data) this.set(user);
    return this.cache;
  }
  async resetAll() {
    const route = Routes.guilds.betUsers.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildBetUser[], {}>({
      method: "PUT",
      url: route,
    });
    this.setAll(response);
    return this.cache;
  }
  /**
   * Fetch a user
   * @param id Id of the user to fetch
   * @returns GuildBetUser
   */
  async fetch(id: string, name: string): Promise<GuildBetUser> {
    const route = Routes.guilds.betUsers.get(this.guild.id, id);
    const response = await this.rest.request<APIGuildBetUser, { name: string }>({
      method: "get",
      url: route,
      payload: { name },
    });
    if (!response) return this.cache.get(id);

    const user = new GuildBetUser(response, this, this.rest);
    this.cache.set(user?.id, user);
    this.rest.betUsers.set(user?.id, user);

    return user;
  }

  async fetchAll(): Promise<Collection<string, GuildBetUser>> {
    const route = Routes.guilds.betUsers.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildBetUser[], {}>({
      method: "get",
      url: route,
    });
    if (Array.isArray(response) && response.length === 0) {
      this.cache.clear();
      return this.cache;
    }
    this.setAll(response);
    return this.cache;
  }

  async delete(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.betUsers.delete(id, this.guild.id);
    const betUser = this.cache.get(id);
    this.rest.emit("betDelete", betUser);

    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.betUsers.deleteAll(this.guild.id);
    this.rest.emit("betsDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
