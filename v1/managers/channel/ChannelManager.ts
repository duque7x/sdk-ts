import { REST } from "../../rest/REST";
import { Route, Routes } from "../../rest/Routes";
import { GuildBet } from "../../structures/bet/GuildBet";
import { Channel } from "../../structures/channel/Channel";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildMatch } from "../../structures/match/GuildMatch";
import { Optional } from "../../types/api";
import { APIBaseChannel } from "../../types/api/APIBaseChannel";

import { Assertion } from "../../utils/Assertion";
type Channels = Optional<APIBaseChannel>;

export class ChannelManager<Structure extends GuildBet | GuildMatch> {
  /** A cache of bet channels */
  cache: Collection<string, Channel<Structure>>;

  /** The rest client */
  rest: REST;

  /** GuildBet user guild */
  guild: Guild;

  /** The bet */
  structure: Structure;

  /** Base Url  */
  baseUrl: string;

  /**
   * Manage channels of a bet
   * @param guild The guild at hand
   * @param bet The bet at hand
   * @param rest The rest client
   */
  constructor(guild: Guild, structure: Structure, rest: REST) {
    this.structure = structure;
    this.rest = rest;
    this.guild = guild;
    this.cache = new Collection<string, Channel<Structure>>("channels");
    this.baseUrl = Routes.guilds[structure.key as "bets"].resource(guild.id, structure._id, "channels");
  }
  async create(data: Optional<APIBaseChannel>): Promise<Channel<Structure>> {
    const { id, type } = data;
    Assertion.assertString(id);
    Assertion.assertString(type);

    const route = this.baseUrl;
    const payload = { id, type };
    const response = await this.rest.request<APIBaseChannel, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    const channel = this.set(response);

    this.rest.emit("channelCreate", channel);
    return channel;
  }
  async createMany(...channels: Channels[]) {
    Assertion.assertArray(channels);
    const route = Routes.fields(this.baseUrl, "bulk");
    const payload = { channels };
    const response = await this.rest.request<APIBaseChannel[], typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    this.rest.emit("channelBulkCreate", response);
    return this.setAll(response);
  }
  async deleteMany(...channels: Optional<APIBaseChannel>[]) {
    Assertion.assertArray(channels);

    const route = Routes.fields(this.baseUrl, "bulk");
    const payload = { channels };
    const response = await this.rest.request<APIBaseChannel[], typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });
    const channel = this.setAll(response);

    this.rest.emit("channelBulkDelete", channel);
    return channel;
  }
  setAll(data: APIBaseChannel[]): Collection<string, Channel<Structure>> {
    if (!data) return this.cache;
    for (let channelData of data) this.set(channelData);
    return this.cache;
  }
  set(data: APIBaseChannel): Channel<Structure> {
    if (!data?.type) return;
    const channel = new Channel(
      {
        baseUrl: Routes.guilds[this.structure.key as "bets"].resource(this.guild.id, this.structure._id, "channels"),
        data: data,
        guild: this.guild,
        manager: this,
      },
      this.rest
    );
    this.cache.set(data.type, channel);
    return channel;
  }
  async update(type: string, payload: Optional<APIBaseChannel>): Promise<Channel<Structure>> {
    Assertion.assertString(type);
    Assertion.assertObject(payload);

    const route = Routes.fields(this.baseUrl, type);
    const response = await this.rest.request<APIBaseChannel, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    const channel = this.set(response);
    this.rest.emit("betUpdate", this.structure, this.structure);
    return channel;
  }
  async fetch(type: string): Promise<Channel<Structure>> {
    Assertion.assertString(type);

    const route = Routes.fields(this.baseUrl, type);
    const response = await this.rest.request<APIBaseChannel, {}>({
      method: "GET",
      url: route,
    });

    const channel = this.set(response);
    this.cache.set(channel.type, channel);

    return channel;
  }
  async fetchAll() {
    const response = await this.rest.request<APIBaseChannel[], {}>({
      method: "GET",
      url: this.baseUrl,
    });
    if (Array.isArray(response) && response.length === 0) {
      this.cache.clear();
      return this.cache;
    }
    for (let channelData of response) this.set(channelData);
    return this.cache;
  }

  async delete(type: string): Promise<Collection<string, Channel<Structure>>> {
    Assertion.assertString(type);

    const route = this.baseUrl;
    const response = await this.rest.request<APIBaseChannel[], {}>({
      method: "DELETE",
      url: Routes.fields(route, type),
    });
    this.cache.delete(type);
    return this.cache;
  }

  async deleteAll(): Promise<boolean> {
    const route = this.baseUrl;
    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
