import { GuildPermissionManager } from "../../managers/permission/GuildPermissionManager";
import { BufferManager } from "../../managers/buffer/BufferManager";
import { GuildMatchManager } from "../../managers/match/GuildMatchManager";
import { VipMemberManager } from "../../managers/vipmember/VipMemberManager";
import { REST } from "../../rest/REST";
import { APIGuildGroupedChannel, Daily, GuildBlacklist, Optional } from "../../types/api";
import { APIGuild, DailyCategories, GuildChannelsType, GuildModes, GuildPrices, GuildScores, GuildStatus, GuildTicketConfiguration } from "../../types/api/APIGuild";
import { APIGuildEmoji } from "../../types/api/APIGuildEmoji";
import { APIGuildPermissions } from "../../types/api/APIGuildPermissions";
import { APIGuildRole } from "../../types/api/APIGuildRole";
import { GuildUserManager } from "../../managers/user/GuildUserManager";
import { TicketManager } from "../../managers";
import LogManager from "../../managers/logs/LogManager";
export declare class Guild {
    /** The data of this guild */
    data: APIGuild;
    /** The rest client */
    rest: REST;
    /** The guild's id */
    id: string;
    modes: GuildModes;
    /** Guild's client key */
    client_key: string;
    /** Guild Permissions */
    permissions: APIGuildPermissions;
    /** Guild Ticket */
    /** Guild Ticket Configuration */
    tickets_configuration: GuildTicketConfiguration;
    /** Guild Daily Categories */
    daily_categories: DailyCategories[];
    /** Guild Scores */
    scores: GuildScores;
    /** Guild Status */
    status: GuildStatus;
    channels: APIGuildGroupedChannel[];
    /** Guild Blacklist */
    blacklist: GuildBlacklist;
    /** Guild Prefix */
    prefix: string;
    /** Guild Creation Date */
    createdAt: Date;
    /** Guild Updated Date */
    updatedAt: Date;
    /** Guild Matches */
    matches: GuildMatchManager;
    /** Guild Emojis */
    emojis: APIGuildEmoji[];
    /** Guild Roles */
    roles: APIGuildRole[];
    /** Guild Prices Used */
    prices: GuildPrices;
    permissionsManager: GuildPermissionManager;
    buffer: BufferManager;
    vipMembers: VipMemberManager;
    users: GuildUserManager;
    tickets: TicketManager;
    logEntries: LogManager;
    /**
     * The guild structure
     * @param data The guild's data
     * @param rest The rest client
     */
    constructor(data: APIGuild, rest: REST);
    getChannel(type: GuildChannelsType): Promise<APIGuildGroupedChannel>;
    addIdToChannel(type: GuildChannelsType, id: string | string[]): Promise<this>;
    removeIdInChannel(type: GuildChannelsType, id: string): Promise<this>;
    _start(): Promise<this>;
    _updateInternals(data: Optional<APIGuild>): this;
    fetch(): Promise<Guild>;
    update(data: Optional<APIGuild>): Promise<Guild>;
    setStatus(key: keyof GuildStatus, status: "on" | "off"): Promise<this>;
    addPrice(price: number): Promise<this>;
    removePrice(price: number): Promise<this>;
    setPrefix(prefix: string): Promise<this>;
    toggleDailyCategory(category: keyof Omit<Daily, "date">): Promise<this>;
    setScores(name: AvailableScores, amount: number): Promise<this>;
    toggleMode(mode: "1v1" | "2v2" | "3v3" | "4v4" | "5v5" | "6v6"): Promise<this>;
}
type AvailableScores = "win" | "loss" | "mvp" | "creator" | "coin";
export {};
