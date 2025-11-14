declare class Guild {
    id: string;
    tickets: [];
}
export declare const APIEndpoints: {
    readonly "guilds/get": {
        readonly response: typeof Guild;
    };
};
export type APIEndpoint = keyof typeof APIEndpoints;
export {};
