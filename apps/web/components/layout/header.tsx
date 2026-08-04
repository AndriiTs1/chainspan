"use client";

import { ChainSpanLogo } from "@/components/brand/chainspan-logo";
import { WalletControl } from "@/components/web3";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#ecosystem", label: "Ecosystem" },
];

export function Header() {
  return (
    <>
      <header className="flex h-20 items-center justify-between sm:h-24">
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
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="transition hover:text-white"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <WalletControl />
      </header>

      <nav
        aria-label="Primary navigation"
        className="flex items-center justify-center gap-8 border-t border-white/6 pb-4 pt-3 text-sm text-zinc-300 lg:hidden"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            className="transition hover:text-white"
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </>
  );
}
