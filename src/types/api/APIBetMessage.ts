export interface APIBetMessage {
  /** Message's type  */
  type: string;

  /** Message's id */
  id: string[];

  /** Creation Date */
  createdAt: Date;

  /** Updated Date */
  updatedAt: Date;
}
