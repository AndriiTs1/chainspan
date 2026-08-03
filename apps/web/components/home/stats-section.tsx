"use client";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-2">
      <p className="text-lg font-semibold text-blue-200 sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {label}
      </p>
    </div>
  );
}

export function StatsSection() {
  return (
    <footer className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-blue-300/10 bg-white/10 text-center backdrop-blur-xl sm:grid-cols-4">
      <Stat value="10+" label="EVM Networks" />
      <Stat value="24/7" label="Transaction Tracking" />
      <Stat value="100%" label="Typed Architecture" />
      <Stat value="AI-first" label="Engineering Workflow" />
    </footer>
  );
}
