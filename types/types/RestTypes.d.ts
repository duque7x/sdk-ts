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
    matchCreate: [GuildMatch];
    matchUpdate: [GuildMatch, GuildMatch];
    matchDelete: [GuildMatch];
    matchesDelete: [Collection<string, GuildMatch>];
    guildUpdate: [Guild];
    guildDelete: [Guild];
    guildsDelete: [Collection<string, Guild>];
    userDelete: [GuildUser];
    userUpdate: [GuildUser];
    usersDelete: [Collection<string, GuildUser>];
}
