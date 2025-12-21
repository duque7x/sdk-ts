import { GuildBetManager } from "../../managers";
import { REST, Routes } from "../../rest";
import {
  APIBetChannel,
  APIGuildBet,
  APIMessage,
  APIPlayer,
  BaseMatchModes,
  BetQueue,
  Confirm,
  Optional,
} from "../../types";
import { Guild } from "../guild/Guild";

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

  /** The bet's players */
  players: APIPlayer[];

  teams: APIPlayer[][];

  /** The bet's channel */
  channels: APIBetChannel[];

  /** The bet's messages */
  messages: APIMessage[];

  /** The id of the winner */
  winners: APIPlayer[];

  /** The id of the loser */
  losers: APIPlayer[];

  /** The bet's creator id */
  creatorId: string;

  /** The bet's mediator */
  mediatorId: string;

  /** The bet's confirmers */
  confirmed: Confirm[];

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** Bet's id */
  _id: string;
  queues: BetQueue[];

  rest: REST;
  guild: Guild;
  manager: GuildBetManager;

  constructor(data: Optional<APIGuildBet>, manager: GuildBetManager) {
    this.manager = manager;
    this.guild = manager.guild;
    this.rest = manager.rest;

    this._id = data?._id;
    this.type = data?.type;
    this.mode = data?.mode;
    this.status = data?.status;
    this.maximumSize = data?.maximumSize;
    this.price = data?.price;
    this.players = data?.players;
    this.teams = data?.teams;
    this.channels = data?.channels;
    this.messages = data?.messages;
    this.winners = data?.winners;
    this.losers = data?.losers;
    this.creatorId = data?.creatorId;
    this.mediatorId = data?.mediatorId;
    this.confirmed = data?.confirmed;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();
    this.queues = [];

    for (let queue of data.queues ?? []) {
      this.queues.push({
        _id: queue?._id,
        type: queue?.type,
        players: queue?.players,
        updatedAt: queue?.updatedAt ? new Date(queue?.updatedAt) : new Date(),
        createdAt: queue?.createdAt ? new Date(queue?.createdAt) : new Date(),
      });
    }
  }
  toString() {
    return this._id;
  }
  async fetch() {
    const route = Routes.guilds.bets.get(this.guild.id, this._id);
    const response = await this.rest.request<APIGuildBet, {}>({ url: route, method: "GET" });

    return this._updateInternals(response);
  }
  async addPlayer(player: APIPlayer, queue_type?: string) {
    if (this.players.length === 2) return this;
    if (this.players.some((p) => p.id === player.id)) return this;

    this.players.push(player);

    if (queue_type) {
      const queue = this.queues.find((q) => q.type === queue_type);
      if (!queue) return this;

      for (const q of this.queues) {
        q.players = q.players.filter((p) => p.id !== player.id);
      }

      if (!queue.players.some((p) => p.id === player.id)) {
        queue.players.push({ id: player.id });
      }
    }

    await this.update({
      players: this.players,
      queues: this.queues,
    });

    return this;
  }

  async removePlayer(player: APIPlayer) {
    if (!this.players.some((p) => p.id === player.id)) return this;

    this.players = this.players.filter((p) => p.id !== player.id);

    for (const q of this.queues) {
      q.players = q.players.filter((p) => p.id !== player.id);
    }

    await this.update({
      players: this.players,
      queues: this.queues,
    });

    return this;
  }

  async update(data: Optional<APIGuildBet>) {
    const payload = data;
    const route = Routes.guilds.bets.update(this.guild.id, this._id);
    const response = await this.rest.request<APIGuildBet, typeof payload>({ method: "patch", url: route, payload });
    return this._updateInternals(response);
  }
  async delete() {
    const route = Routes.guilds.bets.delete(this.manager.guild.id, this._id);
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.rest.emit("betDelete", this);
    this.manager.cache.delete(this._id);

    return response;
  }
  _updateInternals(data: Optional<APIGuildBet>) {
    for (let key in data) {
      if (key === "_id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIGuildBet];
      }
    }

    this.updatedAt = new Date();
    this.createdAt = new Date(data.createdAt);

    this.manager.set(this);
    return this;
  }

  toJSON(): Optional<APIGuildBet> {
    let json: { [K in keyof GuildBet]?: GuildBet[K] } = {};

    for (const [key, value] of Object.entries(this)) {
      const exclude = ["rest", "guild", "manager"];
      if (exclude.includes(key)) continue;

      if (typeof value !== "function") {
        (json as any)[key] = value;
      }
    }
    return json;
  }
}
