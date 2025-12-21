import { GuildMediatorManager } from "../../managers/mediator/GuildMediatorManager";
import { REST } from "../../rest/REST";
import { Optional } from "../../types/api";
import { APIGuildMediator } from "../../types/api/APIGuildMediator";
import { Guild } from "../guild/Guild";
export declare class GuildMediator implements APIGuildMediator {
    /** User's name */
    id: string;
    guild_id: string;
    /** User's games */
    games: number;
    paypal: string;
    revolut: string;
    mbway: string;
    external_links: string[];
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
    /** The given manager */
    readonly manager: GuildMediatorManager;
    /** The rest client */
    readonly rest: REST;
    readonly guild: Guild;
    /**
     * Bet user
     * @param data  The user's data
     * @param manager The manager
     * @param rest The rest client
     */
    constructor(data: APIGuildMediator, manager: GuildMediatorManager);
    /** String representation of this user */
    toString(): string;
    /**
     * Fetches the user
     * @returns New Instance of the user
     */
    fetch(): Promise<GuildMediator>;
    reset(): Promise<this>;
    _updateInternals(data: Optional<APIGuildMediator>): this;
    /**
     * Update certain property
     * @param data The new data to update with
     * @returns
     */
    update(data: Optional<APIGuildMediator>): Promise<this>;
    setPaymentlink(type: string, link: string): Promise<this>;
    delete(): Promise<boolean>;
    toJSON(): Optional<APIGuildMediator>;
}
