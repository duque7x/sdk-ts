import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GuildBet } from "../../structures/bet/GuildBet";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildMatch } from "../../structures/match/GuildMatch";
import { GuildTicket } from "../../structures/ticket/GuildTicket";
import { Optional } from "../../types/api";
import { APIMessage } from "../../types/api/APIMessage";
import { Assertion } from "../../utils/Assertion";

export class MessagesManager {
  /** A cache of messages */
  cache: Collection<string, APIMessage>;

  /** Key */
  key: string;

  baseUrl: string;

  /** The rest client */
  rest: REST;

  /** APIMessage message guild */
  guild: Guild;
  /**
   * Manage messages with the given client
   * @param messages An array of messages
   * @param rest The rest client
   */
  constructor(guild: Guild, key: string, rest: REST) {
    this.guild = guild;
    this.key = key;
    this.baseUrl = Routes.fields(Routes.guilds.get(guild?.id), key, "messages");

    this.cache = new Collection<string, APIMessage>(`${key}-messages`);
    this.rest = rest;
  }
  async create(payload: Optional<APIMessage>): Promise<boolean> {
    Assertion.assertObject(payload);

    const route = this.baseUrl;
    const response = await this.rest.request<APIMessage, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    this.set(response);

    return true;
  }

  /**
   * Fetch a message
   * @param id Id of the message to fetch
   * @returns APIgroupedChannelUser
   */
  async fetch(type: string) {
    const route = Routes.fields(this.baseUrl, type);
    const response = await this.rest.request<APIMessage, {}>({
      method: "get",
      url: route,
    });
    const message = this.set(response);
    this.set(response);

    return response;
  }

  async fetchAll() {
    const route = this.baseUrl;
    const response = await this.rest.request<APIMessage[], {}>({
      method: "get",
      url: route,
    });

    for (let data of response) {
      if (!data.type) continue;
      this.cache.set(data?.type, data);
    }
    return this.cache;
  }

  set(data: APIMessage | APIMessage[]): Collection<string, APIMessage> {
    if (Array.isArray(data)) {
      for (let message of data) {
        if (!message?.type) return;
        this.cache.set(`${message?.userId}-${Date.now()}`, message);
      }
    } else {
      this.cache.set(`${data?.userId}-${Date.now()}`, data);
    }
    return this.cache;
  }
  setAll(data: APIMessage[]) {
    if (!data) return this.cache;
    for (let message of data) this.set(message);
    return this.cache;
  }
}
