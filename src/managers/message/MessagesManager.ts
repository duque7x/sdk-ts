import { REST } from "../../rest";
import { Collection } from "../../structures/Collection";
import { APIMessage, Optional } from "../../types";

type T<e> = e & { rest: REST; messages: MessagesManager<e> };

export  class MessagesManager<Structure> {
  cache: Collection<string, APIMessage>;

  readonly base_url: string;
  readonly rest: REST;

  constructor(structure: T<Structure>, base_url: string) {
    this.rest = structure.rest;
    this.cache = new Collection<string, APIMessage>("messages");
    this.base_url = base_url;
  }

  async fetch() {
    const response = await this.rest.request<APIMessage, {}>({
      method: "GET",
      url: this.base_url,
      payload: {},
    });

    this.cache.set(response._id, response);

    return response;
  }

  async create(data: Optional<APIMessage> | Optional<APIMessage>[]) {
    const messages: APIMessage[] & Optional<APIMessage>[] = [...this.cache.toArray()];
    if (Array.isArray(data)) messages.push(...data);
    else messages.push(data);

    const response = await this.rest.request<APIMessage[], {}>({
      method: "POST",
      url: this.base_url,
      payload: { messages },
    });

    for (let message of response) this.cache.set(message._id, message);
    return response;
  }

  setAll(data: APIMessage | APIMessage[]) {
    if (Array.isArray(data)) {
      for (let message of data) this.cache.set(message._id, message);
    } else this.cache.set(data._id, data);
    return this.cache;
  }
}
