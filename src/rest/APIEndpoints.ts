class Guild {
  id: string;
  tickets: [];
}

export const APIEndpoints = {
  "guilds/get": {
    response: Guild,
  },
};
export type APIEndpoint = keyof string;
