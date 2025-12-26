import { GuildTicketManager } from "../../managers";
import { REST, Routes } from "../../rest";
import { APIGuildTicket, APIMessage, Optional } from "../../types";
import { Guild } from "../";

export class GuildTicket implements APIGuildTicket {
  _id: string;
  guild_id: string;
  type: string;
  status: "on" | "off";

  admin_id: string;
  channel_id: string;
  closed_by_id: string;
  creator_id: string;
  customer_rating: number;
  messages: APIMessage[];

  createdAt: Date;
  updatedAt: Date;

  readonly rest: REST;
  readonly guild: Guild;
  readonly manager: GuildTicketManager;

  constructor(data: APIGuildTicket, manager: any) {
    this.manager = manager;

    this.guild = manager.guild;
    this.rest = manager.rest;

    this._id = data?._id;
    this.type = data?.type;

    this.admin_id = data?.admin_id;
    this.guild_id = data?.guild_id;
    this.channel_id = data?.channel_id;
    this.creator_id = data?.creator_id;
    this.status = data?.status;
    this.customer_rating = data?.customer_rating;
    this.messages = data?.messages;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
  }

  async fetch(): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.get(this.guild.id, this._id);
    const response = await this.rest.request<APIGuildTicket, {}>({
      method: "GET",
      url: route,
    });
    return this._updateInternals(response);
  }
  async setCustomerRating(rating: number): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.resource(this.guild.id, this._id, "customer_rating");
    const payload = { set: rating };

    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setAdminId(id: string): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.resource(this.guild.id, this._id, "admin_id");
    const payload = { set: id };

    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setChannelId(id: string): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.resource(this.guild.id, this._id, "channel_id");
    const payload = { set: id };

    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setClosedById(id: string): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.resource(this.guild.id, this._id, "closed_by_id");
    const payload = { set: id };

    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setStatus(status: "on" | "off"): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.resource(this.guild.id, this._id, "status");
    const payload = { set: status };

    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async addMessage(message: Optional<APIMessage>): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.resource(this.guild.id, this._id, "messages");
    const payload = { set: [...this.messages, message] };

    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  _updateInternals(data: Optional<APIGuildTicket>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIGuildTicket];
      }
    }

    this.updatedAt = new Date();
    this.createdAt = new Date(data.createdAt);

    this.manager.set(this);
    return this;
  }
}
