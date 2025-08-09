import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GuildTicket } from "../../structures/ticket/GuildTicket";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional } from "../../types/api";
import { APIGuildTicket } from "../../types/api/APIGuildTicket";
import { Assertion } from "../../utils/Assertion";

export class GuildTicketManager {
  /** A cache of users */
  cache: Collection<string, GuildTicket>;

  /** The rest client */
  rest: REST;

  /** GuildTicket ticket guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;
    this.rest = rest;

    this.cache = new Collection<string, GuildTicket>("tickets");
  }

  async create(payload: Optional<APIGuildTicket>): Promise<GuildTicket> {
    Assertion.assertObject(payload);

    const route = Routes.guilds.tickets.create(this.guild.id);
    const response = await this.rest.request<APIGuildTicket, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    const ticket = this.set(response);
    return ticket;
  }

  /**
   * Fetch a ticket
   * @param id Id of the ticket to fetch
   * @returns APIticketUser
   */
  async fetch(id: string) {
    const route = Routes.guilds.tickets.get(this.guild.id, id);
    const response = await this.rest.request<APIGuildTicket, {}>({
      method: "get",
      url: route,
    });

    const ticket = new GuildTicket(response, this.guild, this, this.rest);
    this.cache.set(ticket.id, ticket);
    return ticket;
  }

  async fetchAll() {
    const route = Routes.guilds.tickets.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildTicket[], {}>({
      method: "get",
      url: route,
    });

    for (let ticketData of response) {
      const ticket = new GuildTicket(ticketData, this.guild, this, this.rest);
      this.cache.set(ticket.id, ticket);
    }
    return this.cache;
  }
  set(data: APIGuildTicket): GuildTicket {
    if (!data?.id) return;
    const ticket = new GuildTicket(data, this.guild, this, this.rest);
    this.cache.set(data?.id?.toString(), ticket);
    return ticket;
  }
  setAll(data: APIGuildTicket[]) {
    if (!data) return this.cache;
    for (let ticket of data) this.set(ticket);
    return this.cache;
  }

  async delete(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.tickets.delete(id, this.guild.id);
    const ticket = this.cache.get(id);
    this.rest.emit("ticketDelete", ticket);

    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.tickets.deleteAll(this.guild.id);
    this.rest.emit("ticketsDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
