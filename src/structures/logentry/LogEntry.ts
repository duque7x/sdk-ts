import { LogManager } from "../../managers";
import { REST, Routes } from "../../rest";
import { APILogEntry, LogEntryTypes, Optional } from "../../types";
import { Guild } from "../guild/Guild";

export class LogEntry {
  _id: string;
  guild_id: string;
  user_id: string;
  admin_id: string;
  object_id: string;

  type: LogEntryTypes;
  description: string;
  change: string;

  before: any;
  after: any;
  logs_channel_id: string;

  createdAt: Date;
  updatedAt: Date;

  manager: LogManager;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;

  constructor(data: APILogEntry, manager: LogManager) {
    this.manager = manager;
    this.guild = manager.guild;

    this._id = data?._id;
    this.guild_id = data?.guild_id;
    this.user_id = data?.user_id;
    this.admin_id = data?.admin_id;
    this.object_id = data?.object_id;

    this.type = data?.type;
    this.description = data?.description;
    this.change = data?.change;
    this.before = data?.before;
    this.after = data?.after;
    this.logs_channel_id = data?.logs_channel_id;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
  }

  async fetch(): Promise<LogEntry> {
    const route = Routes.guilds.resources(this.guild.id, "logs", this._id);
    const response = await this.rest.request<APILogEntry, {}>({ url: route, method: "GET" });

    return this._updateInternals(response);
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

  _updateInternals(data: Optional<APILogEntry>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APILogEntry];
      }
    }

    this.updatedAt = new Date();
    this.manager.set(this);
    return this;
  }
}
