"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useId, useRef, useState } from "react";

import { ChainSpanLogo } from "@/components/brand/chainspan-logo";
import { WalletControl } from "@/components/web3";
import { useDismissableLayer } from "@/hooks/use-dismissable-layer";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#ecosystem", label: "Ecosystem" },
];

export function Header() {
  const menuId = useId();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useDismissableLayer({
    isOpen: isMenuOpen,
    onDismiss: closeMenu,
    containerRef: menuRef,
    triggerRef: menuTriggerRef,
  });

  return (
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

      <div className="flex items-center gap-3">
        <WalletControl />

        <div className="relative lg:hidden">
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            className="flex size-10 items-center justify-center rounded-xl border border-blue-300/15 bg-[#070b14]/80 text-zinc-300 backdrop-blur-xl transition hover:border-blue-300/30 hover:bg-[#0a101d] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
          >
            {isMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>

          <AnimatePresence>
            {isMenuOpen ? (
              <motion.div
                ref={menuRef}
                id={menuId}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-blue-300/10 bg-[#070b14]/96 p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
              >
                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col"
                >
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
