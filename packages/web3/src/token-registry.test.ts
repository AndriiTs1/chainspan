import { describe, expect, it } from "vitest";

import { supportedChains } from "./chains";
import {
  getToken,
  getTokensForChain,
  hasRegisteredToken,
} from "./token-registry";

const DUMMY_ADDRESS = "0x0000000000000000000000000000000000dEaD" as const;

describe("getTokensForChain", () => {
  // Registry is intentionally empty until Stage 5.2 confirms real contract
  // addresses - these assertions document that starting state and should be
  // updated once real tokens are registered.
  it("returns an (currently empty) array for every supported chain", () => {
    for (const chain of supportedChains) {
      expect(getTokensForChain(chain.id)).toEqual([]);
    }
  });

  it("returns an empty array for an unsupported chain id", () => {
    expect(getTokensForChain(999999)).toEqual([]);
  });
});

describe("getToken", () => {
  it("returns undefined on every supported chain (registry not yet populated)", () => {
    for (const chain of supportedChains) {
      expect(getToken(chain.id, DUMMY_ADDRESS)).toBeUndefined();
    }
  });

  it("returns undefined for an unsupported chain id", () => {
    expect(getToken(999999, DUMMY_ADDRESS)).toBeUndefined();
  });
});

describe("hasRegisteredToken", () => {
  it("returns false on every supported chain (registry not yet populated)", () => {
    for (const chain of supportedChains) {
      expect(hasRegisteredToken(chain.id, DUMMY_ADDRESS)).toBe(false);
    }
  });

  it("returns false for an unsupported chain id", () => {
    expect(hasRegisteredToken(999999, DUMMY_ADDRESS)).toBe(false);
  });
});
