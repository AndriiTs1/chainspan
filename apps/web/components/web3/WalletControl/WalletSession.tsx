type WalletSessionProps = {
  address: `0x${string}`;
  chainName: string;
  balanceLabel: string;
};

export function WalletSession({
  address,
  chainName,
  balanceLabel,
}: WalletSessionProps) {
  return (
    <>
      <div className="px-3 py-2.5">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
          Wallet session
        </p>

        <p className="mt-1.5 truncate font-mono text-[11px] text-zinc-300">
          {address}
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
          <span className="truncate">
            {chainName} · {balanceLabel}
          </span>
        </div>
      </div>

      <div className="my-1 h-px bg-white/6" />
    </>
  );
}
