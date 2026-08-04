import type { SupportedChainId } from "./chains";
import type { Token } from "./token.types";

export type AssetBalance = {
  token: Token;
  value: bigint;
};

export type Portfolio = {
  address: `0x${string}`;
  chainId: SupportedChainId;
  assets: readonly AssetBalance[];
};
