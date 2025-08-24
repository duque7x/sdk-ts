export interface APIMessage {
  /** Message's content */
  content: string | object;

  /** Message's creator id */
  userId: string;

  /** Message's type */
  type: "text" | "img" | ".png" | ".gif" | ".jpg";

  /** Creation Date */
  createdAt?: Date;

  /** Updated Date */
  updatedAt?: Date;
}