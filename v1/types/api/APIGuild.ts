import { APITicketCategory, GuildBlacklist } from ".";
import { APIBetMessage } from "./APIBetMessage";
import { APIGuildBet } from "./APIGuildBet";
import { APIGuildBetUser } from "./APIGuildBetUser";
import { APIGuildChannel } from "./APIGuildChannel";
import { APIGuildEmoji } from "./APIGuildEmoji";
import { APIGuildGroupedChannel } from "./APIGuildGroupedChannel";
import { APIGuildMatch } from "./APIGuildMatch";
import { APIGuildMediator } from "./APIGuildMediator";
import { APIGuildPermissions } from "./APIGuildPermissions";
import { APIGuildRole } from "./APIGuildRole";
import { APIGuildShop } from "./APIGuildShop";
import { APIGuildTicket } from "./APIGuildTicket";
import { APIGuildUser } from "./APIGuildUser";
import { APIMessage } from "./APIMessage";

/** Ticket's configuration */
export interface GuildTicketConfiguration {
  /** Guild's categories */
  categories: APITicketCategory[];
}
export interface GuildStatus {
  /** Matches status */
  matches: "on" | "off";
  /** Bets status */
  bets: "on" | "off";
  /** Daily Ranking status */
  dailyRank: "on" | "off";
  /** Voice Channels for a bet */
  createVoiceChannels: "on" | "off";
}
export type DailyCategories = "coins" | "credit" | "wins" | "points" | "losses" | "mvps";

export interface GuildPrices {
  on: number[];
  used: number[];
}
export interface GuildScores {
  /** Win */
  win: number;

  /** Loss */
  loss: number;

  /** Mvp */
  mvp: number;

  /** Coin */
  coin: number;

  /** Creator */
  creator: number;
}
export interface APIGuild {
  /** Guild's id */
  id: string;

  /** Guild's client key */
  clientKey: string;

  /** Guild Permissions */
  permissions: APIGuildPermissions;

  /** Guild Ticket */
  tickets: APIGuildTicket[];

  /** Guild Ticket Configuration */
  ticketsConfiguration: GuildTicketConfiguration;

  /** Guild Daily Categories */
  dailyCategories: DailyCategories[];

  /** Guild Scores */
  scores: GuildScores;

  /** Guild Status */
  status: GuildStatus;

  /** Guild Channel */
  channels: APIGuildGroupedChannel[];

  /** Guild Categories */
  categories: APIGuildGroupedChannel[];

  /** Guild Blacklist */
  blacklist: GuildBlacklist;

  /** Guild Prefix */
  prefix: string;

  /** Guild Prices */
  pricesAvailable: number[];

  /** Guild Prices Used */
  pricesOn: number[];
  /** Guild Prices Used */
  prices: GuildPrices;

  /** Guild Creation Date */
  createdAt: Date;

  /** Guild Updated Date */
  updatedAt: Date;

  /** Guild Bets */
  bets: APIGuildBet[];

  /** Guild Users */
  users: APIGuildUser[];

  /** Guild Bet Users */
  betUsers: APIGuildBetUser[];

  /** Guild Matches */
  matches: APIGuildMatch[];

  /** Guild Mediators */
  mediators: APIGuildMediator[];

  /** Guild Messages */
  messages: APIMessage[];

  /** Guild Emojis */
  emojis: APIGuildEmoji[];

  /** Guild Roles */
  roles: APIGuildRole[];

  /** Guild Shop */
  shop: APIGuildShop;
}
