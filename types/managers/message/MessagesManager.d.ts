import { REST } from "../../rest";
import { Collection } from "../../structures/Collection";
import { APIMessage, Optional } from "../../types";
type T<e> = e & {
    rest: REST;
    messages: MessagesManager<e>;
};
export declare class MessagesManager<Structure> {
    cache: Collection<string, APIMessage>;
    readonly base_url: string;
    readonly rest: REST;
    constructor(structure: T<Structure>, base_url: string);
    fetch(): Promise<APIMessage>;
    create(data: Optional<APIMessage> | Optional<APIMessage>[]): Promise<APIMessage[]>;
    setAll(data: APIMessage | APIMessage[]): Collection<string, APIMessage>;
}
export {};
