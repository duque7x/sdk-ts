import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildMatch } from "../../structures/match/GuildMatch";
import { APIGuildMatch, APIGuildTicket, Optional } from "../../types";
export type BufferMatch = Optional<APIGuildMatch & {
    id: string;
}>;
export type BufferTicket = Optional<APIGuildTicket & {
    id: string;
}>;
export declare class BufferManager {
    matches: Collection<string, BufferMatch | GuildMatch>;
    tickets: Collection<string, BufferTicket>;
    guild: Guild;
    constructor(guild: Guild);
    flush(key: "matches" | "tickets"): Promise<APIGuildMatch[] & APIGuildTicket[]>;
    createMatch(id: string, data: BufferMatch): void;
    createTicket(id: string, data: BufferTicket): void;
}
