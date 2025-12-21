import { Routes } from "../../rest/Routes";
import { GuildBetUser } from "../../structures/betuser/GuildBetUser";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional, APIGuildBetUser } from "../../types";
import { BaseManager } from "../base";

type FetchOptions = {
  userId?: string;
  cache?: boolean;
};
export class GuildBetUserManager extends BaseManager<GuildBetUser> {
  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.guilds.betusers.getAll(guild.id);
    this.cache = new Collection<string, GuildBetUser>("betusers");
  }

  async fetch(options?: FetchOptions): Promise<Collection<string, GuildBetUser> | GuildBetUser> {
    if (options && options.cache) return this.cache;
    if (options && options.userId) {
      const route = Routes.fields(this.base_url, options.userId);
      const response = await this.rest.request<APIGuildBetUser, {}>({
        method: "GET",
        url: route,
      });
      const user = new GuildBetUser(response, this);
      this.set(user);
      return user as GuildBetUser;
    }
    const route = this.base_url;
    const response = await this.rest.request<APIGuildBetUser[], {}>({
      method: "GET",
      url: route,
    });
    this.set(response);
    return this.cache;
  }
  async updateMany(...betusers: Optional<APIGuildBetUser>[]): Promise<Collection<string, GuildBetUser>> {
    const route = this.base_url;
    const response = await this.rest.request<APIGuildBetUser[], { betusers: Optional<APIGuildBetUser>[] }>({
      method: "PATCH",
      url: route,
      payload: { betusers },
    });

    return this.set(response) as Collection<string, GuildBetUser>;
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
    const response = await this.rest.request<APIGuildBetUser[], {}>({
      method: "put",
      url: route,
    });

    this.cache.clear();
    return this.set(response);
  }

  set(data: APIGuildBetUser | APIGuildBetUser[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _user of data) {
        if (!_user.id) return;
        const user = new GuildBetUser(_user, this);
        this.cache.set(user.id, user);
        this.rest.betusers.set(user.id, user);
      }
      return this.cache;
    } else {
      if (!data.id) return;
      const user = new GuildBetUser(data, this);
      this.cache.set(user.id, user);
      this.rest.betusers.set(user.id, user);
      return user;
    }
  }
}
