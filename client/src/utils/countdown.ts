export const NO_SHOW_SECONDS = 120;
export const NO_SHOW_TIMEOUT_MS = NO_SHOW_SECONDS * 1000;

/**
 * Computes client-vs-server clock skew once per API response (`localOffsetMs = Date.now() - serverNowMs`).
 * Returns null if `serverNow` is omitted or invalid so callers can handle legacy fallback cleanly.
 */
export function computeServerOffsetMs(serverNow?: string): number | null {
  if (!serverNow) return null;
  const serverMs = new Date(serverNow).getTime();
  if (Number.isNaN(serverMs)) return null;
  return Date.now() - serverMs;
}

/**
 * Computes server-synchronized remaining seconds before the 120s No-Show window expires (`Math.ceil`).
 */
export function computeNoShowRemainingSeconds(
  calledAt: string | null | undefined,
  serverOffsetMs: number | null,
  fallbackSeconds = NO_SHOW_SECONDS,
): number {
  if (!calledAt) return fallbackSeconds;
  const calledMs = new Date(calledAt).getTime();
  if (Number.isNaN(calledMs)) return fallbackSeconds;

  const virtualServerNow = Date.now() - (serverOffsetMs ?? 0);
  return Math.max(0, Math.ceil((calledMs + NO_SHOW_TIMEOUT_MS - virtualServerNow) / 1000));
}
