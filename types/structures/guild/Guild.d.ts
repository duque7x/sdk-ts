import { BufferManager, GuildMatchManager, GuildPermissionManager, GuildTicketManager, GuildUserManager, LogManager, VipMemberManager } from "../../managers";
import { REST } from "../../rest/REST";
import { APIGuildGroupedChannel, APIGuildPermissions, APIGuildShop, Daily, Optional } from "../../types/api";
import { APIGuild, DailyCategories, GuildChannelsType, GuildModes, GuildPrices, GuildScores, GuildStatus, GuildTicketConfiguration } from "../../types/api/APIGuild";
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
    tickets: GuildTicketManager;
    /** Guild Ticket Configuration */
    tickets_configuration: GuildTicketConfiguration;
    /** Guild Daily Categories */
    daily_categories: DailyCategories[];
    /** Guild Scores */
    scores: GuildScores;
    /** Guild Status */
    status: GuildStatus;
    channels: APIGuildGroupedChannel[];
    /** Guild Prefix */
    prefix: string;
    /** Guild Creation Date */
    createdAt: Date;
    /** Guild Updated Date */
    updatedAt: Date;
    /** Guild Matches */
    matches: GuildMatchManager;
    /** Guild Prices Used */
    prices: GuildPrices;
    permissionsManager: GuildPermissionManager;
    buffer: BufferManager;
    vipMembers: VipMemberManager;
    users: GuildUserManager;
    logEntries: LogManager;
    shop: APIGuildShop;
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
