import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GuildMatch } from "../../structures/match/GuildMatch";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuildMatch } from "../../types/api/APIGuildMatch";
import { Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";

export class GuildMatchManager {
  /** A cache of users */
  cache: Collection<string, GuildMatch>;

  /** The rest client */
  rest: REST;

  /** GuildMatch match guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;

    this.cache = new Collection<string, GuildMatch>("matches");
    this.rest = rest;
  }

  /**
   * Fetch a match
   * @param id Id of the match to fetch
   * @returns APIBetUser
   */
  async fetch(id: string) {
    const route = Routes.guilds.matches.get(this.guild.id, id);
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "get",
      url: route,
    });
    if (!response.creatorId) return null;

    const match = new GuildMatch(response, this.guild, this, this.rest);
    this.cache.set(match._id, match);
    this.rest.matches.set(match._id, match);

    return match;
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
    this.setAll(response);
    return this.cache;
  }
  set(data: APIGuildMatch): GuildMatch {
    if (!data?._id) return;
    const match = new GuildMatch(data, this?.guild, this, this.rest);

    this.cache.set(data?._id, match);
    this.rest.matches.set(data?._id, match);
    return match;
  }
  setAll(data: APIGuildMatch[]) {
    if (!data) return this.cache;
    for (let match of data || []) this.set(match);
    return this.cache;
  }

  async create(payload: Optional<APIGuildMatch>): Promise<GuildMatch> {
    Assertion.assertObject(payload);

    const route = Routes.guilds.matches.create(this.guild.id);
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    const match = this.set(response);
    return match;
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
