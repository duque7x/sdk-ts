import { REST, Routes } from "../../rest";
import { Guild, GuildTicket } from "../../structures";
import { Collection } from "../../structures/Collection";
import { APIGuildTicket, Optional } from "../../types";

type FecthOptions = {
  ticketId?: string;
  cache?: boolean;
};

type DeleteOptions = {
  ticketId?: string;
};
export class TicketManager {
  cache: Collection<string, GuildTicket>;
  readonly guild: Guild;
  readonly rest: REST;

  constructor(guild: Guild) {
    this.guild = guild;
    this.rest = guild.rest;

    this.cache = new Collection<string, GuildTicket>("tickets");
  }

  async fetch(options?: FecthOptions) {
    if (options && options.cache) return this.cache;
    if (options && options.ticketId) {
      const route = Routes.guilds.tickets.get(this.guild.id, options.ticketId);
      const response = await this.rest.request<APIGuildTicket, {}>({
        method: "GET",
        url: route,
      });

      return this.set(response) as GuildTicket;
    }
    const route = Routes.guilds.tickets.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildTicket[], {}>({
      method: "GET",
      url: route,
    });

    return this.set(response) as Collection<string, GuildTicket>;
  }
  async create(data: Optional<APIGuildTicket>): Promise<GuildTicket> {
    const route = Routes.guilds.tickets.create(this.guild.id);
    const response = await this.rest.request<APIGuildTicket[], {}>({
      method: "POST",
      url: route,
      payload: data,
    });

    return this.set(response) as GuildTicket;
  }
  async delete(options?: DeleteOptions) {
    if (options && options.ticketId) {
      const route = Routes.guilds.tickets.delete(this.guild.id, options.ticketId);
      await this.rest.request({
        method: "DELETE",
        url: route,
      });
      return true;
    }
    const route = Routes.guilds.tickets.deleteAll(this.guild.id);
    await this.rest.request({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return true;
  }
  set(data: APIGuildTicket | APIGuildTicket[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _ticket of data) {
        const ticket = new GuildTicket(_ticket, this);
        this.cache.set(ticket._id, ticket);
      }
      return this.cache;
    } else {
      const ticket = new GuildTicket(data, this);
      this.cache.set(ticket._id, ticket);
      return ticket;
    }
  }
}
