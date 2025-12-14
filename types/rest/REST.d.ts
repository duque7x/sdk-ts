import EventEmitter from "events";
import { GuildManager } from "../managers/guild/GuildManager";
import { Collection } from "../structures/Collection";
import { GuildMatch } from "../structures/match/GuildMatch";
import { GuildUser } from "../structures/user/GuildUser";
import { RestEvents, RequestOptions } from "../types/RestTypes";
import { MinesGameManager } from "../managers";
import { StatusResponse } from "../types";
import { GuildBetUser } from "../structures/betuser/GuildBetUser";
import { GuildBet, GuildTicket, VipMember } from "../structures";
interface ClientOptions {
    clientKey: string;
    guildId: string;
    authKey: string;
}
/**
 * The main class of this package
 */
export declare class REST extends EventEmitter {
    /**
     * The unique key for client
     */
    clientKey: string;
    authKey: string;
    guildId: string;
    /** The guild manager */
    guilds: GuildManager;
    minesGames: MinesGameManager;
    users: Collection<string, GuildUser>;
    betusers: Collection<string, GuildBetUser>;
    matches: Collection<string, GuildMatch>;
    bets: Collection<string, GuildBet>;
    tickets: Collection<string, GuildTicket>;
    vipmembers: Collection<string, VipMember>;
    /**
     *
     * @param key The unique key for he client
     */
    constructor(options: ClientOptions);
    /** Initialize the caching sistem */
    init(): Promise<this>;
    /**
     * Request Data from a certain url
     * @param options
     * @returns
     */
    request<Expecting, Payload>(options: RequestOptions<Payload>): Promise<Expecting>;
    getStatus(): Promise<StatusResponse>;
    emit<K extends keyof RestEvents>(event: K, ...args: RestEvents[K]): boolean;
    on<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this;
    once<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void): this;
}
export {};
