import { Guild } from "../../structures/guild/Guild";
import { APIGuild, APIGuildPermissions, GuildPermissionsTypes } from "../../types";
import { BaseManager } from "../base";
export declare class GuildPermissionManager extends BaseManager<APIGuildPermissions> {
    constructor(guild: Guild);
    addRole(type: GuildPermissionsTypes, ...ids: string[]): Promise<APIGuild>;
    removeRole(type: GuildPermissionsTypes, ...ids: string[]): Promise<APIGuild>;
}
