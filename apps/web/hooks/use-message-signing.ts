"use client";

import {
  buildSigningMessage,
  buildVerificationResult,
  classifySigningError,
  isSigningRequestExpired,
  isSupportedChainId,
} from "@chainspan/web3";
import type {
  SigningError,
  SigningRequest,
  VerificationResult,
} from "@chainspan/web3";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSignMessage } from "wagmi";
import { getConnection, verifyMessage } from "wagmi/actions";

import { wagmiConfig } from "@/lib/web3/wagmi-config";

const SIGNING_REQUEST_TTL_MS = 5 * 60 * 1000;

export type MessageSigningState =
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "awaiting_signature"; request: SigningRequest }
  | { status: "verifying"; request: SigningRequest; signature: `0x${string}` }
  | {
      status: "verified";
      request: SigningRequest;
      signature: `0x${string}`;
      result: VerificationResult;
    }
  | { status: "rejected"; request: SigningRequest }
  | { status: "failed"; request: SigningRequest | null; error: SigningError };

export type UseMessageSigningResult = MessageSigningState & {
  startSigning: () => void;
  reset: () => void;
};

export function useMessageSigning(): UseMessageSigningResult {
  const { signMessageAsync } = useSignMessage();

  const [state, setState] = useState<MessageSigningState>({ status: "idle" });

  // Read from startSigning's guard/callback without needing `state` in a
  // dependency array (which would make startSigning's identity - and any
  // in-flight closure - churn on every state transition).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // Bumped on every new attempt, on reset(), and on unmount, so any async
  // step that resolves after being superseded can detect it and discard its
  // result instead of calling setState with stale data.
  const attemptIdRef = useRef(0);

  useEffect(() => {
    return () => {
      attemptIdRef.current += 1;
    };
  }, []);

  const reset = useCallback(() => {
    attemptIdRef.current += 1;
    setState({ status: "idle" });
  }, []);

  const startSigning = useCallback(() => {
    const busy =
      stateRef.current.status === "preparing" ||
      stateRef.current.status === "awaiting_signature" ||
      stateRef.current.status === "verifying";

    if (busy) return;

    const attemptId = ++attemptIdRef.current;
    const isStale = () => attemptIdRef.current !== attemptId;

    setState({ status: "preparing" });

    void (async () => {
      // Read current wallet/chain imperatively (not from a React hook
      // closure) so this always reflects the connection at the moment it's
      // checked, not the render that created this callback.
      const connection = getConnection(wagmiConfig);

      if (
        !connection.isConnected ||
        !connection.address ||
        connection.chainId === undefined
      ) {
        if (isStale()) return;
        setState({
          status: "failed",
          request: null,
          error: { category: "wallet_unavailable" },
        });
        return;
      }

      if (!isSupportedChainId(connection.chainId)) {
        if (isStale()) return;
        setState({
          status: "failed",
          request: null,
          error: { category: "unsupported_chain" },
        });
        return;
      }

      const issuedAt = new Date();
      const expiresAt = new Date(issuedAt.getTime() + SIGNING_REQUEST_TTL_MS);

      const request = buildSigningMessage({
        appName: process.env.NEXT_PUBLIC_APP_NAME ?? "ChainSpan",
        domain: process.env.NEXT_PUBLIC_APP_DOMAIN ?? window.location.host,
        address: connection.address,
        chainId: connection.chainId,
        nonce: crypto.randomUUID(),
        issuedAt: issuedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });

      if (isStale()) return;
      setState({ status: "awaiting_signature", request });

      let signature: `0x${string}`;
      try {
        signature = await signMessageAsync({ message: request.message });
      } catch (error) {
        if (isStale()) return;

        const classified = classifySigningError(error);

        if (classified.category === "user_rejection") {
          setState({ status: "rejected", request });
        } else {
          setState({ status: "failed", request, error: classified });
          console.warn("Message signing failed", {
            category: classified.category,
            message: classified.cause?.message,
          });
        }
        return;
      }

      if (isStale()) return;
      setState({ status: "verifying", request, signature });

      if (isSigningRequestExpired(request, new Date())) {
        if (isStale()) return;
        setState({
          status: "failed",
          request,
          error: { category: "expired_request" },
        });
        return;
      }

      try {
        // publicClient.verifyMessage() under the hood - ERC-6492-compatible,
        // works for smart contract wallets as well as EOAs. Always verifies
        // against request.address/request.chainId (captured at signing
        // time), never the "current" connection.
        const isValid = await verifyMessage(wagmiConfig, {
          address: request.address,
          message: request.message,
          signature,
          chainId: request.chainId,
        });

        if (isStale()) return;

        const currentConnection = getConnection(wagmiConfig);

        const result = buildVerificationResult({
          isValid,
          requestAddress: request.address,
          currentAddress: currentConnection.address,
          requestChainId: request.chainId,
          currentChainId: currentConnection.chainId,
        });

        setState({ status: "verified", request, signature, result });
      } catch (error) {
        if (isStale()) return;
        setState({
          status: "failed",
          request,
          error: {
            category: "verification_failed",
            cause: error instanceof Error ? error : undefined,
          },
        });
      }
    })();
  }, [signMessageAsync]);

  return { ...state, startSigning, reset };
}
