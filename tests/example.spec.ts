import { test, expect } from '@playwright/test';

test('Example Test', async ({ page }) => {
  await page.goto('https://www.donut.com/');
  await expect(page).toHaveTitle(/.*/)
});
