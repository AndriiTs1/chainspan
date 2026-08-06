import type { ConnectionError } from "./connection.types";

// Same wagmi/WalletConnect error surface on web (wagmi 3.x) and mobile
// (wagmi 2.x via Reown AppKit) - both throw UserRejectedRequestError or a
// message drawn from this same small vocabulary when the user cancels from
// their wallet, so one classifier can serve both without either platform
// depending on the other's UI.
const userRejectionMessages = [
  "user rejected",
  "user denied",
  "request rejected",
  "connection request reset",
  "connection request expired",
];

export function classifyConnectionError(error: unknown): ConnectionError {
  if (!(error instanceof Error)) {
    return { category: "unknown" };
  }

  const message = error.message.toLowerCase();
  const isRejection =
    error.name === "UserRejectedRequestError" ||
    userRejectionMessages.some((needle) => message.includes(needle));

  return {
    category: isRejection ? "user_rejection" : "unknown",
    cause: error,
  };
}
