import { REST } from "../../rest/REST";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuild } from "../../types/api/APIGuild";
type FetchOptions = {
    guildId?: string;
    cache?: boolean;
};
type DeleteOptions = {
    guildId?: string;
};
export declare class GuildManager {
    /** A cache of guilds */
    cache: Collection<string, Guild>;
    /** The rest client */
    rest: REST;
    /**
     * Manage guilds with the given client
     * @param guilds An array of guilds
     * @param rest The rest client
     */
    constructor(rest: REST);
    /**
     * Fetch a guild
     * @param id Id of the guild to fetch
     * @returns APIGuild
     */
    fetch(options?: FetchOptions): Promise<Collection<string, Guild> | Guild>;
    delete(options: DeleteOptions): Promise<Collection<string, Guild> | boolean>;
    set(data: APIGuild | APIGuild[]): Guild | Collection<string, Guild>;
}
export {};
