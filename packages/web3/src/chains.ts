import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";

export const supportedChains = [
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
  sepolia,
] as const;

export type SupportedChain = (typeof supportedChains)[number];
export type SupportedChainId = SupportedChain["id"];

export const defaultChain = sepolia;

export function isSupportedChainId(
  chainId: number,
): chainId is SupportedChainId {
  return supportedChains.some((chain) => chain.id === chainId);
}

export function getSupportedChain(
  chainId: number,
): SupportedChain | undefined {
  return supportedChains.find((chain) => chain.id === chainId);
}
