import env from "dotenv";
env.config();

import EventEmitter from "events";
import { Assertion } from "../utils/Assertion";
import { request, Headers } from "undici";
import { Routes } from "./Routes";

import { GuildManager } from "../managers/guild/GuildManager";
import { Collection } from "../structures/Collection";
import { GuildMatch } from "../structures/match/GuildMatch";
import { GuildUser } from "../structures/user/GuildUser";
import { RestEvents, RequestOptions } from "../types/RestTypes";
import { MinesGameManager } from "../managers";
import { StatusResponse } from "../types";
import { GuildBetUser } from "../structures/betuser/GuildBetUser";
import { GuildBet, GuildTicket, VipMember } from "../structures";
import { GuildMediator } from "../structures/mediator/GuildMediator";

const Reset = "\x1b[0m";
const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";
const FgBlue = "\x1b[34m";
const FgCyan = "\x1b[36m";

interface ClientOptions {
  clientKey: string;
  guildId: string;
  authKey: string;
}
/**
 * The main class of this package
 */
export class REST extends EventEmitter {
  /**
   * The unique key for client
   */
  clientKey: string;
  authKey: string;
  guildId: string;

  /** The guild manager */
  guilds: GuildManager;
  minesGames: MinesGameManager;
  users: Collection<string, GuildUser>;
  betusers: Collection<string, GuildBetUser>;
  matches: Collection<string, GuildMatch>;
  bets: Collection<string, GuildBet>;
  tickets: Collection<string, GuildTicket>;
  vipmembers: Collection<string, VipMember>;
  mediators: Collection<string, GuildMediator>;

  /**
   *
   * @param key The unique key for he client
   */
  constructor(options: ClientOptions) {
    super({ captureRejections: true });

    this.clientKey = options.clientKey ?? "";
    this.authKey = options.authKey ?? "";
    this.guildId = options.guildId ?? "";

    this.guilds = new GuildManager(this);
    this.minesGames = new MinesGameManager(this);

    this.users = new Collection("rest:users");
    this.matches = new Collection("rest:matches");
    this.bets = new Collection("rest:bets");
    this.betusers = new Collection("rest:betusers");
    this.tickets = new Collection("rest:tickets");
    this.vipmembers = new Collection("rest:vipmembers");
    this.mediators = new Collection("rest:mediators");

    this.setMaxListeners(999);
  }

  /** Initialize the caching sistem */
  async init() {
    if (!this.clientKey || !this.authKey || !this.guildId) throw new Error("Key is necessary");
    await Promise.all([this.guilds.fetch({ guildId: this.guildId }), this.minesGames.fetch()]);
    return this;
  }

  formatUrl(url: string) {
    return url.endsWith("/") ? url.slice(0, url.length - 1) : url;
  }
  /**
   * Request Data from a certain url
   * @param options
   * @returns
   */
  async request<Expecting, Payload>(options: RequestOptions<Payload>) {
    let { method, url, payload } = options;
    Assertion.assertString(method);
    Assertion.assertString(this.clientKey);
    Assertion.assertString(url);

    method = method.toUpperCase();
    url = this.formatUrl(Routes.base + url);

    const headers = new Headers();
    headers.append("authorization", this.authKey);
    headers.append("client_key", this.clientKey);
    headers.append("Content-Type", "application/json");

    const before = Date.now();
    this.emit("debug", [`[Request] ${FgBlue}${method} ${FgCyan}${url}`, Reset].join("\n"));
    const body = { ...payload };
    const res = await request(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const responseBody = await res.body.json();
    const { data, message } = responseBody as Record<string, unknown>;
    const now = new Date().getTime();

    if (!data || res.body.errored) {
      if (message) this.emit("debug", `${FgRed}${message}${Reset}`);
      this.emit("debug", `[No data]${FgGreen} ${(now - before) / 1000}${Reset}`);
      return "No data available." as Expecting;
    }

    if (message) this.emit("debug", `${FgRed}${message}${Reset}`);
    this.emit("debug", `[Request]${FgGreen} ${(now - before) / 1000}s done.${Reset}`);

    return data as Expecting;
  }
  async getStatus() {
    return await this.request<StatusResponse, {}>({ method: "GET", url: "/status" });
  }
  override emit<K extends keyof RestEvents>(
    event: K,
    ...args: RestEvents[K] // tuple type is spread automatically
  ): boolean {
    return super.emit(event, ...args);
  }

  override on<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this {
    return super.on(event, listener);
  }

  override once<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this {
    return super.once(event, listener);
  }
}
