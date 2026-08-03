"use client";

import { getSupportedChain } from "@chainspan/web3";
import { useEffect, useRef, useState } from "react";

import { useWallet } from "@/hooks/use-wallet";

import { ConnectWalletButton } from "./connect-wallet-button";
import { formatBalance, shortenAddress } from "./utils/wallet-format";
import { WalletDropdown } from "./WalletControl/WalletDropdown";
import { WalletTrigger } from "./WalletControl/WalletTrigger";

export function WalletControl() {
  const {
    address,
    balance,
    chainId,
    chains,
    disconnect,
    isBalanceLoading,
    isConnected,
    isSwitchChainPending,
    pendingChainId,
    switchChain,
    switchChainError,
  } = useWallet();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isConnected || !address) {
    return <ConnectWalletButton />;
  }

  const chain = getSupportedChain(chainId);
  const chainName = chain?.name ?? `Chain ${chainId}`;
  const explorerUrl = chain?.blockExplorers?.default.url;

  const balanceLabel = isBalanceLoading
    ? "Loading..."
    : balance
      ? formatBalance(balance.value, balance.decimals, balance.symbol)
      : "Balance unavailable";

  async function copyAddress() {
    const currentAddress = address;

    if (!currentAddress) return;

    await navigator.clipboard.writeText(currentAddress);
    setIsCopied(true);

    window.setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }

  function disconnectWallet() {
    setIsOpen(false);
    disconnect();
  }

  function selectChain(nextChainId: number) {
    if (nextChainId === chainId || isSwitchChainPending) return;

    switchChain({
      chainId: nextChainId,
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <WalletTrigger
        addressLabel={shortenAddress(address)}
        balanceLabel={balanceLabel}
        chainName={chainName}
        isOpen={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      />

      <WalletDropdown
        address={address}
        balanceLabel={balanceLabel}
        chainId={chainId}
        chainName={chainName}
        chains={chains}
        explorerUrl={explorerUrl}
        isCopied={isCopied}
        isOpen={isOpen}
        isSwitchChainPending={isSwitchChainPending}
        pendingChainId={pendingChainId}
        switchChainError={switchChainError}
        onCopyAddress={copyAddress}
        onDisconnect={disconnectWallet}
        onSelectChain={selectChain}
      />
    </div>
  );
}
