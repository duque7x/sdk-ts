import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuild } from "../../types/api/APIGuild";
import { Assertion } from "../../utils/Assertion";

type FetchOptions = {
  guildId?: string;
  cache?: boolean;
};

type DeleteOptions = {
  guildId?: string;
};

export class GuildManager {
  /** A cache of guilds */
  cache: Collection<string, Guild>;

  /** The rest client */
  rest: REST;

  /**
   * Manage guilds with the given client
   * @param guilds An array of guilds
   * @param rest The rest client
   */
  constructor(rest: REST) {
    this.cache = new Collection<string, Guild>("guilds");
    this.rest = rest;
  }

  /**
   * Fetch a guild
   * @param id Id of the guild to fetch
   * @returns APIGuild
   */
  async fetch(options?: FetchOptions): Promise<Collection<string, Guild> | Guild> {
    if (options && options.cache) return this.cache;
    if (options && options.guildId) {
      const route = Routes.guilds.get(options.guildId);
      const response = await this.rest.request<APIGuild, {}>({
        method: "get",
        url: route,
      });
      const guild = new Guild(response, this.rest);
      await guild._start().then((g) => {
        this.cache.set(g.id, g);
      });
      this.cache.set(guild.id, guild);
      return guild as Guild;
    }
    const route = Routes.guilds.getAll();
    const response = await this.rest.request<APIGuild[], {}>({
      method: "get",
      url: route,
    });

    for (let _guild of response) {
      if (!_guild.id) continue;
      const guild = new Guild(_guild, this.rest);
      await guild._start().then((g) => {
        this.cache.set(g.id, g);
      });
    }
    return this.cache;
  }

  async delete(options: DeleteOptions): Promise<Collection<string, Guild> | boolean> {
    if (options && options.guildId) {
      Assertion.assertString(options.guildId);

      const route = Routes.guilds.delete(options.guildId);
      const guild = this.cache.get(options.guildId);
      this.rest.emit("guildDelete", guild);

      await this.rest.request<boolean, {}>({
        method: "DELETE",
        url: route,
      });

      this.cache.delete(options.guildId);
      return this.cache;
    }
    const route = Routes.guilds.deleteAll();
    this.rest.emit("guildsDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
  set(data: APIGuild | APIGuild[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _guild of data) {
        const guild = new Guild(_guild, this.rest);
        this.cache.set(guild.id, guild);
      }
      return this.cache;
    } else {
      const guild = new Guild(data, this.rest);
      this.cache.set(guild.id, guild);
      return guild;
    }
  }
}
