import { BaseMatchModes, BaseMatchStatus, Confirm } from ".";
import { APIBaseChannel } from "./APIBaseChannel";
import { APIGuildMessage } from "./APIGuildMessage";
import { APIMessage } from "./APIMessage";
import { APIPlayer } from "./APIPlayer";

export interface APIGuildMatch {
  /** Match's type */
  type: BaseMatchModes;

  /** Match's status */
  status: BaseMatchStatus;

  /** Match's challenge */
  challenge: boolean;

  /** Match's players */
  players: APIPlayer[];

  /** Match's winners */
  winners: APIPlayer[];

  /** Match's losers */
  losers: APIPlayer[];

  /** Match;s messages */
  messages: APIMessage[];

  /** Matches channels */
  channels: APIBaseChannel[];

  /** Match's maximum size */
  maximumSize: number;

  /** Match's kicked out */
  kickedOut: APIPlayer[];

  /** Match's team a */
  teamA: APIPlayer[];

  /** Match's team b */
  teamB: APIPlayer[];

  /** Match's confirmed */
  confirmed: Confirm[];

  /** Match's leaders */
  leaders: APIPlayer[];

  /** Match's mvp */
  mvpId: string;

  /** Match's creator id */
  creatorId: string;

  /** Match's room creator id */
  roomCreatorId: string;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** Match's id */
  _id: string;
}
