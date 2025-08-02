import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { APIGuildMatch } from "../../types/api/APIGuildMatch";
import { APIPlayer } from "../../types/api/APIPlayer";
import { APIBetChannel } from "../../types/api/APIBetChannel";
import { BaseMatchModes, BaseMatchStatus, Confirm, Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { ChannelManager } from "../../managers/channel/ChannelManager";
import { APIGuildMessage } from "../../types/api/APIGuildMessage";
import { GuildMatchManager } from "../../managers/match/GuildMatchManager";
import { MessagesManager } from "../../managers/messages/MessagesManager";

export class GuildMatch {
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
  messages: MessagesManager;

  /** Matches channels */
  channels: ChannelManager<GuildMatch>;

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

  constructor(data: APIGuildMatch, guild: Guild, manager: GuildMatchManager, rest: REST) {
    this._id = data?._id;
    this.manager = manager;

    this.challenge = data?.challenge;
    this.kickedOut = data?.kickedOut;
    this.leaders = data?.leaders;
    this.type = data?.type;
    this.status = data?.status;
    this.maximumSize = data?.maximumSize;
    this.players = data?.players;
    this.teamA = data?.teamA;
    this.teamB = data?.teamB;
    this.winners = data?.winners;
    this.losers = data?.losers;
    this.creatorId = data?.creatorId;
    this.roomCreatorId = data?.roomCreatorId;
    this.confirmed = data?.confirmed;
    this.mvpId = data?.mvpId;

    this.key = "matches";
    this.channels = new ChannelManager<GuildMatch>(guild, this, rest);
    this.messages = new MessagesManager(guild, `matches/${data?._id}`, rest);

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.guild = guild;
    this.rest = rest;

    this.channels.setAll(data?.channels);
    this.messages.setAll(data?.messages);
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

    const match = new GuildMatch(response, this.guild, this.manager, this.rest);
    this.manager.cache.set(match._id, match);
    return match;
  }
  async addMessage(id: string, type: string, content?: string) {
    const response = await this.messages.create({
      userId: id,
      type: type as "img",
      content,
    });

    this.manager.cache.set(this._id, this);
    this.rest.matches.set(this._id, this);
    return response;
  }
  async addConfirmed(type: string, id: string): Promise<Confirm> {
    Assertion.assertString(type);
    Assertion.assertString(id);

    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "confirmed");
    const payload = { type, id };

    const response = await this.rest.request<Confirm[], typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.rest.emit("matchUpdate", this);

    this.updatedAt = new Date();
    this.confirmed = response;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this.confirmed.find((c) => c.type === type);
  }
  async setConfirmed(set: Confirm[]): Promise<GuildMatch> {
    Assertion.assertObject(set);
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "confirmed");

    const response = await this.rest.request<Confirm[], typeof set>({
      method: "PATCH",
      url: route,
      payload: set,
    });

    this.confirmed = response;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
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
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    this.status = response.status;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }
  async setWinners(players: Optional<APIPlayer>[] | Optional<APIPlayer>): Promise<GuildMatch> {
    if (!Array.isArray(players)) players = [players];

    const payload = { winners: players };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "winners");
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    this.winners = response.winners;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }
  async setLoser(players: Optional<APIPlayer>[] | Optional<APIPlayer>): Promise<GuildMatch> {
    if (!Array.isArray(players)) players = [players];

    const payload = { losers: players };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "losers");
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    this.losers = response.losers;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }
  async setMvp(userId: string): Promise<GuildMatch> {
    Assertion.assertString(userId);

    const payload = { id: userId };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "mvp");
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    this.mvpId = response.mvpId;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }
  async setRoomCreatorId(userId: string): Promise<GuildMatch> {
    Assertion.assertString(userId);

    const payload = { id: userId };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "roomCreatorId");
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    this.roomCreatorId = response.roomCreatorId;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }
  async kick(player: Optional<APIPlayer>) {
    const payload = { ...player };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "kickout");
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    this.kickedOut = response.kickedOut;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }
  async addChannel(id: string, type: string): Promise<GuildMatch> {
    await this.channels.create({ id, type });
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }

  async setChannels(channels: APIBetChannel[]): Promise<GuildMatch> {
    Assertion.assertObject(channels);

    const payload = { set: channels };
    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "channels");
    const response = await this.rest.request<APIGuildMatch, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    this.channels.setAll(response.channels);
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }

  async addPlayer(id: string, name: string): Promise<GuildMatch> {
    Assertion.assertString(id);
    Assertion.assertString(name);

    const route = Routes.guilds.matches.resource(this.guild.id, this._id, "players");
    const payload = { id, name };
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    ({ response });

    this.players = response.players;
    this.rest.matches.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
  }
  async removePlayer(id: string, name: string): Promise<GuildMatch> {
    Assertion.assertString(id);
    Assertion.assertString(name);

    const route = Routes.guilds.matches.resource(this.guild.id, this?._id, "players", id);
    const payload = { id, name };
    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.players = response.players;
    this.rest.matches.set(this?._id, this);
    this.manager.cache.set(this?._id, this);
    return this;
  }

  async update(data: Optional<APIGuildMatch>): Promise<GuildMatch> {
    const route = Routes.guilds.matches.get(this.guild.id, this._id);
    const payload = data;

    const response = await this.rest.request<APIGuildMatch, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.rest.emit("matchUpdate", this, new GuildMatch(response, this.guild, this.manager, this.rest));
    for (const k in response) {
      if (k === "id" || k == "createdAt") continue;
      if (Object.hasOwn(this, k)) {
        if (k === "channels") {
          ({ chs: response["channels"] });
          this.channels.setAll(response["channels"]);
          ({ chs2: this.channels.cache });
          continue;
        }
        if (k === "messages") {
          this.messages.setAll(response["messages"]);
          continue;
        }

        (this as any)[k] = response[k as keyof APIGuildMatch];
      }
    }

    this.updatedAt = new Date();
    this.manager.cache.set(this._id, this);
    this.rest.matches.set(this._id, this);
    return this;
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
}
