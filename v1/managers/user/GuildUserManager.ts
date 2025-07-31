import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GuildUser } from "../../structures/user/GuildUser";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuildUser } from "../../types/api/APIGuildUser";
import { Assertion } from "../../utils/Assertion";
import { Optional } from "../../types";

export class GuildUserManager {
  /** A cache of users */
  cache: Collection<string, GuildUser>;

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

    this.cache = new Collection<string, GuildUser>("users");
  }

  /**
   * Fetch a user
   * @param id Id of the user to fetch
   * @returns GuildUser
   */
  async fetch(id: string, name: string): Promise<GuildUser> {
    const route = Routes.guilds.users.get(this.guild.id, id);
    const response = await this.rest.request<APIGuildUser, { name: string }>({
      method: "get",
      url: route,
      payload: { name },
    });
    if (!response) return this.cache.get(id);

    const user = new GuildUser(response, this, this.rest);
    this.cache.set(user?.id, user);
    this.rest.users.set(user?.id, user);

    return user;
  }

  async fetchAll(): Promise<Collection<string, GuildUser>> {
    const route = Routes.guilds.users.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildUser[], {}>({
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
  async updateUser(id: string, name: string, data: Optional<APIGuildUser>) {
    const route = Routes.guilds.users.update(this.guild.id, id);
    const payload = { ...data, name };
    const response = await this.rest.request<APIGuildUser, typeof payload>({
      method: "Patch",
      url: route,
      payload,
    });
    const user = this.set(response);
    return user;
  }
  set(data: APIGuildUser): GuildUser {
    if (!data?.id) return;
    const user = new GuildUser(data, this, this.rest);
    this.cache.set(user?.id, user);
    this.rest.users.set(user?.id, user);

    return user;
  }
  setAll(data: APIGuildUser[]): Collection<string, GuildUser> {
    if (!data) return this.cache;
    for (let user of data) this.set(user);
    return this.cache;
  }
  async resetAll() {
    const route = Routes.guilds.users.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildUser[], {}>({
      method: "PUT",
      url: route,
    });
    this.setAll(response);
    return this.cache;
  }
  async delete(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.users.delete(id, this.guild.id);
    const user = this.cache.get(id);
    this.rest.emit("userDelete", user);

    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.users.deleteAll(this.guild.id);
    this.rest.emit("usersDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
