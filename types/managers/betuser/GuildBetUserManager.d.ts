import { GuildBetUser } from "../../structures/betuser/GuildBetUser";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional, APIGuildBetUser } from "../../types";
import { BaseManager } from "../base";
type FetchOptions = {
    userId?: string;
    cache?: boolean;
};
export declare class GuildBetUserManager extends BaseManager<GuildBetUser> {
    constructor(guild: Guild);
    fetch(options?: FetchOptions): Promise<Collection<string, GuildBetUser> | GuildBetUser>;
    updateMany(...betusers: Optional<APIGuildBetUser>[]): Promise<Collection<string, GuildBetUser>>;
    deleteAll(): Promise<void>;
    resetAll(): Promise<Collection<string, GuildBetUser>>;
    set(data: APIGuildBetUser | APIGuildBetUser[]): GuildBetUser | Collection<string, GuildBetUser>;
}
export {};
