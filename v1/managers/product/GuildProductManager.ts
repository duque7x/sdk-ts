import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { GuildProduct } from "../../structures/product/GuildProduct";
import { Optional } from "../../types/api";
import { APIProduct } from "../../types/api/APIProduct";
import { Assertion } from "../../utils/Assertion";

export class GuildProductManager {
  /** A cache of users */
  cache: Collection<string, GuildProduct>;

  /** The rest client */
  rest: REST;

  /** GuildProduct product guild */
  guild: Guild;
  /**
   * Manage users with the given client
   * @param users An array of users
   * @param rest The rest client
   */
  constructor(guild: Guild, rest: REST) {
    this.guild = guild;
    this.rest = rest;

    this.cache = new Collection<string, GuildProduct>("products");
  }

  async create(payload: Optional<APIProduct>): Promise<GuildProduct> {
    Assertion.assertObject(payload);

    const route = Routes.guilds.shop.products.create(this.guild.id);
    const response = await this.rest.request<APIProduct, typeof payload>({
      method: "POST",
      url: route,
      payload
    });
    const product = this.set(response);
    return product;
  }

  /**
   * Fetch a product
   * @param id Id of the product to fetch
   * @returns APIBetUser
   */
  async fetch(id: string) {
    const route = Routes.guilds.shop.products.get(this.guild.id, id);
    const response = await this.rest.request<APIProduct, {}>({
      method: "get",
      url: route,
    });
    const product = new GuildProduct(response, this, this.rest);
    this.cache.set(product.id, product);

    return product;
  }

  async fetchAll() {
    const route = Routes.guilds.shop.products.getAll(this.guild.id);
    const response = await this.rest.request<APIProduct[], {}>({
      method: "get",
      url: route,
    });

    for (let betData of response) {
      const product = new GuildProduct(betData, this, this.rest);
      this.cache.set(product.id, product);
    }
    return this.cache;
  }

  set(data: APIProduct): GuildProduct {
    if (!data?.id) return;
    const product = new GuildProduct(data, this, this.rest);
    this.cache.set(data.id, product);
    return product;
  }
  setAll(data: APIProduct[]) {
    if (!data) return this.cache;
    for (let product of data) this.set(product);
    return this.cache;
  }

  async delete(id: string, type: string) {
    Assertion.assertString(id);
    Assertion.assertString(type);

    const route = Routes.guilds.shop.products.delete(id, this.guild.id);
    const payload = { type };
    const product = this.cache.get(id);
    this.rest.emit("productsDelete", product);

    await this.rest.request({
      method: "DELETE",
      url: route,
      payload,
    });

    this.cache.delete(id);
    return this.cache;
  }
  async deleteAll() {
    const route = Routes.guilds.shop.products.deleteAll(this.guild.id);
    this.rest.emit("productsDelete", this.cache);

    const value = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });
    this.cache.clear();
    return value;
  }
}
