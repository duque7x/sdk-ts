import { APICode, APIGuildAdvert, APITicketCategory } from ".";
import { APIGuildGroupedChannel } from "./APIGuildGroupedChannel";
import { APIGuildPermissions } from "./APIGuildPermissions";
import { APIGuildShop } from "./APIGuildShop";

/** Ticket's configuration */
export interface GuildTicketConfiguration {
  /** Guild's categories */
  categories: APITicketCategory[];
  creationCategory: string;
  rating_channel_id: string
}
export interface GuildStatus {
  /** Matches status */
  matches: "on" | "off";
  /** Bets status */
  bets: "on" | "off";
  /** Daily Ranking status */
  daily_rank: "on" | "off";
  /** Voice Channels for a bet */
  create_voice_channels: "on" | "off";
  two_mvps: "on" | "off";
  ranking_name: "on" | "off";

  logs_queues: "on" | "off";
  logs_users: "on" | "off";
  logs_managing: "on" | "off";

  name_hidden: "on" | "off";
}
export enum GuildStatusEnum {
  /** Matches status */
  Matches = "matches",
  /** Bets status */
  Bets = "bets",
  /** Daily Ranking status */
  DailyRank = "daily_rank",
  /** Voice Channels for a bet */
  CreateVoiceChannels = "create_voice_channels",
  TwoMvps = "two_mvps",
  RankingName = "ranking_name",

  LogsQueues = "logs_queues",
  LogsUsers = "logs_users",
  LogsManaging = "logs_managing",

  NameHidden = "name_hidden",
}
export interface GuildModes {
  on: string[];
  off: string[];
}
export type DailyCategories = "coins" | "credit" | "wins" | "points" | "losses" | "mvps";

export type GuildPrices = number[];


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
  client_key: string;

  modes: GuildModes;

  /** Guild Permissions */
  permissions: APIGuildPermissions;

  /** Guild Ticket Configuration */
  tickets_configuration: GuildTicketConfiguration;

  /** Guild Daily Categories */
  daily_categories: DailyCategories[];

  /** Guild Scores */
  scores: GuildScores;

  /** Guild Status */
  status: GuildStatus;

  /** Guild Channel */
  channels: APIGuildGroupedChannel[];

  /** Guild Categories */
  categories: APIGuildGroupedChannel[];

  /** Guild Prefix */
  prefix: string;

  /** Guild Prices Used */
  prices: GuildPrices;

  /** Guild Creation Date */
  createdAt: Date;

  /** Guild Updated Date */
  updatedAt: Date;

  /** Guild Shop */
  shop: APIGuildShop;

  adverts: APIGuildAdvert[];

  max_advert_per_user: number;

  codes: APICode[];

  coin_symbol: string;
}

export enum GuildChannelsType {
  DailyRank = "daily_rank",

  Commands = "command",

  Blacklist = "blacklist",

  Queues = "queue",

  VipMemebers = "vipmembers_category",

  QueueLogs = "queue_logs",

  UserLogs = "user_logs",

  ManagingLogs = "managing_logs",

  NormalQueue = "normal_queue",
  ChallengeQueue = "challenge_queue",
  MatchTextChannelParent = "match_text_channel_parent",
  VoiceChannelMatchCreation = "voice_channel_match_creation",

  WaitingVC = "waiting_vc",


  BetMobileCategory = "bet_mobile_category",
  BetEmulatorCategory = "bet_emulator_category",
  BetMixCategory = "bet_mix_category",
}
