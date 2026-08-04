import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "viem/chains";

import { isSupportedChainId } from "./chains";
import type { SupportedChainId } from "./chains";
import type { Erc20Token } from "./token.types";

export type TokenRegistry = Readonly<
  Record<SupportedChainId, readonly Erc20Token[]>
>;

// No contract addresses yet - populated in Stage 5.2 once each address is
// confirmed against an explicit verification source (see Stage 5.1 report).
export const tokenRegistry: TokenRegistry = {
  [mainnet.id]: [],
  [base.id]: [],
  [arbitrum.id]: [],
  [optimism.id]: [],
  [polygon.id]: [],
  [sepolia.id]: [],
};

export function getTokensForChain(chainId: number): readonly Erc20Token[] {
  if (!isSupportedChainId(chainId)) return [];

  return tokenRegistry[chainId];
}

export function getToken(
  chainId: number,
  address: `0x${string}`,
): Erc20Token | undefined {
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
