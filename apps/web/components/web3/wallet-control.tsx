"use client";

import { getSupportedChain } from "@chainspan/web3";
import { useEffect, useId, useRef, useState } from "react";

import { getFocusableElements, useDismissableLayer } from "@/hooks/use-dismissable-layer";
import { useMessageSigning } from "@/hooks/use-message-signing";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useWallet } from "@/hooks/use-wallet";

import { ConnectWalletButton } from "./connect-wallet-button";
import { MessageSigningDialog } from "./signing/MessageSigningDialog";
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

  const portfolio = usePortfolio();
  const signing = useMessageSigning();

  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSigningDialogOpen, setIsSigningDialogOpen] = useState(false);

  function closeDropdown() {
    setIsOpen(false);
  }

  useDismissableLayer({
    isOpen,
    onDismiss: closeDropdown,
    containerRef: dropdownRef,
    triggerRef,
  });

  useEffect(() => {
    if (!isOpen) return;

    function handleArrowKeys(event: KeyboardEvent) {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      const focusable = getFocusableElements(dropdownRef.current);
      if (focusable.length === 0) return;

      event.preventDefault();

      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement,
      );
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (currentIndex + delta + focusable.length) % focusable.length;

      focusable[nextIndex]?.focus();
    }

    document.addEventListener("keydown", handleArrowKeys);

    return () => {
      document.removeEventListener("keydown", handleArrowKeys);
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
    setIsSigningDialogOpen(false);
    signing.reset();
    disconnect();
  }

  function selectChain(nextChainId: number) {
    if (nextChainId === chainId || isSwitchChainPending) return;

    switchChain({
      chainId: nextChainId,
    });
  }

  function openSigningDialog() {
    // Closing the dropdown first keeps at most one focus-trapped layer
    // active at a time (the dropdown itself doesn't trap focus, but closing
    // it avoids stacking it under the modal).
    setIsOpen(false);

    if (signing.status !== "idle") {
      signing.reset();
    }

    setIsSigningDialogOpen(true);
  }

  function closeSigningDialog() {
    setIsSigningDialogOpen(false);
  }

  return (
    <div className="relative">
      <WalletTrigger
        ref={triggerRef}
        addressLabel={shortenAddress(address)}
        balanceLabel={balanceLabel}
        chainName={chainName}
        isOpen={isOpen}
        menuId={menuId}
        onClick={() => setIsOpen((current) => !current)}
      />

      <WalletDropdown
        ref={dropdownRef}
        id={menuId}
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
        portfolio={portfolio}
        switchChainError={switchChainError}
        onCopyAddress={copyAddress}
        onDisconnect={disconnectWallet}
        onSelectChain={selectChain}
        onSignMessage={openSigningDialog}
      />

      <MessageSigningDialog
        isOpen={isSigningDialogOpen}
        onClose={closeSigningDialog}
        triggerRef={triggerRef}
        signing={signing}
        address={address}
        chainId={chainId}
        chainName={chainName}
      />
    </div>
  );
}
