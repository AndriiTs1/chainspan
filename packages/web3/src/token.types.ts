import type { SupportedChainId } from "./chains";

export type NativeToken = {
  type: "native";
  chainId: SupportedChainId;
  name: string;
  symbol: string;
  decimals: number;
};

export type Erc20Token = {
  type: "erc20";
  chainId: SupportedChainId;
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
};

export type Token = NativeToken | Erc20Token;
