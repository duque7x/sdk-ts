import { REST } from "../../rest/REST";
import { Daily, Optional, Profile } from "../../types/api";
import { APIGuildBetUser } from "../../types/api/APIGuildBetUser";
import { GuildBetUserManager } from "../../managers/betuser/GuildBetUserManager";
import { Guild } from "../guild/Guild";
export declare class GuildBetUser implements APIGuildBetUser {
    /** User daily */
    daily: Omit<Daily, "points">;
    profile: Profile;
    /** User's name */
    id: string;
    guild_id: string;
    /** User's credit */
    credit: number;
    /** User's wins */
    wins: number;
    /** User's mvps */
    mvps: number;
    /** User's losses */
    losses: number;
    /** User's games */
    games: number;
    /** User's blacklist */
    blacklist: boolean;
    /** User's coins */
    coins: number;
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
    consecutive_wins: number;
    /** The given manager */
    readonly manager: GuildBetUserManager;
    /** The rest client */
    readonly rest: REST;
    readonly guild: Guild;
    /**
     * Bet user
     * @param data  The user's data
     * @param manager The manager
     * @param rest The rest client
     */
    constructor(data: APIGuildBetUser, manager: GuildBetUserManager);
    /** String representation of this user */
    toString(): string;
    /**
     * Fetches the user
     * @returns New Instance of the user
     */
    fetch(): Promise<GuildBetUser>;
    /**
     * Set the user blacklist
     * @param value Value to set to
     * @returns GuildBetUser
     */
    setBlacklist(value: boolean): Promise<this>;
    reset(): Promise<this>;
    updateProfile(data: Optional<Profile>): Promise<this>;
    _updateInternals(data: Optional<APIGuildBetUser>): this;
    /**
     * Update certain property
     * @param data The new data to update with
     * @returns
     */
    update(data: Omit<Optional<APIGuildBetUser>, "daily"> & {
        type?: "add" | "remove";
    }): Promise<this>;
    delete(): Promise<boolean>;
    toJSON(): Optional<APIGuildBetUser>;
}
