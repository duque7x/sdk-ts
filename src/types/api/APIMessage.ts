export interface APIMessage {
  /** Message's content */
  content?: string | object;

  _id?: string;
  id?: string;
  /** Message's type */
  type: string;

  /** Creation Date */
  createdAt?: Date;

  /** Updated Date */
  updatedAt?: Date;
}
