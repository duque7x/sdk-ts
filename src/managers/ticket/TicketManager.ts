import { REST, Routes } from "../../rest";
import { Guild, GuildTicket } from "../../structures";
import { Collection } from "../../structures/Collection";
import { APIGuild, APIGuildTicket, APITicketCategory, Optional } from "../../types";

type FecthOptions = {
  ticketId?: string;
  cache?: boolean;
};

type DeleteOptions = {
  ticketId?: string;
};
export class GuildTicketManager {
  cache: Collection<string, GuildTicket>;
  readonly guild: Guild;
  readonly rest: REST;

  constructor(guild: Guild) {
    this.guild = guild;
    this.rest = guild.rest;

    this.cache = new Collection<string, GuildTicket>("tickets");
  }
  async createTicketCategory(data: Optional<APITicketCategory>) {
    const categories = this.guild.tickets_configuration.categories;
    let hasCategory = categories.find((c) => c.type === data?.type);
    if (hasCategory) {
      hasCategory = data as APITicketCategory;
      const index = categories.findIndex((c) => c.type === data?.type);
      categories[index] = hasCategory;
    } else {
      categories.push(data as APITicketCategory);
    }
    const payload = { tickets_configuration: { categories } };
    const route = Routes.guilds.get(this.guild.id);
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.guild._updateInternals(response);
    return response;
  }
  async deleteTicketCategory(data: Optional<APITicketCategory>) {
    let categories = this.guild.tickets_configuration.categories;
    let categoryIndex = categories.findIndex((c) => c.type === data?.type);
    if (categoryIndex === -1) return this.guild;

    categories = categories.filter((c) => c.type !== data.type);

    const payload = { tickets_configuration: { categories } };
    const route = Routes.guilds.get(this.guild.id);
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.guild._updateInternals(response);
    return response;
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

    const ticket = this.set(response) as GuildTicket;
    this.rest.emit("ticketCreate", ticket);
    return ticket;
  }
  async delete(options?: DeleteOptions) {
    if (options && options.ticketId) {
      const route = Routes.guilds.tickets.delete(this.guild.id, options.ticketId);
      await this.rest.request({
        method: "DELETE",
        url: route,
      });

      this.rest.emit("ticketDelete", this.cache.get(options.ticketId));
      this.cache.delete(options.ticketId);
      return true;
    }
    const route = Routes.guilds.tickets.deleteAll(this.guild.id);
    await this.rest.request({
      method: "DELETE",
      url: route,
    });
    this.rest.emit("ticketsDelete", this.cache);
    this.cache.clear();
    return true;
  }
  set(data: APIGuildTicket | APIGuildTicket[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _ticket of data) {
        if (!_ticket._id) return;

        const ticket = new GuildTicket(_ticket, this);
        this.cache.set(ticket._id, ticket);
        this.rest.tickets.set(ticket._id, ticket);
      }
      return this.cache;
    } else {
      if (!data._id) return;
      const ticket = new GuildTicket(data, this);
      this.cache.set(ticket._id, ticket);
      this.rest.tickets.set(ticket._id, ticket);
      return ticket;
    }
  }
}
