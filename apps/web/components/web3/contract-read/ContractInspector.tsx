"use client";

import { getSupportedChain, getTokensForChain, supportedChains } from "@chainspan/web3";
import type { ContractReadFailure } from "@chainspan/web3";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "viem/chains";

import { useErc20ContractRead } from "@/hooks/use-erc20-contract-read";
import { Card } from "@/components/ui/card";
import { Selector } from "@/components/ui/selector";
import type { SelectorOption } from "@/components/ui/selector";

import { MetadataComparison } from "./MetadataComparison";
import { TokenSummary } from "./TokenSummary";
import { TotalSupplyCard } from "./TotalSupplyCard";

const CHAIN_BADGE_LABEL: Record<number, string> = {
  [mainnet.id]: "ETH",
  [base.id]: "BASE",
  [arbitrum.id]: "ARB",
  [optimism.id]: "OP",
  [polygon.id]: "POLY",
  [sepolia.id]: "SEP",
};

function ChainBadge({ chainId }: { chainId: number }) {
  return (
    <span className="flex h-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-1.5 text-[9px] font-semibold tracking-wide text-zinc-300">
      {CHAIN_BADGE_LABEL[chainId] ?? "?"}
    </span>
  );
}

function LiveRpcBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
      <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
      Live RPC
    </span>
  );
}

function contractReadFailureMessage(failure: ContractReadFailure): string {
  switch (failure.category) {
    case "unsupported_chain":
      return "This network isn't supported.";
    case "token_not_registered":
      return "This token isn't in the curated registry.";
    case "rpc_error":
      return "Unable to read this contract right now. Try again in a moment.";
    case "unknown":
    default:
      return "Something went wrong while reading this contract.";
  }
}

export function ContractInspector() {
  const [openSelector, setOpenSelector] = useState<"chain" | "token" | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number>(mainnet.id);
  const [selectedAddress, setSelectedAddress] = useState<`0x${string}` | undefined>(
    () => getTokensForChain(mainnet.id)[0]?.address,
  );

  const tokensForChain = getTokensForChain(selectedChainId);
  const chainName = getSupportedChain(selectedChainId)?.name ?? `Chain ${selectedChainId}`;
  const result = useErc20ContractRead(selectedChainId, selectedAddress);

  function handleChainChange(value: string) {
    const nextChainId = Number(value);
    const nextTokens = getTokensForChain(nextChainId);

    setSelectedChainId(nextChainId);
    setSelectedAddress(nextTokens[0]?.address);
  }

  function handleTokenChange(value: string) {
    setSelectedAddress(value as `0x${string}`);
  }

  const chainOptions: SelectorOption<string>[] = supportedChains.map((chain) => ({
    value: String(chain.id),
    label: (
      <>
        <ChainBadge chainId={chain.id} />
        <span>{chain.name}</span>
      </>
    ),
  }));

  const tokenOptions: SelectorOption<string>[] = tokensForChain.map((token) => ({
    value: token.address,
    label: (
      <>
        <span className="font-medium text-white">{token.symbol}</span>
        <span className="text-zinc-500">— {token.name}</span>
      </>
    ),
    description: token.issuer,
  }));

  return (
    <section id="contract-inspector" className="pb-8">
      <div className="mb-6 max-w-2xl text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <p className="text-xs font-medium tracking-[0.3em] text-blue-200/75 uppercase">
            Contract Inspector
          </p>

          <LiveRpcBadge />
        </div>

        <h2 className="mt-2 text-xl font-semibold text-white sm:text-3xl">
          Inspect verified ERC-20 contracts with live on-chain data
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Read contract metadata and total supply directly through public RPC, then compare it with
          ChainSpan&apos;s curated registry.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contract-inspector-chain" className="text-xs font-medium text-zinc-500">
              Network
            </label>

            <div className="mt-1.5">
              <Selector
                id="contract-inspector-chain"
                label="Network"
                options={chainOptions}
                value={String(selectedChainId)}
                onChange={handleChainChange}
                isOpen={openSelector === "chain"}
                onOpenChange={(isOpen) => setOpenSelector(isOpen ? "chain" : null)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contract-inspector-token" className="text-xs font-medium text-zinc-500">
              Token
            </label>

            <div className="mt-1.5">
              {tokensForChain.length > 0 ? (
                <Selector
                  id="contract-inspector-token"
                  label="Token"
                  options={tokenOptions}
                  value={selectedAddress}
                  onChange={handleTokenChange}
                  isOpen={openSelector === "token"}
                  onOpenChange={(isOpen) => setOpenSelector(isOpen ? "token" : null)}
                />
              ) : (
                <p
                  role="status"
                  className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-zinc-500"
                >
                  No curated tokens are registered on {chainName} yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {result.status === "loading" ? (
            <p
              role="status"
              className="flex items-center justify-center gap-2 px-1 py-8 text-sm text-zinc-400"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Reading contract...
            </p>
          ) : null}

          {result.status === "success" ? (
            <>
              <TokenSummary snapshot={result.snapshot} />
              <MetadataComparison snapshot={result.snapshot} />
              <TotalSupplyCard snapshot={result.snapshot} />
            </>
          ) : null}

          {result.status === "error" ? (
            <p
              role="alert"
              className="rounded-lg border border-red-400/10 bg-red-400/6 px-3 py-2.5 text-xs leading-5 text-red-300"
            >
              {contractReadFailureMessage(result.failure)}
            </p>
          ) : null}

          {result.status === "unsupported_chain" ? (
            <p className="px-1 py-2 text-sm text-zinc-500">This network isn&apos;t supported.</p>
          ) : null}

          {result.status === "token_not_registered" ? (
            <p className="px-1 py-2 text-sm text-zinc-500">
              This token isn&apos;t in the curated registry.
            </p>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
