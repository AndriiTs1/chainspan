import { getSupportedChain } from "./chains";
import type { SupportedChainId } from "./chains";
import type {
  SigningError,
  SigningRequest,
  VerificationResult,
} from "./signing.types";

export type BuildSigningMessageParams = {
  appName: string;
  domain: string;
  address: `0x${string}`;
  chainId: SupportedChainId;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
};

// Nonce/issuedAt/expiresAt are inputs, not generated here - keeps this
// function pure and deterministic so it stays cheap to unit test without
// mocking crypto.randomUUID()/Date.
export function buildSigningMessage(
  params: BuildSigningMessageParams,
): SigningRequest {
  const chain = getSupportedChain(params.chainId);
  const networkLabel = chain
    ? `${chain.name} (Chain ID: ${chain.id})`
    : `Chain ID: ${params.chainId}`;

  const message = [
    `${params.appName} Message Verification`,
    "",
    "Purpose:",
    "Verify ownership of this wallet.",
    "",
    "Application:",
    params.appName,
    "",
    "Domain:",
    params.domain,
    "",
    "Wallet:",
    params.address,
    "",
    "Network:",
    networkLabel,
    "",
    "Nonce:",
    params.nonce,
    "",
    "Issued At:",
    params.issuedAt,
    "",
    "Expires At:",
    params.expiresAt,
    "",
    "This request will not submit a blockchain transaction and will not cost any gas.",
    "",
    "Only sign this message if you trust this application.",
  ].join("\n");

  return {
    message,
    address: params.address,
    chainId: params.chainId,
    nonce: params.nonce,
    issuedAt: params.issuedAt,
    expiresAt: params.expiresAt,
  };
}

// `now` is a parameter (not `new Date()` internally) for the same
// determinism reason as above.
export function isSigningRequestExpired(
  request: SigningRequest,
  now: Date,
): boolean {
  return now.getTime() >= new Date(request.expiresAt).getTime();
}

export type BuildVerificationResultParams = {
  isValid: boolean;
  requestAddress: `0x${string}`;
  currentAddress: `0x${string}` | undefined;
  requestChainId: SupportedChainId;
  currentChainId: number | undefined;
};

export function buildVerificationResult(
  params: BuildVerificationResultParams,
): VerificationResult {
  const accountChangedSinceSigning =
    params.currentAddress === undefined ||
    params.currentAddress.toLowerCase() !== params.requestAddress.toLowerCase();

  const chainChangedSinceSigning =
    params.currentChainId === undefined ||
    params.currentChainId !== params.requestChainId;

  return {
    isValid: params.isValid,
    accountChangedSinceSigning,
    chainChangedSinceSigning,
  };
}

// Classifies a caught sign-message exception as a user rejection vs.
// anything else. Only handles this one distinction (the rest of the error
// model - wallet_unavailable, unsupported_chain, expired_request, etc. - is
// decided directly by the caller's own control flow, not by inspecting a
// caught error, so it doesn't belong in a classifier).
export function classifySigningError(error: unknown): SigningError {
  if (!(error instanceof Error)) {
    return { category: "unknown" };
  }

  const message = error.message.toLowerCase();
  const isRejection =
    error.name === "UserRejectedRequestError" ||
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("request rejected");

  return {
    category: isRejection ? "user_rejection" : "unknown",
    cause: error,
  };
}
