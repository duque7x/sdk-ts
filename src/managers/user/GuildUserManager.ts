import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildUser } from "../../structures/user/GuildUser";
import { APIGuildUser, Optional } from "../../types";
import { BaseManager } from "../base";

type FetchOptions = {
  userId?: string;
  cache?: boolean;
};
export class GuildUserManager extends BaseManager<GuildUser> {
  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.guilds.users.getAll(guild.id);
    this.cache = new Collection<string, GuildUser>("users");
  }

  async fetch(options?: FetchOptions): Promise<Collection<string, GuildUser> | GuildUser> {
    if (options && options.cache) return this.cache;
    if (options && options.userId) {
      const route = Routes.fields(this.base_url, options.userId);
      const response = await this.rest.request<APIGuildUser, {}>({
        method: "GET",
        url: route,
      });
      const user = new GuildUser(response, this);
      this.set(user);
      return user as GuildUser;
    }
    const route = this.base_url;
    const response = await this.rest.request<APIGuildUser[], {}>({
      method: "GET",
      url: route,
    });
    this.cache.clear();
    for (let userData of response) {
      const user = new GuildUser(userData, this);
      this.set(user);
    }
    return this.cache;
  }
  async updateMany(...users: Optional<APIGuildUser>[]): Promise<Collection<string, GuildUser>> {
    const route = this.base_url;
    const response = await this.rest.request<APIGuildUser[], { users: Optional<APIGuildUser>[] }>({
      method: "PATCH",
      url: route,
      payload: { users },
    });

    for (const userData of response) {
      const user = new GuildUser(userData, this);
      this.set(user);
    }

    return this.cache;
  }

  async deleteAll() {
    const route = this.base_url;
    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.clear();
  }
  async resetAll() {
    const route = this.base_url;
    const response = await this.rest.request<APIGuildUser[], {}>({
      method: "put",
      url: route,
    });

    this.cache.clear();
    this.set(response);
    return this.cache;
  }

  set(data: APIGuildUser | APIGuildUser[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _user of data) {
        if (!_user.id) return;
        const user = new GuildUser(_user, this);
        this.cache.set(user.id, user);
        this.rest.users.set(user.id, user);
      }
      return this.cache;
    } else {
      if (!data.id) return;
      const user = new GuildUser(data, this);
      this.cache.set(user.id, user);
      this.rest.users.set(user.id, user);
      return user;
    }
  }
}
