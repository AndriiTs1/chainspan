import { supportedChains } from "@chainspan/web3";
import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

function getWalletConnectProjectId(): string {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured.",
    );
  }

  return projectId;
}

const walletConnectProjectId = getWalletConnectProjectId();

function createWagmiConfig() {
  const connectors =
    typeof window === "undefined"
      ? [
          injected({
            shimDisconnect: true,
          }),
        ]
      : (() => {
          const appUrl = window.location.origin;

          return [
            injected({
              shimDisconnect: true,
            }),
            walletConnect({
              projectId: walletConnectProjectId,
              showQrModal: true,
              logger: "fatal",
              metadata: {
                name: "ChainSpan",
                description:
                  "Production-oriented Web3 engineering platform.",
                url: appUrl,
                icons: [`${appUrl}/icon.svg`],
              },
              qrModalOptions: {
                themeMode: "dark",
              },
            }),
          ];
        })();

  return createConfig({
    chains: supportedChains,
    connectors,
    transports: {
      [supportedChains[0].id]: http(),
      [supportedChains[1].id]: http(),
      [supportedChains[2].id]: http(),
      [supportedChains[3].id]: http(),
      [supportedChains[4].id]: http(),
      [supportedChains[5].id]: http(),
    },
    ssr: true,
  });
}

// Fast Refresh re-evaluates this module on every dev-mode edit, which would
// otherwise recreate the WalletConnect connector - and the underlying
// @walletconnect/core Core singleton - on every hot reload, producing a
// spurious "Core is already initialized" warning. Caching the config on
// globalThis keeps the same instance alive across Fast Refresh, the same
// pattern Next.js itself recommends for the Prisma client singleton.
declare global {
  var __chainspanWagmiConfig: ReturnType<typeof createWagmiConfig> | undefined;
}

export const wagmiConfig =
  process.env.NODE_ENV === "production"
    ? createWagmiConfig()
    : (globalThis.__chainspanWagmiConfig ??= createWagmiConfig());
