export interface APIVipMember {
    /** Members's name */
    name: string;
    /** Members's id */
    id: string;
    /** Members's roleId */
    roleId: string;
    duration: Date;
    status: "on" | "off";
    /** Members's voiceChannelId */
    voiceChannelId: string;
    /** Vip's type */
    type: "both" | "role" | "channel";
    /** Member's Guild Id */
    guild_id: string;
    /** User's daily */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
}
