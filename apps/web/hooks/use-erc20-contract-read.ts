"use client";

import {
  buildErc20ContractSnapshot,
  defaultChain,
  erc20Abi,
  getToken,
  isSupportedChainId,
} from "@chainspan/web3";
import type { ContractFieldRead, ContractReadFailure, Erc20ContractSnapshot } from "@chainspan/web3";
import { useReadContracts } from "wagmi";

// Contract-reported values only change when a contract is redeployed or a
// controlled supply changes - a much longer window than portfolio balances,
// so this stays deliberately longer than BALANCE_STALE_TIME_MS.
const CONTRACT_READ_STALE_TIME_MS = 60_000;

// Used only when no token is selected yet (query stays disabled via
// `enabled` below, so this address is never actually read). Keeping the
// `contracts` array's shape constant regardless of token presence avoids a
// `[] : [...]` ternary, which otherwise collapses wagmi's generic inference
// for a heterogeneous (name/symbol/decimals/totalSupply) call tuple down to
// `never[]`.
const PLACEHOLDER_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export type UseErc20ContractReadResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; snapshot: Erc20ContractSnapshot }
  | { status: "error"; failure: ContractReadFailure }
  | { status: "unsupported_chain"; chainId: number }
  | { status: "token_not_registered"; chainId: number; address: `0x${string}` };

function toFieldRead<T>(
  result: { status: "success"; result: unknown } | { status: "failure"; error: unknown } | undefined,
): ContractFieldRead<T> {
  if (!result || result.status === "failure") {
    const error = result?.error instanceof Error ? result.error : new Error("Unknown contract read failure");
    return { status: "failure", error };
  }

  return { status: "success", value: result.result as T };
}

// Reads a single curated ERC-20 contract independently of wallet connection
// or the wallet's active chain - chainId/address are caller-selected local
// state (Contract Inspector's own network/token pickers), never derived from
// useAccount()/useChainId(). The token itself only ever comes from the
// public token-registry lookup, never from the raw address argument.
export function useErc20ContractRead(
  chainId: number,
  address: `0x${string}` | undefined,
): UseErc20ContractReadResult {
  const chainIsSupported = isSupportedChainId(chainId);
  const token = chainIsSupported && address ? getToken(chainId, address) : undefined;

  const contractAddress = token?.address ?? PLACEHOLDER_ADDRESS;
  const contractChainId = token?.chainId ?? defaultChain.id;

  const contracts = [
    { address: contractAddress, abi: erc20Abi, functionName: "name", chainId: contractChainId },
    { address: contractAddress, abi: erc20Abi, functionName: "symbol", chainId: contractChainId },
    { address: contractAddress, abi: erc20Abi, functionName: "decimals", chainId: contractChainId },
    { address: contractAddress, abi: erc20Abi, functionName: "totalSupply", chainId: contractChainId },
  ] as const;

  const query = useReadContracts({
    allowFailure: true,
    contracts,
    query: {
      enabled: Boolean(token),
      staleTime: CONTRACT_READ_STALE_TIME_MS,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  if (!address) {
    return { status: "idle" };
  }

  if (!chainIsSupported) {
    return { status: "unsupported_chain", chainId };
  }

  if (!token) {
    return { status: "token_not_registered", chainId, address };
  }

  if (query.isLoading) {
    return { status: "loading" };
  }

  if (query.isError || !query.data) {
    const cause = query.error instanceof Error ? query.error : undefined;
    return { status: "error", failure: { category: "rpc_error", cause } };
  }

  const [nameResult, symbolResult, decimalsResult, totalSupplyResult] = query.data;

  const readResult = buildErc20ContractSnapshot({
    token,
    name: toFieldRead<string>(nameResult),
    symbol: toFieldRead<string>(symbolResult),
    decimals: toFieldRead<number>(decimalsResult),
    totalSupply: toFieldRead<bigint>(totalSupplyResult),
  });

  if (readResult.status === "failure") {
    return { status: "error", failure: readResult.failure };
  }

  return { status: "success", snapshot: readResult.snapshot };
}
