import { AppKit } from '@reown/appkit-react-native';

// Split out purely so wallet.tsx (a shared, unsuffixed src/app route) never
// imports @reown/appkit-react-native directly - that import would otherwise
// also land in the web bundle and reintroduce the Node-SSR crash that
// mobile-providers.web.tsx / use-wallet.web.ts already avoid.
export function WalletModalMount() {
  return <AppKit />;
}
