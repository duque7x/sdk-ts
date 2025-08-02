import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { APIGuildBet } from "../../types/api/APIGuildBet";
import { APIPlayer } from "../../types/api/APIPlayer";
import { APIBetChannel } from "../../types/api/APIBetChannel";
import { APIBetMessage } from "../../types/api/APIBetMessage";
import { BaseMatchModes, BaseMatchStatus, Confirm, Logs, Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { ChannelManager } from "../../managers/channel/ChannelManager";
import { GuildBetManager } from "../../managers/bet/GuildBetManager";
import { MessagesManager } from "../../managers/messages/MessagesManager";

type ExtendedMatchStatus = BaseMatchStatus | "waiting";

export class GuildBet {
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
  channels: ChannelManager<GuildBet>;

  /** THe bet's messages */
  messages: MessagesManager;

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

  /** GuildBet's id */
  _id: string;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;

  readonly key: string;

  readonly manager: GuildBetManager;
  /**
   * GuildBet bet
   * @param data  The bet's data
   * @param guild The guild
   * @param rest The rest client
   */
  constructor(data: APIGuildBet, guild: Guild, manager: GuildBetManager, rest: REST) {
    this.type = data?.type;
    this.mode = data?.mode;
    this.status = data?.status;
    this.maximumSize = data?.maximumSize;
    this.price = data?.price;
    this.payedBy = data?.payedBy;
    this.players = data?.players;
    this.teamA = data?.teamA;
    this.teamB = data?.teamB;
    this.winner = data?.winner;
    this.loser = data?.loser;
    this.creatorId = data?.creatorId;
    this.mediatorId = data?.mediatorId;
    this.confirmed = data?.confirmed;
    this.embedMessageId = data?.embedMessageId;
    this.winner = data?.winner;
    this.loser = data?.loser;
    this._id = data?._id;
    this.logs = data?.logs;
    this.guild = guild;
    this.rest = rest;

    this.manager = manager;

    this.key = "bets";
    this.channels = new ChannelManager<GuildBet>(guild, this, rest);
    this.messages = new MessagesManager(this?.guild, `bets/${data?._id}`, rest);

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.channels.setAll(data?.channels);
    this.messages.setAll(data?.messages);
  }
  toString() {
    return this._id || "1";
  }
  /**
   * Fetches the bet
   * @returns New Instance of the bet
   */
  async fetch() {
    const route = Routes.guilds.bets.get(this.guild.id, this._id);
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "get",
      url: route,
    });
    const bt = new GuildBet(response, this.guild, this.manager, this.rest);
    this.manager.cache.set(bt._id, bt);
    return bt;
  }

  async addConfirmed(type: string, id: string) {
    Assertion.assertString(type);
    Assertion.assertString(id);

    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "confirmed");
    const payload = { entry: { type, id } };

    const response = await this.rest.request<APIGuildBet, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.rest.emit("betUpdate", this, new GuildBet(response, this.guild, this.manager, this.rest));
    this.confirmed = response.confirmed;
    this.manager.cache.set(this._id, this);
    return response.confirmed.find((cn) => cn.type == type);
  }
  async setConfirmed(set: Confirm[]) {
    Assertion.assertObject(set);

    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "confirmed");

    const response = await this.rest.request<APIGuildBet, typeof set>({
      method: "PATCH",
      url: route,
      payload: set,
    });
    this.rest.emit("betUpdate", this, new GuildBet(response, this.guild, this.manager, this.rest));
    this.confirmed = response.confirmed;
    this.manager.cache.set(this._id, this);
    return this.confirmed;
  }

  async setStatus(status: ExtendedMatchStatus) {
    Assertion.assertString(status);

    const payload = { set: status.toLowerCase() };
    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "status");
    const response = await this.rest.request<APIGuildBet, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new GuildBet(response, this.guild, this.manager, this.rest));
    this.status = response.status;
    this.manager.cache.set(this._id, this);
    return this;
  }
  async setWinner(userId: string) {
    Assertion.assertString(userId);

    const payload = { set: userId };
    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "winner");
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new GuildBet(response, this.guild, this.manager, this.rest));
    this.winner = response.winner;
    this.manager.cache.set(this._id, this);
    return response.winner;
  }
  async setLoser(userId: string) {
    Assertion.assertString(userId);

    const payload = { set: userId };
    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "loser");
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new GuildBet(response, this.guild, this.manager, this.rest));
    this.loser = response.loser;
    this.manager.cache.set(this._id, this);
    return response.loser;
  }
  async delete() {
    const route = Routes.guilds.bets.resource(this.guild.id, this._id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.manager.cache.delete(this?._id);
    this.rest.bets.delete(this?._id);
    return response;
  }
  async addChannel(id: string, type: string) {
    const ch = await this.channels.create({ id, type });
    this.manager.cache.set(this._id, this);
    return ch;
  }
  async addMessage(id: string, type: string, content?: string) {
    const response = await this.messages.create({
      userId: id,
      type: type as "img",
      content,
    });

    this.manager.cache.set(this._id, this);
    this.rest.bets.set(this._id, this);
    return response;
  }
  async setChannels(channels: APIBetChannel[]) {
    Assertion.assertObject(channels);

    const payload = { set: channels };
    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "channels");
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new GuildBet(response, this.guild, this.manager, this.rest));
    this.channels.setAll(response.channels);
    this.manager.cache.set(this._id, this);
    return this.channels;
  }

  async addPlayer(player: Optional<APIPlayer>) {
    Assertion.assertObject(player);

    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "players");
    const payload = { ...player };
    const response = await this.rest.request<APIPlayer[], typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    this.players = response;
    this.manager.cache.set(this._id, this);
    return this.players;
  }
  async removePlayer(player: Optional<APIPlayer>) {
    Assertion.assertObject(player);

    const route = Routes.guilds.bets.resource(this.guild.id, this._id, "players", player.id);
    const payload = { ...player };
    const response = await this.rest.request<APIPlayer[], typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });
    this.players = response;
    this.manager.cache.set(this._id, this);
    return this.players;
  }

  async update(data: Optional<APIGuildBet>) {
    const route = Routes.guilds.bets.get(this.guild.id, this._id);
    const payload = data;

    const response = await this.rest.request<APIGuildBet, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new GuildBet(response, this.guild, this.manager, this.rest));
    for (const k in response) {
      if (k === "id") continue;

      if (Object.hasOwn(this, k)) {
        if (k === "channels") {
          this.channels.setAll(response["channels"]);
          continue;
        }
        if (k === "messages") {
          this.messages.setAll(response["messages"]);
          continue;
        }

        (this as any)[k] = response[k as keyof APIGuildBet];
      }
    }
    this.rest.bets.set(this._id, this);
    this.manager.cache.set(this._id, this);
    return this;
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
