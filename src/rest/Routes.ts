import { APIEndpoints } from "./APIEndpoints";
export const Route = <K>(route: string) => route;

export const Routes = {
  base: "http://localhost:3000/api/v1",
  //base: "https://duquedev.up.railway.app/api/v1",

  field: (field: string) => `/${field}`,
  fields: (fields: string[]) => `/${fields.join("/")}`,

  guilds: {
    create: () => `/guilds`,

    get: (guildId: string) => Route<"guilds/get">(`/guilds/${guildId}`),
    getAll: () => `/guilds`,
    delete: (guildId: string) => `/guilds/${guildId}`,
    deleteAll: () => `/guilds/`,
    resource: (guildId: string, resource: string) =>
      `/guilds/${guildId}/${resource}`,
    resources: (guildId: string, ...resourcess: string[]) =>
      `/guilds/${guildId}/${resourcess.join("/")}`,

    users: {
      create: (guildId: string) => `/guilds/${guildId}/users`,
      update: (guildId: string, userId: string) =>
        `/guilds/${guildId}/users/${userId}`,

      getAll: (guildId: string) => `/guilds/${guildId}/users`,
      get: (guildId: string, userId: string) => `/guilds/${guildId}/users/${userId}`,

      delete: (guildId: string, userId: string) =>
        `/guilds/${guildId}/users/${userId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}/users`,

      resource: (guildId: string, userId: string, resource: string) =>
        `/guilds/${guildId}/users/${userId}/${resource}`,
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
      getAll: (guildId: string) => `/guilds/${guildId}`,
      get: (guildId: string, matchId: string) => `/guilds/${guildId}`,
      create: (guildId: string) => `/guilds/${guildId}`,
      update: (guildId: string, matchId: string) => `/guilds/${guildId}`,
      delete: (guildId: string, matchId: string) => `/guilds/${guildId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}`,
      resource: (guildId: string, matchId: string, ...resources: string[]) =>
        `/guilds/${guildId}/matches/${resources.join("/")}`,
    },

    bets: {
      getAll: (guildId: string) => `/guilds/${guildId}`,
      get: (guildId: string, betId: string) => `/guilds/${guildId}`,
      create: (guildId: string) => `/guilds/${guildId}`,
      update: (guildId: string, betId: string) => `/guilds/${guildId}`,
      delete: (guildId: string, betId: string) => `/guilds/${guildId}`,
      deleteAll: (guildId: string) => `/guilds/${guildId}`,
      resource: (guildId: string, ...resources: string[]) =>
        `/guilds/${guildId}/bets/${resources.join("/")}`,
    },
  },
};
