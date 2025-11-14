import { Guild } from "../../structures/guild/Guild";
import { APIGuild, APIGuildPermissions } from "../../types";
import { BaseManager } from "../base";
export declare class GuildPermissionManager extends BaseManager<APIGuildPermissions> {
    constructor(guild: Guild);
    addRole(permissionId: keyof APIGuildPermissions, roleId: string): Promise<APIGuild | Guild>;
    removeRole(permissionId: keyof APIGuildPermissions, roleId: string): Promise<APIGuild | Guild>;
}
