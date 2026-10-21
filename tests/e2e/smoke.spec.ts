import { test, expect } from '@playwright/test';

const PATH = '/php2shell-anatomy/';

test('renders the page with live status and no app errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const text = m.text();
    // External fonts and the optional PM avatar (handled by an onerror fallback)
    // are not app bugs.
    if (/fonts\.g|favicon|pm-avatar|net::ERR/i.test(text)) return;
    errors.push(text);
  });
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(PATH);
  await expect(page).toHaveTitle(/php2shell/i);
  await expect(page.locator('h1')).not.toBeEmpty();
  // '…' is the build-time placeholder; renderStatus() must replace it.
  await expect(page.locator('#statusBig')).not.toHaveText('…');
  await expect(page.locator('#expVerdict h3')).not.toBeEmpty();
  // every plate renders its cards
  await expect(page.locator('#whyCards .why-card')).toHaveCount(4);
  await expect(page.locator('#defs .def')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('language toggle switches English ↔ Japanese', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('#langTog').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('h1')).toContainText('PHP');
  await page.locator('#langTog').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('attack playback renders its instrument and steps', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('#atkMap .atk-node')).toHaveCount(5);
  await expect(page.locator('#atkFlow .atk-step')).toHaveCount(6);
  await expect(page.locator('#atkPips button')).toHaveCount(6);
  await expect(page.locator('#atkTerm .l').first()).toBeVisible();
});

test('exposure check reacts to an end-of-life selection', async ({ page }) => {
  await page.goto(PATH);
  await page.locator('#expVer button', { hasText: /8\.1 or older/ }).click();
  await expect(page.locator('#expVerdict')).toHaveClass(/crit/);
});
