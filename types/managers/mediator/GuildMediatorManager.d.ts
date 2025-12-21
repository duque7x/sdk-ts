import { GuildMediator } from "../../structures/mediator/GuildMediator";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional, APIGuildMediator } from "../../types";
import { BaseManager } from "../base";
type FetchOptions = {
    mediatorId?: string;
    cache?: boolean;
};
export declare class GuildMediatorManager extends BaseManager<GuildMediator> {
    constructor(guild: Guild);
    fetch(options?: FetchOptions): Promise<Collection<string, GuildMediator> | GuildMediator>;
    updateMany(...mediators: Optional<APIGuildMediator>[]): Promise<Collection<string, GuildMediator>>;
    create(payload: Optional<APIGuildMediator>): Promise<GuildMediator>;
    deleteAll(): Promise<void>;
    resetAll(): Promise<Collection<string, GuildMediator>>;
    set(data: APIGuildMediator | APIGuildMediator[]): GuildMediator | Collection<string, GuildMediator>;
}
export {};
