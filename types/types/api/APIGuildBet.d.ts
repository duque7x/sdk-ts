import { BaseMatchModes, Confirm } from ".";
import { APIBetChannel } from "./APIBetChannel";
import { APIMessage } from "./APIMessage";
import { APIPlayer } from "./APIPlayer";
export interface BetQueue {
    _id: string;
    type: string;
    players: APIPlayer[];
    createdAt: Date;
    updatedAt: Date;
}
export declare enum BetChannelTypes {
    CreationChannel = "creation_channel"
}
export interface APIGuildBet {
    /** The bet's type */
    type: Omit<BaseMatchModes, "5x5" | "6x6" | "5v5" | "6v6">;
    /** The bet's mode */
    mode: "misto" | "emu" | "mob" | "MISTO" | "EMU" | "MOB";
    /** The bet's status */
    status: "off" | "created" | "on" | "shutted" | "waiting";
    /** The bet's maximum size */
    maximumSize: number;
    /** The bet's price */
    price: number;
    /** The bet's players */
    players: APIPlayer[];
    teams: APIPlayer[][];
    /** The bet's channel */
    channels: APIBetChannel[];
    /** The bet's messages */
    messages: APIMessage[];
    /** The id of the winner */
    winners: APIPlayer[];
    /** The id of the loser */
    losers: APIPlayer[];
    /** The bet's creator id */
    creatorId: string;
    /** The bet's mediator */
    mediatorId: string;
    /** The bet's confirmers */
    confirmed: Confirm[];
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
    /** Bet's id */
    _id: string;
    queues: BetQueue[];
}
