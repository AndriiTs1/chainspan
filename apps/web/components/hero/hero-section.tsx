"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/motion/fade-up";
import { heroTitleMotion } from "@/components/motion/hero-title";
import { heroDescriptionMotion } from "@/components/motion/hero-description";
import { heroActionsMotion } from "@/components/motion/hero-actions";

export function HeroSection() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center pb-8 pt-12 text-center">
      <motion.p
        {...fadeUp}
        className="mb-5 text-xs font-medium uppercase tracking-[0.45em] text-blue-200/75 sm:text-sm"
      >
        Web3 Engineering Platform
      </motion.p>

      <motion.h1
        {...heroTitleMotion}
        className="bg-linear-to-b from-white via-white to-blue-300 bg-clip-text text-6xl font-semibold tracking-[-0.06em] text-transparent drop-shadow-[0_0_35px_rgba(96,165,250,0.22)] sm:text-7xl lg:text-[108px]"
      >
        ChainSpan
      </motion.h1>

      <motion.p
        {...heroDescriptionMotion}
        className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg"
      >
        Production-oriented wallet, transaction and cross-chain engineering
        platform built for modern Web3 applications.
      </motion.p>

      <motion.div
        {...heroActionsMotion}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Button variant="primary" className="group gap-2">
          Explore Platform
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>

        <Button variant="secondary">View Architecture</Button>
      </motion.div>
    </section>
  );
}
