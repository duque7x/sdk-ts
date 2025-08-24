import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { VipMember } from "../../structures/vipmember/VipMember";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIVipMember } from "../../types/api/APIVipMember";
import { Assertion } from "../../utils/Assertion";
import { Optional } from "../../types";

export class VipMemberManager {
  /** A cache of vipmembers */
  cache: Collection<string, VipMember>;

  /** The rest client */
  readonly rest: REST;
  readonly guild: Guild;

  /**
   * Manage vipmembers with the given client
   * @param vipmembers An array of vipmembers
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.rest = rest;
    this.guild = guild;
    this.cache = new Collection<string, VipMember>("vipmembers");
  }
  async create(data: Optional<APIVipMember>) {
    const route = Routes.vipmembers.create(this.guild.id);
    const payload = { ...data };
    const response = await this.rest.request<APIVipMember, typeof payload>({
      method: "post",
      url: route,
      payload,
    });

    const member = new VipMember(response, this, this.rest);
    this.cache.set(member?.id, member);
    return member;
  }
  /**
   * Fetch a member
   * @param id Id of the member to fetch
   * @returns VipMember
   */
  async fetch(id: string): Promise<VipMember> {
    const route = Routes.vipmembers.get(this.guild.id, id);
    const payload = { guild_id: this.guild.id };
    const response = await this.rest.request<APIVipMember, typeof payload>({
      method: "get",
      url: route,
      payload,
    });
    if (!response) return this.cache.get(id);

    const member = new VipMember(response, this, this.rest);
    this.cache.set(member?.id, member);

    return member;
  }

  async fetchAll(): Promise<Collection<string, VipMember>> {
    const route = Routes.vipmembers.getAll(this.guild.id);
    const response = await this.rest.request<APIVipMember[], {}>({
      method: "get",
      url: route,
    });
    if (Array.isArray(response) && response.length === 0) {
      this.cache.clear();
      return this.cache;
    }
    this.setAll(response);
    return this.cache;
  }
  async updateMember(id: string, data: Optional<APIVipMember>) {
    const route = Routes.vipmembers.update(this.guild.id, id);
    const payload = { ...data, guild_id: this.guild.id };
    const response = await this.rest.request<APIVipMember, typeof payload>({
      method: "Patch",
      url: route,
      payload,
    });
    const member = this.set(response);
    return member;
  }
  set(data: APIVipMember): VipMember {
    if (!data?.id) return;
    const member = new VipMember(data, this, this.rest);
    this.cache.set(member.id, member);
    return member;
  }
  setAll(data: APIVipMember[]): Collection<string, VipMember> {
    if (!data) return this.cache;
    for (let member of data) this.set(member);
    return this.cache;
  }
  async resetAll() {
    const route = Routes.vipmembers.getAll(this.guild.id);
    const response = await this.rest.request<APIVipMember[], {}>({
      method: "PUT",
      url: route,
    });
    this.setAll(response);
    return this.cache;
  }
  async delete(id: string) {
    Assertion.assertString(id);
    Assertion.assertString(this.guild.id);

    const route = Routes.vipmembers.delete(id, this.guild.id);
    await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    Assertion.assertString(this.guild.id);
    const route = Routes.vipmembers.deleteAll(this.guild.id);
    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
