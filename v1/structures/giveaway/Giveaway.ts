import { GiveawayManager } from "../../managers/giveaway/GiveawayManager";
import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Optional } from "../../types";
import { APIGiveaway, GiveawayMessage, GiveawayWinners } from "../../types/api/APIGiveaway";
import { getRandomNumber } from "../../utils/getRandomNumber";

type AllowedTypes = Optional<APIGiveaway> | Giveaway;

export class Giveaway {
  host_id: string;
  channel_id: string;
  guild_id: string;
  _id: string;

  /** Duration of giveaway in sec */
  duration: number;

  prizes: string[];
  participants: string[];
  allowed_roles: string[];
  blacklisted_roles: string[];

  message: GiveawayMessage;
  winners: GiveawayWinners;

  rerolls: string[];
  status: "created" | "off" | "on";
  createdAt: Date;
  updatedAt: Date;
  readonly rest: REST;
  readonly manager: GiveawayManager;
  constructor(data: AllowedTypes, manager: GiveawayManager) {
    this._id = data?._id;
    this.host_id = data?.host_id;
    this.channel_id = data?.channel_id;
    this.guild_id = data?.guild_id;
    this.status = data?.status;

    /** Duration of giveaway in sec */
    this.duration = data?.duration;

    this.prizes = data?.prizes;
    this.participants = data?.participants;
    this.allowed_roles = data?.allowed_roles;
    this.blacklisted_roles = data?.blacklisted_roles;

    this.message = data?.message;
    this.winners = data?.winners;

    this.rerolls = data?.rerolls;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
    this.manager = manager;
    this.rest = manager.rest;
  }
  async end() {
    const route = Routes.giveaways.get(this._id);
    const payload = { status: "off" };

    const response = await this.rest.request<APIGiveaway, {}>({
      method: "patch",
      url: route,
      payload,
    });
    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGiveaway];
      }
    }

    this.manager.set(this);
    return true;
  }
  async start() {
    const route = Routes.giveaways.get(this._id);
    const payload = { status: "on" };

    const response = await this.rest.request<APIGiveaway, {}>({
      method: "patch",
      url: route,
      payload,
    });
    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGiveaway];
      }
    }

    this.manager.set(this);
    return true;
  }
  async addAllowedRole(roleId: string) {
    const route = Routes.giveaways.get(this._id);
    const payload = { allowed_roles: [...new Set([...this.allowed_roles, roleId])] };

    const response = await this.rest.request<APIGiveaway, {}>({
      method: "patch",
      url: route,
      payload,
    });
    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGiveaway];
      }
    }

    this.manager.set(this);
    return true;
  }
  async addBlacklistedRole(roleId: string) {
    const route = Routes.giveaways.get(this._id);
    const payload = { blacklisted_roles: [...new Set([...this.blacklisted_roles, roleId])] };

    const response = await this.rest.request<APIGiveaway, {}>({
      method: "patch",
      url: route,
      payload,
    });
    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGiveaway];
      }
    }

    this.manager.set(this);
    return true;
  }

  async getWinners() {
    let winners: string[];
    if (this.participants.length !== 0) {
      for (let index = 0; index < this.participants.length; index++) {
        const winnerIndex = getRandomNumber(1, this.participants.length ?? 1);
        winners.push(this.participants[winnerIndex]);
      }
    } else winners = [];
    const newWinners = { count: winners.length, selected: winners };
    this.winners = newWinners;

    const route = Routes.giveaways.get(this._id);
    const payload = { winners: newWinners };
    const response = await this.rest.request<APIGiveaway, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    this.updatedAt = response?.updatedAt ? new Date(response?.updatedAt) : new Date();
    this.manager.set(this);

    return this;
  }
  async addParticipant(userId: string) {
    const route = Routes.fields(Routes.giveaways.get(this._id), "participants");
    const payload = { userId };
    const response = await this.rest.request<APIGiveaway, typeof payload>({
      method: "post",
      url: route,
      payload,
    });

    this.participants = response.participants;
    this.updatedAt = response?.updatedAt ? new Date(response?.updatedAt) : new Date();
    this.manager.set(this);

    return this;
  }
  async removeParticipant(userId: string) {
    const route = Routes.fields(Routes.giveaways.get(this._id), "participants");
    const payload = { userId };
    const response = await this.rest.request<APIGiveaway, typeof payload>({
      method: "delete",
      url: route,
      payload,
    });

    this.participants = response.participants;
    this.updatedAt = response?.updatedAt ? new Date(response?.updatedAt) : new Date();
    this.manager.set(this);
    return this;
  }
  async reroll(winners?: string[]) {
    const route = Routes.fields(Routes.giveaways.get(this._id), "rerolls");
    const payload = { winners };
    const response = await this.rest.request<APIGiveaway, typeof payload>({
      method: "post",
      url: route,
      payload,
    });

    this.rerolls = response.rerolls;
    this.updatedAt = response?.updatedAt ? new Date(response?.updatedAt) : new Date();
    this.manager.set(this);
    return this;
  }
  async delete() {
    const route = Routes.giveaways.delete(this._id);
    const response = await this.rest.request<APIGiveaway, {}>({
      method: "delete",
      url: route,
    });
    this.manager.cache.delete(this._id);
    return true;
  }

  async update(data: AllowedTypes) {
    const route = Routes.giveaways.update(this._id);
    const payload = data;
    const response = await this.rest.request<APIGiveaway, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGiveaway];
      }
    }
    this.updatedAt = response?.updatedAt ? new Date(response?.updatedAt) : new Date();

    this.manager.set(this);
    return this;
  }
}
