import { GuildBetManager, MessagesManager } from "../../managers";
import { REST } from "../../rest";
import { APIBetChannel, APIGuildBet, APIPlayer, BaseMatchModes, BetQueue, Confirm, Optional } from "../../types";
import { Guild } from "../guild/Guild";
export declare class GuildBet {
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
    messages: MessagesManager<GuildBet>;
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
    guild_id: string;
    rest: REST;
    guild: Guild;
    manager: GuildBetManager;
    constructor(data: Optional<APIGuildBet>, manager: GuildBetManager);
    toString(): string;
    fetch(): Promise<this>;
    addPlayer(player: APIPlayer, queue_type?: string): Promise<this>;
    removePlayer(player: APIPlayer): Promise<this>;
    update(data: Optional<APIGuildBet>): Promise<this>;
    delete(): Promise<boolean>;
    _updateInternals(data: Optional<APIGuildBet>): this;
    toJSON(): Optional<APIGuildBet>;
}
