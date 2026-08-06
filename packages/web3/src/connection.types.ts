export type ConnectionErrorCategory = "user_rejection" | "unknown";

export type ConnectionError = {
  category: ConnectionErrorCategory;
  cause?: Error;
};
