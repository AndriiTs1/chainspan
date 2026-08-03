"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, LogOut } from "lucide-react";

type WalletChain = {
  id: number;
  name: string;
};

type WalletDropdownProps = {
  address: `0x${string}`;
  balanceLabel: string;
  chainId: number;
  chainName: string;
  chains: readonly WalletChain[];
  explorerUrl?: string;
  isCopied: boolean;
  isOpen: boolean;
  isSwitchChainPending: boolean;
  pendingChainId?: number;
  switchChainError?: Error | null;
  onCopyAddress: () => void;
  onDisconnect: () => void;
  onSelectChain: (chainId: number) => void;
};

export function WalletDropdown({
  address,
  balanceLabel,
  chainId,
  chainName,
  chains,
  explorerUrl,
  isCopied,
  isOpen,
  isSwitchChainPending,
  pendingChainId,
  switchChainError,
  onCopyAddress,
  onDisconnect,
  onSelectChain,
}: WalletDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          role="menu"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 z-50 mt-2 w-62.5 overflow-hidden rounded-xl border border-blue-300/10 bg-[#070b14]/96 p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
        >
          <div className="px-3 py-2.5">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Wallet session
            </p>

            <p className="mt-1.5 truncate font-mono text-[11px] text-zinc-300">
              {address}
            </p>

            <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>{chainName}</span>
            </div>

            <p className="mt-1 text-[11px] text-zinc-400">
              {balanceLabel}
            </p>
          </div>

          <div className="my-1 h-px bg-white/6" />

          <div className="px-1 py-1">
            <p className="px-2 pb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Network
            </p>

            <div className="space-y-0.5">
              {chains.map((availableChain) => {
                const isActive = availableChain.id === chainId;
                const isPending =
                  isSwitchChainPending &&
                  pendingChainId === availableChain.id;

                return (
                  <button
                    key={availableChain.id}
                    type="button"
                    role="menuitem"
                    onClick={() => onSelectChain(availableChain.id)}
                    disabled={isActive || isSwitchChainPending}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:cursor-default disabled:opacity-70"
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "size-2 rounded-full",
                        isActive
                          ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.7)]"
                          : "bg-zinc-700",
                      ].join(" ")}
                    />

                    <span className="min-w-0 flex-1 truncate">
                      {availableChain.name}
                    </span>

                    <span className="text-[10px] text-zinc-600">
                      {isPending ? "Switching..." : isActive ? "Active" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {switchChainError ? (
            <p className="mx-3 mb-2 rounded-lg border border-red-400/10 bg-red-400/5 px-2.5 py-2 text-[10px] leading-4 text-red-300">
              {switchChainError.message}
            </p>
          ) : null}

          <div className="my-1 h-px bg-white/6" />

          <button
            type="button"
            role="menuitem"
            onClick={onCopyAddress}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            {isCopied ? (
              <Check className="size-4 text-emerald-300" />
            ) : (
              <Copy className="size-4 text-blue-300" />
            )}

            {isCopied ? "Address copied" : "Copy address"}
          </button>

          {explorerUrl ? (
            <a
              role="menuitem"
              href={`${explorerUrl}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <ExternalLink className="size-4 text-blue-300" />
              View on explorer
            </a>
          ) : null}

          <button
            type="button"
            role="menuitem"
            onClick={onDisconnect}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-red-300/80 transition hover:bg-red-400/8 hover:text-red-200"
          >
            <LogOut className="size-4" />
            Disconnect
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
