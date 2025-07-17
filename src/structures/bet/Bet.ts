import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { APIGuildBet } from "../../types/api/APIGuildBet";
import { APIPlayer } from "../../types/api/APIPlayer";
import { APIBetChannel } from "../../types/api/APIBetChannel";
import { APIBetMessage } from "../../types/api/APIBetMessage";
import {
  BaseMatchModes,
  BaseMatchStatus,
  Confirm,
  Logs,
  Optional,
} from "../../types/api";
import { Assertion } from "../../utils/Assertion";
type ExtendedMatchStatus = BaseMatchStatus | "waiting";

export class Bet implements APIGuildBet {
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

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;

  /**
   * Bet user
   * @param data  The user's data
   * @param guild The guild
   * @param rest The rest client
   */
  constructor(data: APIGuildBet, guild: Guild, rest: REST) {
    this.type = data.type;
    this.mode = data.mode;
    this.status = data.status;
    this.maximumSize = data.maximumSize;
    this.price = data.price;
    this.payedBy = data.payedBy;
    this.players = data.players;
    this.teamA = data.teamA;
    this.teamB = data.teamB;
    this.channels = data.channels;
    this.messages = data.messages;
    this.winner = data.winner;
    this.loser = data.loser;
    this.creatorId = data.creatorId;
    this.mediatorId = data.mediatorId;
    this.confirmed = data.confirmed;
    this.embedMessageId = data.embedMessageId;
    this.winner = data?.winner;
    this.loser = data?.loser;
    this._id = data?._id;
    this.logs = data.logs;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.guild = guild;
    this.rest = rest;
  }

  /**
   * Fetches the user
   * @returns New Instance of the user
   */
  async fetch() {
    const route = Routes.guilds.bets.get(this.guild.id, this._id);
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "get",
      url: route,
    });
    return new Bet(response, this.guild, this.rest);
  }

  async addConfirmed(type: string, id: string) {
    Assertion.assertString(type);
    Assertion.assertString(id);

    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "confirmed"
    );
    const payload = { entry: { type, id } };

    const response = await this.rest.request<APIGuildBet, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.rest.emit("betUpdate", this, new Bet(response, this.guild, this.rest));
    this.confirmed = response.confirmed;
    return response.confirmed.find((cn) => cn.type == type);
  }
  async setConfirmed(set: Confirm[]) {
    Assertion.assertObject(set);

    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "confirmed"
    );

    const response = await this.rest.request<APIGuildBet, typeof set>({
      method: "PATCH",
      url: route,
      payload: set,
    });
    this.rest.emit("betUpdate", this, new Bet(response, this.guild, this.rest));
    this.confirmed = response.confirmed;
    return this.confirmed;
  }

  async setStatus(status: ExtendedMatchStatus) {
    Assertion.assertString(status);

    const payload = { set: status.toLowerCase() };
    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "status"
    );
    const response = await this.rest.request<APIGuildBet, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new Bet(response, this.guild, this.rest));
    this.status = response.status;
    return this;
  }
  async setWinner(userId: string) {
    Assertion.assertString(userId);

    const payload = { set: userId };
    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "winner"
    );
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new Bet(response, this.guild, this.rest));
    this.winner = response.winner;
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
    this.rest.emit("betUpdate", this, new Bet(response, this.guild, this.rest));
    this.loser = response.loser;
    return response.loser;
  }

  /*  async addChannel(payload) {
    Assertion.assertObject(payload);
    return this.channels.create(payload);
  } */
  async addMessage(id: string, type: string, content?: string) {
    Assertion.assertString(id);
    Assertion.assertString(type);

    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "messages"
    );
    const payload = { id, type, content };
    const response = await this.rest.request<APIBetMessage, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    const index = this.messages.push(response);
    this.messages[index] = response;
    return response;
  }
  async setChannels(channels: APIBetChannel[]) {
    Assertion.assertObject(channels);

    const payload = { set: channels };
    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "channels"
    );
    const response = await this.rest.request<APIGuildBet, {}>({
      method: "PATCH",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new Bet(response, this.guild, this.rest));
    this.channels = response.channels;
    return response["channels"];
  }

  async addPlayer(id: string, name: string) {
    Assertion.assertString(id);
    Assertion.assertString(name);

    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "players"
    );
    const payload = { id, name };
    const response = await this.rest.request<APIPlayer[], typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    this.players = response;
    return this.players;
  }
  async removePlayer(id: string, name: string) {
    Assertion.assertString(id);
    Assertion.assertString(name);

    const route = Routes.guilds.bets.resource(
      this.guild.id,
      this._id,
      "players",
      id
    );
    const payload = { id, name };
    const response = await this.rest.request<APIPlayer[], typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });
    this.players = response;
    return this.players;
  }

  async update(data: Optional<APIGuildBet>) {
    const route = Routes.guilds.betUsers.get(this.guild.id, this._id);
    const payload = data;

    const response = await this.rest.request<APIGuildBet, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.rest.emit("betUpdate", this, new Bet(response, this.guild, this.rest));
    for (const k in response) {
      if (k === "id") continue;

      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGuildBet];
      }
    }
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
export type BetUserAddOptions = {
  coins: number;
  credit: number;
  wins: number;
  losses: number;
  mvps: number;
};
