import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildMediator } from "../../structures/mediator/GuildMediator";
import { Optional } from "../../types/api";
import { APIGuildMediator } from "../../types/api/APIGuildMediator";
import { Assertion } from "../../utils/Assertion";

export class GuildMediatorManager {
  /** A cache of users */
  cache: Collection<string, GuildMediator>;

  /** The rest client */
  rest: REST;

  /** GuildMediator mediator guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;
    this.rest = rest;

    this.cache = new Collection<string, GuildMediator>("mediators");
  }

  async create(payload: Optional<APIGuildMediator>): Promise<GuildMediator> {
    Assertion.assertObject(payload);

    const route = Routes.guilds.mediators.create(this.guild.id);
    const response = await this.rest.request<APIGuildMediator, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    const mediator = this.set(response);
    return mediator;
  }

  /**
   * Fetch a mediator
   * @param id Id of the mediator to fetch
   * @returns APImediatorUser
   */
  async fetch(id: string) {
    const route = Routes.guilds.mediators.get(this.guild.id, id);
    const response = await this.rest.request<APIGuildMediator, {}>({
      method: "get",
      url: route,
    });

    const mediator = new GuildMediator(response, this.guild, this, this.rest);
    this.cache.set(mediator.id, mediator);

    return mediator;
  }

  async fetchAll() {
    const route = Routes.guilds.mediators.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildMediator[], {}>({
      method: "get",
      url: route,
    });

    this.setAll(response);
    return this.cache;
  }

  set(data: APIGuildMediator): GuildMediator {
    if (!data.id) return;
    const mediator = new GuildMediator(data, this.guild, this, this.rest);
    this.cache.set(data?.id, mediator);
    this.rest.mediators.set(mediator.id, mediator);
    return mediator;
  }
  setAll(data: APIGuildMediator[]) {
    if (!data) return this.cache;
    for (let mediator of data) this.set(mediator);
    return this.cache;
  }

  async delete(id: string) {
    Assertion.assertString(id);

    const route = Routes.guilds.mediators.delete(this.guild.id, id);
    const mediator = this.cache.get(id);
    this.rest.emit("mediatorDelete", mediator);

    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.mediators.deleteAll(this.guild.id);
    this.rest.emit("mediatorsDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
