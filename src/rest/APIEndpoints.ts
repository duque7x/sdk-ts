class Guild {
  id: string;
  tickets: [];
}

export const APIEndpoints = {
  "guilds/get": {
    response: Guild,
  },
} as const;
export type APIEndpoint = keyof typeof APIEndpoints;

