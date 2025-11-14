import { REST } from "../../rest";
import { Guild, GuildTicket } from "../../structures";
import { Collection } from "../../structures/Collection";
import { APIGuildTicket, Optional } from "../../types";
type FecthOptions = {
    ticketId?: string;
    cache?: boolean;
};
type DeleteOptions = {
    ticketId?: string;
};
export declare class TicketManager {
    cache: Collection<string, GuildTicket>;
    readonly guild: Guild;
    readonly rest: REST;
    constructor(guild: Guild);
    fetch(options?: FecthOptions): Promise<GuildTicket | Collection<string, GuildTicket>>;
    create(data: Optional<APIGuildTicket>): Promise<GuildTicket>;
    delete(options?: DeleteOptions): Promise<boolean>;
    set(data: APIGuildTicket | APIGuildTicket[]): GuildTicket | Collection<string, GuildTicket>;
}
export {};
