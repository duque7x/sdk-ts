import { GuildMatch } from "../../structures/match/GuildMatch";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuildMatch } from "../../types/api/APIGuildMatch";
import { Optional } from "../../types/api";
import { BaseManager } from "../base";
type FetchOptions = {
    cache: boolean;
    matchId: string;
};
export declare class GuildMatchManager extends BaseManager<GuildMatch> {
    /**
     * Manage users with the given client
     * @param users An array of users
     * @param rest The rest client
     */
    constructor(guild: Guild);
    /**
     * Fetch a match
     * @param id Id of the match to fetch
     * @returns APIBetUser
     */
    fetch(options?: Optional<FetchOptions>): Promise<GuildMatch | Collection<string, GuildMatch>>;
    fetchAll(): Promise<Collection<string, GuildMatch>>;
    set(data: APIGuildMatch | APIGuildMatch[] | GuildMatch): GuildMatch | Collection<string, GuildMatch>;
    create(payload: Optional<APIGuildMatch>): Promise<GuildMatch>;
    delete(id?: string): Promise<GuildMatch | Collection<string, GuildMatch>>;
}
export {};
