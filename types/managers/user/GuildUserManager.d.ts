import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildUser } from "../../structures/user/GuildUser";
import { APIGuildUser, Optional } from "../../types";
import { BaseManager } from "../base";
type FetchOptions = {
    userId?: string;
    cache?: boolean;
};
export declare class GuildUserManager extends BaseManager<GuildUser> {
    constructor(guild: Guild);
    fetch(options?: FetchOptions): Promise<Collection<string, GuildUser> | GuildUser>;
    updateMany(...users: Optional<APIGuildUser>[]): Promise<Collection<string, GuildUser>>;
    deleteAll(): Promise<void>;
    resetAll(): Promise<Collection<string, GuildUser>>;
    set(data: APIGuildUser | APIGuildUser[]): GuildUser | Collection<string, GuildUser>;
}
export {};
