import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildMatch } from "../../structures/match/GuildMatch";
//import { GuildTicket } from "../../structures/ticket/GuildTicket";
import { APIGuildMatch, APIGuildTicket, Optional } from "../../types";

export type BufferMatch = Optional<APIGuildMatch & { id: string }>;
export type BufferTicket = Optional<APIGuildTicket & { id: string }>;

export class BufferManager {
  matches: Collection<string, BufferMatch | GuildMatch>;
  tickets: Collection<string, BufferTicket>;

  guild: Guild;
  constructor(guild: Guild) {
    this.matches = new Collection("buffer:matches");
    this.tickets = new Collection("buffer:tickets");

    this.guild = guild;
  }
  async flush(key: "matches" | "tickets") {
    const { rest } = this.guild;
    const cache = this[key];
    const { size, clear } = cache;
    if (size >= 2) {
      const response = await rest.request<APIGuildMatch[] & APIGuildTicket[], {}>({
        method: "POST",
        url: Routes.guilds.resources(this.guild.id, key, "bulk"),
        payload: { [key]: this[key].toArray() },
      });
      this.guild[key as "matches"].set(response);
      clear();
      return response;
    }
    return;
  }
  createMatch(id: string, data: BufferMatch) {
    this.matches.set(id, data);
  }
  createTicket(id: string, data: BufferTicket) {
    this.tickets.set(id, data);
  }
}
