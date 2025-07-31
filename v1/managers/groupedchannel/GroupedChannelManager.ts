import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GroupedChannel } from "../../structures/groupedchannel/GroupedChannel";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional } from "../../types/api";
import { APIGuildGroupedChannel } from "../../types/api/APIGuildGroupedChannel";
import { Assertion } from "../../utils/Assertion";

export class GroupedChannelManager {
  /** A cache of channels */
  cache: Collection<string, GroupedChannel>;

  /** Key */
  key: string;

  baseUrl: string;

  /** The rest client */
  rest: REST;

  /** GroupedChannel groupedChannel guild */
  guild: Guild;
  /**
   * Manage channels with the given client
   * @param channels An array of channels
   * @param rest The rest client
   */
  constructor(guild: Guild, key: string, rest: REST) {
    this.key = key;
    this.baseUrl = Routes.fields(Routes.guilds.get(guild?.id), key);

    this.cache = new Collection<string, GroupedChannel>("groupedChannels");

    this.guild = guild;
    this.rest = rest;
  }
  async delete(type: string) {
    const route = Routes.fields(this.baseUrl, type);
    const response = await this.rest.request<boolean, {}>({
      method: "delete",
      url: route,
    });
    this.cache.delete(type);
    return response;
  }
  async create(payload: Optional<APIGuildGroupedChannel>): Promise<GroupedChannel> {
    Assertion.assertObject(payload);

    const route = this.baseUrl;
    const response = await this.rest.request<APIGuildGroupedChannel, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    const groupedChannel = this.set(response);
    return groupedChannel;
  }

  /**
   * Fetch a groupedChannel
   * @param id Id of the groupedChannel to fetch
   * @returns APIgroupedChannelUser
   */
  async fetch(type: string) {
    const route = Routes.fields(this.baseUrl, type);
    const response = await this.rest.request<APIGuildGroupedChannel, {}>({
      method: "get",
      url: route,
    });
    const channel = this.set(response);
    this.cache.set(channel.type, channel);

    return channel;
  }

  async fetchAll() {
    const route = this.baseUrl;
    const response = await this.rest.request<APIGuildGroupedChannel[], {}>({
      method: "get",
      url: route,
    });

    for (let groupedChannelData of response) {
      const groupedChannel = new GroupedChannel(groupedChannelData, this.guild, this, this.rest);
      this.cache.set(groupedChannel.type, groupedChannel);
    }
    return this.cache;
  }
  setAll(data: APIGuildGroupedChannel[]) {
    if (!data) return this.cache;
    for (let groupedChannel of data) this.set(groupedChannel);
    return this.cache;
  }

  set(data: APIGuildGroupedChannel): GroupedChannel {
    if (!data?.type) return;
    const groupedChannel = new GroupedChannel(data, this.guild, this, this.rest);
    this.cache.set(data.type, groupedChannel);
    return groupedChannel;
  }
}
