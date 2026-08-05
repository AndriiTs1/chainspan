"use client";

import type { Erc20ContractSnapshot } from "@chainspan/web3";

import { formatBalance } from "../utils/wallet-format";

export function TotalSupplyCard({ snapshot }: { snapshot: Erc20ContractSnapshot }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <p className="text-[11px] font-medium tracking-[0.15em] text-zinc-600 uppercase">Total supply</p>

      <p className="mt-2 break-all font-mono text-xl font-semibold text-white tabular-nums">
        {formatBalance(snapshot.totalSupply, snapshot.onChainDecimals, snapshot.token.symbol)}
      </p>

      <p className="mt-1.5 text-xs text-zinc-500">Contract-reported total supply.</p>
    </div>
  );
}
