"use client";

import { ChainSpanLogo } from "@/components/brand/chainspan-logo";
import { WalletControl } from "@/components/web3";

export function Header() {
  return (
    <header className="flex h-24 items-center justify-between">
      <a href="#" className="flex items-center gap-3">
        <ChainSpanLogo />

        <span className="text-xl font-semibold tracking-tight">
          ChainSpan
        </span>
      </a>

      <nav
        aria-label="Primary navigation"
        className="hidden items-center gap-9 text-sm text-zinc-300 lg:flex"
      >
        <a className="transition hover:text-white" href="#platform">
          Platform
        </a>

        <a className="transition hover:text-white" href="#ecosystem">
          Ecosystem
        </a>

        <a className="transition hover:text-white" href="#developers">
          Developers
        </a>

        <a className="transition hover:text-white" href="#docs">
          Documentation
        </a>
      </nav>

      <WalletControl />
    </header>
  );
}
