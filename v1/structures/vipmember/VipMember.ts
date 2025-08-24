import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Accessory, Daily, Items, Optional, OriginalChannels, ProfileCard } from "../../types/api";
import { APIVipMember } from "../../types/api/APIVipMember";
import { VipMemberManager } from "../../managers/vipmember/VipMemberManager";
import { Guild } from "../guild/Guild";

export class VipMember implements APIVipMember {
  /** member's id */
  id: string;

  /** member name */
  name: string;

  /** Members's roleId */
  roleId: string;

  /** Members's voiceChannelId */
  voiceChannelId: string;

  /** Vip's type */
  type: string;

  /** Member's Guild Id */
  guild_id: string;

  /** member's daily */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given manager */
  readonly manager: VipMemberManager;

  /** The rest client */
  readonly rest: REST;
  readonly guild: Guild;

  /**
   * Bet member
   * @param data  The member's data
   * @param manager The manager
   * @param rest The rest client
   */
  constructor(data: APIVipMember, manager: VipMemberManager, rest: REST) {
    this.name = data.name;
    this.id = data.id;
    this.roleId = data.roleId;
    this.voiceChannelId = data.voiceChannelId;
    this.guild_id = data.guild_id;
    this.guild = manager.guild;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.manager = manager;
    this.rest = rest;
  }
  /** String representation of this member */
  toString() {
    return `<@${this.id}>`;
  }
  /**
   * Fetches the member
   * @returns New Instance of the member
   */
  async fetch() {
    const route = Routes.vipmembers.get(this.guild_id, this.id);
    const response = await this.rest.request<APIVipMember, {}>({
      method: "get",
      url: route,
    });
    const member = new VipMember(response, this.manager, this.rest);

    this.manager.cache.set(member.id, member);
    return member;
  }

  async reset() {
    const route = Routes.vipmembers.get(this.guild_id, this.id);
    const payload = { reset: true };
    const response = await this.rest.request<APIVipMember, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.#updateData(response);
    return this;
  }
  #updateData(data: Optional<APIVipMember | VipMember>) {
    for (const k in data) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = data[k as keyof APIVipMember];
        (this as any).data[k] = data[k as keyof APIVipMember];
      }
    }
  }
  /**
   * Update certain property
   * @param data The new data to update with
   * @returns
   */
  async update(data: Optional<APIVipMember>) {
    const route = Routes.vipmembers.get(this.guild_id, this.id);
    const payload: Record<string, any> = data;

    const response = await this.rest.request<APIVipMember, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIVipMember];
      }
    }

    this.updatedAt = response?.updatedAt ? new Date(response?.updatedAt) : new Date();
    this.createdAt = response?.createdAt ? new Date(response?.createdAt) : new Date();
    this.manager.cache.set(this.id, this);

    return this;
  }

  async delete() {
    const route = Routes.vipmembers.delete(this.guild_id, this.id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.manager.cache.delete(this.id);
    return response;
  }
  toJSON() {
    let json: Record<keyof APIVipMember, unknown>;
    for (const [key, value] of Object.entries(this)) {
      if (typeof value !== "function") {
        (json as any)[key] = value;
      }
    }
    return json;
  }
}
