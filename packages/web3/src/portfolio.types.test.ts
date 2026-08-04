import { describe, expect, it } from "vitest";

import { supportedChains } from "./chains";
import { getNativeToken } from "./tokens";
import type { AssetBalance, Portfolio } from "./portfolio.types";

describe("AssetBalance", () => {
  it("holds only a token and a raw bigint value", () => {
    const nativeToken = getNativeToken(supportedChains[0].id);
    expect(nativeToken).toBeDefined();
    if (!nativeToken) return;

    const assetBalance: AssetBalance = {
      token: nativeToken,
      value: 1_000_000_000_000_000_000n,
    };

    expect(assetBalance.token).toBe(nativeToken);
    expect(assetBalance.value).toBe(1_000_000_000_000_000_000n);
    expect(Object.keys(assetBalance).sort()).toEqual(["token", "value"]);
  });
});

describe("Portfolio", () => {
  it("groups assets under a single address and chain with no extra fields", () => {
    const chain = supportedChains[0];
    const nativeToken = getNativeToken(chain.id);
    expect(nativeToken).toBeDefined();
    if (!nativeToken) return;

    const portfolio: Portfolio = {
      address: "0x0000000000000000000000000000000000dEaD",
      chainId: chain.id,
      assets: [{ token: nativeToken, value: 0n }],
    };

    expect(portfolio.chainId).toBe(chain.id);
    expect(portfolio.assets).toHaveLength(1);
    expect(Object.keys(portfolio).sort()).toEqual([
      "address",
      "assets",
      "chainId",
    ]);
  });
});
