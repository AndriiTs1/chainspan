import type { SupportedChainId } from "./chains";

export type SigningRequest = {
  message: string;
  address: `0x${string}`;
  chainId: SupportedChainId;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
};

export type SigningResult = {
  request: SigningRequest;
  signature: `0x${string}`;
};

export type VerificationResult = {
  isValid: boolean;
  accountChangedSinceSigning: boolean;
  chainChangedSinceSigning: boolean;
};

export type SigningErrorCategory =
  | "user_rejection"
  | "wallet_unavailable"
  | "unsupported_chain"
  | "account_changed"
  | "chain_changed"
  | "expired_request"
  | "verification_failed"
  | "malformed_signature"
  | "unknown";

export type SigningError = {
  category: SigningErrorCategory;
  cause?: Error;
};
