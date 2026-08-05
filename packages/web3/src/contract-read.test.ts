import { describe, expect, it } from "vitest";
import { mainnet } from "viem/chains";

import { buildErc20ContractSnapshot } from "./contract-read";
import type { ContractFieldRead } from "./contract-read";
import type { RegisteredErc20Token } from "./token-registry";

const CURATED_TOKEN: RegisteredErc20Token = {
  type: "erc20",
  chainId: mainnet.id,
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  issuer: "Circle",
  verification: "verified",
  visibility: "default",
};

const success = <T>(value: T): ContractFieldRead<T> => ({ status: "success", value });
const failure = <T>(message = "boom"): ContractFieldRead<T> => ({
  status: "failure",
  error: new Error(message),
});

const FULL_MATCH_PARAMS = {
  token: CURATED_TOKEN,
  name: success("USD Coin"),
  symbol: success("USDC"),
  decimals: success(6),
  totalSupply: success(123_456_789_000n),
};

describe("buildErc20ContractSnapshot", () => {
  it("returns a success snapshot when everything matches the curated registry", () => {
    const result = buildErc20ContractSnapshot(FULL_MATCH_PARAMS);

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(result.snapshot.chainId).toBe(mainnet.id);
    expect(result.snapshot.address).toBe(CURATED_TOKEN.address);
    expect(result.snapshot.token).toBe(CURATED_TOKEN);
    expect(result.snapshot.onChainName).toBe("USD Coin");
    expect(result.snapshot.onChainSymbol).toBe("USDC");
    expect(result.snapshot.onChainDecimals).toBe(6);
    expect(result.snapshot.totalSupply).toBe(123_456_789_000n);
    expect(result.snapshot.metadataComparison).toEqual({
      name: "match",
      symbol: "match",
      decimals: "match",
    });
  });

  it("keeps totalSupply as a bigint without numeric conversion", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      totalSupply: success(999_999_999_999_999_999_999n),
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(typeof result.snapshot.totalSupply).toBe("bigint");
    expect(result.snapshot.totalSupply).toBe(999_999_999_999_999_999_999n);
  });

  it("flags an on-chain name mismatch without affecting other fields", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      name: success("Not USD Coin"),
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(result.snapshot.metadataComparison.name).toBe("mismatch");
    expect(result.snapshot.metadataComparison.symbol).toBe("match");
    expect(result.snapshot.metadataComparison.decimals).toBe("match");
  });

  it("flags an on-chain symbol mismatch", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      symbol: success("FAKE"),
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(result.snapshot.metadataComparison.symbol).toBe("mismatch");
  });

  it("flags an on-chain decimals mismatch", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      decimals: success(18),
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(result.snapshot.onChainDecimals).toBe(18);
    expect(result.snapshot.metadataComparison.decimals).toBe("mismatch");
  });

  it("treats a failed name() read as unavailable, not a mismatch, and still succeeds", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      name: failure("name() reverted"),
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(result.snapshot.onChainName).toBeNull();
    expect(result.snapshot.metadataComparison.name).toBe("unavailable");
  });

  it("treats a failed symbol() read as unavailable and still succeeds", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      symbol: failure("symbol() reverted"),
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(result.snapshot.onChainSymbol).toBeNull();
    expect(result.snapshot.metadataComparison.symbol).toBe("unavailable");
  });

  it("fails the whole read when decimals() fails, even if totalSupply() succeeded", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      decimals: failure("decimals() reverted"),
    });

    expect(result).toEqual({
      status: "failure",
      failure: { category: "rpc_error", cause: expect.any(Error) },
    });
  });

  it("fails the whole read when totalSupply() fails, even if decimals() succeeded", () => {
    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      totalSupply: failure("totalSupply() reverted"),
    });

    expect(result).toEqual({
      status: "failure",
      failure: { category: "rpc_error", cause: expect.any(Error) },
    });
  });

  it("preserves the token's chainId and address on the snapshot unchanged", () => {
    const otherToken: RegisteredErc20Token = {
      ...CURATED_TOKEN,
      chainId: 8453,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    };

    const result = buildErc20ContractSnapshot({
      ...FULL_MATCH_PARAMS,
      token: otherToken,
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;

    expect(result.snapshot.chainId).toBe(8453);
    expect(result.snapshot.address).toBe("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
  });
});
