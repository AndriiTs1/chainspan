"use client";

import { ChainSpanScene } from "@/components/hero/chainspan-scene";
import { HeroSection } from "@/components/hero/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_75%_25%,rgba(124,58,237,0.14),transparent_25%)]" />

      <ChainSpanScene />

      <div className="relative z-10 mx-auto flex min-h-screen max-w: 1500px flex-col px-6 lg:px-10">
        <Header />

        <HeroSection />

        <FeaturesSection />

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
