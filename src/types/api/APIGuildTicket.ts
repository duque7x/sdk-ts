import { APIMessage } from "./APIMessage";

export interface APIGuildTicket {
  /** Ticket's id */
  _id: string;

  guild_id: string;
  type: string;
  status: "on" | "off";

  creator_id: string;
  channel_id: string;

  admin_id: string;
  customer_rating: number;
  closed_by_id: string;

  messages: APIMessage[];

  createdAt: Date;
  updatedAt: Date;
}
