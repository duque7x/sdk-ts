export declare enum LogEntryTypes {
    QueueCreated = "queue_created",
    QueueShut = "queue_shut",
    MatchStarted = "match_started",
    MatchUpdated = "match_updated",
    MatchClosed = "match_closed",
    UserUpdated = "user_updated",
    UserManaged = "user_managed"
}
export interface APILogEntry {
    _id: string;
    guild_id: string;
    user_id: string;
    admin_id: string;
    object_id: string;
    type: LogEntryTypes;
    description: string;
    change: string;
    logs_channel_id: string;
    before: any;
    after: any;
    createdAt: Date;
    updatedAt: Date;
}
