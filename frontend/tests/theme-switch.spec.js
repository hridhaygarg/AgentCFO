import { test, expect } from '@playwright/test';

test('theme toggle visibly changes colors on landing page', async ({ page }) => {
  await page.goto('https://layeroi.com');
  await page.waitForTimeout(3000);

  const getDataTheme = () => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const getBodyBg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  // Click Light
  await page.locator('button[title="Light"]').first().click();
  await page.waitForTimeout(500);
  expect(await getDataTheme()).toBe('light');
  const lightRgb = (await getBodyBg()).match(/\d+/g).map(Number);
  expect(lightRgb[0]).toBeGreaterThan(200);

  // Click Dark
  await page.locator('button[title="Dark"]').first().click();
  await page.waitForTimeout(500);
  expect(await getDataTheme()).toBe('dark');
  const darkRgb = (await getBodyBg()).match(/\d+/g).map(Number);
  expect(darkRgb[0]).toBeLessThan(30);

  console.log('✅ Landing toggle: Light/Dark switch verified');
});

test('auto mode follows system preference', async ({ page }) => {
  // Set system to dark, then load
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('https://layeroi.com');
  await page.waitForTimeout(2000);

  // Click Auto
  await page.locator('button[title="Auto"]').first().click();
  await page.waitForTimeout(500);

  const getDataTheme = () => page.evaluate(() => document.documentElement.getAttribute('data-theme'));

  expect(await getDataTheme()).toBe('dark');
  console.log('  Auto + system dark → dark ✓');

  // Now switch system to light — theme should follow automatically
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForTimeout(1000);

  expect(await getDataTheme()).toBe('light');
  console.log('  Auto + system light → light ✓');

  // Switch back to dark
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForTimeout(1000);

  expect(await getDataTheme()).toBe('dark');
  console.log('✅ Auto mode follows system preference');
});

test('dashboard topbar has theme toggle', async ({ page }) => {
  // Sign up fresh user
  const ts = Date.now();
  await page.goto('https://layeroi.com/signup');
  await page.waitForTimeout(2000);

  await page.fill('input[name="name"]', 'Theme Test');
  await page.fill('input[name="email"]', `test+theme${ts}@layeroi.com`);
  await page.fill('input[name="company"]', 'Theme Co');
  await page.fill('input[name="password"]', 'testpass123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  // Navigate to dashboard
  await page.goto('https://layeroi.com/dashboard');
  await page.waitForTimeout(3000);

  // Find toggle in topbar (header element)
  const topbarToggle = page.locator('header button[title="Light"]');
  const count = await topbarToggle.count();
  console.log('Toggle buttons in topbar/header:', count);
  expect(count).toBeGreaterThan(0);

  // Click it and verify theme changes
  await topbarToggle.first().click();
  await page.waitForTimeout(500);
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(theme).toBe('light');

  console.log('✅ Dashboard topbar toggle works');
});
