import { Guild } from "../../structures/guild/Guild";
import { APIGuild, APIGuildPermissions, GuildPermissionsTypes } from "../../types";
import { BaseManager } from "../base";
export declare class GuildPermissionManager extends BaseManager<APIGuildPermissions> {
    constructor(guild: Guild);
    addRole(type: GuildPermissionsTypes, roleId: string): Promise<APIGuild>;
    removeRole(type: GuildPermissionsTypes, roleId: string): Promise<APIGuild | Guild>;
}
