export interface APIGuildMessage {
  /** Message's type  */
  type: string;

  /** Message's ids */
  ids: string[];

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
}
