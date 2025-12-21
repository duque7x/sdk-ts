import { Collection, Guild, GuildBet } from "../../structures";
import { APIGuildBet, Optional } from "../../types";
import { BaseManager } from "../base";
export interface FetchOptions {
    cache?: boolean;
    betId?: string;
}
export declare class GuildBetManager extends BaseManager<GuildBet> {
    constructor(guild: Guild);
    toString(): number;
    fetch(options?: FetchOptions): Promise<GuildBet | Collection<string, GuildBet>>;
    create(data: Optional<APIGuildBet>): Promise<GuildBet>;
    delete(betId?: string): Promise<GuildBet>;
    set(data: Optional<APIGuildBet> | Optional<APIGuildBet>[]): GuildBet;
}
