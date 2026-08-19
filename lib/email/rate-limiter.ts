/**
 * Server-Side In-Memory Rate Limiter and Idempotency Key Manager
 * Enforces rate limits per identifier (e.g. NPM/IP) and prevents duplicate email dispatches via email_event_key
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const processedEventKeys = new Set<string>();

/**
 * Checks whether an email dispatch is allowed within the rate limit window
 * @param identifier Target NPM, email, or IP address
 * @param maxRequests Max dispatches allowed per window (Default: 3 per hour)
 * @param windowMs Window duration in ms (Default: 1 hour = 3600000 ms)
 */
export function checkEmailRateLimit(
  identifier: string,
  maxRequests: number = 3,
  windowMs: number = 3600000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const cleanId = identifier.trim().toLowerCase();

  let record = rateLimitStore.get(cleanId);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(cleanId, record);
  }

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetTime = oldestTimestamp + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetTime
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetTime: now + windowMs
  };
}

/**
 * Checks if an email event key (e.g. HLP-2026-XXXXX:created) has already been processed (Idempotency)
 */
export function hasProcessedEmailEvent(eventKey: string): boolean {
  return processedEventKeys.has(eventKey.trim());
}

/**
 * Marks an email event key as processed (Idempotency)
 */
export function markEmailEventProcessed(eventKey: string): void {
  processedEventKeys.add(eventKey.trim());
}

/**
 * Reset rate limit and idempotency stores (Testing Utility)
 */
export function resetEmailRateLimitStores(): void {
  rateLimitStore.clear();
  processedEventKeys.clear();
}
