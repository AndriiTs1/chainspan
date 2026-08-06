import { classifyConnectionError, getSupportedChain, isSupportedChainId } from '@chainspan/web3';
import type { SupportedChain } from '@chainspan/web3';
import { useAppKit, useAppKitEventSubscription, useAppKitState } from '@reown/appkit-react-native';
import { useCallback, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

const genericConnectErrorMessage =
  'Connection failed. Check your wallet or internet connection and try again.';

// AppKit's own modal already distinguishes USER_REJECTED from CONNECT_ERROR,
// but CONNECT_ERROR's message is still run through the shared classifier
// (same one apps/web uses) as a second check, so a rejection worded
// differently by a given wallet still never surfaces as a system error.
export function useWallet() {
  const account = useAccount();
  const { isLoading: isModalLoading } = useAppKitState();
  const { open, disconnect, switchNetwork } = useAppKit();
  const switchChainMutation = useSwitchChain();

  const [connectError, setConnectError] = useState<string | null>(null);

  useAppKitEventSubscription('USER_REJECTED', () => {
    setConnectError(null);
  });

  useAppKitEventSubscription('CONNECT_ERROR', (event) => {
    const message =
      event.data.type === 'track' && event.data.event === 'CONNECT_ERROR'
        ? event.data.properties.message
        : '';

    if (classifyConnectionError(new Error(message)).category === 'user_rejection') {
      setConnectError(null);
      return;
    }

    setConnectError(genericConnectErrorMessage);
  });

  const connect = useCallback(() => {
    setConnectError(null);
    open();
  }, [open]);

  const chainId = account.chainId;
  const supportedChain: SupportedChain | undefined =
    chainId !== undefined ? getSupportedChain(chainId) : undefined;
  const isUnsupportedChain =
    account.isConnected && chainId !== undefined && !isSupportedChainId(chainId);

  return {
    status: account.status,
    address: account.address,
    chainId,
    isConnected: account.isConnected,
    isConnecting: account.isConnecting || isModalLoading,
    isReconnecting: account.isReconnecting,

    supportedChain,
    isUnsupportedChain,

    connect,
    connectError,

    disconnect: () => disconnect(),

    switchNetwork,
    chains: switchChainMutation.chains,
    switchChain: switchChainMutation.switchChain,
    switchChainError: switchChainMutation.error,
    isSwitchChainPending: switchChainMutation.isPending,
    pendingChainId: switchChainMutation.variables?.chainId,
  };
}
