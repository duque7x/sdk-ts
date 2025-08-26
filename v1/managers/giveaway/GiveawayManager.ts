import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Giveaway } from "../../structures/giveaway/Giveaway";
import { Optional } from "../../types";
import { APIGiveaway } from "../../types/api/APIGiveaway";

type AllowedTypes = Optional<APIGiveaway> | Giveaway | Giveaway[] | Optional<APIGiveaway>[];

export class GiveawayManager {
  cache: Collection<String, Giveaway>;

  readonly rest: REST;
  constructor(rest: REST) {
    this.rest = rest;
    this.cache = new Collection<string, Giveaway>("giveaways");
  }
  async fetchAll() {
    const route = Routes.giveaways.getAll();
    const response = await this.rest.request<APIGiveaway[], {}>({
      method: "get",
      url: route,
    });

    this.set(response);
    return this.cache;
  }
  async create(data: Optional<APIGiveaway>): Promise<Giveaway> {
    const route = Routes.giveaways.create();
    const payload = data;
    const response = await this.rest.request<APIGiveaway, typeof payload>({
      method: "post",
      url: route,
      payload,
    });
    const giveaway = new Giveaway(response, this);
    this.set(giveaway);
    return giveaway;
  }
  async deleteAll() {
    const route = Routes.giveaways.deleteAll();
    const response = await this.rest.request<APIGiveaway, {}>({
      method: "delete",
      url: route,
    });
    this.cache.clear();
    return this.cache;
  }
  set(data: AllowedTypes) {
    if (Array.isArray(data)) {
      for (let giv of data) {
        giv = new Giveaway(giv, this);
        this.cache.set(giv._id, giv as Giveaway);
      }
    } else {
      data = new Giveaway(data, this);
      this.cache.set(data._id, data as Giveaway);
    }
  }
}
