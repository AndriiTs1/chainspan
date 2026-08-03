"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Code2, Link2, Send, WalletCards } from "lucide-react";
import { ChainSpanLogo } from "@/components/brand/chainspan-logo";
import { ChainSpanScene } from "@/components/hero/chainspan-scene";

const features = [
  {
    title: "Wallet",
    text: "Secure, non-custodial wallet connectivity for Web3.",
    icon: WalletCards,
  },
  {
    title: "Transactions",
    text: "Send, monitor and verify on-chain activity.",
    icon: Send,
  },
  {
    title: "Cross-Chain Bridge",
    text: "Track asset movement across multiple EVM networks.",
    icon: Link2,
  },
  {
    title: "Developer Tools",
    text: "Build and review blockchain-facing applications.",
    icon: Code2,
  },
  {
    title: "AI Engineering",
    text: "AI-first execution with rigorous human review.",
    icon: Bot,
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_75%_25%,rgba(124,58,237,0.14),transparent_25%)]" />

      <ChainSpanScene />

      <div className="relative z-10 mx-auto flex min-h-screen max-w: 1500px flex-col px-6 lg:px-10">
        <header className="flex h-24 items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <ChainSpanLogo />
            <span className="text-xl font-semibold tracking-tight">
              ChainSpan
            </span>
          </a>

          <nav className="hidden items-center gap-9 text-sm text-zinc-300 lg:flex">
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

          <button className="group flex h-11 items-center gap-2 rounded-xl border border-blue-300/30 bg-linear-to-r from-blue-600 to-violet-600 px-5 text-sm font-medium shadow-[0_0_32px_rgba(59,130,246,0.35)] transition hover:scale-[1.03]">
            Launch App
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center pb-8 pt-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 text-xs font-medium uppercase tracking-[0.45em] text-blue-200/75 sm:text-sm"
          >
            Web3 Engineering Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.8 }}
            className="bg-linear-to-b from-white via-white to-blue-300 bg-clip-text text-6xl font-semibold tracking-[-0.06em] text-transparent drop-shadow-[0_0_35px_rgba(96,165,250,0.22)] sm:text-7xl lg:text-[108px]"
          >
            ChainSpan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg"
          >
            Production-oriented wallet, transaction and cross-chain engineering
            platform built for modern Web3 applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.7 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-7 font-medium shadow-[0_0_42px_rgba(79,70,229,0.4)] transition hover:scale-[1.03]">
              Explore Platform
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="h-12 rounded-xl border border-white/15 bg-white/4 px-7 font-medium text-zinc-200 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/8">
              View Architecture
            </button>
          </motion.div>
        </section>

        <motion.section
          id="platform"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-5"
        >
          {features.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="group rounded-2xl border border-blue-300/10 bg-[#080d19]/75 p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#0b1222]/90"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-blue-400/20 bg-linear-to-br from-blue-500/20 to-violet-500/20 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
                <Icon className="size-5 text-blue-300" />
              </div>

              <h2 className="font-medium text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
            </article>
          ))}
        </motion.section>

        <footer className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-blue-300/10 bg-white/10 text-center backdrop-blur-xl sm:grid-cols-4">
          <Stat value="10+" label="EVM Networks" />
          <Stat value="24/7" label="Transaction Tracking" />
          <Stat value="100%" label="Typed Architecture" />
          <Stat value="AI-first" label="Engineering Workflow" />
        </footer>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-2">
      <p className="text-lg font-semibold text-blue-200 sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
