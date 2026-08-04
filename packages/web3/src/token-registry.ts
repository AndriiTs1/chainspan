import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "viem/chains";

import { isSupportedChainId } from "./chains";
import type { SupportedChainId } from "./chains";
import type { Erc20Token } from "./token.types";

export type TokenVerificationStatus = "verified" | "unverified";

export type TokenVisibility = "default" | "hidden";

export type RegisteredErc20Token = Erc20Token & {
  issuer: string;
  verification: TokenVerificationStatus;
  visibility: TokenVisibility;
  logo?: string;
};

export type TokenRegistry = Readonly<
  Record<SupportedChainId, readonly RegisteredErc20Token[]>
>;

// Curated, human-reviewed list of officially issued ERC-20 tokens per chain.
// Every address below was cross-verified against the issuer's own official
// source plus that chain's block explorer before being approved (Stage 5.2
// research). Bridged variants (USDC.e, USDbC) and unresolved tokens
// (Polygon USDT - no confirmed Tether-official address at time of writing)
// are intentionally excluded, not just omitted by oversight.
export const tokenRegistry: TokenRegistry = {
  [mainnet.id]: [
    {
      type: "erc20",
      chainId: mainnet.id,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      issuer: "Circle",
      verification: "verified",
      visibility: "default",
    },
    {
      type: "erc20",
      chainId: mainnet.id,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      issuer: "Tether",
      verification: "verified",
      visibility: "default",
    },
  ],
  [base.id]: [
    {
      type: "erc20",
      chainId: base.id,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      issuer: "Circle",
      verification: "verified",
      visibility: "default",
    },
  ],
  [arbitrum.id]: [
    {
      type: "erc20",
      chainId: arbitrum.id,
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      issuer: "Circle",
      verification: "verified",
      visibility: "default",
    },
  ],
  [optimism.id]: [
    {
      type: "erc20",
      chainId: optimism.id,
      address: "0x0b2C639c533813f4aA9D7837CAf62653d097Ff85",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      issuer: "Circle",
      verification: "verified",
      visibility: "default",
    },
  ],
  [polygon.id]: [
    {
      type: "erc20",
      chainId: polygon.id,
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      issuer: "Circle",
      verification: "verified",
      visibility: "default",
    },
  ],
  [sepolia.id]: [],
};

export function getTokensForChain(
  chainId: number,
): readonly RegisteredErc20Token[] {
  if (!isSupportedChainId(chainId)) return [];

  return tokenRegistry[chainId];
}

export function getToken(
  chainId: number,
  address: `0x${string}`,
): RegisteredErc20Token | undefined {
  const normalizedAddress = address.toLowerCase();

  return getTokensForChain(chainId).find(
    (token) => token.address.toLowerCase() === normalizedAddress,
  );
}

export function hasRegisteredToken(
  chainId: number,
  address: `0x${string}`,
): boolean {
  return getToken(chainId, address) !== undefined;
}
