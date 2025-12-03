import { APIGuildTicket } from "../types";
export declare const Routes: {
    base: string;
    field: (field: string) => string;
    fields: (...fields: string[]) => string;
    guilds: {
        create: () => string;
        get: (guildId: string) => string;
        getAll: () => string;
        delete: (guildId: string) => string;
        deleteAll: () => string;
        resource: (guildId: string, resource: string) => string;
        resources: (guildId: string, ...resources: string[]) => string;
        users: {
            create: (guildId: string) => string;
            update: (guildId: string, userId: string) => string;
            getAll: (guildId: string) => string;
            get: (guildId: string, userId: string) => string;
            delete: (guildId: string, userId: string) => string;
            deleteAll: (guildId: string) => string;
            resource: (guildId: string, userId: string, ...resource: string[]) => string;
        };
        betUsers: {
            getAll: (guildId: string) => string;
            get: (guildId: string, userId: string) => string;
            create: (guildId: string) => string;
            update: (guildId: string, userId: string) => string;
            delete: (guildId: string, userId: string) => string;
            deleteAll: (guildId: string) => string;
            resource: (guildId: string, userId: string, resourceName: string) => string;
        };
        matches: {
            getAll: (guildId: string) => string;
            get: (guildId: string, matchId: string) => string;
            create: (guildId: string) => string;
            update: (guildId: string, matchId: string) => string;
            delete: (guildId: string, matchId: string) => string;
            deleteAll: (guildId: string) => string;
            resource: (guildId: string, matchId: string, ...resources: string[]) => string;
        };
        bets: {
            getAll: (guildId: string) => string;
            get: (guildId: string, betId: string) => string;
            create: (guildId: string) => string;
            update: (guildId: string, betId: string) => string;
            delete: (guildId: string, betId: string) => string;
            deleteAll: (guildId: string) => string;
            resource: (guildId: string, betId: string, ...resources: string[]) => string;
        };
        tickets: {
            getAll: (guildId: string) => string;
            get: (guildId: string, ticketId: string) => string;
            create: (guildId: string) => string;
            update: (guildId: string, ticketId: string) => string;
            delete: (guildId: string, ticketId: string) => string;
            deleteAll: (guildId: string) => string;
            resource: (guildId: string, ticketId: string, ...resources: (keyof APIGuildTicket)[]) => string;
        };
        mediators: {
            getAll: (guildId: string) => string;
            get: (guildId: string, mediatorId: string) => string;
            create: (guildId: string) => string;
            update: (guildId: string, mediatorId: string) => string;
            delete: (guildId: string, mediatorId: string) => string;
            deleteAll: (guildId: string) => string;
            resource: (guildId: string, mediatorId: string, ...resources: string[]) => string;
        };
        shop: {
            get: (guildId: string) => string;
            update: (guildId: string) => string;
            delete: (guildId: string) => string;
            resource: (guildId: string, ...resources: string[]) => string;
            products: {
                getAll: (guildId: string) => string;
                get: (guildId: string, productId: string) => string;
                create: (guildId: string) => string;
                update: (guildId: string, productId: string) => string;
                delete: (guildId: string, productId: string) => string;
                deleteAll: (guildId: string) => string;
                resource: (guildId: string, productId: string, ...resources: string[]) => string;
            };
        };
    };
    vipmembers: {
        get: (guildId: string, memberId: string) => string;
        getAll: (guildId: string) => string;
        deleteAll: (guildId: string) => string;
        create: (guildId: string) => string;
        update: (guildId: string, memberId: string) => string;
        delete: (guildId: string, memberId: string) => string;
    };
    giveaways: {
        get: (giveawayId: string) => string;
        getAll: () => string;
        deleteAll: () => string;
        create: () => string;
        update: (giveawayId: string) => string;
        delete: (giveawayId: string) => string;
    };
};
