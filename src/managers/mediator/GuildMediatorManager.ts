import { Routes } from "../../rest/Routes";
import { GuildMediator } from "../../structures/mediator/GuildMediator";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional, APIGuildMediator } from "../../types";
import { BaseManager } from "../base";

type FetchOptions = {
  mediatorId?: string;
  cache?: boolean;
};
export class GuildMediatorManager extends BaseManager<GuildMediator> {
  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.guilds.mediators.getAll(guild.id);
    this.cache = new Collection<string, GuildMediator>("mediators");
  }

  async fetch(options?: FetchOptions): Promise<Collection<string, GuildMediator> | GuildMediator> {
    if (options && options.cache) return this.cache;
    if (options && options.mediatorId) {
      const route = Routes.fields(this.base_url, options.mediatorId);
      const response = await this.rest.request<APIGuildMediator, {}>({
        method: "GET",
        url: route,
      });
      return this.set(response) as GuildMediator;
    }
    const route = this.base_url;
    const response = await this.rest.request<APIGuildMediator[], {}>({
      method: "GET",
      url: route,
    });
    this.set(response);
    return this.cache;
  }
  async updateMany(...mediators: Optional<APIGuildMediator>[]): Promise<Collection<string, GuildMediator>> {
    const route = this.base_url;
    const response = await this.rest.request<APIGuildMediator[], { mediators: Optional<APIGuildMediator>[] }>({
      method: "PATCH",
      url: route,
      payload: { mediators },
    });

    return this.set(response) as Collection<string, GuildMediator>;
  }
  async create(payload: Optional<APIGuildMediator>): Promise<GuildMediator> {
    const route = Routes.guilds.mediators.create(this.guild.id);
    const response = await this.rest.request<APIGuildMediator, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    return this.set(response) as GuildMediator;
  }
  async deleteAll() {
    const route = this.base_url;
    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.clear();
  }
  async resetAll() {
    const route = this.base_url;
    const response = await this.rest.request<APIGuildMediator[], {}>({
      method: "put",
      url: route,
    });

    this.cache.clear();
    this.set(response);
    return this.cache;
  }

  set(data: APIGuildMediator | APIGuildMediator[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let _mediator of data) {
        if (!_mediator.id) return;
        const mediator = new GuildMediator(_mediator, this);
        this.cache.set(mediator.id, mediator);
        this.rest.mediators.set(mediator.id, mediator);
      }
      return this.cache;
    } else {
      if (!data.id) return;
      const mediator = new GuildMediator(data, this);
      this.cache.set(mediator.id, mediator);
      this.rest.mediators.set(mediator.id, mediator);
      return mediator;
    }
  }
}
