import { REST, Routes } from "../../rest";
import { Collection, Guild } from "../../structures";
import { Optional } from "../../types";
import { APILogEntry } from "../../types/api/APILogEntry";
import { BaseManager } from "../base";

export class LogManager extends BaseManager<APILogEntry> {
  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.fields(Routes.guilds.get(guild.id), "logs");
    this.cache = new Collection<string, APILogEntry>();
  }

  async fetch(): Promise<APILogEntry[]> {
    const route = this.base_url;
    const response = await this.rest.request<APILogEntry[], {}>({
      method: "GET",
      url: route,
    });
    return response;
  }
  async create(data: Optional<APILogEntry>): Promise<APILogEntry> {
    const route = this.base_url;
    const payload = { ...data };
    const response = await this.rest.request<APILogEntry, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    this.set(response);
    return response;
  }
  async createMany(data: Optional<APILogEntry>[]): Promise<APILogEntry[]> {
    const route = this.base_url;
    const payload = { ...data };
    const response = await this.rest.request<APILogEntry[], typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    this.set(response);
    return response;
  }
  set(data: APILogEntry | APILogEntry[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      for (let entry of data) {
        this.cache.set(entry._id, entry);
      }
      return this.cache;
    } else {
      this.cache.set(data._id, data);
      return data;
    }
  }
}
