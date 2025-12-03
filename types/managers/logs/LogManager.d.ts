import { Collection, Guild, LogEntry } from "../../structures";
import { Optional } from "../../types";
import { APILogEntry } from "../../types/api/APILogEntry";
import { BaseManager } from "../base";
export declare class LogManager extends BaseManager<LogEntry> {
    constructor(guild: Guild);
    fetch(): Promise<Collection<string, LogEntry>>;
    create(data: Optional<APILogEntry>): Promise<LogEntry>;
    set(data: APILogEntry | APILogEntry[]): LogEntry | Collection<string, LogEntry>;
}
