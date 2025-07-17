import { APIPlayer } from "./APIPlayer";

export interface APIProduct {
  /** Product's name */
  name: string;

  /** Product's description */
  description: string;

  /** Product's id */
  id: number;

  /** Product's price */
  price: number;

  /** Product's buyers */
  buyers: APIPlayer[];

  /** Product's emoji */
  emoji: string;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
};