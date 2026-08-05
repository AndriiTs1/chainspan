import type { SVGProps } from "react";

import { ChainSpanLogo } from "@/components/brand/chainspan-logo";
import { Card } from "@/components/ui/card";

const GITHUB_URL = "https://github.com/AndriiTs1/chainspan";
const ARCHITECTURE_URL =
  "https://github.com/AndriiTs1/chainspan/blob/main/ARCHITECTURE.md";

const LINKEDIN_URL = "https://www.linkedin.com/in/andrii-tsiurupa-ch/";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#ecosystem", label: "Ecosystem" },
];

const footerLinkClassName =
  "inline-flex items-center gap-1.5 rounded-md text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70";

const iconLinkClassName =
  "flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-zinc-400 transition hover:border-blue-300/20 hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.73 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 mb-6">
      <Card className="px-5 py-5 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <ChainSpanLogo className="size-8" iconClassName="size-4" />

            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                ChainSpan
              </p>

              <p className="text-xs text-zinc-500">
                Production-oriented Web3 engineering platform.
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={footerLinkClassName}>
                  {link.label}
                </a>
              ))}

              <a
                href={ARCHITECTURE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkClassName}
              >
                Architecture
              </a>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ChainSpan on GitHub"
                className={iconLinkClassName}
              >
                <GithubIcon className="size-4" aria-hidden="true" />
              </a>

              {LINKEDIN_URL ? (
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Andrii Tsiurupa on LinkedIn"
                  className={iconLinkClassName}
                >
                  <LinkedinIcon className="size-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </nav>
        </div>

        <div className="mx-auto mt-5 max-w-3xl border-t border-white/6 pt-4 text-center text-xs text-zinc-600">
          © 2026 ChainSpan. Built by Andrii Tsiurupa.
        </div>
      </Card>
    </footer>
  );
}
