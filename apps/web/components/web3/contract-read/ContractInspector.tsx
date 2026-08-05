"use client";

import { getSupportedChain, getTokensForChain, supportedChains } from "@chainspan/web3";
import type {
  ContractReadFailure,
  Erc20ContractSnapshot,
  Erc20FieldComparison,
} from "@chainspan/web3";
import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";
import { mainnet } from "viem/chains";

import { useErc20ContractRead } from "@/hooks/use-erc20-contract-read";
import { Card } from "@/components/ui/card";

import { formatBalance } from "../utils/wallet-format";

const selectClassName =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-sm text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70";

const fieldLabelClassName = "text-xs font-medium text-zinc-500";

const toneTextClassName: Record<"good" | "caution" | "neutral", string> = {
  good: "text-emerald-300",
  caution: "text-amber-300",
  neutral: "text-zinc-500",
};

function toneForComparison(comparison: Erc20FieldComparison): "good" | "caution" | "neutral" {
  if (comparison === "mismatch") return "caution";
  if (comparison === "unavailable") return "neutral";
  return "good";
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

type MetadataRowProps = {
  label: string;
  value: string;
  tone?: "good" | "caution" | "neutral";
};

function MetadataRow({ label, value, tone }: MetadataRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-zinc-500">{label}</dt>
      <dd
        className={[
          "min-w-0 flex-1 text-right break-all",
          tone ? toneTextClassName[tone] : "text-zinc-200",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function MetadataColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-600">{title}</p>
      <dl className="mt-2.5 space-y-2 text-xs">{children}</dl>
    </div>
  );
}

function SnapshotView({ snapshot }: { snapshot: Erc20ContractSnapshot }) {
  const chain = getSupportedChain(snapshot.chainId);
  const explorerUrl = chain?.blockExplorers?.default.url;
  const hasMismatch = Object.values(snapshot.metadataComparison).some((value) => value === "mismatch");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{snapshot.token.symbol}</p>
          <p className="text-xs text-zinc-500">
            {snapshot.token.name} · {snapshot.token.issuer}
          </p>
        </div>

        {explorerUrl ? (
          <a
            href={`${explorerUrl}/address/${snapshot.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md text-xs text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
          >
            View on explorer
          </a>
        ) : null}
      </div>

      <p className="break-all font-mono text-[11px] text-zinc-500">{snapshot.address}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetadataColumn title="Curated (trusted)">
          <MetadataRow label="Name" value={snapshot.token.name} />
          <MetadataRow label="Symbol" value={snapshot.token.symbol} />
          <MetadataRow label="Decimals" value={String(snapshot.token.decimals)} />
        </MetadataColumn>

        <MetadataColumn title="On-chain (contract-reported)">
          <MetadataRow
            label="Name"
            value={snapshot.onChainName ?? "Unavailable"}
            tone={toneForComparison(snapshot.metadataComparison.name)}
          />
          <MetadataRow
            label="Symbol"
            value={snapshot.onChainSymbol ?? "Unavailable"}
            tone={toneForComparison(snapshot.metadataComparison.symbol)}
          />
          <MetadataRow
            label="Decimals"
            value={String(snapshot.onChainDecimals)}
            tone={toneForComparison(snapshot.metadataComparison.decimals)}
          />
        </MetadataColumn>
      </div>

      {hasMismatch ? (
        <p
          role="status"
          className="rounded-lg border border-amber-400/20 bg-amber-400/8 px-3 py-2.5 text-xs leading-5 text-amber-200"
        >
          On-chain metadata differs from the curated registry entry for this token.
        </p>
      ) : null}

      <div className="rounded-xl border border-white/8 bg-white/3 p-3">
        <p className="text-[11px] text-zinc-500">Total supply</p>
        <p className="mt-1 break-all font-mono text-base text-white">
          {formatBalance(snapshot.totalSupply, snapshot.onChainDecimals, snapshot.token.symbol)}
        </p>
      </div>
    </div>
  );
}

export function ContractInspector() {
  const [selectedChainId, setSelectedChainId] = useState<number>(mainnet.id);
  const [selectedAddress, setSelectedAddress] = useState<`0x${string}` | undefined>(
    () => getTokensForChain(mainnet.id)[0]?.address,
  );

  const tokensForChain = getTokensForChain(selectedChainId);
  const chainName = getSupportedChain(selectedChainId)?.name ?? `Chain ${selectedChainId}`;

  const result = useErc20ContractRead(selectedChainId, selectedAddress);

  function handleChainChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextChainId = Number(event.target.value);
    const nextTokens = getTokensForChain(nextChainId);

    setSelectedChainId(nextChainId);
    setSelectedAddress(nextTokens[0]?.address);
  }

  function handleTokenChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedAddress(event.target.value as `0x${string}`);
  }

  return (
    <section id="contract-inspector" className="pb-8">
      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-200/75">
          Contract Inspector
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          Read a curated ERC-20 contract directly
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Data below is read live from the selected contract over public RPC - no wallet
          connection required. Only tokens already verified in ChainSpan&apos;s curated registry
          can be inspected here.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contract-inspector-chain" className={fieldLabelClassName}>
              Network
            </label>

            <select
              id="contract-inspector-chain"
              value={selectedChainId}
              onChange={handleChainChange}
              className={selectClassName}
            >
              {supportedChains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contract-inspector-token" className={fieldLabelClassName}>
              Token
            </label>

            {tokensForChain.length > 0 ? (
              <select
                id="contract-inspector-token"
                value={selectedAddress}
                onChange={handleTokenChange}
                className={selectClassName}
              >
                {tokensForChain.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} — {token.name}
                  </option>
                ))}
              </select>
            ) : (
              <p
                role="status"
                className="mt-1.5 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-sm text-zinc-500"
              >
                No curated tokens are registered on {chainName} yet.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          {result.status === "loading" ? (
            <p role="status" className="px-1 py-6 text-center text-sm text-zinc-400">
              Reading contract...
            </p>
          ) : null}

          {result.status === "success" ? <SnapshotView snapshot={result.snapshot} /> : null}

          {result.status === "error" ? (
            <p
              role="alert"
              className="rounded-lg border border-red-400/10 bg-red-400/6 px-3 py-2.5 text-xs leading-5 text-red-300"
            >
              {contractReadFailureMessage(result.failure)}
            </p>
          ) : null}

          {result.status === "unsupported_chain" || result.status === "token_not_registered" ? (
            <p className="px-1 py-2 text-sm text-zinc-500">
              {contractReadFailureMessage(
                result.status === "unsupported_chain"
                  ? { category: "unsupported_chain" }
                  : { category: "token_not_registered" },
              )}
            </p>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
