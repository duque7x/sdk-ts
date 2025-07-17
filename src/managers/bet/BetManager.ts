import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Bet } from "../../structures/bet/Bet";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuildBet } from "../../types/api/APIGuildBet";

export class BetManager {
  /** A cache of users */
  cache: Collection<string, Bet>;

  /** The rest client */
  rest: REST;

  /** Bet bet guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;

    this.cache = new Collection<string, Bet>();
    this.rest = rest;
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

    return response;
  }

  async fetchAll() {
    const route = Routes.guilds.bets.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildBet[], {}>({
      method: "get",
      url: route,
    });

    for (let betData of response) {
      const bet = new Bet(betData, this.guild, this.rest);
      this.cache.set(bet._id, bet);
    }
    return this.cache;
  }
  setAll(data: APIGuildBet[]) {
    for (let bet of data) {
      if (!bet._id) continue;
      const bt = new Bet(bet, this.guild, this.rest);
      this.cache.set(bet._id, bt);
      this.rest.bets.set(bet._id, bt);
    }
    return this.cache;
  }
}
