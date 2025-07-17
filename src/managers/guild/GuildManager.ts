import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuild } from "../../types/api/APIGuild";

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
    this.cache = new Collection<string, Guild>();
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

    return new Guild(response, this.rest);
  }

  async fetchAll() {
    const route = Routes.guilds.getAll();
    const response = await this.rest.request<APIGuild[], {}>({
      method: "get",
      url: route,
    });

    for (let guildData of response) {
      this.cache.set(guildData.id, new Guild(guildData, this.rest));
    }
    return this.cache;
  }
}
