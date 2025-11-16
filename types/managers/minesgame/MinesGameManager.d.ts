import { REST } from "../../rest";
import { Collection, MinesGame } from "../../structures";
import { APIMinesGame, Optional } from "../../types";
interface FetchOptions {
    cache?: boolean;
    gameId?: string;
}
export declare class MinesGameManager {
    cache: Collection<string, MinesGame>;
    readonly rest: REST;
    constructor(rest: REST);
    create(data: Optional<APIMinesGame>): Promise<MinesGame>;
    delete(gameId: string): Promise<unknown>;
    fetch(options?: FetchOptions): Promise<MinesGame | Collection<string, MinesGame>>;
    set(data: APIMinesGame | APIMinesGame[]): MinesGame | Collection<string, MinesGame>;
}
export {};
