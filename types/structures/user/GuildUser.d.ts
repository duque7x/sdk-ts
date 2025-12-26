import { REST } from "../../rest/REST";
import { Accessory, APIAdvert, Daily, Optional, OriginalChannels } from "../../types/api";
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
    adverts: APIAdvert[];
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
     * Set the user blacklist
     * @param value Value to set to
     * @returns GuildUser
     */
    setBlacklist(value: boolean): Promise<this>;
    reset(): Promise<this>;
    updateProfile(data: Optional<Profile>): Promise<this>;
    _updateInternals(data: Optional<APIGuildUser>): this;
    addAdvert(data: Optional<Omit<APIAdvert, "_id">>): Promise<GuildUser>;
    removeAdvert(advertId?: string): Promise<GuildUser>;
    /**
     * Update certain property
     * @param data The new data to update with
     * @returns
     */
    update(data: Omit<Optional<APIGuildUser>, "daily"> & {
        type?: "add" | "remove";
    }): Promise<this>;
    delete(): Promise<boolean>;
    toJSON(): APIGuildUser;
}
