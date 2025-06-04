import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://www.donut.com/');
  await expect(page).toHaveTitle(/.*/)
});

test('navigation test', async ({ page }) => {
  await page.goto('https://www.donut.com/');
  
  // Example of interacting with elements
  // await page.click('text=Login');
  // await expect(page).toHaveURL(/.*login/);
}); 