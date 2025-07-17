import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { BetUser } from "../../structures/betuser/BetUser";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIGuildBetUser } from "../../types/api/APIGuildBetUser";

export class BetUserManager {
  /** A cache of users */
  cache: Collection<string, BetUser>;

  /** The rest client */
  rest: REST;

  /** Bet user guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;

    this.cache = new Collection<string, BetUser>();
    this.rest = rest;
  }

  /**
   * Fetch a user
   * @param id Id of the user to fetch
   * @returns APIBetUser
   */
  async fetch(id: string, name: string) {
    const route = Routes.guilds.betUsers.get(this.guild.id, id);
    const response = await this.rest.request<APIGuildBetUser, { name: string }>(
      {
        method: "get",
        url: route,
        payload: { name },
      }
    );

    return response;
  }

  async fetchAll() {
    const route = Routes.guilds.betUsers.getAll(this.guild.id);
    const response = await this.rest.request<APIGuildBetUser[], {}>({
      method: "get",
      url: route,
    });

    for (let userData of response) {
      const user = new BetUser(userData, this.guild, this.rest);
      this.cache.set(user.id, user);
    }
    return this.cache;
  }
  setAll(data: APIGuildBetUser[]) {
    for (let user of data) {
      if (!user.id) continue;
      const ur = new BetUser(user, this.guild, this.rest);
      this.cache.set(user.id, ur);
      this.rest.betUsers.set(ur.id, ur);
    }
    return this.cache;
  }
}
