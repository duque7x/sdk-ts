import { LogManager } from "../../managers";
import { REST } from "../../rest";
import { APILogEntry, LogEntryTypes, Optional } from "../../types";
import { Guild } from "../guild/Guild";
export declare class LogEntry {
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
    constructor(data: APILogEntry, manager: LogManager);
    fetch(): Promise<LogEntry>;
    toJSON(): Record<string, unknown>;
    _updateInternals(data: Optional<APILogEntry>): this;
}
