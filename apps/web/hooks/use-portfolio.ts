"use client";

import {
  buildPortfolio,
  erc20Abi,
  getNativeToken,
  getTokensForChain,
  isSupportedChainId,
} from "@chainspan/web3";
import type {
  PortfolioAssetFailure,
  Portfolio,
  TokenBalanceInput,
} from "@chainspan/web3";
import { useAccount, useBalance, useChainId, useReadContracts } from "wagmi";

// On-chain balances only change on new blocks; a short buffer avoids
// refetching on every re-mount/focus while still staying close to current.
const BALANCE_STALE_TIME_MS = 15_000;

export type UsePortfolioResult =
  | { status: "disconnected" }
  | { status: "unsupported"; chainId: number }
  | { status: "loading" }
  | {
      status: "success";
      portfolio: Portfolio;
      hasPartialError: boolean;
      failedAssets: readonly PortfolioAssetFailure[];
    }
  | { status: "error"; error: Error };

export function usePortfolio(): UsePortfolioResult {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const chainIsSupported = isSupportedChainId(chainId);
  const registryTokens = chainIsSupported ? getTokensForChain(chainId) : [];
  const nativeToken = chainIsSupported ? getNativeToken(chainId) : undefined;

  const nativeBalanceQuery = useBalance({
    address,
    chainId,
    query: {
      enabled: Boolean(address) && chainIsSupported,
      staleTime: BALANCE_STALE_TIME_MS,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const erc20BalanceQuery = useReadContracts({
    allowFailure: true,
    contracts: registryTokens.map((token) => ({
      address: token.address,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: address ? ([address] as const) : undefined,
      chainId: token.chainId,
    })),
    query: {
      enabled:
        Boolean(address) && chainIsSupported && registryTokens.length > 0,
      staleTime: BALANCE_STALE_TIME_MS,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  if (!isConnected || !address) {
    return { status: "disconnected" };
  }

  if (!chainIsSupported || !nativeToken) {
    return { status: "unsupported", chainId };
  }

  const erc20QueryActive = registryTokens.length > 0;

  const stillLoading =
    nativeBalanceQuery.isLoading ||
    (erc20QueryActive && erc20BalanceQuery.isLoading);

  if (stillLoading) {
    return { status: "loading" };
  }

  const balanceInputs: TokenBalanceInput[] = [
    {
      token: nativeToken,
      result: nativeBalanceQuery.isError
        ? { status: "failure", error: nativeBalanceQuery.error }
        : {
            status: "success",
            value: nativeBalanceQuery.data?.value ?? BigInt(0),
          },
    },
  ];

  if (erc20QueryActive) {
    if (erc20BalanceQuery.isError) {
      for (const token of registryTokens) {
        balanceInputs.push({
          token,
          result: { status: "failure", error: erc20BalanceQuery.error },
        });
      }
    } else {
      registryTokens.forEach((token, index) => {
        const result = erc20BalanceQuery.data?.[index];

        if (!result || result.status === "failure") {
          const error =
            result?.error instanceof Error
              ? result.error
              : new Error("Unknown balance read failure");

          balanceInputs.push({ token, result: { status: "failure", error } });
        } else {
          balanceInputs.push({
            token,
            result: { status: "success", value: result.result },
          });
        }
      });
    }
  }

  const { portfolio, failedAssets } = buildPortfolio(
    address,
    chainId,
    balanceInputs,
  );

  if (portfolio.assets.length === 0 && failedAssets.length > 0) {
    return { status: "error", error: failedAssets[0].error };
  }

  return {
    status: "success",
    portfolio,
    hasPartialError: failedAssets.length > 0,
    failedAssets,
  };
}
