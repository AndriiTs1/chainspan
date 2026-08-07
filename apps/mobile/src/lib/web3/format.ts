import { formatUnits } from 'viem';

// Mirrors apps/web/components/web3/utils/wallet-format.ts's formatBalance
// behavior (same zero/dust/precision handling), minus the `symbol` param -
// mobile UI renders the symbol as a separate Text node next to the number,
// same split apps/web/components/web3/WalletControl/PortfolioSection.tsx
// already uses internally.
export function formatBalance(value: bigint, decimals: number): string {
  if (value === BigInt(0)) {
    return '0.0000';
  }

  // formatUnits keeps this bigint-safe - only the resulting decimal string
  // is converted to Number, never the raw bigint itself.
  const formatted = Number(formatUnits(value, decimals));

  if (!Number.isFinite(formatted)) {
    return '0.0000';
  }

  // A non-zero raw value can still round to "0.0000" at 4dp (e.g. 1 unit of
  // a 6-decimal token) - that reads as indistinguishable from an empty
  // balance, so show a dust indicator instead of a misleading zero.
  if (formatted < 0.0001) {
    return '<0.0001';
  }

  // toFixed always returns fixed-point notation (never scientific) and
  // caps the fraction at 4 digits.
  return formatted.toFixed(4);
}

export function shortenAddress(address: `0x${string}`): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
