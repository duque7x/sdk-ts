import { BaseMatchModes, Confirm, Logs } from ".";
import { APIBetChannel } from "./APIBetChannel";
import { APIBetMessage } from "./APIBetMessage";
import { APIPlayer } from "./APIPlayer";

export interface APIGuildBet {
  /** The bet's type */
  type: Omit<BaseMatchModes, "5x5" | "6x6" | "5v5" | "6v6">;

  /** The bet's mode */
  mode: "misto" | "emu" | "mob" | "MISTO" | "EMU" | "MOB";

  /** The bet's status */
  status: "off" | "created" | "on" | "shutted" | "waiting";

  /** The bet's maximum size */
  maximumSize: number;

  /** The bet's price */
  price: number;

  /** Who has payed the bet */
  payedBy: APIPlayer[];

  /** The bet's players */
  players: APIPlayer[];

  /** An array of team a */
  teamA: APIPlayer[];

  /** An array of team b */
  teamB: APIPlayer[];

  /** The bet's channel */
  channels: APIBetChannel[];

  /** THe bet's messages */
  messages: APIBetMessage[];

  /** The id of the winner */
  winner: string;

  /** The id of the loser */
  loser: string;

  /** The bet's creator id */
  creatorId: string;

  /** The bet's mediator */
  mediatorId: string;

  /** The bet's confirmers */
  confirmed: Confirm[];

  /** The bet's embed id */
  embedMessageId: string;

  /** The bet's logs */
  logs: Logs;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** Bet's id */
  _id: string;
}
