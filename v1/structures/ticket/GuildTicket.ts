import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { APIGuildTicket } from "../../types/api/APIGuildTicket";
import { Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { GuildTicketManager } from "../../managers/ticket/GuildTicketManager";
import { APIMessage } from "../../types/api/APIMessage";
import { MessagesManager } from "../../managers/messages/MessagesManager";

export class GuildTicket {
  /** Ticket's id */
  id: string;
  _id: string;

  /** Ticket's creator id */
  creatorId: string;

  /** Ticket's admin id */
  adminId: string;

  /** Ticket's rating that customer gave */
  customerRating: number;

  /** Ticket's channel id */
  channelId: string;

  /** Ticket's closed by who */
  closedById: string;

  /** Ticket's type */
  type: string;

  /** Ticket's status */
  status: "on" | "off";

  /** Ticket's messages */
  messages: MessagesManager;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;
  readonly manager: GuildTicketManager;

  /**
   * GuildMediator mediator
   * @param data  The mediator's data
   * @param guild The guild
   * @param rest The rest client
   */
  constructor(data: APIGuildTicket, guild: Guild, manager: GuildTicketManager, rest: REST) {
    this.id = data?.id?.toString();
    this._id = data?._id?.toString();

    this.creatorId = data?.creatorId;
    this.adminId = data?.adminId;
    this.customerRating = data.customerRating;
    this.closedById = data?.closedById;
    this.type = data?.type;
    this.status = data?.status;
    this.channelId = data?.channelId;
    this.messages = new MessagesManager(guild, `tickets/${data?.id}`, rest);
    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.guild = guild;
    this.rest = rest;
    this.manager = manager;

    this.messages.setAll(data?.messages);
  }
  async fetch(): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.get(this.id, this.guild.id);
    const response = await this.rest.request<APIGuildTicket, {}>({
      method: "DELETE",
      url: route,
    });
    const ticket = new GuildTicket(response, this.guild, this.manager, this.rest);
    this.manager.cache.set(response.id, ticket);
    return ticket;
  }
  async setChannelId(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "channelId");
    const payload = { channelId: id };
    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.channelId = response.channelId;
    this.manager.cache.set(this.id, this);
    return this;
  }
  async setAdminId(id: string) {
    Assertion.assertString(id);
    const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "adminId");
    const payload = { adminId: id };
    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.adminId = response.adminId;
    this.manager.cache.set(this.id, this);

    return this;
  }
  async setClosedById(id: string) {
    Assertion.assertString(id);
    const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "closedById");
    const payload = { closedById: id };

    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.closedById = response.closedById;
    this.manager.cache.set(this.id, this);
    return this;
  }
  async setCustomerRating(rating: string) {
    Assertion.assertString(rating);
    const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "customerRating");
    const payload = {
      customerRating: rating,
    };
    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload
    });
    this.customerRating = response.customerRating;
    this.manager.cache.set(this.id, this);
    return this;
  }
  async setType(type: string) {
    Assertion.assertString(type);
    const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "type");
    const payload = { type };
    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.type = response.type;
    this.manager.cache.set(this.id, this);
    return this;
  }
  async setStatus(status: string) {
    Assertion.assertString(status);
    const route = Routes.guilds.tickets.resource(this.guild.id, this.id, "status");
    const payload = { status };
    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.status = response.status;
    this.manager.cache.set(this.id, this);
    return this;
  }
  async delete(): Promise<boolean> {
    const route = Routes.guilds.tickets.delete(this.id, this.guild.id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.manager.cache.set(this.id, this);
    this.manager.cache.delete(this.id);
    return response;
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
    return this.id || "1";
  }
}
