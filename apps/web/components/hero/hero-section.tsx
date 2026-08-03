"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
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
  );
}
