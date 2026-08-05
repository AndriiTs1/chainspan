"use client";

import {
  buildSigningMessage,
  isSigningRequestExpired,
  isSupportedChainId,
} from "@chainspan/web3";
import type { SigningError, SigningRequest, VerificationResult } from "@chainspan/web3";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

import { useDismissableLayer } from "@/hooks/use-dismissable-layer";
import { getSigningAppContext } from "@/hooks/use-message-signing";
import type { UseMessageSigningResult } from "@/hooks/use-message-signing";

import { shortenAddress } from "../utils/wallet-format";

// Mirrors the hook's own TTL for display purposes only - the request that is
// actually signed is built fresh by startSigning() with its own nonce and
// timestamps, so this only affects how long the *preview* looks valid.
const PREVIEW_TTL_MS = 5 * 60 * 1000;

const modalPanelClassName = [
  "w-full max-w-sm overflow-hidden rounded-2xl",
  "border border-blue-300/15 bg-[#070b14]/95",
  "shadow-[0_30px_100px_rgba(0,0,0,0.65)]",
  "backdrop-blur-2xl",
].join(" ");

const primaryButtonClassName =
  "flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-violet-600 px-4 text-xs font-medium text-white transition hover:scale-[1.02]";

const secondaryButtonClassName =
  "flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg border border-white/15 bg-white/4 px-4 text-xs text-zinc-300 transition hover:bg-white/8";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

function shortenSignature(signature: `0x${string}`): string {
  return `${signature.slice(0, 10)}...${signature.slice(-8)}`;
}

type SummaryRowProps = {
  label: string;
  value: string;
  title?: string;
  mono?: boolean;
};

function SummaryRow({ label, value, title, mono }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-zinc-500">{label}</dt>
      <dd
        title={title}
        className={[
          "min-w-0 flex-1 text-right break-all text-zinc-200",
          mono ? "font-mono" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

type RequestSummaryProps = {
  request: SigningRequest;
  appName: string;
  domain: string;
  chainName: string;
};

function RequestSummary({ request, appName, domain, chainName }: RequestSummaryProps) {
  return (
    <dl className="space-y-2 rounded-xl border border-white/8 bg-white/3 p-3 text-xs">
      <SummaryRow label="Purpose" value="Verify ownership of this wallet" />
      <SummaryRow label="Application" value={appName} />
      <SummaryRow label="Domain" value={domain} mono />
      <SummaryRow
        label="Wallet"
        value={shortenAddress(request.address)}
        title={request.address}
        mono
      />
      <SummaryRow label="Network" value={`${chainName} (Chain ID: ${request.chainId})`} />
      <SummaryRow label="Nonce" value={request.nonce} mono />
      <SummaryRow
        label="Issued at"
        value={formatTimestamp(request.issuedAt)}
        title={request.issuedAt}
      />
      <SummaryRow
        label="Expires at"
        value={formatTimestamp(request.expiresAt)}
        title={request.expiresAt}
      />
    </dl>
  );
}

type StatusRowProps = {
  label: string;
  value: string;
  tone: "good" | "caution" | "bad";
};

const statusRowIconClassName = {
  good: "text-emerald-400",
  caution: "text-amber-400",
  bad: "text-red-400",
};

function StatusRow({ label, value, tone }: StatusRowProps) {
  const Icon = tone === "bad" ? XCircle : tone === "caution" ? AlertTriangle : CheckCircle2;

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex min-w-0 items-center gap-1.5 text-zinc-500">
        <Icon className={["size-3.5 shrink-0", statusRowIconClassName[tone]].join(" ")} />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="shrink-0 text-right text-zinc-200">{value}</dd>
    </div>
  );
}

type RawMessageDisclosureProps = {
  message: string;
  isCopied: boolean;
  onCopy: () => void;
};

function RawMessageDisclosure({ message, isCopied, onCopy }: RawMessageDisclosureProps) {
  return (
    <details className="rounded-xl border border-white/8 bg-white/3 p-3 text-xs text-zinc-400">
      <summary className="cursor-pointer select-none text-zinc-300">
        View raw message
      </summary>

      <pre className="mt-2 max-h-48 overflow-y-auto break-words font-mono text-[11px] leading-5 whitespace-pre-wrap text-zinc-400">
        {message}
      </pre>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="text-[11px] text-blue-300 transition hover:text-blue-200"
        >
          Copy message
        </button>

        <span role="status" aria-live="polite" className="text-[11px] text-emerald-300">
          {isCopied ? "Message copied" : ""}
        </span>
      </div>
    </details>
  );
}

const securityNotes = [
  "This request will not submit a blockchain transaction and will not cost any gas.",
  "Signing does not create a session in this app - nothing is sent to a server.",
  "This project has no backend, so this signature is not protected against replay elsewhere. Only sign if you trust this application, and confirm the domain and wallet above are what you expect.",
];

function SecurityNotes() {
  return (
    <ul className="space-y-1.5 px-1 text-[11px] leading-5 text-zinc-500">
      {securityNotes.map((note) => (
        <li key={note}>{note}</li>
      ))}
    </ul>
  );
}

function failureMessage(error: SigningError): string {
  switch (error.category) {
    case "wallet_unavailable":
      return "Your wallet isn't available right now. Reconnect and try again.";
    case "unsupported_chain":
      return "This network isn't supported for message signing. Switch networks and try again.";
    case "expired_request":
      return "This signing request expired before it could be verified. Try again.";
    case "verification_failed":
      return "Signature verification failed. Try again.";
    case "malformed_signature":
      return "Your wallet returned a signature that couldn't be read. Try again.";
    case "account_changed":
      return "The connected account changed before signing finished. Try again.";
    case "chain_changed":
      return "The connected network changed before signing finished. Try again.";
    case "user_rejection":
    case "unknown":
    default:
      return "Something went wrong while signing. Try again.";
  }
}

type VerifiedResultProps = {
  request: SigningRequest;
  signature: `0x${string}`;
  result: VerificationResult;
  isSignatureCopied: boolean;
  onCopySignature: () => void;
  onReset: () => void;
};

function VerifiedResult({
  request,
  signature,
  result,
  isSignatureCopied,
  onCopySignature,
  onReset,
}: VerifiedResultProps) {
  // Informational only - re-checked live at render time since the hook's
  // "verified" status just means the verification round-trip finished, not
  // that the request window is still open right now.
  const isExpiredNow = isSigningRequestExpired(request, new Date());
  const hasDrift = result.accountChangedSinceSigning || result.chainChangedSinceSigning;

  const tone = !result.isValid ? "danger" : hasDrift ? "caution" : "success";

  const toneClassName = {
    success: "border-emerald-400/20 bg-emerald-400/8 text-emerald-200",
    caution: "border-amber-400/20 bg-amber-400/8 text-amber-200",
    danger: "border-red-400/15 bg-red-400/8 text-red-300",
  }[tone];

  const headline = !result.isValid
    ? "Signature could not be verified"
    : hasDrift
      ? "Signature verified, but wallet state changed since signing"
      : "Signature verified";

  const ToneIcon = !result.isValid ? ShieldAlert : hasDrift ? ShieldQuestion : ShieldCheck;

  return (
    <>
      <div
        className={[
          "flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-xs leading-5",
          toneClassName,
        ].join(" ")}
      >
        <ToneIcon className="mt-0.5 size-4 shrink-0" />
        <span>{headline}</span>
      </div>

      <dl className="space-y-2.5 rounded-xl border border-white/8 bg-white/3 p-3 text-xs">
        <StatusRow
          label="Signature valid"
          value={result.isValid ? "Yes" : "No"}
          tone={result.isValid ? "good" : "bad"}
        />
        <StatusRow
          label="Signing address"
          value={
            result.accountChangedSinceSigning ? "Changed since signing" : "Matches current wallet"
          }
          tone={result.accountChangedSinceSigning ? "caution" : "good"}
        />
        <StatusRow
          label="Network"
          value={
            result.chainChangedSinceSigning ? "Changed since signing" : "Matches current network"
          }
          tone={result.chainChangedSinceSigning ? "caution" : "good"}
        />
        <StatusRow
          label="Request window"
          value={isExpiredNow ? "Expired since signing" : "Still within validity window"}
          tone={isExpiredNow ? "caution" : "good"}
        />
      </dl>

      <div className="rounded-xl border border-white/8 bg-white/3 p-3">
        <p className="text-[11px] text-zinc-500">Signature</p>
        <p className="mt-1 font-mono text-xs break-all text-zinc-200">
          {shortenSignature(signature)}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCopySignature}
            className="text-[11px] text-blue-300 transition hover:text-blue-200"
          >
            Copy full signature
          </button>

          <span role="status" aria-live="polite" className="text-[11px] text-emerald-300">
            {isSignatureCopied ? "Signature copied" : ""}
          </span>
        </div>
      </div>

      <button type="button" onClick={onReset} className={secondaryButtonClassName}>
        Sign again
      </button>
    </>
  );
}

type MessageSigningDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  signing: UseMessageSigningResult;
  address: `0x${string}`;
  chainId: number;
  chainName: string;
};

export function MessageSigningDialog({
  isOpen,
  onClose,
  triggerRef,
  signing,
  address,
  chainId,
  chainName,
}: MessageSigningDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSignatureCopied, setIsSignatureCopied] = useState(false);
  const [isMessageCopied, setIsMessageCopied] = useState(false);

  // A wallet extension prompt is open during awaiting_signature - closing our
  // own dialog underneath it would strand the flow, so block it here exactly
  // like connect-wallet-button.tsx blocks close during isConnectPending.
  const canClose = signing.status !== "awaiting_signature";

  function closeDialog() {
    if (!canClose) return;
    onClose();
  }

  useDismissableLayer({
    isOpen,
    onDismiss: closeDialog,
    containerRef: modalRef,
    triggerRef,
    trapFocus: true,
  });

  // Empty placeholder while closed keeps the type stable; never rendered,
  // since all JSX below only mounts once `isOpen` is true.
  const appContext = useMemo(
    () => (isOpen ? getSigningAppContext() : { appName: "", domain: "" }),
    [isOpen],
  );

  // A draft, display-only request built from the same pure builder the hook
  // itself uses - shown so the user sees the exact shape of what they'll
  // sign before committing. Its nonce/timestamps are illustrative and get
  // regenerated by startSigning() the moment the user actually confirms, so
  // the real request gets the full TTL from that click, not from whenever
  // they opened this dialog.
  const preview = useMemo(() => {
    if (!isOpen || !isSupportedChainId(chainId)) return null;

    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + PREVIEW_TTL_MS);

    return buildSigningMessage({
      appName: appContext.appName,
      domain: appContext.domain,
      address,
      chainId,
      nonce: crypto.randomUUID(),
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
  }, [isOpen, appContext, address, chainId]);

  async function copySignature(signature: `0x${string}`) {
    await navigator.clipboard.writeText(signature);
    setIsSignatureCopied(true);
    window.setTimeout(() => setIsSignatureCopied(false), 1500);
  }

  async function copyMessage(message: string) {
    await navigator.clipboard.writeText(message);
    setIsMessageCopied(true);
    window.setTimeout(() => setIsMessageCopied(false), 1500);
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signing-dialog-title"
            aria-describedby="signing-dialog-description"
            layout="size"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={modalPanelClassName}
          >
            <div className="flex items-start justify-between border-b border-white/7 px-5 py-4">
              <div>
                <h2 id="signing-dialog-title" className="text-base font-semibold text-white">
                  Sign message
                </h2>

                <p
                  id="signing-dialog-description"
                  className="mt-1 text-xs leading-5 text-zinc-500"
                >
                  Prove wallet ownership with a free, off-chain signature.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDialog}
                disabled={!canClose}
                aria-label="Close sign message dialog"
                className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/6 hover:text-white disabled:cursor-wait disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-3 overflow-y-auto p-4">
              {signing.status === "idle" ? (
                <>
                  {preview ? (
                    <>
                      <RequestSummary
                        request={preview}
                        appName={appContext.appName}
                        domain={appContext.domain}
                        chainName={chainName}
                      />

                      <RawMessageDisclosure
                        message={preview.message}
                        isCopied={isMessageCopied}
                        onCopy={() => copyMessage(preview.message)}
                      />
                    </>
                  ) : (
                    <p className="rounded-xl border border-amber-400/15 bg-amber-400/8 px-3 py-2.5 text-xs leading-5 text-amber-200">
                      {chainName} isn&apos;t a supported network for message signing. Switch
                      networks to preview the exact message.
                    </p>
                  )}

                  <SecurityNotes />

                  <button
                    type="button"
                    onClick={signing.startSigning}
                    className={primaryButtonClassName}
                  >
                    Sign message
                  </button>
                </>
              ) : null}

              {signing.status === "preparing" ? (
                <p
                  role="status"
                  className="flex items-center justify-center gap-2 px-1 py-8 text-sm text-zinc-400"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Preparing request...
                </p>
              ) : null}

              {signing.status === "awaiting_signature" ? (
                <>
                  <p
                    role="status"
                    className="flex items-center gap-2 rounded-xl border border-blue-400/15 bg-blue-400/8 px-3 py-2.5 text-xs leading-5 text-blue-200"
                  >
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                    Confirm this message in your wallet to continue.
                  </p>

                  <RequestSummary
                    request={signing.request}
                    appName={appContext.appName}
                    domain={appContext.domain}
                    chainName={chainName}
                  />

                  <RawMessageDisclosure
                    message={signing.request.message}
                    isCopied={isMessageCopied}
                    onCopy={() => copyMessage(signing.request.message)}
                  />
                </>
              ) : null}

              {signing.status === "verifying" ? (
                <p
                  role="status"
                  className="flex items-center justify-center gap-2 px-1 py-8 text-sm text-zinc-400"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Verifying signature...
                </p>
              ) : null}

              {signing.status === "verified" ? (
                <VerifiedResult
                  request={signing.request}
                  signature={signing.signature}
                  result={signing.result}
                  isSignatureCopied={isSignatureCopied}
                  onCopySignature={() => copySignature(signing.signature)}
                  onReset={signing.reset}
                />
              ) : null}

              {signing.status === "rejected" ? (
                <>
                  <p
                    role="status"
                    className="rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-xs leading-5 text-zinc-300"
                  >
                    Signature request was cancelled. No signature was created.
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={signing.startSigning}
                      className={primaryButtonClassName}
                    >
                      Retry
                    </button>

                    <button
                      type="button"
                      onClick={signing.reset}
                      className={secondaryButtonClassName}
                    >
                      Reset
                    </button>
                  </div>
                </>
              ) : null}

              {signing.status === "failed" ? (
                <>
                  <p
                    role="alert"
                    className="rounded-xl border border-red-400/10 bg-red-400/6 px-3 py-2.5 text-xs leading-5 text-red-300"
                  >
                    {failureMessage(signing.error)}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={signing.startSigning}
                      className={primaryButtonClassName}
                    >
                      Retry
                    </button>

                    <button
                      type="button"
                      onClick={signing.reset}
                      className={secondaryButtonClassName}
                    >
                      Reset
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
