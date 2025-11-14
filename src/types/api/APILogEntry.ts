export interface APILogEntry {
  _id: string;

  guild_id: string;
  type: string;
  user_id: string;
  description: string;

  createdAt: Date;
  updatedAt: Date;
}
