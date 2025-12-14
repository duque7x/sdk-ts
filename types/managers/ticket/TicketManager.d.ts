import { REST } from "../../rest";
import { Guild, GuildTicket } from "../../structures";
import { Collection } from "../../structures/Collection";
import { APIGuild, APIGuildTicket, APITicketCategory, Optional } from "../../types";
type FecthOptions = {
    ticketId?: string;
    cache?: boolean;
};
type DeleteOptions = {
    ticketId?: string;
};
export declare class GuildTicketManager {
    cache: Collection<string, GuildTicket>;
    readonly guild: Guild;
    readonly rest: REST;
    constructor(guild: Guild);
    createTicketCategory(data: Optional<APITicketCategory>): Promise<APIGuild>;
    deleteTicketCategory(data: Optional<APITicketCategory>): Promise<APIGuild | Guild>;
    fetch(options?: FecthOptions): Promise<GuildTicket | Collection<string, GuildTicket>>;
    create(data: Optional<APIGuildTicket>): Promise<GuildTicket>;
    delete(options?: DeleteOptions): Promise<boolean>;
    set(data: APIGuildTicket | APIGuildTicket[]): GuildTicket | Collection<string, GuildTicket>;
}
export {};
