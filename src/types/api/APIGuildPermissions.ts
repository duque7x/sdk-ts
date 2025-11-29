export interface Permission {
  type: string;

  ids: string[];
}

export type APIGuildPermissions = Permission[];

export enum GuildPermissionsTypes {
  ManageBot = "manage_bot",
}
