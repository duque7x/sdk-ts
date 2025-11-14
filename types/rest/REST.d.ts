import EventEmitter from "events";
import { GuildManager } from "../managers/guild/GuildManager";
import { Collection } from "../structures/Collection";
import { GuildMatch } from "../structures/match/GuildMatch";
import { GuildUser } from "../structures/user/GuildUser";
import { RestEvents, RequestOptions } from "../types/RestTypes";
/**
 * The main class of this package
 */
export declare class REST extends EventEmitter {
    /**
     * The unique key for client
     */
    key: string;
    /** The guild manager */
    guilds: GuildManager;
    users: Collection<string, GuildUser>;
    matches: Collection<string, GuildMatch>;
    /**
     *
     * @param key The unique key for he client
     */
    constructor(key?: string);
    /**
     * Set the api key
     * @param key The unique key of the client
     */
    setKey(key: string): void;
    /** Initialize the caching sistem */
    init(): Promise<this>;
    /**
     * Ping the api
     */
    ping(): Promise<unknown>;
    /**
     * Request Data from a certain url
     * @param options
     * @returns
     */
    request<Expecting, Payload>(options: RequestOptions<Payload>): Promise<Expecting>;
    emit<K extends keyof RestEvents>(event: K, ...args: RestEvents[K]): boolean;
    on<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this;
    once<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this;
}
