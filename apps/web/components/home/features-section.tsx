"use client";

import { motion } from "framer-motion";
import { Bot, Code2, Link2, Send, WalletCards } from "lucide-react";

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

export function FeaturesSection() {
  return (
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

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {text}
          </p>
        </article>
      ))}
    </motion.section>
  );
}
