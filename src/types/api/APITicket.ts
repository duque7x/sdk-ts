import { APILogMessage } from "./APILogMessage";

export interface APITicket {
  /** Ticket's id */
  id: number;

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
  messages: APILogMessage[];
};