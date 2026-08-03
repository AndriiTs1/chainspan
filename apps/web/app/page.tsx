"use client";

import { ChainSpanScene } from "@/components/hero/chainspan-scene";
import { HeroSection } from "@/components/hero/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { StatsSection } from "@/components/home/stats-section";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_75%_25%,rgba(124,58,237,0.14),transparent_25%)]" />

      <ChainSpanScene />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-375 flex-col px-6 lg:px-10">
        <Header />

        <HeroSection />

        <FeaturesSection />

        <StatsSection />
      </div>
    </main>
  );
}
