import { REST } from "../rest/REST";
import { Collection } from "../structures/Collection";
import { Guild } from "../structures/guild/Guild";

export class BaseManager<S> {
  /** This url of the manager */
  base_url: string;

  /** The rest client */
  rest: REST;

  /** The guild of the manager */
  guild: Guild;

  /** Cache */
  cache: Collection<string, S>;


  constructor(guild: Guild, data?: unknown) {
    this.guild = guild;
    this.rest = guild.rest;
    
    this.cache = new Collection<string, S>();
  }
}
