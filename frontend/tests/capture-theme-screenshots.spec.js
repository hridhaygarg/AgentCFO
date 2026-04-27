import { test } from '@playwright/test';

const SCREENS = [
  { name: 'landing', url: 'https://layeroi.com/' },
  { name: 'signup', url: 'https://layeroi.com/signup' },
  { name: 'login', url: 'https://layeroi.com/login' },
];

for (const screen of SCREENS) {
  test(`screenshot ${screen.name} — dark mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(screen.url);
    await page.waitForTimeout(2000);
    // Ensure dark mode
    await page.evaluate(() => {
      localStorage.setItem('layeroi-theme-mode', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `tests/theme-screenshots/${screen.name}-dark.png`, fullPage: true });
  });

  test(`screenshot ${screen.name} — light mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(screen.url);
    await page.waitForTimeout(2000);
    // Force light via toggle click
    const lightBtn = page.locator('button[title="Light"]');
    if (await lightBtn.count() > 0) {
      await lightBtn.first().click();
      await page.waitForTimeout(500);
    } else {
      await page.evaluate(() => {
        localStorage.setItem('layeroi-theme-mode', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
      });
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: `tests/theme-screenshots/${screen.name}-light.png`, fullPage: true });
  });
}
