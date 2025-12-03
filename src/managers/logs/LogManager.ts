import { REST, Routes } from "../../rest";
import { Collection, Guild, LogEntry } from "../../structures";
import { Optional } from "../../types";
import { APILogEntry } from "../../types/api/APILogEntry";
import { BaseManager } from "../base";

export class LogManager extends BaseManager<LogEntry> {
  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.fields(Routes.guilds.get(guild.id), "logs");
    this.cache = new Collection<string, LogEntry>();
  }

  async fetch(): Promise<Collection<string, LogEntry>> {
    const route = this.base_url;
    const response = await this.rest.request<APILogEntry[], {}>({
      method: "GET",
      url: route,
    });

    return this.set(response) as Collection<string, LogEntry>;
  }
  async create(data: Optional<APILogEntry>): Promise<LogEntry> {
    const route = this.base_url;
    const payload = { ...data };
    const response = await this.rest.request<APILogEntry, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    const logEntry = this.set(response) as LogEntry;
    this.cache.set(data._id, logEntry);
    this.rest.emit("logEntryCreate", logEntry, this.guild);

    return logEntry;
  }
  /* async createMany(data: Optional<APILogEntry>[]): Promise<APILogEntry[]> {
    const route = Routes.fields(this.base_url, "bulk");
    const payload = { ...data };
    const response = await this.rest.request<APILogEntry[], typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    this.set(response);
    return response;
  } */
  set(data: APILogEntry | APILogEntry[]) {
    if (!data) return this.cache;
    if (Array.isArray(data)) {
      this.cache.clear();

      for (let entry of data) {
        if (!entry._id) continue;
        const logEntry = new LogEntry(entry, this);
        this.cache.set(entry._id, logEntry);
      }
      return this.cache;
    } else {
      const logEntry = new LogEntry(data, this);
      this.cache.set(data._id, logEntry);
      return logEntry;
    }
  }
}
