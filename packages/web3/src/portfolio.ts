import type { SupportedChainId } from "./chains";
import type { AssetBalance, Portfolio } from "./portfolio.types";
import type { Token } from "./token.types";

export type BalanceReadResult =
  | { status: "success"; value: bigint }
  | { status: "failure"; error: Error };

export type TokenBalanceInput = {
  token: Token;
  result: BalanceReadResult;
};

export type PortfolioAssetFailure = {
  token: Token;
  error: Error;
};

export type BuildPortfolioResult = {
  portfolio: Portfolio;
  failedAssets: readonly PortfolioAssetFailure[];
};

export function buildPortfolio(
  address: `0x${string}`,
  chainId: SupportedChainId,
  balances: readonly TokenBalanceInput[],
): BuildPortfolioResult {
  const assets: AssetBalance[] = [];
  const failedAssets: PortfolioAssetFailure[] = [];

  for (const { token, result } of balances) {
    if (result.status === "success") {
      assets.push({ token, value: result.value });
    } else {
      failedAssets.push({ token, error: result.error });
    }
  }

  return {
    portfolio: { address, chainId, assets },
    failedAssets,
  };
}
