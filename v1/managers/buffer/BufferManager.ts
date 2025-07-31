import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildMatch } from "../../structures/match/GuildMatch";
import { GuildTicket } from "../../structures/ticket/GuildTicket";
import { APIGuildMatch, APIGuildTicket, Optional } from "../../types";

export class BufferManager {
  matches: Collection<string, Optional<APIGuildMatch & { id: string }>>;
  tickets: Collection<string, Optional<APIGuildTicket & { id: string }>>;

  guild: Guild;
  constructor(guild: Guild) {
    this.matches = new Collection();
    this.tickets = new Collection();

    this.guild = guild;
  }
  async flush(key: "matches" | "tickets") {
    const { rest } = this.guild;
    const cache = this[key];
    const { size, clear } = cache;
    if (size >= 3) {
      const response = await rest.request<APIGuildMatch[] & APIGuildTicket[], {}>({
        method: "POST",
        url: Routes.guilds.resources(this.guild.id, key, "bulk"),
        payload: { [key]: this[key].toArray() },
      });
      this.guild[key].setAll(response);
      clear();
      return response;
    }
    return;
  }
}
