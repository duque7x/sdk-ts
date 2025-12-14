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

  async addRole(type: GuildPermissionsTypes, ...ids: string[]) {
    const perm = this.guild.permissions.find((p) => p.type === type) || { ids: [], type };

    const _ids = [...new Set([...perm.ids, ...ids])];

    const perms = [...this.guild.permissions];
    let permsIndex = this.guild.permissions.findIndex((p) => p.type === type);

    if (permsIndex === -1) perms.push({ type, ids: _ids });
    else perms[permsIndex] = { type, ids: _ids };

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

  async removeRole(type: GuildPermissionsTypes, ...ids: string[]) {
    const perm = this.guild.permissions.find((p) => p.type === type) || { ids: [], type };

    // Remove matching ids
    const _ids = [...new Set([...perm.ids.filter((i) => !ids.includes(i))])];

    const perms = [...this.guild.permissions];
    let permsIndex = this.guild.permissions.findIndex((p) => p.type === type);

    if (permsIndex === -1) {
      // no existing permission, just push empty version
      perms.push({ type, ids: _ids });
    } else {
      perms[permsIndex] = { type, ids: _ids };
    }

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
