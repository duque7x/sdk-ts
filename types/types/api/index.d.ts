export interface APITicketCategory {
    /** Category's type */
    type: string;
    /** Category's emoji */
    emoji: string;
    /** Category's description */
    description: string;
    /** Category's alias */
    alias: string;
}
export interface LogMessage {
    /** The message's content */
    content: string | Buffer<any>;
    /** The message's sender */
    userId: string;
    /** The message's type */
    type: string;
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
}
/** Base match modes */
export type BaseMatchModes = "1v1" | "2v2" | "3v3" | "4v4" | "5v5" | "6v6";
/** Base match status */
export type BaseMatchStatus = "on" | "created" | "off" | "shutted";
/** The logs of the structure */
export interface Logs {
    /** The messages of the structure */
    messages: LogMessage[];
}
/** Original Channel */
export type OriginalChannel = {
    /** Channel id */
    channelId: string;
    /** Match id */
    matchId: string;
};
/** Items */
export type Items = string[];
/** Original Channels */
export type OriginalChannels = OriginalChannel[];
/** Accessories */
export type Accessory = {
    /** Accessory type */
    type: "point_protect" | "immunity" | "double_points";
    /** Accessory longevity */
    longevity: string;
    /** Accessory adder */
    addedBy: string;
    /** When accessory added */
    when: Date;
    createdAt: Date;
    updatedAt: Date;
    /** If accessory has expired */
    expired: boolean;
};
/** Daily information */
export type Daily = {
    /** Wins */
    wins: number;
    /** Coins */
    coins: number;
    /** Points */
    points: number;
    /** Credit */
    credit: number;
    /** Losses */
    losses: number;
    /** Mvps */
    mvps: number;
    /** Date of the daily */
    date: Date;
};
export interface Banner {
    /** Equipped banner */
    equipped: number;
    /** Bought banners */
    allowed: number[];
}
export interface ProfileCard {
    /** Profile's description */
    description: string;
    /** Profile's banner */
    banner: Banner;
}
export interface Confirm {
    /** Confirm's type */
    type: string;
    /** Confirm's id */
    ids: string[];
    /** Confirm's counts */
    count: number;
}
export type Optional<T> = {
    [K in keyof T]?: T[K];
};
export declare enum MATCHTYPES {
    OneVOne = "1v1",
    TwoVTwo = "2v2",
    ThreeVThree = "3v3",
    FourVFour = "4v4",
    FiveVFive = "5v5",
    SixVSix = "6v6"
}
export declare enum MATCHSTATUS {
    ON = "on",
    OFF = "off",
    CREATED = "created",
    SHUTTED = "shutted"
}
export declare enum BETSTATUS {
    ON = "on",
    OFF = "off",
    CREATED = "created",
    SHUTTED = "shutted",
    WAITING = "waiting"
}
export declare enum STATES {
    ON = "on",
    OFF = "off",
    CREATED = "created",
    SHUTTED = "shutted",
    WAITING = "waiting"
}
export * from "./APIBaseChannel";
export * from "./APIBetChannel";
export * from "./APIBetMessage";
export * from "./APIGiveaway";
export * from "./APIGuild";
export * from "./APIGuildBet";
export * from "./APIGuildBetUser";
export * from "./APIGuildChannel";
export * from "./APIGuildGroupedChannel";
export * from "./APIGuildMatch";
export * from "./APIGuildMediator";
export * from "./APIGuildPermissions";
export * from "./APIGuildShop";
export * from "./APIGuildTicket";
export * from "./APIGuildUser";
export * from "./APILogEntry";
export * from "./APILogMessage";
export * from "./APIMessage";
export * from "./APIMinesGame";
export * from "./APIPlayer";
export * from "./APIProduct";
export * from "./APIVipMember";
