import { ChannelManager } from "../../managers/channel/ChannelManager";
import { REST } from "../../rest/REST";
import { APIBaseChannel } from "../../types/api/APIBaseChannel";
import { APIBetChannel } from "../../types/api/APIBetChannel";
import { Assertion } from "../../utils/Assertion";
import { GuildBet } from "../bet/GuildBet";
import { Guild } from "../guild/Guild";
import { GuildMatch } from "../match/GuildMatch";

export interface ChannelData<S extends GuildBet | GuildMatch> {
  baseUrl: string;

  data: APIBaseChannel;
  guild: Guild;
  manager: ChannelManager<S>;
}
export class Channel<S extends GuildBet | GuildMatch> {
  /** Channel's type */
  type: string;

  /** Channel's id */
  id: string;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  data: ChannelData<S>;
  rest: REST;
  baseUrl: string;
  guild: Guild;
  manager: ChannelManager<S>;
  constructor(data: ChannelData<S>, rest: REST) {
    this.type = data?.data?.type;
    this.id = data?.data?.id;
    this.createdAt = data?.data?.createdAt
      ? new Date(data?.data?.createdAt)
      : new Date();
    this.updatedAt = data?.data?.updatedAt
      ? new Date(data?.data?.updatedAt)
      : new Date();

    this.guild = data?.guild;

    this.manager = data?.manager;
    this.baseUrl = data.baseUrl;

    this.data = data;
    this.rest = rest;
  }
  toString() {
    return `<#${this.id}>`;
  }
  async setId(id: string) {
    Assertion.assertString(id);

    const payload = { id };
    const response = await this.rest.request<APIBetChannel, typeof payload>({
      method: "PATCH",
      url: this.baseUrl,
      payload,
    });

    this.id = response.id;
    return this;
  }
  async delete() {
    await this.rest.request<APIBetChannel, {}>({
      method: "delete",
      url: this.baseUrl,
    });

    this.manager.cache.delete(this.type);
    return this;
  }
}
