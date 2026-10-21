// Pure, framework-free logic shared by the page and the unit tests.

/** The out-of-cycle PHP security release: 2026-10-21 14:00:00 UTC. */
export const PATCH_TARGET_MS = Date.UTC(2026, 9, 21, 14, 0, 0);

/** Has the patch release time passed? */
export function patchIsLive(now: number, target: number = PATCH_TARGET_MS): boolean {
  return now >= target;
}

/** Format a positive millisecond span as `1h 02m 03s` (hours shown only when > 0). */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${h > 0 ? `${h}h ` : ''}${pad(m)}m ${pad(s)}s`;
}

export type VerdictKey =
  'eol' | 'supportedPre' | 'supportedPost' | 'guardPre' | 'guardPost' | 'unknown';

/** Choose which exposure verdict applies from the user's branch + edge-filter answer. */
export function chooseVerdict(ver: string, waf: string, isLive: boolean): VerdictKey {
  if (ver === 'eol') return 'eol';
  if (ver === 'unknown') return 'unknown';
  if (waf === 'yes') return isLive ? 'guardPost' : 'guardPre';
  return isLive ? 'supportedPost' : 'supportedPre';
}
