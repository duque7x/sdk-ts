import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { APIGuildGroupedChannel } from "../../types/api/APIGuildGroupedChannel";
import { Confirm, Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { GroupedChannelManager } from "../../managers/groupedchannel/GroupedChannelManager";

export class GroupedChannel {
  type: string;
  ids: string[];

  createdAt: Date;
  updatedAt: Date;
  manager: GroupedChannelManager;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;

  /**
   * GroupedChannel channel
   * @param data  The channel's data
   * @param guild The guild
   * @param rest The rest client
   */

  constructor(data: APIGuildGroupedChannel, guild: Guild, manager: GroupedChannelManager, rest: REST) {
    this.ids = data?.ids;
    this.type = data?.type;

    this.manager = manager;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.guild = guild;
    this.rest = rest;
  }

  /**
   * Fetches the channel
   * @returns New Instance of the channel
   */
  async fetch(): Promise<GroupedChannel> {
    const route = Routes.fields(this.manager.baseUrl, this.type);
    const response = await this.rest.request<APIGuildGroupedChannel, {}>({
      method: "get",
      url: route,
    });

    const channel = new GroupedChannel(response, this.guild, this.manager, this.rest);

    this.manager.cache.set(channel.type, channel);
    return channel;
  }
  async setIds(ids: string[]) {
    Assertion.assertArray(ids);

    const payload = { ids };
    const route = Routes.fields(this.manager.baseUrl, this.type, "ids");
    const response = await this.rest.request<APIGuildGroupedChannel, {}>({
      method: "PUT",
      url: route,
      payload,
    });

    this.ids = ids;
    this.updatedAt = new Date();
    this.rest.emit("groupedChannelUpdate", this, new GroupedChannel(response, this.guild, this.manager, this.rest));
    return this;
  }
  async addId(id: string) {
    Assertion.assertString(id);

    const payload = { id };
    const route = Routes.fields(this.manager.baseUrl, this.type, "ids");
    const response = await this.rest.request<APIGuildGroupedChannel, {}>({
      method: "POST",
      url: route,
      payload,
    });
    this.ids = response.ids;

    this.updatedAt = new Date();

    this.manager.set(response);
    this.rest.emit("groupedChannelUpdate", this, new GroupedChannel(response, this.guild, this.manager, this.rest));
    return this;
  }

  async removeId(id: string) {
    Assertion.assertString(id);

    const payload = { id };
    const route = Routes.fields(this.manager.baseUrl, this.type, "ids", id);
    const response = await this.rest.request<APIGuildGroupedChannel, {}>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.ids = response.ids;
    this.updatedAt = new Date();
    this.manager.set(response);

    return this;
  }
  async update(data: Optional<APIGuildGroupedChannel>): Promise<GroupedChannel> {
    const route = Routes.fields(this.manager.baseUrl, this.type);
    const payload = data;

    const response = await this.rest.request<APIGuildGroupedChannel, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.rest.emit("groupedChannelUpdate", this, new GroupedChannel(response, this.guild, this.manager, this.rest));
    for (const k in response) {
      if (k === "id" || k == "createdAt") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGuildGroupedChannel];
      }
    }

    this.updatedAt = new Date();
    this.manager.cache.set(this.type, this);
    return this;
  }
  toJSON() {
    const json: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this)) {
      if (typeof value !== "function") {
        json[key] = value;
      }
    }
    return json;
  }
  toString() {
    return `${this.ids.length}`;
  }
}
