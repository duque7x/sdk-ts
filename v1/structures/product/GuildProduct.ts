import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Items, Optional } from "../../types/api";
import { APIProduct } from "../../types/api/APIProduct";
import { APIPlayer } from "../../types/api/APIPlayer";
import { Assertion } from "../../utils/Assertion";
import { GuildProductManager } from "../../managers/product/GuildProductManager";

export class GuildProduct implements APIProduct {
  /** Product's name */
  name: string;

  /** Product's description */
  description: string;

  /** Product's id */
  id: string;

  /** Product's price */
  price: number;

  /** Product's buyers */
  buyers: APIPlayer[];

  /** Product's emoji */
  emoji: string;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given manager */
  readonly manager: GuildProductManager;

  /** The rest client */
  readonly rest: REST;

  /**
   * Bet product
   * @param data  The product's data
   * @param manager The manager
   * @param rest The rest client
   */
  constructor(data: APIProduct, manager: GuildProductManager, rest: REST) {
    this.name = data?.name;
    this.id = data?.id;
    this.price = data?.price;
    this.buyers = data?.buyers;
    this.emoji = data?.emoji;
    this.description = data?.description;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.manager = manager;
    this.rest = rest;
  }
  /** String representation of this product */
  toString() {
    return `<@${this.id}>`;
  }
  /**
   * Fetches the product
   * @returns New Instance of the product
   */
  async fetch() {
    const route = Routes.guilds.shop.products.get(
      this.manager.guild.id,
      this.id
    );
    const response = await this.rest.request<APIProduct, {}>({
      method: "get",
      url: route,
    });
    const product = new GuildProduct(response, this.manager, this.rest);
    this.manager.cache.set(product.id, product);
    return product;
  }
  async setPrice(price: number) {
    Assertion.assertNumber(price);

    const route = Routes.guilds.shop.products.resource(
      this.id,
      this.manager.guild.id,
      "price"
    );
    const payload = { price };
    const response = await this.rest.request<APIProduct, typeof payload>({
      method: "PATCH",
      url: route,
    });
    this.price = response.price;
    this.manager.cache.set(this.id, this);
    return this;
  }
  async addBuyer(id: string, name: string, type: string) {
    Assertion.assertString(id);
    Assertion.assertString(name);
    Assertion.assertString(type);

    const payload = { id, name, type };
    const route = Routes.guilds.shop.products.resource(
      this.id,
      this.manager.guild.id,
      "buyers"
    );
    const response = await this.rest.request<APIProduct, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });

    let user;
    if (type == "bet") {
      user = this.manager.guild.betUsers.cache.get(id);
      user.items = [...new Set([...user.items, this.id])] as Items;
      this.manager.guild.betUsers.cache.set(user.id, user);
      this.rest.betUsers.set(user.id, user);
    } else if (type == "match") {
      user = this.manager.guild.users.cache.get(id);
      user.items = [...new Set([...user.items, this.id])] as Items;
      this.manager.guild.users.cache.set(user.id, user);
      this.rest.users.set(user.id, user);
    }
    this.buyers = response.buyers;
    this.manager.cache.set(this.id, this);

    return this;
  }
  async removeBuyer(id: string, name: string, type: string) {
    Assertion.assertString(id);
    Assertion.assertString(name);
    Assertion.assertString(type);

    const payload = { id, name, type };
    const route = Routes.guilds.shop.products.resource(
      this.id,
      this.manager.guild.id,
      "buyers",
      id
    );
    const response = await this.rest.request<APIProduct, {}>({
      method: "DELETE",
      url: route,
      payload,
    });

    let user;
    if (type == "bet") {
      user = this.manager.guild.betUsers.cache.get(id);
      user.items = [
        ...new Set(user.items.filter((item) => item != this.id)),
      ] as Items;
      this.manager.guild.betUsers.cache.set(user.id, user);
    } else if (type == "match") {
      user = this.manager.guild.users.cache.get(id);
      user.items = [
        ...new Set(user.items.filter((item) => item != this.id)),
      ] as Items;
      this.manager.guild.users.cache.set(user.id, user);
    }

    this.buyers = response.buyers;
    this.manager.cache.set(this.id, this);
    return this;
  }
  /**
   * Update certain property
   * @param data The new data to update with
   * @returns
   */
  async update(payload: Optional<APIProduct>) {
    const route = Routes.guilds.shop.products.get(
      this.manager.guild.id,
      this.id
    );
    const response = await this.rest.request<APIProduct, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    for (const k in response) {
      if (k === "id") continue;
      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIProduct];
      }
    }
    this.manager.cache.set(this.id, this);
    return this;
  }
  async delete() {
    const route = Routes.guilds.shop.products.delete(
      this.manager.guild.id,
      this.id
    );
    const response = await this.rest.request<boolean, {}>({
      method: "DELETE",
      url: route,
    });

    this.rest.emit("betproductDelete", this);
    this.manager.cache.delete(this.id);
    return response;
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