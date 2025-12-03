import { Accessory, APIAdvert, Daily, Items, OriginalChannels } from ".";
export interface Profile {
    bannerUrl?: string;
    avatarUrl?: string;
    bio?: string;
    name?: string;
    textColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
}
export interface APIGuildUser {
    /** User's id */
    id: string;
    guild_id: string;
    /** User's daily */
    daily: Omit<Daily, "credit">;
    profile: Profile;
    /** User's points */
    points: number;
    creations: number;
    /** User's wins */
    wins: number;
    adverts: APIAdvert[];
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
    /** User's items */
    items: Items;
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
}
