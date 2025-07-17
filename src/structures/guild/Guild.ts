import { BetManager } from "../../managers/bet/BetManager";
import { BetUserManager } from "../../managers/betuser/BetUserManager";
import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { GuildBlacklist } from "../../types/api";
import { APIBetMessage } from "../../types/api/APIBetMessage";
import {
  APIGuild,
  GuildPermission,
  GuildScores,
  GuildStatus,
  GuildTicketConfiguration,
} from "../../types/api/APIGuild";
import { APIGuildBet } from "../../types/api/APIGuildBet";
import { APIGuildBetUser } from "../../types/api/APIGuildBetUser";
import { APIGuildChannel } from "../../types/api/APIGuildChannel";
import { APIGuildEmoji } from "../../types/api/APIGuildEmoji";
import { APIMatchChannel } from "../../types/api/APIGuildMatch";
import { APIGuildMediator } from "../../types/api/APIGuildMediator";
import { APIGuildRole } from "../../types/api/APIGuildRole";
import { APIGuildShop } from "../../types/api/APIGuildShop";
import { APIGuildTicket } from "../../types/api/APIGuildTicket";
import { APIGuildUser } from "../../types/api/APIGuildUser";

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
  permissions: GuildPermission;

  /** Guild Ticket */
  tickets: APIGuildTicket[];

  /** Guild Ticket Configuration */
  ticketsConfiguration: GuildTicketConfiguration;

  /** Guild Daily Categories */
  dailyCategories: ["coins", "credit"];

  /** Guild Scores */
  scores: GuildScores;

  /** Guild Status */
  status: GuildStatus;

  /** Guild Channel */
  channels: APIGuildChannel;

  /** Guild Categories */
  categories: APIGuildChannel;

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
  bets: BetManager;

  /** Guild Users */
  users: APIGuildUser[];

  /** Guild Bet Users */
  betUsers: BetUserManager;

  /** Guild Matches */
  matches: APIMatchChannel[];

  /** Guild Mediators */
  mediators: APIGuildMediator[];

  /** Guild Messages */
  messages: APIBetMessage[];

  /** Guild Emojis */
  emojis: APIGuildEmoji[];

  /** Guild Roles */
  roles: APIGuildRole[];

  /** Guild Shop */
  shop: APIGuildShop;

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
    this.permissions = data?.permissions;
    this.status = data?.status;

    this.ticketsConfiguration = data?.ticketsConfiguration;
    this.dailyCategories = data?.dailyCategories;
    this.scores = data?.scores;
    this.channels = data?.channels;
    this.categories = data?.categories;
    this.messages = data?.messages;
    this.roles = data?.roles;
    this.emojis = data?.emojis;

    this.blacklist = data?.blacklist;
    this.pricesAvailable = data?.pricesAvailable;
    this.pricesOn = data?.pricesOn;

    this.bets = new BetManager(this, rest);
    this.tickets = data?.tickets;
    this.users = data?.users;
    this.betUsers = new BetUserManager(this, rest);
    this.matches = data?.matches;
    this.mediators = data?.mediators;

    this.shop = data?.shop;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.betUsers.setAll(this.data?.betUsers);
    this.bets.setAll(this.data?.bets);
  }

  async fetch(): Promise<Guild> {
    const route = Routes.guilds.get(this.id);
    const response = await this.rest.request<APIGuild, {}>({
      method: "get",
      url: route,
    });

    return new Guild(response, this.rest);
  }
}
