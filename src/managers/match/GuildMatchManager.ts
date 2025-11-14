import { Routes } from "../../rest/Routes";
import { GuildMatch } from "../../structures/match/GuildMatch";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuildMatch } from "../../types/api/APIGuildMatch";
import { Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { BaseManager } from "../base";

type FetchOptions = {
  cache: boolean;
  matchId: string;
};
export class GuildMatchManager extends BaseManager<GuildMatch> {
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild) {
    super(guild, guild.rest);
    this.guild = guild;
    this.rest = guild.rest;

    this.base_url = Routes.guilds.resource(guild.id, "matches");
    this.cache = new Collection<string, GuildMatch>("matches");
  }

  /**
   * Fetch a match
   * @param id Id of the match to fetch
   * @returns APIBetUser
   */
  async fetch(options?: Optional<FetchOptions>) {
    if (options && options.cache) return this.cache;
    if (options && options.matchId) {
      const route = Routes.guilds.matches.get(this.guild.id, options.matchId);
      const response = await this.rest.request<APIGuildMatch, {}>({
        method: "get",
        url: route,
      });
      return this.set(response);
    }
    const route = Routes.guilds.matches.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildMatch[], {}>({
      method: "get",
      url: route,
    });
    if (!response) return this.cache;

    const coll = new Collection<string, GuildMatch>("matches");
    for (let match of response ?? []) {
      const guildMatch = new GuildMatch(match, this);
      coll.set(match._id, guildMatch);
      this.rest.matches.set(match._id, guildMatch);
    }

    this.cache = coll;
    return coll;
  }

  async fetchAll() {
    const route = Routes.guilds.matches.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildMatch[], {}>({
      method: "get",
      url: route,
    });
    if (Array.isArray(response) && response.length === 0) {
      this.cache.clear();
      return this.cache;
    }
    this.set(response);
    return this.cache;
  }
  set(data: APIGuildMatch | APIGuildMatch[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _match of data) {
        const match = new GuildMatch(_match, this);
        this.cache.set(match._id, match);
      }
      return this.cache;
    } else {
      const match = new GuildMatch(data, this);
      this.cache.set(match._id, match);
      return match;
    }
  }

  async create(payload: Optional<APIGuildMatch>): Promise<GuildMatch> {
    Assertion.assertObject(payload);

    const route = Routes.guilds.matches.create(this.guild.id);
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    return this.set(response) as GuildMatch;
  }

  async delete(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.matches.delete(id, this.guild.id);
    const match = this.cache.get(id);
    this.rest.emit("matchDelete", match);

    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.matches.deleteAll(this.guild.id);
    this.rest.emit("matchesDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
