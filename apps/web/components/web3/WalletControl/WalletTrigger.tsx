"use client";

import { ChevronDown } from "lucide-react";

type WalletTriggerProps = {
  addressLabel: string;
  balanceLabel: string;
  chainName: string;
  isOpen: boolean;
  onClick: () => void;
};

export function WalletTrigger({
  addressLabel,
  balanceLabel,
  chainName,
  isOpen,
  onClick,
}: WalletTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className="group flex min-w-51.25 items-center gap-3 rounded-xl border border-blue-300/15 bg-[#070b14]/80 px-3 py-2 text-left shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:border-blue-300/30 hover:bg-[#0a101d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-white">
          {addressLabel}
        </span>

        <span className="mt-0.5 block truncate text-[10px] text-zinc-500">
          {chainName} · {balanceLabel}
        </span>
      </span>

      <ChevronDown
        className={[
          "size-3.5 shrink-0 text-zinc-600 transition duration-200",
          isOpen
            ? "rotate-180 text-zinc-300"
            : "group-hover:text-zinc-300",
        ].join(" ")}
      />
    </button>
  );
}
