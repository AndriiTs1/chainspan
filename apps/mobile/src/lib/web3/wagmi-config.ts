import '@walletconnect/react-native-compat';

import { supportedChains } from '@chainspan/web3';
import { createAppKit } from '@reown/appkit-react-native';
import { formatNetworks, WagmiAdapter } from '@reown/appkit-wagmi-react-native';
import type { Chain } from 'wagmi/chains';

import { asyncStorageAdapter } from './storage';

// packages/web3 (typescript ^5.9.3) and apps/mobile (typescript ~6.0.3)
// pull separately-resolved instances of the same viem@2.55.10, so their
// Chain types are structurally identical but nominally distinct - the cast
// below only reconciles that TS-instance mismatch, not a real shape
// difference (apps/web's wagmi 3.x config takes the same supportedChains
// array with no cast at all).
const wagmiChains = supportedChains as unknown as readonly [Chain, ...Chain[]];

function getProjectId(): string {
  const projectId = process.env.EXPO_PUBLIC_REOWN_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      'EXPO_PUBLIC_REOWN_PROJECT_ID is not configured. Set it in apps/mobile/.env (see .env.example) before starting the app.',
    );
  }

  return projectId;
}

const projectId = getProjectId();

export const wagmiAdapter = new WagmiAdapter({
  networks: wagmiChains,
  projectId,
});

export const appKit = createAppKit({
  projectId,
  metadata: {
    name: 'ChainSpan',
    description: 'Production-oriented Web3 engineering platform.',
    url: 'https://chainspan.vercel.app',
    icons: ['https://chainspan.vercel.app/icon.svg'],
    redirect: {
      native: 'chainspan://',
    },
  },
  adapters: [wagmiAdapter],
  networks: formatNetworks([...supportedChains]),
  storage: asyncStorageAdapter,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
