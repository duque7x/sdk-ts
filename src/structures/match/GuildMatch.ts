import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { APIGuildMatch, MatchSelection } from "../../types/api/APIGuildMatch";
import { APIPlayer } from "../../types/api/APIPlayer";
import { APIMessage, BaseMatchModes, BaseMatchStatus, Confirm, Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { GuildMatchManager } from "../../managers/match/GuildMatchManager";
import { APIBaseChannel } from "../../types";

export class GuildMatch {
  _id: string;
  selections: MatchSelection[];
  /** Match's type */
  type: BaseMatchModes;
  channels: APIBaseChannel[];
  guild_id: string;
  /** Match's status */
  status: BaseMatchStatus;

  /** Match's challenge */
  challenge: boolean;

  /** Match's players */
  players: APIPlayer[];
  teams: APIPlayer[][];

  /** Match's winners */
  winners: APIPlayer[];

  /** Match's losers */
  losers: APIPlayer[];

  /** Match's maximum size */
  maximumSize: number;

  /** Match's kicked out */
  kickedOut: APIPlayer[];

  /** Match's confirmed */
  confirmed: Confirm[];

  /** Match's leaders */
  leaders: APIPlayer[];

  /** Match's creator id */
  creatorId: string;

  /** Match's room creator id */
  roomCreatorId: string;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
  messages: APIMessage[];
  /** Match's id */
  mvps: [];
  manager: GuildMatchManager;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;
  readonly key: string;

  /**
   * GuildMatch match
   * @param data  The match's data
   * @param guild The guild
   * @param rest The rest client
   */

  constructor(data: APIGuildMatch, manager: GuildMatchManager) {
    this._id = data?._id;
    this.guild_id = data?.guild_id;
    this.selections = data?.selections;
    this.manager = manager;
    this.guild = manager.guild;
    this.rest = manager.rest;

    this.challenge = data?.challenge;
    this.teams = data?.teams;
    this.kickedOut = data?.kickedOut;
    this.leaders = data?.leaders;
    this.type = data?.type;
    this.status = data?.status;
    this.maximumSize = data?.maximumSize;
    this.players = data?.players;
    this.winners = data?.winners;
    this.losers = data?.losers;
    this.creatorId = data?.creatorId;
    this.roomCreatorId = data?.roomCreatorId;
    this.confirmed = data?.confirmed;
    this.mvps = data?.mvps;
    this.key = "matches";
    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.messages = data?.messages;
  }

  /**
   * Fetches the match
   * @returns New Instance of the match
   */
  async fetch(): Promise<GuildMatch> {
    const route = Routes.guilds.matches.get(this.guild.id, this._id);
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "get",
      url: route,
    });

    const match = new GuildMatch(response, this.manager);
    this.manager.cache.set(match._id, match);
    return match;
  }
  /* async addMessage(id: string, type: string, content?: string) {
    const response = await this.messages.create({
      userId: id,
      type: type as "img",
      content,
    });

    this.manager.cache.set(this._id, this);
    this.rest.matches.set(this._id, this);
    return response;
  } */
  async addConfirmed(type: string, id: string): Promise<Confirm> {
    Assertion.assertString(type);
    Assertion.assertString(id);

    /*   const confirms = this.confirmed;
    const con: Confirm = confirms.find((c) => c.type === type) ?? { count: 1, ids: [id], type };
 */
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "confirmed");
    const payload = { type, id };

    const response = await this.rest.request<Confirm[], typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.rest.emit("matchUpdate", this, this);

    this.confirmed = response;

    this.updatedAt = new Date();
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    this.guild.buffer.matches.set(this._id, this);
    return this.confirmed.find((c) => c.type === type);
  }
  async setConfirmed(set: Confirm[]): Promise<GuildMatch> {
    Assertion.assertObject(set);
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "confirmed");

    const response = await this.rest.request<APIGuildMatch, typeof set>({
      method: "PATCH",
      url: route,
      payload: set,
    });

    return this._updateInternals(response);
  }

  async setStatus(status: BaseMatchStatus): Promise<GuildMatch> {
    Assertion.assertString(status);

    const payload = { set: status.toLowerCase() };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "status");
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setWinners(players: Optional<APIPlayer>[] | Optional<APIPlayer>): Promise<GuildMatch> {
    if (!Array.isArray(players)) players = [players];

    const payload = { set: players };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "winners");
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    return this._updateInternals(response);
  }
  async setLoser(players: Optional<APIPlayer>[] | Optional<APIPlayer>): Promise<GuildMatch> {
    if (!Array.isArray(players)) players = [players];

    const payload = { set: players };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "losers");
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setMvps(...usersId: string[]): Promise<GuildMatch> {
    const payload = { set: usersId };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "mvps");
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async setRoomCreatorId(userId: string): Promise<GuildMatch> {
    Assertion.assertString(userId);

    const payload = { set: userId };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "roomCreatorId");
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }
  async kick(player: Optional<APIPlayer>) {
    const payload = { set: player };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "kickout");
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    return this._updateInternals(response);
  }

  async update(data: Optional<APIGuildMatch>): Promise<GuildMatch> {
    const route = Routes.guilds.matches.get(this.guild.id, this._id);
    const response = await this.rest.request<APIGuildMatch, typeof data>({
      method: "patch",
      url: route,
      payload: data,
    });
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.manager));
    return this._updateInternals(response);
  }
  async delete() {
    const route = Routes.guilds.matches.resource(this.guild.id, this._id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.manager.cache.delete(this?._id);
    this.rest.matches.delete(this?._id);
    return response;
  }
  toJSON() {
    const json: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this)) {
      if (typeof value !== "function") {
        json[key] = value;
      }
    }
    return json;
  }

  _updateInternals(data: Optional<APIGuildMatch>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIGuildMatch];
      }
    }

    this.updatedAt = new Date();
    this.manager.cache.set(this._id, this);
    this.rest.matches.set(this._id, this);
    this.guild.buffer.matches.set(this._id, this);
    return this;
  }
}
