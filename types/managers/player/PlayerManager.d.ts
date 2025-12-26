import { Collection } from "../../structures";
import { APIPlayer } from "../../types";
export type AddPlayer = APIPlayer[] | APIPlayer;
export declare class PlayerManager {
    _cache: Collection<string, APIPlayer>;
    constructor(players: APIPlayer | APIPlayer[], base_url: string);
    get(id: string): APIPlayer;
    add(player: AddPlayer): void;
}
