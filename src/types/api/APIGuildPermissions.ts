export interface Permission {
  type: string;

  ids: string[];
}

export type APIGuildPermissions = Permission[];

export enum GuildPermissionsTypes {
  ManageBot = "manage_bot",
  ManageQueues = "manage_queues",
  ManageUsers = "manage_users",

  ViewQueueChannels = "view_queue_channels",

  MediatorRole = "mediator_role"
}
