import { APIMessage } from "./APIMessage";

export interface APIGuildTicket {
  /** Ticket's id */
  id: string;
  _id: string;

  /** Ticket's creator id */
  creatorId: string;

  /** Ticket's admin id */
  adminId: string;

  /** Ticket's rating that customer gave */
  customerRating: number;

  /** Ticket's channel id */
  channelId: string;

  /** Ticket's closed by who */
  closedById: string;

  /** Ticket's type */
  type: string;

  /** Ticket's status */
  status: "on" | "off";

  /** Ticket's messages */
  messages: APIMessage[];

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
}
