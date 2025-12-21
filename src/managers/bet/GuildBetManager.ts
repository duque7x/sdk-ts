import { Routes } from "../../rest";
import { Collection, Guild, GuildBet } from "../../structures";
import { APIGuildBet, APIPlayer, Optional } from "../../types";
import { BaseManager } from "../base";

export interface FetchOptions {
  cache?: boolean;
  betId?: string;
}

export class GuildBetManager extends BaseManager<GuildBet> {
  constructor(guild: Guild) {
    super(guild);
    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.guilds.bets.getAll(guild.id);
    this.cache = new Collection<string, GuildBet>("bets");
  }
  toString() {
    return this.cache.size;
  }
  async fetch(options?: FetchOptions) {
    const route = this.base_url;

    if (options && options.cache) return this.cache;
    if (options && options.betId) {
      const response = await this.rest.request<APIGuildBet, {}>({ url: `${route}/${options.betId}`, method: "GET" });
      return this.set(response);
    }
    const response = await this.rest.request<APIGuildBet, {}>({ url: route, method: "GET" });
    return this.set(response);
  }
  async create(data: Optional<APIGuildBet>) {
    const route = Routes.guilds.bets.create(this.guild.id);
    const response = await this.rest.request<APIGuildBet, typeof data>({ url: route, method: "POST", payload: data });
    return this.set(response);
  }
  async delete(betId?: string) {
    const route = Routes.fields(this.base_url, betId);
    const response = await this.rest.request<APIGuildBet, {}>({ url: route, method: "DELETE" });
    return this.set(response);
  }
  set(data: Optional<APIGuildBet> | Optional<APIGuildBet>[]) {
    if (!data) return;
    if (Array.isArray(data)) {
      for (let _bet of data) {
        if (!_bet._id) continue;
        const bet = new GuildBet(_bet, this);
        this.cache.set(bet._id, bet);
        this.rest.bets.set(bet._id, bet);
      }
    } else {
      if (!data._id) return;
      const bet = new GuildBet(data, this);
      this.cache.set(bet._id, bet);
      this.rest.bets.set(bet._id, bet);
      return bet;
    }
  }
}
