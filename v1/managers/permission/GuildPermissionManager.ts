import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { Optional } from "../../types/api";
import { APIGuild } from "../../types/api/APIGuild";
import { APIGuildPermissions } from "../../types/api/APIGuildPermissions";
import { Assertion } from "../../utils/Assertion";

export class GuildPermissionManager {
  /** The rest client */
  rest: REST;

  /** GuildBet bet guild */
  guild: Guild;

  permissions: APIGuildPermissions;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;
    this.rest = rest;
  }

  /**
   * Fetch a bet
   * @param id Id of the bet to fetch
   * @returns APIBetUser
   */
  async fetch() {
    const route = Routes.guilds.resource(this.guild.id, "permissions");
    const response = await this.rest.request<APIGuildPermissions, {}>({
      method: "get",
      url: route,
    });
    this.setAll(response);
  }
  async addId(permissionId: keyof APIGuildPermissions, roleId: string) {
    const route = Routes.guilds.resources(
      this.guild.id,
      "permissions",
      permissionId,
      "ids"
    );
    const payload = { id: roleId };
    const response = await this.rest.request<string[], typeof payload>({
      method: "post",
      url: route,
      payload,
    });
    this.permissions[permissionId] = response;
    return response;
  }
  async removeId(permissionId: keyof APIGuildPermissions, roleId: string) {
    const route = Routes.guilds.resources(
      this.guild.id,
      "permissions",
      permissionId,
      "ids",
      roleId
    );
    const payload = { id: roleId };
    const response = await this.rest.request<string[], typeof payload>({
      method: "delete",
      url: route,
      payload,
    });

    this.permissions[permissionId] = response;
    return response;
  }
  setAll(data: APIGuildPermissions) {
    if (!data) return this.permissions;
    this.permissions = data;
  }
  toJSON() {
    const json: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this)) {
      if (typeof value !== "function") {
        json[key] = value;
      }
    }
    return json;
  }
}
