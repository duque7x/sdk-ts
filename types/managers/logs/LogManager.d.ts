import { Collection, Guild } from "../../structures";
import { Optional } from "../../types";
import { APILogEntry } from "../../types/api/APILogEntry";
import { BaseManager } from "../base";
export declare class LogManager extends BaseManager<APILogEntry> {
    constructor(guild: Guild);
    fetch(): Promise<APILogEntry[]>;
    create(data: Optional<APILogEntry>): Promise<APILogEntry>;
    createMany(data: Optional<APILogEntry>[]): Promise<APILogEntry[]>;
    set(data: APILogEntry | APILogEntry[]): APILogEntry | Collection<string, APILogEntry>;
}
