import { REST } from "../../rest/REST";
import { Guild } from "../guild/Guild";
import { APIGuildMatch, MatchSelection } from "../../types/api/APIGuildMatch";
import { APIPlayer } from "../../types/api/APIPlayer";
import { APIMessage, BaseMatchModes, BaseMatchStatus, Confirm, Optional } from "../../types/api";
import { GuildMatchManager } from "../../managers/match/GuildMatchManager";
import { APIBaseChannel } from "../../types";
export declare class GuildMatch {
    _id: string;
    selections: MatchSelection[];
    /** Match's type */
    type: BaseMatchModes;
    channels: APIBaseChannel[];
    guild_id: string;
    /** Match's status */
    status: BaseMatchStatus;
    /** Match's challenge */
    challenge: boolean;
    /** Match's players */
    players: APIPlayer[];
    teams: APIPlayer[][];
    /** Match's winners */
    winners: APIPlayer[];
    /** Match's losers */
    losers: APIPlayer[];
    /** Match's maximum size */
    maximumSize: number;
    /** Match's kicked out */
    kickedOut: APIPlayer[];
    /** Match's confirmed */
    confirmed: Confirm[];
    /** Match's leaders */
    leaders: APIPlayer[];
    /** Match's creator id */
    creatorId: string;
    /** Match's room creator id */
    roomCreatorId: string;
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
    messages: APIMessage[];
    /** Match's id */
    mvps: [];
    manager: GuildMatchManager;
    /** The given guild */
    readonly guild: Guild;
    /** The rest client */
    readonly rest: REST;
    readonly key: string;
    /**
     * GuildMatch match
     * @param data  The match's data
     * @param guild The guild
     * @param rest The rest client
     */
    constructor(data: APIGuildMatch, manager: GuildMatchManager);
    /**
     * Fetches the match
     * @returns New Instance of the match
     */
    fetch(): Promise<GuildMatch>;
    addConfirmed(type: string, id: string): Promise<Confirm>;
    setConfirmed(set: Confirm[]): Promise<GuildMatch>;
    setStatus(status: BaseMatchStatus): Promise<GuildMatch>;
    setWinners(players: Optional<APIPlayer>[] | Optional<APIPlayer>): Promise<GuildMatch>;
    setLoser(players: Optional<APIPlayer>[] | Optional<APIPlayer>): Promise<GuildMatch>;
    setMvps(...usersId: string[]): Promise<GuildMatch>;
    setRoomCreatorId(userId: string): Promise<GuildMatch>;
    kick(player: Optional<APIPlayer>): Promise<this>;
    update(data: Optional<APIGuildMatch>): Promise<GuildMatch>;
    delete(): Promise<boolean>;
    toJSON(): Record<string, unknown>;
    _updateInternals(data: Optional<APIGuildMatch>): this;
}
