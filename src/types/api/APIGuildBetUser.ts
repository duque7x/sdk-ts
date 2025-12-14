import { Daily,  Profile } from ".";

/** Bet user */
export interface APIGuildBetUser {
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
}
