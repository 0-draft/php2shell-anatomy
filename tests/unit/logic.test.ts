import { describe, it, expect } from 'vitest';
import { formatCountdown, patchIsLive, chooseVerdict, PATCH_TARGET_MS } from '../../src/logic';

describe('formatCountdown', () => {
  it('shows hours when present', () => {
    expect(formatCountdown(3_661_000)).toBe('1h 01m 01s');
  });
  it('omits hours under one hour', () => {
    expect(formatCountdown(65_000)).toBe('01m 05s');
  });
  it('clamps negative spans to zero', () => {
    expect(formatCountdown(-5000)).toBe('00m 00s');
  });
});

describe('patchIsLive', () => {
  it('is false just before the release', () => {
    expect(patchIsLive(PATCH_TARGET_MS - 1)).toBe(false);
  });
  it('is true at and after the release', () => {
    expect(patchIsLive(PATCH_TARGET_MS)).toBe(true);
    expect(patchIsLive(PATCH_TARGET_MS + 1)).toBe(true);
  });
});

describe('chooseVerdict', () => {
  it('flags end-of-life branches regardless of other answers', () => {
    expect(chooseVerdict('eol', 'yes', true)).toBe('eol');
  });
  it('treats unknown version as unknown', () => {
    expect(chooseVerdict('unknown', 'no', false)).toBe('unknown');
  });
  it('maps supported branches by patch timing', () => {
    expect(chooseVerdict('8.3', 'no', false)).toBe('supportedPre');
    expect(chooseVerdict('8.3', 'no', true)).toBe('supportedPost');
  });
  it('maps WAF-protected branches to the guarded verdicts', () => {
    expect(chooseVerdict('8.2', 'yes', false)).toBe('guardPre');
    expect(chooseVerdict('8.2', 'yes', true)).toBe('guardPost');
  });
});
