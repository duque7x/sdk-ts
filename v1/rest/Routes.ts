import { APIEndpoints } from "./APIEndpoints";
export const Route = <K>(route: string) => route;

export const Routes = {
  base: "http://localhost:3000/api/v1",
  //base: "https://duquedev.up.railway.app/api/v1",

  field: (field: string) => `${field}`,
  fields: (...fields: string[]) => `${fields.join("/")}`,

  guilds: {
    create: () => `/guilds`,

    get: (guildId: string) => `/guilds/${guildId}`,
    getAll: () => `/guilds`,
    delete: (guildId: string) => `/guilds/${guildId}`,
    deleteAll: () => `/guilds`,
    resource: (guildId: string, resource: string) => `/guilds/${guildId}/${resource}`,
    resources: (guildId: string, ...resourcess: string[]) => `/guilds/${guildId}/${resourcess.join("/")}`,

    users: {
      create: (guildId: string) => `/guilds/${guildId}/users`,
      update: (guildId: string, userId: string) => `/guilds/${guildId}/users/${userId}`,

      getAll: (guildId: string) => `/guilds/${guildId}/users`,
      get: (guildId: string, userId: string) => `/guilds/${guildId}/users/${userId}`,

      delete: (guildId: string, userId: string) => `/guilds/${guildId}/users/${userId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}/users`,

      resource: (guildId: string, userId: string, resource: string) => `/guilds/${guildId}/users/${userId}/${resource}`,
    },

    betUsers: {
      getAll: (guildId: string) => `/guilds/${guildId}/betusers`,
      get: (guildId: string, userId: string) => `/guilds/${guildId}/betusers/${userId}`,

      create: (guildId: string) => `/guilds/${guildId}/betusers`,
      update: (guildId: string, userId: string) => `/guilds/${guildId}/betusers/${userId}`,

      delete: (guildId: string, userId: string) => `/guilds/${guildId}/betusers/${userId}`,

      deleteAll: (guildId: string) => `/guilds/${guildId}/betusers`,
      resource: (guildId: string, userId: string, resourceName: string) =>
        `/guilds/${guildId}/betusers/${userId}/${resourceName}`,
    },

    matches: {
      getAll: (guildId: string) => `/guilds/${guildId}/matches`,
      get: (guildId: string, matchId: string) => `/guilds/${guildId}/matches/${matchId}`,

      create: (guildId: string) => `/guilds/${guildId}/matches`,
      update: (guildId: string, matchId: string) => `/guilds/${guildId}/matches/${matchId}`,

      delete: (guildId: string, matchId: string) => `/guilds/${guildId}/matches/${matchId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}/matches`,
      resource: (guildId: string, matchId: string, ...resources: string[]) =>
        `/guilds/${guildId}/matches/${matchId}/${resources.join("/")}`,
    },

    bets: {
      getAll: (guildId: string) => `/guilds/${guildId}/bets`,
      get: (guildId: string, betId: string) => `/guilds/${guildId}/bets/${betId}`,
      create: (guildId: string) => `/guilds/${guildId}/bets`,
      update: (guildId: string, betId: string) => `/guilds/${guildId}/bets/${betId}`,
      delete: (guildId: string, betId: string) => `/guilds/${guildId}/bets/${betId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}/bets`,
      resource: (guildId: string, betId: string, ...resources: string[]) =>
        `/guilds/${guildId}/bets/${betId}/${resources.join("/")}`,
    },

    tickets: {
      getAll: (guildId: string) => `/guilds/${guildId}/tickets`,
      get: (guildId: string, ticketId: string) => `/guilds/${guildId}/tickets/${ticketId}`,
      create: (guildId: string) => `/guilds/${guildId}/tickets`,
      update: (guildId: string, ticketId: string) => `/guilds/${guildId}/tickets/${ticketId}`,
      delete: (guildId: string, ticketId: string) => `/guilds/${guildId}/tickets/${ticketId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}/tickets`,
      resource: (guildId: string, ticketId: string, ...resources: string[]) =>
        `/guilds/${guildId}/tickets/${ticketId}/${resources.join("/")}`,
    },
    mediators: {
      getAll: (guildId: string) => `/guilds/${guildId}/mediators`,
      get: (guildId: string, mediatorId: string) => `/guilds/${guildId}/mediators/${mediatorId}`,
      create: (guildId: string) => `/guilds/${guildId}/mediators`,
      update: (guildId: string, mediatorId: string) => `/guilds/${guildId}/mediators/${mediatorId}`,
      delete: (guildId: string, mediatorId: string) => `/guilds/${guildId}/mediators/${mediatorId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}/mediators`,
      resource: (guildId: string, mediatorId: string, ...resources: string[]) =>
        `/guilds/${guildId}/mediators/${mediatorId}/${resources.join("/")}`,
    },

    shop: {
      get: (guildId: string) => `/guilds/${guildId}/shop`,

      update: (guildId: string) => `/guilds/${guildId}/shop`,
      delete: (guildId: string) => `/guilds/${guildId}/shop/ `,
      resource: (guildId: string, ...resources: string[]) => `/guilds/${guildId}/shop/${resources.join("/")}`,

      products: {
        getAll: (guildId: string) => `/guilds/${guildId}/shop/products`,
        get: (guildId: string, productId: string) => `/guilds/${guildId}/shop/${productId}/products`,
        create: (guildId: string) => `/guilds/${guildId}/shop/products`,
        update: (guildId: string, productId: string) => `/guilds/${guildId}/shop/products/${productId}`,
        delete: (guildId: string, productId: string) => `/guilds/${guildId}/shop/products/${productId}`,
        deleteAll: (guildId: string) => `/guilds/${guildId}/products/shop`,
        resource: (guildId: string, productId: string, ...resources: string[]) =>
          `/guilds/${guildId}/shop/products/${productId}/${resources.join("/")}`,
      },
    },
  },

  vipmembers: {
    get: (guildId: string, memberId: string) => `/guilds/${guildId}/vipmembers/${memberId}`,
    getAll: (guildId: string) => `/guilds/${guildId}/vipmembers`,
    deleteAll: (guildId: string) => `/guilds/${guildId}/vipmembers`,
    create: (guildId: string) => `/guilds/${guildId}/vipmembers`,

    update: (guildId: string, memberId: string) => `/guilds/${guildId}/vipmembers/${memberId}`,
    delete: (guildId: string, memberId: string) => `/guilds/${guildId}/vipmembers/${memberId}`,
  },
};
