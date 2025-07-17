import { APITicketCategory, GuildBlacklist } from ".";
import { APIBetMessage } from "./APIBetMessage";
import { APIGuildBet } from "./APIGuildBet";
import { APIGuildBetUser } from "./APIGuildBetUser";
import { APIGuildChannel } from "./APIGuildChannel";
import { APIGuildEmoji } from "./APIGuildEmoji";
import { APIMatchChannel } from "./APIGuildMatch";
import { APIGuildMediator } from "./APIGuildMediator";
import { APIGuildRole } from "./APIGuildRole";
import { APIGuildShop } from "./APIGuildShop";
import { APIGuildTicket } from "./APIGuildTicket";
import { APIGuildUser } from "./APIGuildUser";

export interface GuildPermission {
  /** Manage bot and use dashboard */
  manage_bot: string[];

  /** Manage rooms */
  manage_rooms: string[];

  /** Manage scores */
  manage_scores: string[];
}
/** Ticket's configuration */
export interface GuildTicketConfiguration {
  /** Guild's categories */
  categories: APITicketCategory;
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
export interface GuildScores {
  /** Win */
  win: number;

  /** Loss */
  loss: number;

  /** Mvp */
  mvp: number;

  /** Coin */
  coin: number;
}
export interface APIGuild {
  /** Guild's id */
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
  bets: APIGuildBet[];

  /** Guild Users */
  users: APIGuildUser[];

  /** Guild Bet Users */
  betUsers: APIGuildBetUser[];

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
}
