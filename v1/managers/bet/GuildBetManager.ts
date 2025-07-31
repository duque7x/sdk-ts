import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GuildBet } from "../../structures/bet/GuildBet";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional } from "../../types/api";
import { APIGuildBet } from "../../types/api/APIGuildBet";
import { Assertion } from "../../utils/Assertion";

type OptionalGuildBet = Optional<APIGuildBet>;

export class GuildBetManager {
  /** A cache of users */
  cache: Collection<string, GuildBet>;

  /** The rest client */
  rest: REST;

  /** GuildBet bet guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;
    this.rest = rest;

    this.cache = new Collection<string, GuildBet>("bets");
  }

  async create(payload: Optional<APIGuildBet>): Promise<GuildBet> {
    Assertion.assertObject(payload);

    const route = Routes.guilds.bets.create(this.guild.id);
    const response = await this.rest.request<APIGuildBet, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    const bet = this.set(response);
    return bet;
  }
  async createMany(bets: OptionalGuildBet[]) {
    Assertion.assertArray(bets);

    const route = Routes.guilds.bets.resource(this.guild.id, "bulk");
    const payload = { bets };
    const response = await this.rest.request<APIGuildBet[], typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    this.rest.emit("betBulkCreate", response);
    this.setAll(response);
    const coll = new Collection<string, GuildBet>();
    for (let bt of response) {
      const bet = new GuildBet(bt, this.guild, this, this.rest);
      coll.set(bt._id, bet);
    }
    return coll;
  }
  /**
   * Fetch a bet
   * @param id Id of the bet to fetch
   * @returns APIBetUser
   */
  async fetch(id: string) {
    const route = Routes.guilds.bets.get(this.guild.id, id);
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "get",
      url: route,
    });
    const bet = new GuildBet(response, this.guild, this, this.rest);
    this.cache.set(bet._id, bet);
    this.rest.bets.set(bet._id, bet);

    return bet;
  }

  async fetchAll() {
    const route = Routes.guilds.bets.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildBet[], {}>({
      method: "get",
      url: route,
    });
    if (Array.isArray(response) && response.length === 0) {
      this.cache.clear();
      return this.cache;
    }
    for (let betData of response) {
      const bet = new GuildBet(betData, this.guild, this, this.rest);
      this.cache.set(bet._id, bet);
    }
    return this.cache;
  }
  set(data: APIGuildBet): GuildBet {
    if (!data?._id) return;
    if (!this.guild) return;
    const bet = new GuildBet(data, this.guild, this, this.rest);
    this.cache.set(bet._id, bet);
    this.rest.bets.set(bet._id, bet);

    return bet;
  }
  setAll(data: APIGuildBet[]) {
    if (!data) return this.cache;
    for (let bet of data) this.set(bet);
    return this.cache;
  }

  async delete(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.bets.delete(id, this.guild.id);
    const bet = this.cache.get(id);
    this.rest.emit("betDelete", bet);

    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.bets.deleteAll(this.guild.id);
    this.rest.emit("betsDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
