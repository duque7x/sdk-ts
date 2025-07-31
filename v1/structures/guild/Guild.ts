import { GuildBetManager } from "../../managers/bet/GuildBetManager";
import { GuildBetUserManager } from "../../managers/betuser/GuildBetUserManager";
import { BufferManager } from "../../managers/buffer/BufferManager";
import { GroupedChannelManager } from "../../managers/groupedchannel/GroupedChannelManager";
import { GuildMatchManager } from "../../managers/match/GuildMatchManager";
import { GuildMediatorManager } from "../../managers/mediator/GuildMediatorManager";
import { MessagesManager } from "../../managers/messages/MessagesManager";
import { GuildPermissionManager } from "../../managers/permission/GuildPermissionManager";
import { GuildTicketManager } from "../../managers/ticket/GuildTicketManager";
import { GuildUserManager } from "../../managers/user/GuildUserManager";
import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Daily, GuildBlacklist } from "../../types/api";
import { APIBetMessage } from "../../types/api/APIBetMessage";
import {
  APIGuild,
  DailyCategories,
  GuildScores,
  GuildStatus,
  GuildTicketConfiguration,
} from "../../types/api/APIGuild";
import { APIGuildEmoji } from "../../types/api/APIGuildEmoji";
import { APIGuildMediator } from "../../types/api/APIGuildMediator";
import { APIGuildPermissions } from "../../types/api/APIGuildPermissions";
import { APIGuildRole } from "../../types/api/APIGuildRole";
import { APIGuildShop } from "../../types/api/APIGuildShop";
import { APIGuildTicket } from "../../types/api/APIGuildTicket";
import { APIGuildUser } from "../../types/api/APIGuildUser";
import { Assertion } from "../../utils/Assertion";
import { GuildBetUser } from "../betuser/GuildBetUser";
import { GuildShop } from "../shop/GuildShop";
import { GuildUser } from "../user/GuildUser";

/** The Guild */
export class Guild {
  /** The data of this guild */
  data: APIGuild;

  /** The rest client */
  rest: REST;

  /** The guild's id */
  id: string;

  /** Guild's client key */
  clientKey: string;

  /** Guild Permissions */
  permissions: APIGuildPermissions;

  /** Guild Ticket */
  tickets: GuildTicketManager;

  /** Guild Ticket Configuration */
  ticketsConfiguration: GuildTicketConfiguration;

  /** Guild Daily Categories */
  dailyCategories: DailyCategories[];

  /** Guild Scores */
  scores: GuildScores;

  /** Guild Status */
  status: GuildStatus;

  /** Guild Channel */
  channels: GroupedChannelManager;

  /** Guild Categories */
  categories: GroupedChannelManager;

  /** Guild Blacklist */
  blacklist: GuildBlacklist;

  /** Guild Prefix */
  prefix: string;

  /** Guild Prices */
  pricesAvailable: number[];

  /** Guild Prices Used */
  pricesOn: number[];

  /** Guild Creation Date */
  createdAt: Date;

  /** Guild Updated Date */
  updatedAt: Date;

  /** Guild Bets */
  bets: GuildBetManager;

  /** Guild Users */
  users: GuildUserManager;

  /** Guild Bet Users */
  betUsers: GuildBetUserManager;

  /** Guild Matches */
  matches: GuildMatchManager;

  /** Guild Mediators */
  mediators: GuildMediatorManager;

  /** Guild Messages */
  messages: MessagesManager;

  /** Guild Emojis */
  emojis: APIGuildEmoji[];

  /** Guild Roles */
  roles: APIGuildRole[];

  /** Guild Shop */
  shop: GuildShop;

  permissionsManager: GuildPermissionManager;
  buffer: BufferManager;

  /**
   * The guild structure
   * @param data The guild's data
   * @param rest The rest client
   */
  constructor(data: APIGuild, rest: REST) {
    this.data = data;
    this.rest = rest;

    this.id = data?.id;
    this.clientKey = data?.clientKey;
    this.prefix = data?.prefix;
    this.status = data?.status;

    this.ticketsConfiguration = data?.ticketsConfiguration;
    this.permissions = data?.permissions;
    this.dailyCategories = data?.dailyCategories;
    this.scores = data?.scores;

    this.messages = new MessagesManager(this, this.id, rest);
    this.roles = data?.roles;
    this.emojis = data?.emojis;

    this.pricesAvailable = data?.pricesAvailable;
    this.pricesOn = data?.pricesOn;

    this.shop = new GuildShop(data?.shop, this, rest);
    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
    this.blacklist = [];

    for (let blacklisted of data?.blacklist) {
      this.blacklist.push({
        addedBy: blacklisted.addedBy,
        id: blacklisted.id,
        createdAt: blacklisted?.createdAt ? new Date(blacklisted?.createdAt) : new Date(),
        updatedAt: blacklisted?.createdAt ? new Date(blacklisted?.createdAt) : new Date(),
      });
    }

    this.mediators = new GuildMediatorManager(this, rest);
    this.bets = new GuildBetManager(this, rest);
    this.users = new GuildUserManager(this, rest);
    this.betUsers = new GuildBetUserManager(this, rest);
    this.matches = new GuildMatchManager(this, rest);
    this.channels = new GroupedChannelManager(this, "channels", rest);
    this.categories = new GroupedChannelManager(this, "categories", rest);
    this.tickets = new GuildTicketManager(this, rest);
    this.permissionsManager = new GuildPermissionManager(this, rest);
    this.buffer  = new BufferManager(this);

    this.bets.setAll(data?.bets);
    this.users.setAll(data?.users);
    this.betUsers.setAll(data?.betUsers);
    this.channels.setAll(data?.channels);
    this.categories.setAll(data?.categories);
    this.matches.setAll(data?.matches);
    this.mediators.setAll(data?.mediators);
    this.tickets.setAll(data?.tickets);
    this.permissionsManager.setAll(data?.permissions);
    this.messages.setAll(data?.messages);
  }

  async fetch(): Promise<Guild> {
    const route = Routes.guilds.get(this.id);
    const response = await this.rest.request<APIGuild, {}>({
      method: "get",
      url: route,
    });
    const guild = new Guild(response, this.rest);
    this.rest.guilds.cache.set(guild.id, guild);

    return guild;
  }

  async setBlacklist(value: boolean, user: GuildBetUser | GuildUser, adminId: string) {
    Assertion.assertBoolean(value);
    Assertion.assertString(adminId);
    const is_in_blacklist = this.blacklist.find((u) => u.id == user.id);
    if (is_in_blacklist && value === true) return this;

    const route = Routes.guilds.resource(this.id, "blacklist");
    const payload = { id: user.id, name: user.name, adminId, value };

    const [response] = await Promise.all([
      this.rest.request<APIGuild, typeof payload>({
        method: "PATCH",
        url: route,
        payload,
      }),
      user.setBlacklist(value),
    ]);

    for (let blacklisted of response?.blacklist) {
      this.blacklist.push({
        addedBy: blacklisted.addedBy,
        id: blacklisted.id,
        createdAt: blacklisted?.createdAt ? new Date(blacklisted?.createdAt) : new Date(),
        updatedAt: blacklisted?.createdAt ? new Date(blacklisted?.createdAt) : new Date(),
      });
    }
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async setStatus(key: keyof GuildStatus, status: string) {
    Assertion.assertString(status);

    status = status.toLowerCase();

    const route = Routes.fields(Routes.guilds.resource(this.id, "status"), key);
    const payload = { status };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.status = response.status;
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async addPrice(price: number) {
    Assertion.assertNumber(price);

    const route = Routes.fields(Routes.guilds.resource(this.id, "price"), "pricesOn");
    const payload = { price };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.pricesAvailable = response.pricesAvailable;
    this.pricesOn = response.pricesOn;
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async removePrice(price: number) {
    Assertion.assertNumber(price);

    const route = Routes.fields(Routes.guilds.resource(this.id, "price"), "pricesOn");
    const payload = { price };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.pricesAvailable = response.pricesAvailable;
    this.pricesOn = response.pricesOn;
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }

  async setPrefix(prefix: string) {
    Assertion.assertString(prefix);

    const route = Routes.fields(Routes.guilds.resource(this.id, "prefix"));
    const payload = { prefix };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.prefix = response.prefix;
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async addDailyCategory(category: keyof Daily) {
    Assertion.assertString(category);

    const route = Routes.fields(Routes.guilds.resource(this.id, "dailyCategories"));

    const payload = { category };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    this.dailyCategories = response.dailyCategories;

    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async removeDailyCategory(category: keyof Daily) {
    Assertion.assertString(category);

    const route = Routes.fields(Routes.guilds.resources(this.id, "dailyCategories", category));
    const categories = [...new Set([...this.dailyCategories, category])];

    const payload = { categories };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.dailyCategories = response.dailyCategories;
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
}
