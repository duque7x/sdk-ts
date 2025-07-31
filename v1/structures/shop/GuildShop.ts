import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import { Guild } from "../guild/Guild";
import { Optional } from "../../types/api";
import { Assertion } from "../../utils/Assertion";
import { APIProduct } from "../../types/api/APIProduct";
import { APIGuildShop } from "../../types/api/APIGuildShop";
import { GuildProductManager } from "../../managers/product/GuildProductManager";

export class GuildShop {
  /**shop's product */
  products: GuildProductManager;

  /** Bought count */
  boughtCount: number;

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;

  /** The given guild */
  readonly guild: Guild;

  /** The rest client */
  readonly rest: REST;

  /**
   * GuildShopshop
   * @param data  Theshop's data
   * @param guild The guild
   * @param rest The rest client
   */
  constructor(data: APIGuildShop, guild: Guild, rest: REST) {
    this.boughtCount = data?.boughtCount;
    this.products = new GuildProductManager(guild, rest);

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.guild = guild;
    this.rest = rest;

    this.products.setAll(data?.products);
  }
  toString() {
    return this.boughtCount.toString();
  }
  /**
   * Fetches theshop
   * @returns New Instance of theshop
   */
  async fetch() {
    const route = Routes.guilds.shop.get(this.guild.id);
    const response = await this.rest.request<APIGuildShop, {}>({
      method: "get",
      url: route,
    });
    const shp = new GuildShop(response, this.guild, this.rest);
    this.guild.shop = shp;
    return shp;
  }

  async update(data: Optional<APIGuildShop>) {
    const route = Routes.guilds.shop.get(this.guild.id);
    const payload = data;

    const response = await this.rest.request<APIGuildShop, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });
    this.rest.emit(
      "shopUpdate",
      this,
      new GuildShop(response, this.guild, this.rest)
    );
    for (const k in response) {
      if (k === "id") continue;

      if (Object.hasOwn(this, k)) {
        (this as any)[k] = response[k as keyof APIGuildShop];
      }
    }
    this.guild.shop = this;
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
