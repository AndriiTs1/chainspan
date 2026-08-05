import type { RegisteredErc20Token } from "./token-registry";
import type {
  Erc20ContractReadResult,
  Erc20FieldComparison,
  Erc20MetadataComparison,
} from "./contract-read.types";

// Shape of a single decoded contract call, independent of any RPC/wagmi
// library - the caller (apps/web hook) is responsible for translating a
// wagmi multicall result into this before calling buildErc20ContractSnapshot.
export type ContractFieldRead<T> =
  | { status: "success"; value: T }
  | { status: "failure"; error: Error };

export type BuildErc20SnapshotParams = {
  token: RegisteredErc20Token;
  name: ContractFieldRead<string>;
  symbol: ContractFieldRead<string>;
  decimals: ContractFieldRead<number>;
  totalSupply: ContractFieldRead<bigint>;
};

function compareField<T>(onChainValue: T | null, curatedValue: T): Erc20FieldComparison {
  if (onChainValue === null) return "unavailable";
  return onChainValue === curatedValue ? "match" : "mismatch";
}

// decimals and totalSupply are required: decimals is needed to correctly
// format totalSupply (and to compare against the curated value), and
// totalSupply is the entire point of this read. Neither can be silently
// dropped into a "partial" snapshot, so either failing produces a failure
// result rather than a snapshot with missing critical fields.
//
// name and symbol are best-effort: the curated registry is already the
// trusted source for a token's display identity (see token-registry.ts), so
// a failed name()/symbol() read is diagnostic information going missing, not
// a reason to fail the whole read.
export function buildErc20ContractSnapshot(
  params: BuildErc20SnapshotParams,
): Erc20ContractReadResult {
  if (params.decimals.status === "failure") {
    return {
      status: "failure",
      failure: { category: "rpc_error", cause: params.decimals.error },
    };
  }

  if (params.totalSupply.status === "failure") {
    return {
      status: "failure",
      failure: { category: "rpc_error", cause: params.totalSupply.error },
    };
  }

  const onChainName = params.name.status === "success" ? params.name.value : null;
  const onChainSymbol = params.symbol.status === "success" ? params.symbol.value : null;
  const onChainDecimals = params.decimals.value;

  const metadataComparison: Erc20MetadataComparison = {
    name: compareField(onChainName, params.token.name),
    symbol: compareField(onChainSymbol, params.token.symbol),
    decimals: compareField(onChainDecimals, params.token.decimals),
  };

  return {
    status: "success",
    snapshot: {
      chainId: params.token.chainId,
      address: params.token.address,
      token: params.token,
      onChainName,
      onChainSymbol,
      onChainDecimals,
      totalSupply: params.totalSupply.value,
      metadataComparison,
    },
  };
}
