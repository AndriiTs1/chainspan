import { getSupportedChain } from "./chains";
import type { NativeToken, Token } from "./token.types";

export function getNativeToken(chainId: number): NativeToken | undefined {
  const chain = getSupportedChain(chainId);

  if (!chain) return undefined;

  return {
    type: "native",
    chainId: chain.id,
    name: chain.nativeCurrency.name,
    symbol: chain.nativeCurrency.symbol,
    decimals: chain.nativeCurrency.decimals,
  };
}

export function isNativeToken(token: Token): token is NativeToken {
  return token.type === "native";
}
