export interface APIPlayer {
    /** The player's id */
    id: string;
    /** The player's name */
    name?: string;
    /** When player was created */
    createdAt?: Date;
    /** Last time player was updated */
    updateAt?: Date;
}
