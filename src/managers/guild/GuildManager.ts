import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { APIGuild } from "../../types/api/APIGuild";

export class GuildManager {
  /** A cache of guilds */
  cache: Collection<string, typeof APIGuild>;

  /** The rest client */
  rest: REST;

  /**
   * Manage guilds with the given client
   * @param guilds An array of guilds
   * @param rest The rest client
   */
  constructor(rest: REST) {
    this.cache = new Collection<string, typeof APIGuild>();
    this.rest = rest;

  }

  /**
   * Fetch a guild
   * @param id Id of the guild to fecth
   * @returns APIGuild
   */
  async fecth(id: string) {
    const route = Routes.guilds.get(id);
    const response = await this.rest.request<typeof APIGuild>({
      method: "get",
      url: route,
    });

    return response;
  }

  async fetchAll() {
    const route = Routes.guilds.getAll();
    const response = await this.rest.request<(typeof APIGuild)[]>({
      method: "get",
      url: route,
    });
    console.log({
      response,
      route
    });
    
    for (let dt of response) this.cache.set(dt.id, dt);
    return response;
  }
}
