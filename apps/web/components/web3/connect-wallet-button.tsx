"use client";

import { Wallet } from "lucide-react";

import { useWallet } from "@/hooks/use-wallet";

export function ConnectWalletButton() {
  const { connectors, connect, connectError, isConnected, isConnectPending } =
    useWallet();

  if (isConnected) return null;

  const metaMaskConnector =
    connectors.find((connector) =>
      connector.name.toLowerCase().includes("metamask"),
    ) ??
    connectors.find((connector) =>
      connector.id.toLowerCase().includes("metamask"),
    ) ??
    connectors[0];

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => {
          if (!metaMaskConnector) return;

          connect({
            connector: metaMaskConnector,
          });
        }}
        disabled={!metaMaskConnector || isConnectPending}
        className="group flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-5 text-sm font-medium shadow-[0_0_32px_rgba(59,130,246,0.35)] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Wallet className="size-4" />

        {isConnectPending ? "Connecting..." : "Connect Wallet"}
      </button>

      {connectError ? (
        <p className="max-w-64 text-right text-xs text-red-300">
          {connectError.message}
        </p>
      ) : null}
    </div>
  );
}
