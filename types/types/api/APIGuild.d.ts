import { APITicketCategory, GuildBlacklist } from ".";
import { APIGuildBet } from "./APIGuildBet";
import { APIGuildBetUser } from "./APIGuildBetUser";
import { APIGuildGroupedChannel } from "./APIGuildGroupedChannel";
import { APIGuildMatch } from "./APIGuildMatch";
import { APIGuildMediator } from "./APIGuildMediator";
import { APIGuildPermissions } from "./APIGuildPermissions";
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
    daily_rank: "on" | "off";
    /** Voice Channels for a bet */
    create_voice_channels: "on" | "off";
    two_mvps: "on" | "off";
    ranking_name: "on" | "off";
    logs_queues: "on" | "off";
    logs_users: "on" | "off";
    logs_managing: "on" | "off";
}
export interface GuildModes {
    on: string[];
    off: string[];
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
    modes: GuildModes;
    /** Guild's client key */
    client_key: string;
    /** Guild Permissions */
    permissions: APIGuildPermissions;
    /** Guild Ticket */
    tickets: APIGuildTicket[];
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
    /** Guild Blacklist */
    blacklist: GuildBlacklist;
    /** Guild Prefix */
    prefix: string;
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
    /** Guild Shop */
    shop: APIGuildShop;
}
export declare enum GuildChannelsType {
    DailyRank = "daily_rank",
    Commands = "command",
    Blacklist = "blacklist",
    Queues = "queue",
    VipMemebers = "vipmembers_category",
    QueueLogs = "queue_logs",
    UserLogs = "user_logs",
    ManagingLogs = "managing_logs"
}
export declare enum GuildMatchChannelsType {
    CreationChannel = "creation_channel"
}
export declare enum GuildMatchMessagesType {
    CreationMessage = "creation_message"
}
