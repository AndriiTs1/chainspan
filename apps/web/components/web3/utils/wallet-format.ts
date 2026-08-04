import { formatUnits } from "viem";

export function shortenAddress(address: `0x${string}`): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(
  value: bigint,
  decimals: number,
  symbol: string,
): string {
  if (value === BigInt(0)) {
    return `0.0000 ${symbol}`;
  }

  const formatted = Number(formatUnits(value, decimals));

  if (!Number.isFinite(formatted)) {
    return `0.0000 ${symbol}`;
  }

  // A non-zero raw value can still round to "0.0000" at 4dp (e.g. 1 unit of
  // a 6-decimal token) - that reads as indistinguishable from an empty
  // balance, so show a dust indicator instead of a misleading zero.
  if (formatted < 0.0001) {
    return `<0.0001 ${symbol}`;
  }

  return `${formatted.toFixed(4)} ${symbol}`;
}
