import type { SupportedChainId } from "./chains";
import type { RegisteredErc20Token } from "./token-registry";

// "unavailable" is distinct from "mismatch" - it means the on-chain call for
// that specific field failed, not that it succeeded and disagreed with the
// curated registry. Conflating the two would misreport a read failure as a
// data integrity problem.
export type Erc20FieldComparison = "match" | "mismatch" | "unavailable";

export type Erc20MetadataComparison = {
  name: Erc20FieldComparison;
  symbol: Erc20FieldComparison;
  // decimals is a required read (see Erc20ContractReadResult) - within a
  // successful snapshot this is therefore always "match" or "mismatch",
  // never "unavailable". Kept on the same three-state type for a uniform
  // shape rather than a one-off boolean.
  decimals: Erc20FieldComparison;
};

export type Erc20ContractSnapshot = {
  chainId: SupportedChainId;
  address: `0x${string}`;
  token: RegisteredErc20Token;
  // On-chain name/symbol are untrusted, contract-reported strings - kept
  // separate from the curated token.name/token.symbol, which remain the
  // trusted source for display identity. null means the read failed; it is
  // not equivalent to an empty string returned by the contract.
  onChainName: string | null;
  onChainSymbol: string | null;
  onChainDecimals: number;
  totalSupply: bigint;
  metadataComparison: Erc20MetadataComparison;
};

export type ContractReadErrorCategory =
  | "unsupported_chain"
  | "token_not_registered"
  | "rpc_error"
  | "unknown";

export type ContractReadFailure = {
  category: ContractReadErrorCategory;
  cause?: Error;
};

export type Erc20ContractReadResult =
  | { status: "success"; snapshot: Erc20ContractSnapshot }
  | { status: "failure"; failure: ContractReadFailure };
