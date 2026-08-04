import { supportedChains } from "@chainspan/web3";
import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error(
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured.",
  );
}

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

export const wagmiConfig = createConfig({
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
