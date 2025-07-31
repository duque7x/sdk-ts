import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuild } from "../../types/api/APIGuild";
import { Assertion } from "../../utils/Assertion";

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
  async fetch(id: string): Promise<Guild> {
    const route = Routes.guilds.get(id);
    const response = await this.rest.request<APIGuild, {}>({
      method: "get",
      url: route,
    });
    const guild = new Guild(response, this.rest);
    this.cache.set(guild.id, guild);
    return guild;
  }

async fetchAll() {
    const route = Routes.guilds.getAll();
    const response = await this.rest.request<APIGuild[], {}>({
      method: "get",
      url: route,
    });

    for (let guildData of response) {
      if (!guildData.id) continue;
      const guild = new Guild(guildData, this.rest);

      this.cache.set(guild.id, guild);
      this.rest.guilds.cache.set(guild.id, guild);
    }
    return this.cache;
  }

  async delete(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.delete(id);
    const guild = this.cache.get(id);
    this.rest.emit("guildDelete", guild);

    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.deleteAll();
    this.rest.emit("guildsDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
