import { GuildBet, GuildTicket, LogEntry } from "../structures";
import { GuildBetUser } from "../structures/betuser/GuildBetUser";
import { Collection } from "../structures/Collection";
import { Guild } from "../structures/guild/Guild";
import { GuildMatch } from "../structures/match/GuildMatch";
import { GuildUser } from "../structures/user/GuildUser";
export interface RequestOptions<Payload> {
    /** The request's method */
    method: string;
    /** The request's url */
    url: string;
    /** The request payload */
    payload?: Payload;
}
export interface RestEvents {
    request: [{
        url: string;
        method: string;
    }];
    response: [{
        status: number;
        body: unknown;
    }];
    error: [Error];
    debug: [string];
    ticketCreate: [GuildTicket];
    ticketDelete: [GuildTicket];
    ticketsDelete: [Collection<string, GuildTicket>];
    matchCreate: [GuildMatch];
    matchUpdate: [GuildMatch, GuildMatch];
    matchDelete: [GuildMatch];
    matchesDelete: [Collection<string, GuildMatch>];
    betCreate: [GuildBet];
    betUpdate: [GuildBet, GuildBet];
    betDelete: [GuildBet];
    betsDelete: [Collection<string, GuildBet>];
    guildUpdate: [Guild];
    guildDelete: [Guild];
    guildsDelete: [Collection<string, Guild>];
    userDelete: [GuildUser];
    userUpdate: [GuildUser];
    usersDelete: [Collection<string, GuildUser>];
    betuserDelete: [GuildBetUser];
    betuserUpdate: [GuildBetUser];
    betusersDelete: [Collection<string, GuildBetUser>];
    logEntryCreate: [LogEntry, Guild];
}
