"use client";

import type { Erc20ContractSnapshot, Erc20FieldComparison } from "@chainspan/web3";
import { AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

const toneIconClassName: Record<"good" | "caution" | "neutral", string> = {
  good: "text-emerald-400",
  caution: "text-amber-400",
  neutral: "text-zinc-500",
};

function toneForComparison(comparison: Erc20FieldComparison): "good" | "caution" | "neutral" {
  if (comparison === "mismatch") return "caution";
  if (comparison === "unavailable") return "neutral";
  return "good";
}

function ComparisonIcon({ comparison }: { comparison: Erc20FieldComparison }) {
  const tone = toneForComparison(comparison);
  const Icon =
    comparison === "mismatch" ? AlertTriangle : comparison === "unavailable" ? HelpCircle : CheckCircle2;

  return <Icon className={["size-3.5 shrink-0", toneIconClassName[tone]].join(" ")} aria-hidden="true" />;
}

type FieldRowProps = {
  label: string;
  value: string;
  comparison?: Erc20FieldComparison;
};

function FieldRow({ label, value, comparison }: FieldRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <dt className="flex items-center gap-1.5 text-zinc-500">
        {comparison ? <ComparisonIcon comparison={comparison} /> : null}
        {label}
      </dt>

      <dd className="min-w-0 flex-1 truncate text-right text-zinc-200">{value}</dd>
    </div>
  );
}

function Column({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-3.5">
      <p className="text-[11px] font-medium tracking-[0.1em] text-zinc-500 uppercase">
        {title}
        <span className="ml-1.5 font-normal tracking-normal text-zinc-700 normal-case">{hint}</span>
      </p>

      <dl className="mt-2 divide-y divide-white/5 text-xs">{children}</dl>
    </div>
  );
}

export function MetadataComparison({ snapshot }: { snapshot: Erc20ContractSnapshot }) {
  const hasMismatch = Object.values(snapshot.metadataComparison).includes("mismatch");

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Column title="Curated" hint="· source of truth">
          <FieldRow label="Name" value={snapshot.token.name} />
          <FieldRow label="Symbol" value={snapshot.token.symbol} />
          <FieldRow label="Decimals" value={String(snapshot.token.decimals)} />
        </Column>

        <Column title="On-chain" hint="· diagnostic only">
          <FieldRow
            label="Name"
            value={snapshot.onChainName ?? "Unavailable"}
            comparison={snapshot.metadataComparison.name}
          />
          <FieldRow
            label="Symbol"
            value={snapshot.onChainSymbol ?? "Unavailable"}
            comparison={snapshot.metadataComparison.symbol}
          />
          <FieldRow
            label="Decimals"
            value={String(snapshot.onChainDecimals)}
            comparison={snapshot.metadataComparison.decimals}
          />
        </Column>
      </div>

      {hasMismatch ? (
        <p
          role="status"
          className="rounded-lg border border-amber-400/20 bg-amber-400/8 px-3 py-2.5 text-xs leading-5 text-amber-200"
        >
          On-chain metadata differs from the curated registry entry for this token.
        </p>
      ) : null}
    </div>
  );
}
