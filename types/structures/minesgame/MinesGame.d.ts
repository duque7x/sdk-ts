import { MinesGameManager } from "../../managers/minesgame/MinesGameManager";
import { REST } from "../../rest";
import { APIMinesGame, Optional } from "../../types";
export declare class MinesGame {
    guild_id: string;
    _id: string;
    creatorId: string;
    maxMines: number;
    bombs: number;
    bombsPosition: number[];
    bet: number;
    multiplier: number;
    status: "created" | "won" | "lost" | "expired";
    createdAt: Date;
    updatedAt: Date;
    readonly rest: REST;
    readonly manager: MinesGameManager;
    constructor(data: APIMinesGame, manager: MinesGameManager);
    fetch(): Promise<this>;
    delete(): Promise<this>;
    update(data: Optional<APIMinesGame>): Promise<this>;
    _updateInternals(data: Optional<APIMinesGame>): this;
}
