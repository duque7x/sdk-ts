import EventEmitter from "events";
import { Assertion } from "../utils/Assertion";
import { request, Headers } from "undici";
import { Routes } from "./Routes";
import env from "dotenv";
import { GuildManager } from "../managers/guild/GuildManager";
env.config();

const Reset = "\x1b[0m";
const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";
const FgBlue = "\x1b[34m";
const FgCyan = "\x1b[36m";

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
  /**
   *
   * @param key The unique key for he client
   */
  constructor(key?: string) {
    super({ captureRejections: true });

    if (key) {
      Assertion.assertString(key);
      this.key = key;
      console.log({ ky: this.key, key });
    }

    this.guilds = new GuildManager(this);
  }
  /**
   * Set the api key
   * @param key The unique key of the client
   */
  setKey(key: string) {
    this.key = key;
  }
  async init() {
    await this.guilds.fetchAll();
    return this;
  }
  async request<T>(options: {
    method: string;
    url: string;
    payload?: Record<string, unknown>;
    expecting?: T;
  }) {
    let { method, url, payload, expecting } = options;
    Assertion.assertString(method);
    Assertion.assertString(this.key);
    Assertion.assertString(url);
    Assertion.assertObject(payload);

    method = method.toUpperCase();
    url = Routes.base + url;

    const headers = new Headers();
    headers.append("duque-auth", process.env.AUTH);
    headers.append("Content-Type", "application/json");
    headers.append("duque-client-key", this.key);

    this.emit(
      "debug",
      [`[Request] ${FgBlue}${method} ${FgCyan}${url}`, Reset].join("\n")
    );

    const res = await request(url, {
      method,
      headers,
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    const body = await res.body.json();
    const { data, message } = body as Record<string, unknown>;
    if (message) this.emit("debug", `${FgRed}${message}${Reset}`);
    this.emit("debug", `[Request]${FgGreen} done.${Reset}`);
    return data as T;
  }
}
