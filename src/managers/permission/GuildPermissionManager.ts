import { Routes } from "../../rest/Routes";
import { Guild } from "../../structures/guild/Guild";
import { APIGuild, APIGuildPermissions, GuildPermissionsTypes } from "../../types";
import { BaseManager } from "../base";

export class GuildPermissionManager extends BaseManager<APIGuildPermissions> {
  constructor(guild: Guild) {
    super(guild, guild.permissions);

    this.guild = guild;
    this.rest = guild.rest;
    this.base_url = Routes.guilds.resource(guild.id, "permissions");
  }

  async addRole(type: GuildPermissionsTypes, roleId: string) {
    const perm = this.guild.permissions.find((p) => p.type === type) || { ids: [roleId], type };
   // if (perm.ids.includes(roleId)) return this.guild;

    perm.ids.push(roleId);
    const perms = { ...this.guild.permissions };
    let permsIndex = this.guild.permissions.findIndex((p) => p.type === type);
    perms[permsIndex] = perm;

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
  async removeRole(type: GuildPermissionsTypes, roleId: string) {
    const perm = this.guild.permissions.find((p) => p.type === type) || { ids: [], type };
    if (!perm.ids.includes(roleId)) return this.guild;
    perm.ids = perm.ids.filter((i) => i !== roleId);

    let perms = { ...this.guild.permissions };
    let permsIndex = this.guild.permissions.findIndex((p) => p.type === type);
    perms[permsIndex] = perm;

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
