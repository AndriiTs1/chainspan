import type { WalletChain } from "../shared/types";

type WalletChainListProps = {
  chainId: number;
  chains: readonly WalletChain[];
  isSwitchChainPending: boolean;
  pendingChainId?: number;
  switchChainError?: Error | null;
  onSelectChain: (chainId: number) => void;
};

export function WalletChainList({
  chainId,
  chains,
  isSwitchChainPending,
  pendingChainId,
  switchChainError,
  onSelectChain,
}: WalletChainListProps) {
  return (
    <>
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
    </>
  );
}
