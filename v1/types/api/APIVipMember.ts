export interface APIVipMember {
  /** Members's name */
  name: string;

  /** Members's id */
  id: string;

  /** Members's roleId */
  roleId: string;

  /** Members's voiceChannelId */
  voiceChannelId: string;

  /** Vip's type */
  type: string;

  /** Member's Guild Id */
  guild_id: string;

  /** User's daily */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
}
