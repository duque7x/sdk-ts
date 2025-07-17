import { BaseMatchModes, BaseMatchStatus, Confirm } from ".";
import { APIPlayer } from "./APIPlayer";

export interface APIMatchChannel {
  /** Match's id */
  id: string;
}
export interface APIGuildMatch {
  /** Match's type */
  type: BaseMatchModes;

  /** Match's status */
  status: BaseMatchStatus;

  /** Match's challenge */
  challenge: boolean;

  /** Match's players */
  players: APIPlayer[];

  /** Match's text channel */
  textChannel: APIMatchChannel;

  /** Match's voice channels */
  voiceChannels: APIMatchChannel[];

  /** Match's winners */
  winners: string;

  /** Match's losers */

  losers: string;

  /** Match's maximum size */
  maximumSize: { type: Number; default: 4 };

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
