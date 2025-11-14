import { REST } from "../../rest/REST";
import { Optional } from "../../types/api";
import { APIVipMember } from "../../types/api/APIVipMember";
import { VipMemberManager } from "../../managers/vipmember/VipMemberManager";
import { Guild } from "../guild/Guild";
export declare class VipMember implements APIVipMember {
    #private;
    /** member's id */
    id: string;
    /** member name */
    name: string;
    /** Members's roleId */
    roleId: string;
    /** Members's voiceChannelId */
    voiceChannelId: string;
    /** Vip's type */
    type: "both" | "role" | "channel";
    /** Member's Guild Id */
    guild_id: string;
    duration: Date;
    status: "on" | "off";
    /** member's daily */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
    /** The given manager */
    readonly manager: VipMemberManager;
    /** The rest client */
    readonly rest: REST;
    readonly guild: Guild;
    /**
     * Bet member
     * @param data  The member's data
     * @param manager The manager
     * @param rest The rest client
     */
    constructor(data: APIVipMember, manager: VipMemberManager);
    /** String representation of this member */
    toString(): string;
    /**
     * Fetches the member
     * @returns New Instance of the member
     */
    fetch(): Promise<VipMember>;
    reset(): Promise<this>;
    /**
     * Update certain property
     * @param data The new data to update with
     * @returns
     */
    update(data: Optional<APIVipMember>): Promise<this>;
    delete(): Promise<boolean>;
    toJSON(): Record<keyof APIVipMember, unknown>;
}
