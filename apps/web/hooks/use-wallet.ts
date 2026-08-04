"use client";

import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

export function useWallet() {
  const account = useAccount();
  const chainId = useChainId();

  const balance = useBalance({
    address: account.address,
    query: {
      enabled: Boolean(account.address),
    },
  });

  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();

  return {
    address: account.address,
    chainId,
    status: account.status,
    isConnected: account.isConnected,
    isConnecting: account.isConnecting,

    balance: balance.data,
    isBalanceLoading: balance.isLoading,
    balanceError: balance.error,

    connectors: connect.connectors,

    // Снаружи по-прежнему называется connect,
    // но внутри используется Promise-версия connectAsync.
    connect: connect.connectAsync,

    connectError: connect.error,
    isConnectPending: connect.isPending,

    disconnect: disconnect.disconnect,

    chains: switchChain.chains,
    switchChain: switchChain.switchChain,
    switchChainError: switchChain.error,
    isSwitchChainPending: switchChain.isPending,
    pendingChainId: switchChain.variables?.chainId,
  };
}
