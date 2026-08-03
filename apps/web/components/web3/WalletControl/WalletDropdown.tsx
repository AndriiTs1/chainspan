"use client";

import { AnimatePresence, motion } from "framer-motion";

import { WalletActions } from "./WalletActions";
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

          <WalletActions
            address={address}
            explorerUrl={explorerUrl}
            isCopied={isCopied}
            onCopyAddress={onCopyAddress}
            onDisconnect={onDisconnect}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
