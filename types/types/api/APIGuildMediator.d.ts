import { APIPlayer } from "./APIPlayer";
export interface APIGuildMediator extends APIPlayer {
    /** Mediator's id */
    id: string;
    /** Mediator's name */
    name: string;
    /** Mediator's links */
    paymentLinks: string[];
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
}
