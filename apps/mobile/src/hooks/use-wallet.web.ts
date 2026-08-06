import { useCallback } from 'react';

// Web preview never wires Wagmi/AppKit (see mobile-providers.web.tsx for
// why), so this variant calls no wagmi/Reown hooks at all and imports
// neither package - there is no provider in the tree for them to read from
// on this platform. Same public shape as use-wallet.native.ts, statically
// disconnected, so wallet.tsx and the Dashboard render unchanged.
export function useWallet() {
  const connect = useCallback(() => {}, []);
  const disconnect = useCallback(() => {}, []);
  const switchNetwork = useCallback(async (_network: unknown) => {}, []);
  const switchChain = useCallback((_variables: unknown) => {}, []);

  return {
    status: 'disconnected' as const,
    address: undefined,
    chainId: undefined,
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,

    supportedChain: undefined,
    isUnsupportedChain: false,

    connect,
    connectError: null,

    disconnect,

    switchNetwork,
    chains: [] as const,
    switchChain,
    switchChainError: null,
    isSwitchChainPending: false,
    pendingChainId: undefined,
  };
}
