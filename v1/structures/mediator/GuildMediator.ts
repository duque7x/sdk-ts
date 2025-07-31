import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { APIGuildMediator } from "../../types/api/APIGuildMediator";
import { Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { GuildMediatorManager } from "../../managers/mediator/GuildMediatorManager";

export class GuildMediator {
  /** Mediator's id */
  id: string;

  /** Mediator's name */
  name: string;

  /** Mediator's links */
  paymentLinks: string[];

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;
  readonly manager: GuildMediatorManager;

  /**
   * GuildMediator mediator
   * @param data  The mediator's data
   * @param guild The guild
   * @param rest The rest client
   */
  constructor(
    data: APIGuildMediator,
    guild: Guild,
    manager: GuildMediatorManager,
    rest: REST
  ) {
    this.id = data.id;
    this.name = data.name;
    this.paymentLinks = data.paymentLinks;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.guild = guild;
    this.rest = rest;
    this.manager = manager;
  }
  /** String representation of this mediator */
  toString() {
    return `<@${this.id}>`;
  }
  /**
   * Fetches the mediator
   * @returns New Instance of the mediator
   */
  async fetch() {
    const route = Routes.guilds.mediators.get(this.guild.id, this.id);
    const response = await this.rest.request<APIGuildMediator, {}>({
      method: "get",
      url: route,
    });

    const med = new GuildMediator(
      response,
      this.guild,
      this.manager,
      this.rest
    );
    this.manager.cache.set(med.id, med);
    this.rest.mediators.set(med.id, med);
    return med;
  }

  async update(data: Optional<APIGuildMediator>) {
    const route = Routes.guilds.mediators.get(this.guild.id, this.id);
    const payload = data;

    const response = await this.rest.request<APIGuildMediator, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    const med = new GuildMediator(
      response,
      this.guild,
      this.manager,
      this.rest
    );
    this.rest.emit("mediatorUpdate", this);
    for (const k in response) {
      if (k === "id") continue;

      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGuildMediator];
      }
    }
    this.manager.cache.set(med.id, med);
    this.rest.emit("mediatorUpdate", this, med);
    return this;
  }

  async delete() {
    const route = Routes.guilds.mediators.delete(this.guild.id, this.id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.manager.cache.delete(this.id);
    this.rest.mediators.delete(this.id);
    this.rest.emit("mediatorUpdate", this);
    return response;
  }
  async setLinks(link: string) {
    Assertion.assertString(link);

    const route = Routes.guilds.mediators.resource(
      this.guild.id,
      this.id,
      "links"
    );
    const payload = { paymentLinks: [link], set: true };
    const response = await this.rest.request<APIGuildMediator, {}>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.paymentLinks = response.paymentLinks;
    this.manager.cache.set(this.id, this);
    this.rest.mediators.set(this.id, this);
    this.rest.emit("mediatorUpdate", this);
    return this.paymentLinks;
  }
  async removeLink(link: string) {
    Assertion.assertString(link);

    const route = Routes.guilds.mediators.resource(
      this.guild.id,
      this.id,
      "links"
    );

    const payload = {
      paymentLinks: this.paymentLinks.filter((lm) => lm !== link),
    };
    const response = await this.rest.request<APIGuildMediator, {}>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.paymentLinks = response.paymentLinks;
    this.manager.cache.set(this.id, this);
    this.rest.mediators.set(this.id, this);
    this.rest.emit("mediatorUpdate", this);
    return this.paymentLinks;
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
}
