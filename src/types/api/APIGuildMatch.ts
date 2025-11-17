import { BaseMatchModes, BaseMatchStatus, Confirm } from ".";
import { APIBaseChannel } from "./APIBaseChannel";
import { APIMessage } from "./APIMessage";
import { APIPlayer } from "./APIPlayer";

export type MatchSelection = {
  type: "creator" | "mvps" | "winners";
  selected: string[];
  confirmed: string[];
};
export interface APIGuildMatch {
  selections: MatchSelection[];
  /** Match's type */
  type: BaseMatchModes;
  guild_id: string;
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

  /** Match's confirmed */
  confirmed: Confirm[];

  /** Match's leaders */
  leaders: APIPlayer[];
  teams: APIPlayer[][];

  creatorId: string;

  /** Match's room creator id */
  roomCreatorId: string;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** Match's id */
  _id: string;

  mvps: [];
}
export enum GuildMatchChannelsType {
  CreationChannel = "creation_channel",
  TextChannel = "text_channel",
}

export enum GuildMatchMessagesType {
  CreationMessage = "creation_message",
}
