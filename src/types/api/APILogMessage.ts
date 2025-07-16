export interface APILogMessage {
  /** Message's content */
  content: string | object;

  /** Message's creator id */
  userId: string;

  /** Message's type */
  type: "text" | "img" | ".png" | ".gif" | ".jpg";
}