import { describe, expect, it } from "vitest";

import { classifyConnectionError } from "./connection";

describe("classifyConnectionError", () => {
  it("classifies UserRejectedRequestError by name as user_rejection", () => {
    const error = new Error("something went wrong");
    error.name = "UserRejectedRequestError";

    const result = classifyConnectionError(error);

    expect(result.category).toBe("user_rejection");
    expect(result.cause).toBe(error);
  });

  it.each([
    "User rejected the request",
    "User denied transaction signature",
    "Connection request rejected",
    "Connection request reset",
    "Connection request expired",
  ])("classifies %j as user_rejection", (message) => {
    const result = classifyConnectionError(new Error(message));

    expect(result.category).toBe("user_rejection");
  });

  it("classifies an unrelated error as unknown", () => {
    const result = classifyConnectionError(new Error("network timeout"));

    expect(result.category).toBe("unknown");
  });

  it("classifies a non-Error value as unknown with no cause", () => {
    const result = classifyConnectionError("not an error");

    expect(result.category).toBe("unknown");
    expect(result.cause).toBeUndefined();
  });
});
