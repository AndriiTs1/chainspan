import { describe, expect, it } from "vitest";

import {
  getSupportedChain,
  isSupportedChainId,
  supportedChains,
} from "./chains";

describe("isSupportedChainId", () => {
  it("returns true for every supported chain id", () => {
    for (const chain of supportedChains) {
      expect(isSupportedChainId(chain.id)).toBe(true);
    }
  });

  it("returns false for an unsupported chain id", () => {
    expect(isSupportedChainId(999999)).toBe(false);
  });
});

describe("getSupportedChain", () => {
  it("returns the matching chain for every supported chain id", () => {
    for (const chain of supportedChains) {
      expect(getSupportedChain(chain.id)).toEqual(chain);
    }
  });

  it("returns undefined for an unsupported chain id", () => {
    expect(getSupportedChain(999999)).toBeUndefined();
  });
});
