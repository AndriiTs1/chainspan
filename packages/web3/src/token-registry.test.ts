import { describe, expect, it } from "vitest";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "viem/chains";

import { supportedChains } from "./chains";
import {
  getToken,
  getTokensForChain,
  hasRegisteredToken,
} from "./token-registry";

const DUMMY_ADDRESS = "0x0000000000000000000000000000000000dEaD" as const;

// Bridged/legacy addresses that must never appear in the curated registry -
// found during Stage 5.2 research, deliberately excluded (see Stage 5.2
// report for verification sources).
const EXCLUDED_BRIDGED_ADDRESSES = [
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC.e on Polygon
  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC.e on Arbitrum
  "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // USDC.e on Optimism
  "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // USDbC on Base
] as const;

const allEntries = supportedChains.flatMap((chain) =>
  getTokensForChain(chain.id),
);

describe("tokenRegistry contents", () => {
  it("contains exactly six curated entries", () => {
    expect(allEntries).toHaveLength(6);
  });

  it("distributes entries across chains as approved", () => {
    expect(getTokensForChain(mainnet.id)).toHaveLength(2);
    expect(getTokensForChain(base.id)).toHaveLength(1);
    expect(getTokensForChain(arbitrum.id)).toHaveLength(1);
    expect(getTokensForChain(optimism.id)).toHaveLength(1);
    expect(getTokensForChain(polygon.id)).toHaveLength(1);
    expect(getTokensForChain(sepolia.id)).toHaveLength(0);
  });

  it("has no duplicate chainId + address pairs", () => {
    const keys = allEntries.map(
      (token) => `${token.chainId}:${token.address.toLowerCase()}`,
    );

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("marks every entry as verified, default-visible erc20 with 6 decimals", () => {
    for (const token of allEntries) {
      expect(token.type).toBe("erc20");
      expect(token.decimals).toBe(6);
      expect(token.verification).toBe("verified");
      expect(token.visibility).toBe("default");
      expect(token.issuer.length).toBeGreaterThan(0);
    }
  });

  it("does not include Polygon USDT", () => {
    const polygonSymbols = getTokensForChain(polygon.id).map(
      (token) => token.symbol,
    );

    expect(polygonSymbols).not.toContain("USDT");
  });

  it("does not include any known bridged token (USDC.e / USDbC)", () => {
    for (const chain of supportedChains) {
      for (const bridgedAddress of EXCLUDED_BRIDGED_ADDRESSES) {
        expect(getToken(chain.id, bridgedAddress)).toBeUndefined();
      }
    }
  });
});

describe("getTokensForChain", () => {
  it("returns an empty array for Sepolia", () => {
    expect(getTokensForChain(sepolia.id)).toEqual([]);
  });

  it("returns an empty array for an unsupported chain id", () => {
    expect(getTokensForChain(999999)).toEqual([]);
  });
});

describe("getToken", () => {
  it("finds a registered token regardless of address casing", () => {
    const lowercase = getToken(
      mainnet.id,
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    );
    const uppercase = getToken(
      mainnet.id,
      "0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48",
    );

    expect(lowercase?.symbol).toBe("USDC");
    expect(uppercase?.symbol).toBe("USDC");
  });

  it("returns undefined for an unregistered address on a supported chain", () => {
    expect(getToken(mainnet.id, DUMMY_ADDRESS)).toBeUndefined();
  });

  it("returns undefined for any address on Sepolia (registry intentionally empty)", () => {
    expect(getToken(sepolia.id, DUMMY_ADDRESS)).toBeUndefined();
  });

  it("returns undefined for an unsupported chain id", () => {
    expect(getToken(999999, DUMMY_ADDRESS)).toBeUndefined();
  });
});

describe("hasRegisteredToken", () => {
  it("returns true for a registered token", () => {
    expect(
      hasRegisteredToken(
        mainnet.id,
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      ),
    ).toBe(true);
  });

  it("returns false for Sepolia (registry intentionally empty)", () => {
    expect(hasRegisteredToken(sepolia.id, DUMMY_ADDRESS)).toBe(false);
  });

  it("returns false for an unsupported chain id", () => {
    expect(hasRegisteredToken(999999, DUMMY_ADDRESS)).toBe(false);
  });
});
