import { describe, expect, it } from "vitest";

import { supportedChains } from "./chains";
import { buildPortfolio } from "./portfolio";
import type { TokenBalanceInput } from "./portfolio";
import { getTokensForChain } from "./token-registry";
import { getNativeToken } from "./tokens";

const ADDRESS = "0x0000000000000000000000000000000000dEaD" as const;

describe("buildPortfolio", () => {
  it("returns an empty portfolio and no failures for empty input", () => {
    const chain = supportedChains[0];
    const { portfolio, failedAssets } = buildPortfolio(ADDRESS, chain.id, []);

    expect(portfolio).toEqual({
      address: ADDRESS,
      chainId: chain.id,
      assets: [],
    });
    expect(failedAssets).toEqual([]);
  });

  it("collects every successful read into assets, preserving the raw bigint value", () => {
    const chain = supportedChains[0];
    const nativeToken = getNativeToken(chain.id);
    expect(nativeToken).toBeDefined();
    if (!nativeToken) return;

    const [erc20Token] = getTokensForChain(chain.id);
    expect(erc20Token).toBeDefined();
    if (!erc20Token) return;

    const balances: TokenBalanceInput[] = [
      { token: nativeToken, result: { status: "success", value: 1_000n } },
      {
        token: erc20Token,
        result: { status: "success", value: 2_000_000n },
      },
    ];

    const { portfolio, failedAssets } = buildPortfolio(
      ADDRESS,
      chain.id,
      balances,
    );

    expect(failedAssets).toEqual([]);
    expect(portfolio.assets).toEqual([
      { token: nativeToken, value: 1_000n },
      { token: erc20Token, value: 2_000_000n },
    ]);
  });

  it("routes a failed read into failedAssets without adding it to assets", () => {
    const chain = supportedChains[0];
    const nativeToken = getNativeToken(chain.id);
    expect(nativeToken).toBeDefined();
    if (!nativeToken) return;

    const error = new Error("RPC unavailable");
    const { portfolio, failedAssets } = buildPortfolio(ADDRESS, chain.id, [
      { token: nativeToken, result: { status: "failure", error } },
    ]);

    expect(portfolio.assets).toEqual([]);
    expect(failedAssets).toEqual([{ token: nativeToken, error }]);
  });

  it("keeps successful assets even when another read in the same batch fails", () => {
    const chain = supportedChains[0];
    const nativeToken = getNativeToken(chain.id);
    expect(nativeToken).toBeDefined();
    if (!nativeToken) return;

    const [erc20Token] = getTokensForChain(chain.id);
    expect(erc20Token).toBeDefined();
    if (!erc20Token) return;

    const error = new Error("balanceOf reverted");
    const { portfolio, failedAssets } = buildPortfolio(ADDRESS, chain.id, [
      { token: nativeToken, result: { status: "success", value: 500n } },
      { token: erc20Token, result: { status: "failure", error } },
    ]);

    expect(portfolio.assets).toEqual([{ token: nativeToken, value: 500n }]);
    expect(failedAssets).toEqual([{ token: erc20Token, error }]);
  });

  it("preserves the given address and chainId on the resulting portfolio", () => {
    const chain = supportedChains[1];
    const { portfolio } = buildPortfolio(ADDRESS, chain.id, []);

    expect(portfolio.address).toBe(ADDRESS);
    expect(portfolio.chainId).toBe(chain.id);
  });
});
