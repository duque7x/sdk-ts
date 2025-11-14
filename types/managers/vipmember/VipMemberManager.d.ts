import { VipMember } from "../../structures/vipmember/VipMember";
import { Collection } from "../../structures/Collection";
import { Guild } from "../../structures/guild/Guild";
import { APIVipMember } from "../../types/api/APIVipMember";
import { Optional } from "../../types";
import { BaseManager } from "../base";
type FecthOptions = {
    cache?: boolean;
    memberId?: string;
};
export declare class VipMemberManager extends BaseManager<VipMember> {
    /**
     * Manage vipmembers with the given client
     * @param vipmembers An array of vipmembers
     * @param rest The rest client
     */
    constructor(guild: Guild);
    create(data: Optional<APIVipMember>): Promise<VipMember>;
    /**
     * Fetch a member
     * @param id Id of the member to fetch
     * @returns VipMember
     */
    fetch(options?: FecthOptions): Promise<Collection<string, VipMember> | VipMember>;
    updateMember(id: string, data: Optional<APIVipMember>): Promise<VipMember>;
    set(data: APIVipMember): VipMember;
    setAll(data: APIVipMember[]): Collection<string, VipMember>;
    resetAll(): Promise<Collection<string, VipMember>>;
    delete(id: string): Promise<Collection<string, VipMember>>;
    deleteAll(): Promise<boolean>;
}
export {};
