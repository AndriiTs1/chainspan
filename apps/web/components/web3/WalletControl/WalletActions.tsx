import { Check, Copy, ExternalLink, LogOut, PenLine } from "lucide-react";

type WalletActionsProps = {
  address: `0x${string}`;
  explorerUrl?: string;
  isCopied: boolean;
  onCopyAddress: () => void;
  onDisconnect: () => void;
  onSignMessage: () => void;
};

export function WalletActions({
  address,
  explorerUrl,
  isCopied,
  onCopyAddress,
  onDisconnect,
  onSignMessage,
}: WalletActionsProps) {
  return (
    <>
      <button
        type="button"
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
        onClick={onSignMessage}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
      >
        <PenLine className="size-4 text-blue-300" />
        Sign message
      </button>

      <button
        type="button"
        onClick={onDisconnect}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-red-300/80 transition hover:bg-red-400/8 hover:text-red-200"
      >
        <LogOut className="size-4" />
        Disconnect
      </button>
    </>
  );
}
