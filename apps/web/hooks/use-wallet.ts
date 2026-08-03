"use client";

import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
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
    connect: connect.connect,
    connectError: connect.error,
    isConnectPending: connect.isPending,
    disconnect: disconnect.disconnect,
  };
}
