"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, LogOut } from "lucide-react";

import { WalletChainList } from "./WalletChainList";
import { WalletSession } from "./WalletSession";

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
          <WalletSession
            address={address}
            chainName={chainName}
            balanceLabel={balanceLabel}
          />

          <WalletChainList
            chainId={chainId}
            chains={chains}
            isSwitchChainPending={isSwitchChainPending}
            pendingChainId={pendingChainId}
            switchChainError={switchChainError}
            onSelectChain={onSelectChain}
          />

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
