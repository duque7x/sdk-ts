import { Daily, Items, ProfileCard } from ".";

/** Bet user */
export interface APIGuildBetUser {
  /** User daily */
  daily: Omit<Daily, "points">;

  /** User's name */
  name: string;

  /** User's name */
  id: string;

  /** User's credit */
  credit: number;

  /** User's wins */
  wins: number;

  /** User's mvps */
  mvps: number;

  /** User's losses */
  losses: number;

  /** User's bets played */
  betsPlayed: string[];

  /** User's blacklist */
  blacklist: boolean;

  /** User's coins */
  coins: number;

  /** User's items */
  items: Items[];

  /** User's profile card */
  profileCard: ProfileCard;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
}