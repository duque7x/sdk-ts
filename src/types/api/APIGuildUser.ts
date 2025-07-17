import { Accessory, Daily, Items, OriginalChannels } from ".";

export interface APIGuildUser {
  /** User's id */
  id: string;

  /** User name */
  name: string;

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
  gamesPlayed: string[];

  /** If user is blacklisted */
  blacklist: boolean;

  /** User's accessories such as double point */
  accessories: Accessory[];

  /** User's original channels */
  originalChannels: OriginalChannels;

  /** User's items */
  items: Items;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
}
