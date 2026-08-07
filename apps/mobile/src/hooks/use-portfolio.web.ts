import type { Portfolio, PortfolioAssetFailure } from '@chainspan/web3';

// Web preview never wires Wagmi (see mobile-providers.web.tsx) - this
// variant imports nothing from wagmi/Reown and always reports disconnected,
// matching use-wallet.web.ts's pattern. Portfolio/PortfolioAssetFailure are
// type-only imports (erased at build time), so they don't pull any runtime
// code into the web bundle.
export type UsePortfolioResult =
  | { status: 'disconnected' }
  | { status: 'unsupported'; chainId: number }
  | { status: 'loading' }
  | {
      status: 'success';
      portfolio: Portfolio;
      hasPartialError: boolean;
      failedAssets: readonly PortfolioAssetFailure[];
    }
  | { status: 'error'; error: Error };

export function usePortfolio(): UsePortfolioResult {
  return { status: 'disconnected' };
}
