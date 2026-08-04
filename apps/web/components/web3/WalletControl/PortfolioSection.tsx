import type { AssetBalance, Erc20Token, PortfolioAssetFailure } from "@chainspan/web3";
import type { ReactNode } from "react";

import type { UsePortfolioResult } from "@/hooks/use-portfolio";

import { formatBalance } from "../utils/wallet-format";

type PortfolioSectionProps = {
  result: UsePortfolioResult;
};

const statusTextClassName = "px-2 py-2 text-[11px] leading-4 text-zinc-500";

function isErc20Asset(
  asset: AssetBalance,
): asset is AssetBalance & { token: Erc20Token } {
  return asset.token.type === "erc20";
}

function isErc20Failure(
  failure: PortfolioAssetFailure,
): failure is PortfolioAssetFailure & { token: Erc20Token } {
  return failure.token.type === "erc20";
}

export function PortfolioSection({ result }: PortfolioSectionProps) {
  if (result.status === "disconnected") {
    return null;
  }

  return (
    <>
      <div className="px-1 py-1">
        <p className="px-2 pb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
          Tokens
        </p>

        {renderBody(result)}
      </div>

      <div className="my-1 h-px bg-white/6" />
    </>
  );
}

function renderBody(
  result: Exclude<UsePortfolioResult, { status: "disconnected" }>,
) {
  if (result.status === "unsupported") {
    return (
      <p role="status" className={statusTextClassName}>
        Portfolio isn&apos;t available on this network.
      </p>
    );
  }

  if (result.status === "loading") {
    return (
      <p role="status" className={statusTextClassName}>
        Loading tokens...
      </p>
    );
  }

  if (result.status === "error") {
    return (
      <p
        role="alert"
        className="mx-1 rounded-lg border border-red-400/10 bg-red-400/5 px-2.5 py-2 text-[11px] leading-4 text-red-300"
      >
        Unable to load token balances.
      </p>
    );
  }

  const assets = result.portfolio.assets.filter(isErc20Asset);
  const failures = result.failedAssets.filter(isErc20Failure);

  if (assets.length === 0 && failures.length === 0) {
    return <p className={statusTextClassName}>No tokens to show.</p>;
  }

  return (
    <div className="max-h-48 space-y-0.5 overflow-y-auto">
      {assets.map(({ token, value }) => (
        <TokenRow
          key={token.address}
          token={token}
          right={
            <span
              aria-label={formatBalance(value, token.decimals, token.symbol)}
              className="shrink-0 text-right"
            >
              <span
                aria-hidden="true"
                className="block text-[13px] font-medium tabular-nums text-white"
              >
                {formatBalance(value, token.decimals, "")}
              </span>
              <span aria-hidden="true" className="block text-[10px] text-zinc-500">
                {token.symbol}
              </span>
            </span>
          }
        />
      ))}

      {failures.map(({ token }) => (
        <TokenRow
          key={token.address}
          token={token}
          right={
            <span className="shrink-0 text-right text-[11px] text-zinc-500">
              Unavailable
            </span>
          }
        />
      ))}
    </div>
  );
}

function TokenRow({ token, right }: { token: Erc20Token; right: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2.5 rounded-lg px-2 py-2">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-white">
          {token.symbol}
        </span>
        <span className="block truncate text-[10px] text-zinc-500">
          {token.name}
        </span>
      </span>

      {right}
    </div>
  );
}
