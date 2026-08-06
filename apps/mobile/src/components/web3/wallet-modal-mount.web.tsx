// Web preview never wires AppKit (see mobile-providers.web.tsx) - this
// no-op keeps wallet.tsx's import unconditional across platforms without
// pulling @reown/appkit-react-native into the web bundle.
export function WalletModalMount() {
  return null;
}
