import { formatUnits } from "viem";

export function shortenAddress(address: `0x${string}`): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(
  value: bigint,
  decimals: number,
  symbol: string,
): string {
  const formatted = Number(formatUnits(value, decimals));

  if (!Number.isFinite(formatted)) {
    return `0.0000 ${symbol}`;
  }

  return `${formatted.toFixed(4)} ${symbol}`;
}
