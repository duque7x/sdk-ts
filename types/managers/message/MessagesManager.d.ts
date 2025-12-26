import { REST } from "../../rest";
import { Guild } from "../../structures";
import { Collection } from "../../structures/Collection";
import { APIMessage, Optional } from "../../types";
type T<e> = e & {
    rest: REST;
    guild: Guild;
    messages: MessagesManager<e>;
};
export declare class MessagesManager<Structure> {
    cache: Collection<string, APIMessage>;
    readonly base_url: string;
    readonly rest: REST;
    readonly guild: Guild;
    constructor(structure: T<Structure>, base_url: string);
    fetch(): Promise<APIMessage>;
    create(data: Optional<APIMessage> | Optional<APIMessage>[]): Promise<Collection<string, APIMessage>>;
    set(data: APIMessage | APIMessage[]): Collection<string, APIMessage>;
}
export {};
