"use client";

import { getSupportedChain } from "@chainspan/web3";
import type { Erc20ContractSnapshot } from "@chainspan/web3";
import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function TokenSummary({ snapshot }: { snapshot: Erc20ContractSnapshot }) {
  const [isCopied, setIsCopied] = useState(false);
  const chain = getSupportedChain(snapshot.chainId);
  const explorerUrl = chain?.blockExplorers?.default.url;

  async function copyAddress() {
    await navigator.clipboard.writeText(snapshot.address);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-white">{snapshot.token.symbol}</p>

          {snapshot.token.verification === "verified" ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <ShieldCheck className="size-3" aria-hidden="true" />
              Verified
            </span>
          ) : null}
        </div>

        {explorerUrl ? (
          <a
            href={`${explorerUrl}/address/${snapshot.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-blue-300/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            View on explorer
          </a>
        ) : null}
      </div>

      <p className="mt-1 text-xs text-zinc-500">
        {snapshot.token.name} · {snapshot.token.issuer}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="min-w-0 flex-1 break-all font-mono text-xs text-zinc-400">{snapshot.address}</p>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={copyAddress}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
          >
            {isCopied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            Copy
          </button>

          <span role="status" aria-live="polite" className="text-xs text-emerald-300">
            {isCopied ? "Address copied" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
