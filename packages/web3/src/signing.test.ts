import { describe, expect, it } from "vitest";

import { supportedChains } from "./chains";
import {
  buildSigningMessage,
  buildVerificationResult,
  classifySigningError,
  isSigningRequestExpired,
} from "./signing";

const BASE_PARAMS = {
  appName: "ChainSpan",
  domain: "chainspan.vercel.app",
  address: "0x0000000000000000000000000000000000dEaD",
  chainId: supportedChains[0].id,
  nonce: "test-nonce-123",
  issuedAt: "2026-01-01T00:00:00.000Z",
  expiresAt: "2026-01-01T00:05:00.000Z",
} as const;

describe("buildSigningMessage", () => {
  it("includes every required section with the given values", () => {
    const request = buildSigningMessage(BASE_PARAMS);

    expect(request.message).toContain("ChainSpan Message Verification");
    expect(request.message).toContain("Purpose:");
    expect(request.message).toContain("Verify ownership of this wallet.");
    expect(request.message).toContain("Application:\nChainSpan");
    expect(request.message).toContain("Domain:\nchainspan.vercel.app");
    expect(request.message).toContain(`Wallet:\n${BASE_PARAMS.address}`);
    expect(request.message).toContain(`Nonce:\n${BASE_PARAMS.nonce}`);
    expect(request.message).toContain(`Issued At:\n${BASE_PARAMS.issuedAt}`);
    expect(request.message).toContain(
      `Expires At:\n${BASE_PARAMS.expiresAt}`,
    );
    expect(request.message).toContain(
      "This request will not submit a blockchain transaction and will not cost any gas.",
    );
    expect(request.message).toContain(
      "Only sign this message if you trust this application.",
    );
  });

  it("does not hardcode a domain or app name anywhere - both come from params", () => {
    const request = buildSigningMessage({
      ...BASE_PARAMS,
      appName: "SomeOtherApp",
      domain: "example.test",
    });

    expect(request.message).toContain("SomeOtherApp Message Verification");
    expect(request.message).toContain("Domain:\nexample.test");
    expect(request.message).not.toContain("ChainSpan");
    expect(request.message).not.toContain("chainspan.vercel.app");
  });

  it("resolves a human-readable network label with the chain id for every supported chain", () => {
    for (const chain of supportedChains) {
      const request = buildSigningMessage({ ...BASE_PARAMS, chainId: chain.id });

      expect(request.message).toContain(
        `Network:\n${chain.name} (Chain ID: ${chain.id})`,
      );
    }
  });

  it("copies address/chainId/nonce/issuedAt/expiresAt onto the returned request", () => {
    const request = buildSigningMessage(BASE_PARAMS);

    expect(request.address).toBe(BASE_PARAMS.address);
    expect(request.chainId).toBe(BASE_PARAMS.chainId);
    expect(request.nonce).toBe(BASE_PARAMS.nonce);
    expect(request.issuedAt).toBe(BASE_PARAMS.issuedAt);
    expect(request.expiresAt).toBe(BASE_PARAMS.expiresAt);
  });
});

describe("isSigningRequestExpired", () => {
  const request = buildSigningMessage(BASE_PARAMS);

  it("returns false before the expiry timestamp", () => {
    expect(isSigningRequestExpired(request, new Date("2026-01-01T00:04:59.000Z"))).toBe(
      false,
    );
  });

  it("returns true exactly at the expiry timestamp", () => {
    expect(isSigningRequestExpired(request, new Date("2026-01-01T00:05:00.000Z"))).toBe(
      true,
    );
  });

  it("returns true after the expiry timestamp", () => {
    expect(isSigningRequestExpired(request, new Date("2026-01-01T00:06:00.000Z"))).toBe(
      true,
    );
  });
});

describe("buildVerificationResult", () => {
  const requestAddress = "0x0000000000000000000000000000000000dEaD" as const;
  const requestChainId = supportedChains[0].id;

  it("reports no drift when account and chain are unchanged", () => {
    const result = buildVerificationResult({
      isValid: true,
      requestAddress,
      currentAddress: requestAddress,
      requestChainId,
      currentChainId: requestChainId,
    });

    expect(result).toEqual({
      isValid: true,
      accountChangedSinceSigning: false,
      chainChangedSinceSigning: false,
    });
  });

  it("flags an account change with a case-insensitive comparison", () => {
    const result = buildVerificationResult({
      isValid: true,
      requestAddress,
      currentAddress: requestAddress.toUpperCase() as `0x${string}`,
      requestChainId,
      currentChainId: requestChainId,
    });

    expect(result.accountChangedSinceSigning).toBe(false);
  });

  it("flags a real account change", () => {
    const result = buildVerificationResult({
      isValid: true,
      requestAddress,
      currentAddress: "0x1111111111111111111111111111111111111111",
      requestChainId,
      currentChainId: requestChainId,
    });

    expect(result.accountChangedSinceSigning).toBe(true);
  });

  it("flags a chain change", () => {
    const otherChain = supportedChains.find((chain) => chain.id !== requestChainId);
    expect(otherChain).toBeDefined();
    if (!otherChain) return;

    const result = buildVerificationResult({
      isValid: true,
      requestAddress,
      currentAddress: requestAddress,
      requestChainId,
      currentChainId: otherChain.id,
    });

    expect(result.chainChangedSinceSigning).toBe(true);
  });

  it("treats a disconnected wallet (undefined address/chain) as changed", () => {
    const result = buildVerificationResult({
      isValid: true,
      requestAddress,
      currentAddress: undefined,
      requestChainId,
      currentChainId: undefined,
    });

    expect(result.accountChangedSinceSigning).toBe(true);
    expect(result.chainChangedSinceSigning).toBe(true);
  });

  it("passes through an invalid signature result unchanged", () => {
    const result = buildVerificationResult({
      isValid: false,
      requestAddress,
      currentAddress: requestAddress,
      requestChainId,
      currentChainId: requestChainId,
    });

    expect(result.isValid).toBe(false);
  });
});

describe("classifySigningError", () => {
  it("classifies UserRejectedRequestError by name as user_rejection", () => {
    const error = new Error("Something happened");
    error.name = "UserRejectedRequestError";

    const classified = classifySigningError(error);

    expect(classified.category).toBe("user_rejection");
    expect(classified.cause).toBe(error);
  });

  it.each([
    "User rejected the request",
    "user rejected the request.",
    "User denied message signature",
    "Request rejected by the user",
  ])("classifies %j by message as user_rejection", (message) => {
    const classified = classifySigningError(new Error(message));

    expect(classified.category).toBe("user_rejection");
  });

  it("classifies an unrelated Error as unknown, keeping the cause", () => {
    const error = new Error("Network timeout");

    const classified = classifySigningError(error);

    expect(classified.category).toBe("unknown");
    expect(classified.cause).toBe(error);
  });

  it("classifies a non-Error thrown value as unknown with no cause", () => {
    expect(classifySigningError("oops")).toEqual({ category: "unknown" });
    expect(classifySigningError(undefined)).toEqual({ category: "unknown" });
    expect(classifySigningError(null)).toEqual({ category: "unknown" });
  });
});
