import EventEmitter from "events";
import { Assertion } from "../utils/Assertion";
import { request, Headers } from "undici";
import { Routes } from "./Routes";
import env from "dotenv";
import { GuildManager } from "../managers/guild/GuildManager";
import { GuildBet } from "../structures/bet/GuildBet";
import { Collection } from "../structures/Collection";
import { GuildBetUser } from "../structures/betuser/GuildBetUser";
import { GuildMatch } from "../structures/match/GuildMatch";
import { GuildMediator } from "../structures/mediator/GuildMediator";
import { GuildUser } from "../structures/user/GuildUser";
import { VipMemberManager } from "../managers/vipmember/VipMemberManager";
import { GiveawayManager } from "../managers/giveaway/GiveawayManager";
env.config();

const Reset = "\x1b[0m";
const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";
const FgBlue = "\x1b[34m";
const FgCyan = "\x1b[36m";

interface RequestOptions<Payload> {
  /** The request's method */
  method: string;

  /** The request's url */
  url: string;

  /** The request payload */
  payload?: Payload;
}

/**
 * The main class of this package
 */
export class REST extends EventEmitter {
  /**
   * The unique key for client
   */
  key: string;

  /** The guild manager */
  guilds: GuildManager;
  giveaways: GiveawayManager;

  bets: Collection<string, GuildBet>;
  matches: Collection<string, GuildMatch>;
  betUsers: Collection<string, GuildBetUser>;
  users: Collection<string, GuildUser>;
  mediators: Collection<string, GuildMediator>;

  /**
   *
   * @param key The unique key for he client
   */
  constructor(key?: string) {
    super({ captureRejections: true });

    if (key) {
      Assertion.assertString(key);
      this.key = key;
    }

    this.guilds = new GuildManager(this);
    this.giveaways = new GiveawayManager(this);

    this.bets = new Collection<string, GuildBet>("bets");
    this.matches = new Collection<string, GuildMatch>("matches");
    this.betUsers = new Collection<string, GuildBetUser>("betUsers");
    this.users = new Collection<string, GuildUser>("users");
    this.mediators = new Collection<string, GuildMediator>("mediators");
  }
  /**
   * Set the api key
   * @param key The unique key of the client
   */
  setKey(key: string) {
    this.key = key;
  }

  /** Initialize the caching sistem */
  async init() {
    await Promise.all([this.guilds.fetchAll(), this.giveaways.fetchAll()]);
    return this;
  }

  /**
   * Request Data from a certain url
   * @param options
   * @returns
   */
  async request<Expecting, Payload>(options: RequestOptions<Payload>) {
    let { method, url, payload } = options;
    Assertion.assertString(method);
    Assertion.assertString(this.key);
    Assertion.assertString(url);

    method = method.toUpperCase();
    url = Routes.base + url;

    const headers = new Headers();
    headers.append("duque-auth", process.env.AUTH);
    headers.append("Content-Type", "application/json");
    headers.append("duque-client-key", this.key);

    const before = Date.now();
    this.emit("debug", [`[Request] ${FgBlue}${method} ${FgCyan}${url}`, Reset].join("\n"));

    const res = await request(url, {
      method,
      headers,
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    const body = await res.body.json();
    const { data, message } = body as Record<string, unknown>;
    const now = new Date().getTime();

    if (message) this.emit("debug", `${FgRed}${message}${Reset}`);
    this.emit("debug", `[Request]${FgGreen} ${(now - before) / 1000}s done.${Reset}`);

    return data as Expecting;
  }
}
