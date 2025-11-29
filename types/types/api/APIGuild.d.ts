import { APICode, APIGuildAdvert, APITicketCategory } from ".";
import { APIGuildGroupedChannel } from "./APIGuildGroupedChannel";
import { APIGuildPermissions } from "./APIGuildPermissions";
import { APIGuildShop } from "./APIGuildShop";
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
}
export declare enum GuildChannelsType {
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
    VoiceChannelMatchCreation = "voice_channel_match_creation"
}
