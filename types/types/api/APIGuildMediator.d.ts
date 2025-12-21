export interface APIGuildMediator {
    /** Mediator's id */
    id: string;
    guild_id: string;
    paypal: string;
    revolut: string;
    mbway: string;
    external_links: string[];
    games: number;
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
}
