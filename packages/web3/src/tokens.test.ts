import { describe, expect, it } from "vitest";

import { supportedChains } from "./chains";
import type { Erc20Token } from "./token.types";
import { getNativeToken, isNativeToken } from "./tokens";

describe("getNativeToken", () => {
  for (const chain of supportedChains) {
    it(`derives the native token for ${chain.name} (chainId ${chain.id})`, () => {
      expect(getNativeToken(chain.id)).toEqual({
        type: "native",
        chainId: chain.id,
        name: chain.nativeCurrency.name,
        symbol: chain.nativeCurrency.symbol,
        decimals: chain.nativeCurrency.decimals,
      });
    });
  }

  it("returns undefined for an unsupported chain id", () => {
    expect(getNativeToken(999999)).toBeUndefined();
  });
});

describe("isNativeToken", () => {
  it("returns true for a native token", () => {
    const nativeToken = getNativeToken(supportedChains[0].id);

    expect(nativeToken).toBeDefined();
    expect(nativeToken && isNativeToken(nativeToken)).toBe(true);
  });

  it("returns false for an erc20 token", () => {
    const erc20Token: Erc20Token = {
      type: "erc20",
      chainId: supportedChains[0].id,
      address: "0x0000000000000000000000000000000000dEaD",
      name: "Mock Token",
      symbol: "MOCK",
      decimals: 18,
    };

    expect(isNativeToken(erc20Token)).toBe(false);
  });
});
