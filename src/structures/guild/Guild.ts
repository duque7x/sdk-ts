import {
  BufferManager,
  GuildMatchManager,
  GuildPermissionManager,
  GuildTicketManager,
  GuildUserManager,
  LogManager,
  VipMemberManager,
} from "../../managers";
import { REST } from "../../rest/REST";
import { Routes } from "../../rest/Routes";
import {
  APICode,
  APIGuildAdvert,
  APIGuildGroupedChannel,
  APIGuildPermissions,
  APIGuildShop,
  Daily,
  Optional,
} from "../../types/api";
import {
  APIGuild,
  DailyCategories,
  GuildChannelsType,
  GuildModes,
  GuildPrices,
  GuildScores,
  GuildStatus,
  GuildTicketConfiguration,
} from "../../types/api/APIGuild";
import { Assertion } from "../../utils/Assertion";
export class Guild {
  /** The data of this guild */
  data: APIGuild;

  /** The rest client */
  rest: REST;

  /** The guild's id */
  id: string;

  modes: GuildModes;

  /** Guild's client key */
  client_key: string;

  /** Guild Permissions */
  permissions: APIGuildPermissions;

  /** Guild Ticket */
  tickets: GuildTicketManager;

  /** Guild Ticket Configuration */
  tickets_configuration: GuildTicketConfiguration;

  /** Guild Daily Categories */
  daily_categories: DailyCategories[];

  /** Guild Scores */
  scores: GuildScores;

  /** Guild Status */
  status: GuildStatus;

  channels: APIGuildGroupedChannel[];

  /** Guild Prefix */
  prefix: string;

  /** Guild Creation Date */
  createdAt: Date;

  /** Guild Updated Date */
  updatedAt: Date;

  /** Guild Matches */
  matches: GuildMatchManager;

  /** Guild Prices Used */
  prices: GuildPrices;

  permissionsManager: GuildPermissionManager;

  buffer: BufferManager;

  vipMembers: VipMemberManager;

  users: GuildUserManager;

  logEntries: LogManager;

  shop: APIGuildShop;

  adverts: APIGuildAdvert[];

  codes: APICode[];
  /**
   * The guild structure
   * @param data The guild's data
   * @param rest The rest client
   */
  constructor(data: APIGuild, rest: REST) {
    this.data = data;
    this.rest = rest;

    this.id = data?.id;
    this.client_key = data?.client_key;

    this.daily_categories = data?.daily_categories;
    this.permissions = data?.permissions;
    this.modes = data?.modes;
    this.prices = data?.prices;
    this.scores = data?.scores;
    this.codes = data?.codes;
    this.prefix = data?.prefix;
    this.status = data?.status;
    this.tickets_configuration = data?.tickets_configuration;
    this.channels = data?.channels;
    this.shop = data?.shop;

    this.createdAt = data?.createdAt ? new Date(data?.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : new Date();

    this.permissionsManager = new GuildPermissionManager(this);
    this.buffer = new BufferManager(this);

    this.users = new GuildUserManager(this);
    this.matches = new GuildMatchManager(this);
    this.tickets = new GuildTicketManager(this);
    this.vipMembers = new VipMemberManager(this);
    this.logEntries = new LogManager(this);

    this.adverts = [];
    for (let _adv of data?.adverts || []) {
      this.adverts.push({
        _id: _adv._id,
        admin_id: _adv.admin_id,
        points_to_remove: _adv.points_to_remove,
        role_id: _adv.role_id,

        createdAt: _adv.createdAt ? new Date(_adv.createdAt) : new Date(),
        updatedAt: _adv.updatedAt ? new Date(_adv.updatedAt) : new Date(),
      });
    }
    this.codes = [];
    for (let _adv of data?.codes || []) {
      this.codes.push({
        _id: _adv._id,
        admin_id: _adv.admin_id,
        type: _adv.type,
        add: _adv.add,
        code: _adv.code,

        expire: _adv.expire ? new Date(_adv.expire) : new Date(),
        createdAt: _adv.createdAt ? new Date(_adv.createdAt) : new Date(),
        updatedAt: _adv.updatedAt ? new Date(_adv.updatedAt) : new Date(),
      });
    }
  }
  async getChannel(type: GuildChannelsType): Promise<APIGuildGroupedChannel> {
    const channel = this.channels.find((c) => c.type === type);
    if (channel) return channel;
    else {
      const channels = [...this.channels, { type, ids: [] }];
      const route = Routes.guilds.get(this.id);
      const response = await this.rest.request<APIGuild, {}>({
        method: "PATCH",
        url: route,
        payload: { channels },
      });
      this._updateInternals(response);
      return response.channels.find((t) => t.type === type);
    }
  }
  async createAdvert(data: Optional<APIGuildAdvert>) {
    this.adverts.push(data as APIGuildAdvert);
    const route = Routes.guilds.get(this.id);
    const payload = { adverts: this.adverts };
    const response = await this.rest.request<APIGuild, typeof payload>({ method: "PATCH", url: route, payload });
    return this._updateInternals(response);
  }
  async removeAdvert(advertId: string) {
    const route = Routes.guilds.get(this.id);
    const payload = { adverts: this.adverts.filter((a) => a._id !== advertId) };
    const response = await this.rest.request<APIGuild, typeof payload>({ method: "PATCH", url: route, payload });
    return this._updateInternals(response);
  }
  async createCode(data: Optional<APICode>) {
    this.codes.push(data as APICode);
    const route = Routes.guilds.get(this.id);
    const payload = { codes: this.codes };
    const response = await this.rest.request<APIGuild, typeof payload>({ method: "PATCH", url: route, payload });
    return this._updateInternals(response);
  }
  async removeCode(codeId: string) {
    const route = Routes.guilds.get(this.id);
    const payload = { codes: this.codes.filter((a) => a._id !== codeId) };
    const response = await this.rest.request<APIGuild, typeof payload>({ method: "PATCH", url: route, payload });
    return this._updateInternals(response);
  }
  async addIdToChannel(type: GuildChannelsType, id: string | string[]) {
    const channel = this.channels.find((c) => c.type === type);
    const idsToAdd = Array.isArray(id) ? id : [id];

    if (!channel) {
      // create new channel if it doesn't exist
      this.channels.push({ type, ids: [...idsToAdd] });
    } else {
      // merge IDs, remove duplicates
      const chIndex = this.channels.findIndex((ch) => ch.type === type);
      const mergedIds = [...new Set([...(channel.ids || []), ...idsToAdd])];

      this.channels[chIndex] = { ...channel, ids: mergedIds };
    }

    const route = Routes.guilds.get(this.id);
    const payload = { channels: this.channels };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    return this._updateInternals(response);
  }

  async removeIdInChannel(type: GuildChannelsType, id: string) {
    const chIndex = this.channels.findIndex((c) => c.type === type);

    if (chIndex !== -1) {
      const existing = this.channels[chIndex];
      const updatedIds = existing.ids.filter((i) => i !== id);

      this.channels[chIndex] = {
        ...existing,
        ids: updatedIds,
      };
    } else {
      // If channel doesn't exist, create it with empty ids
      this.channels.push({
        type,
        ids: [],
      });
    }

    const route = Routes.guilds.get(this.id);
    const payload = { channels: this.channels };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    return this._updateInternals(response);
  }

  async _start() {
    await Promise.all([
      this.users.fetch(),
      this.matches.fetch(),
      this.tickets.fetch(),
      this.vipMembers.fetch(),
      this.logEntries.fetch(),
    ]);
    return this;
  }
  _updateInternals(data: Optional<APIGuild>) {
    for (let key in data) {
      if (key === "id" || key === "createdAt") continue;
      if (key in this) {
        (this as any)[key] = data[key as keyof APIGuild];
      }
      if (key === "adverts") {
        this.adverts = [];
        for (let _adv of data.adverts) {
          this.adverts.push({
            _id: _adv._id,
            admin_id: _adv.admin_id,
            points_to_remove: _adv.points_to_remove,
            role_id: _adv.role_id,

            createdAt: _adv.createdAt ? new Date(_adv.createdAt) : new Date(),
            updatedAt: _adv.updatedAt ? new Date(_adv.updatedAt) : new Date(),
          });
        }
      }
      if (key === "code") {
        this.codes = [];
        for (let _adv of data.codes) {
          this.codes.push({
            _id: _adv._id,
            admin_id: _adv.admin_id,
            type: _adv.type,
            add: _adv.add,
            code: _adv.code,
            expire: _adv.expire ? new Date(_adv.expire) : new Date(),
            createdAt: _adv.createdAt ? new Date(_adv.createdAt) : new Date(),
            updatedAt: _adv.updatedAt ? new Date(_adv.updatedAt) : new Date(),
          });
        }
      }
    }

    this.updatedAt = new Date();
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async fetch(): Promise<Guild> {
    const route = Routes.guilds.get(this.id);
    const response = await this.rest.request<APIGuild, {}>({
      method: "get",
      url: route,
    });

    return this._updateInternals(response);
  }
  async update(data: Optional<APIGuild>): Promise<Guild> {
    const route = Routes.guilds.get(this.id);
    const response = await this.rest.request<APIGuild, typeof data>({
      method: "patch",
      url: route,
      payload: data,
    });
    for (const k in response) {
      if (k === "id" || k == "createdAt") continue;
      if (k in this) {
        (this as any)[k] = response[k as keyof APIGuild];
      }
    }
    this.updatedAt = new Date();
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async setStatus(key: keyof GuildStatus, status: "on" | "off") {
    Assertion.assertString(key);
    this.status[key] = status;
    const route = Routes.guilds.resource(this.id, "status");
    const payload = { set: this.status };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this.status = response.status;
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }
  async addPrice(price: number) {
    Assertion.assertNumber(price);

    const route = Routes.fields(Routes.guilds.resource(this.id, "prices"), "used");
    const payload = { set: price };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "POST",
      url: route,
      payload,
    });
    this._updateInternals(response);
    return this;
  }
  async removePrice(price: number) {
    Assertion.assertNumber(price);

    const route = Routes.fields(Routes.guilds.resource(this.id, "prices"), "used", price.toString());
    const payload = { set: price };
    const response = await this.rest.request<number[], typeof payload>({
      method: "DELETE",
      url: route,
      payload,
    });

    this.prices.used = response;
    this.rest.guilds.cache.set(this.id, this);
    this.rest.emit("guildUpdate", this);
    return this;
  }

  async setPrefix(prefix: string) {
    Assertion.assertString(prefix);

    const route = Routes.fields(Routes.guilds.resource(this.id, "prefix"));
    const payload = { set: prefix };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "PATCH",
      url: route,
      payload,
    });

    this._updateInternals(response);
    return this;
  }
  async toggleDailyCategory(category: keyof Omit<Daily, "date">) {
    Assertion.assertString(category);
    let categories = this.daily_categories;

    const returnCategories = () => {
      const isCategoryOn = categories.includes(category);
      if (isCategoryOn) categories = categories.filter((m) => m !== category);
      else categories = [...categories, category];
      return categories;
    };

    const _categories = returnCategories();
    const payload = { daily_categories: _categories };
    const route = Routes.guilds.get(this.id);
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    this._updateInternals(response);
    return this;
  }

  async setScores(name: AvailableScores, amount: number) {
    const route = Routes.guilds.get(this.id);

    let scores = this.scores;
    scores[name] = amount;

    const payload = { scores };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    this._updateInternals(response);
    return this;
  }
  async toggleMode(mode: "1v1" | "2v2" | "3v3" | "4v4" | "5v5" | "6v6") {
    const route = Routes.guilds.get(this.id);

    let modes = this.modes;

    const returnModes = () => {
      const isModeOn = modes.on.includes(mode);

      if (isModeOn) {
        modes.on = modes.on.filter((m) => m !== mode);
        modes.off.push(mode);
        return modes;
      } else {
        modes.off = modes.off.filter((m) => m !== mode);
        modes.on.push(mode);
        return modes;
      }
    };
    const md = returnModes();
    const payload = { modes: md };
    const response = await this.rest.request<APIGuild, typeof payload>({
      method: "patch",
      url: route,
      payload,
    });

    this._updateInternals(response);
    return this;
  }
}

type AvailableScores = "win" | "loss" | "mvp" | "creator" | "coin";
