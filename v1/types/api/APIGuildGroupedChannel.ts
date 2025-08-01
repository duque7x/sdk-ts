export interface APIGuildGroupedChannel {
  /** Channel's type */
  type: string;

  /** Channel's ids */
  ids: string[];

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
}
