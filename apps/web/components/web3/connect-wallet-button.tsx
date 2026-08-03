"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe2, Smartphone, Wallet, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useWallet } from "@/hooks/use-wallet";

const triggerButtonClassName = [
  "group flex h-11 items-center gap-2 rounded-xl",
  "bg-linear-to-r from-blue-600 to-violet-600 px-5",
  "text-sm font-medium text-white",
  "shadow-[0_0_32px_rgba(59,130,246,0.35)]",
  "transition duration-200 hover:scale-[1.03]",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-blue-400/70",
].join(" ");

const walletOptionClassName = [
  "group flex w-full items-center gap-3 rounded-xl",
  "border border-white/10 bg-white/3 p-3 text-left",
  "transition duration-200",
  "disabled:cursor-wait disabled:opacity-60",
].join(" ");

const modalPanelClassName = [
  "w-full max-w-sm overflow-hidden rounded-2xl",
  "border border-blue-300/15 bg-[#070b14]/95",
  "shadow-[0_30px_100px_rgba(0,0,0,0.65)]",
  "backdrop-blur-2xl",
].join(" ");

const connectionErrorMessage =
  "Connection failed. Check your wallet or internet connection and try again.";

function isUserCancellation(error: Error): boolean {
  const message = error.message.toLowerCase();

  return (
    error.name === "UserRejectedRequestError" ||
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("request rejected") ||
    message.includes("connection request reset") ||
    message.includes("connection request expired")
  );
}

export function ConnectWalletButton() {
  const {
    connectors,
    connect,
    isConnected,
    isConnectPending,
  } = useWallet();

  const modalRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        modalRef.current &&
        !modalRef.current.contains(target)
      ) {
        setIsOpen(false);
        setConnectionError(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setConnectionError(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (isConnected) {
    return null;
  }

  const walletConnectConnector = connectors.find((connector) => {
    const id = connector.id.toLowerCase();
    const name = connector.name.toLowerCase();

    return id.includes("walletconnect") || name.includes("walletconnect");
  });

  const browserWalletConnector = connectors.find((connector) => {
    const id = connector.id.toLowerCase();
    const name = connector.name.toLowerCase();

    return (
      id.includes("metamask") ||
      id.includes("rabby") ||
      id.includes("coinbase") ||
      name.includes("metamask") ||
      name.includes("rabby") ||
      name.includes("coinbase")
    );
  });

  function openDialog() {
    setConnectionError(null);
    setPendingConnectorId(null);
    setIsOpen(true);
  }

  function closeDialog() {
    if (isConnectPending) return;

    setIsOpen(false);
    setConnectionError(null);
    setPendingConnectorId(null);
  }

  function connectWallet(
    connector: (typeof connectors)[number] | undefined,
  ) {
    if (!connector || isConnectPending) return;

    setConnectionError(null);
    setPendingConnectorId(connector.id);

    connect(
      { connector },
      {
        onSuccess: () => {
          setConnectionError(null);
          setPendingConnectorId(null);
          setIsOpen(false);
        },
        onError: (error) => {
          setPendingConnectorId(null);

          if (isUserCancellation(error)) {
            setConnectionError(null);
            return;
          }

          setConnectionError(connectionErrorMessage);

          console.warn("Wallet connection failed", {
            connectorId: connector.id,
            connectorName: connector.name,
            errorName: error.name,
            errorMessage: error.message,
            errorCause:
              error.cause instanceof Error
                ? {
                    name: error.cause.name,
                    message: error.cause.message,
                  }
                : String(error.cause ?? ""),
          });
        },
      },
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={triggerButtonClassName}
      >
        <Wallet className="size-4" />
        Connect Wallet
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="wallet-dialog-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={modalPanelClassName}
            >
              <div className="flex items-start justify-between border-b border-white/7 px-5 py-4">
                <div>
                  <h2
                    id="wallet-dialog-title"
                    className="text-base font-semibold text-white"
                  >
                    Connect wallet
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Choose how you want to connect to ChainSpan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isConnectPending}
                  aria-label="Close wallet connection dialog"
                  className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/6 hover:text-white disabled:cursor-wait disabled:opacity-50"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-2 p-3">
                {browserWalletConnector ? (
                  <button
                    type="button"
                    onClick={() => connectWallet(browserWalletConnector)}
                    disabled={isConnectPending}
                    className={[
                      walletOptionClassName,
                      "hover:border-blue-300/20 hover:bg-blue-400/6",
                    ].join(" ")}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10">
                      <Globe2 className="size-5 text-blue-300" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white">
                        Browser wallet
                      </span>

                      <span className="mt-0.5 block text-[11px] text-zinc-500">
                        MetaMask, Rabby or Coinbase Wallet
                      </span>
                    </span>

                    {pendingConnectorId === browserWalletConnector.id ? (
                      <span className="text-[10px] text-blue-200">
                        Connecting...
                      </span>
                    ) : null}
                  </button>
                ) : null}

                {walletConnectConnector ? (
                  <button
                    type="button"
                    onClick={() => connectWallet(walletConnectConnector)}
                    disabled={isConnectPending}
                    className={[
                      walletOptionClassName,
                      "hover:border-violet-300/20 hover:bg-violet-400/6",
                    ].join(" ")}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10">
                      <Smartphone className="size-5 text-violet-300" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white">
                        WalletConnect
                      </span>

                      <span className="mt-0.5 block text-[11px] text-zinc-500">
                        Connect a mobile wallet or scan a QR code
                      </span>
                    </span>

                    {pendingConnectorId === walletConnectConnector.id ? (
                      <span className="text-[10px] text-violet-200">
                        Connecting...
                      </span>
                    ) : null}
                  </button>
                ) : null}

                {!browserWalletConnector && !walletConnectConnector ? (
                  <p className="rounded-xl border border-white/10 bg-white/3 px-3 py-3 text-xs leading-5 text-zinc-400">
                    No compatible wallet connector is available.
                  </p>
                ) : null}

                {isConnectPending ? (
                  <p className="px-2 py-1 text-center text-xs text-blue-200">
                    Waiting for wallet confirmation...
                  </p>
                ) : null}

                {connectionError ? (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-400/10 bg-red-400/6 px-3 py-2.5 text-xs leading-5 text-red-300"
                  >
                    {connectionError}
                  </p>
                ) : null}
              </div>

              <p className="border-t border-white/6 px-5 py-3 text-center text-[10px] leading-4 text-zinc-600">
                ChainSpan never receives or stores your private keys.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
