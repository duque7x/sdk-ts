import { REST } from "../../rest/REST";
import { Accessory, Daily, Items, Optional, OriginalChannels } from "../../types/api";
import { APIGuildUser, Profile } from "../../types/api/APIGuildUser";
import { GuildUserManager } from "../../managers/user/GuildUserManager";
export declare class GuildUser implements APIGuildUser {
    /** User's id */
    id: string;
    guild_id: string;
    /** User's daily */
    daily: Omit<Daily, "credit">;
    /** User's points */
    points: number;
    /** User's wins */
    wins: number;
    /** User's mvps */
    mvps: number;
    /** User's losses */
    losses: number;
    /** User's games */
    games: number;
    /** If user is blacklisted */
    blacklist: boolean;
    /** User's accessories such as double point */
    accessories: Accessory[];
    /** User's original channels */
    original_channels: OriginalChannels;
    profile: Profile;
    creations: number;
    /** User's items */
    items: Items;
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
    /** The given manager */
    readonly manager: GuildUserManager;
    /** The rest client */
    readonly rest: REST;
    /**
     * Bet user
     * @param data  The user's data
     * @param manager The manager
     * @param rest The rest client
     */
    constructor(data: APIGuildUser, manager: GuildUserManager);
    /** String representation of this user */
    toString(): string;
    /**
     * Fetches the user
     * @returns New Instance of the user
     */
    fetch(): Promise<GuildUser>;
    /**
     * Add a propery
     * @param key The desired key
     * @param value The desired value
     * @returns GuildUser
     */
    add<K extends keyof UserAddOptions, V extends UserAddOptions[K]>(key: K, value: V): Promise<this>;
    /**
     * Set the user blacklist
     * @param value Value to set to
     * @returns GuildUser
     */
    setBlacklist(value: boolean): Promise<this>;
    reset(): Promise<this>;
    _updateInternals(data: Optional<APIGuildUser>): this;
    /**
     * Update certain property
     * @param data The new data to update with
     * @returns
     */
    update(data: Omit<Optional<APIGuildUser>, "daily"> & {
        type?: "add" | "remove";
    }): Promise<this>;
    delete(): Promise<boolean>;
    toJSON(): Optional<APIGuildUser>;
}
export interface UserAddOptions extends APIGuildUser {
    coins: number;
    points: number;
    wins: number;
    losses: number;
    mvps: number;
}
