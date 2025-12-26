export interface APIMessage {
  _id?: string;

  author_id?: string;

  extension?: string;

  /** Message's content */
  content?: string | object;

  /** Creation Date */
  createdAt?: Date;

  /** Updated Date */
  updatedAt?: Date;
}
