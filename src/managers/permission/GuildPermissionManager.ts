import { Routes } from "../../rest/Routes";
import { Guild } from "../../structures/guild/Guild";
import { APIGuild, APIGuildPermissions } from "../../types";
import { BaseManager } from "../base";

export class GuildPermissionManager extends BaseManager<APIGuildPermissions> {
  constructor(guild: Guild) {
    super(guild, guild.permissions);

    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.guilds.resource(guild.id, "permissions");
  }

  async addRole(permissionId: keyof APIGuildPermissions, roleId: string) {
    const perm = this.guild.permissions[permissionId];
    if (perm.includes(roleId)) return this.guild;

    perm.push(roleId);
    const perms = { ...this.guild.permissions, perm };
    const payload = { set: perms };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: this.base_url,
      payload,
    });

    this.guild.permissions = response.permissions;
    this.rest.guilds.cache.set(this.guild.id, this.guild);

    return response;
  }
  async removeRole(permissionId: keyof APIGuildPermissions, roleId: string) {
    let perm = this.guild.permissions[permissionId];
    if (!perm.includes(roleId)) return this.guild;

    perm = perm.filter((i) => i !== roleId);

    let perms = { ...this.guild.permissions };
    perms[permissionId] = perm;
    const payload = { set: perms };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: this.base_url,
      payload,
    });

    this.guild.permissions = response.permissions;
    this.rest.guilds.cache.set(this.guild.id, this.guild);

    return response;
  }
}
