/** Accounts created within this window via login OAuth are treated as unauthorized signups. */
const FRESH_ACCOUNT_MS = 120_000;

export function isFreshAuthUser(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < FRESH_ACCOUNT_MS;
}
