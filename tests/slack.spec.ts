import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('send message to Slack channel', async ({ page }) => {
  // Get environment variables
  const signinUrl = process.env.SLACK_SIGNIN_URL;
  const fooEmail = process.env.SLACK_FOO_EMAIL;
  const fooPassword = process.env.SLACK_FOO_PASSWORD;
  const channelURL = process.env.SLACK_CHANNEL_URL;

  await page.goto(`${signinUrl}`);

  await page.getByPlaceholder('name@work-email.com').fill(fooEmail!);
  await page.getByPlaceholder('Your password').fill(fooPassword!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Launching Friday Deploy' })).toBeVisible();
  await page.getByRole('link', { name: 'use Slack in your browser' }).click();

  await expect(page.getByRole('button', { name: 'Friday Deploy Actions' })).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: 'test-screenshots/slack-workspace.png', fullPage: true });

  await page.goto(`${channelURL}`);
  await expect(page.getByRole('button', { name: '#demo-donut-qa', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-screenshots/slack-channel.png', fullPage: true });

  await page.getByRole('textbox', { name: 'Message to demo-donut-qa' }).fill('@Bar :doughnut: test');
  await page.getByRole('button', { name: 'Send now' }).click();
  
  await expect(page.getByText('@Bar test').last()).toBeVisible();
  await page.screenshot({ path: 'test-screenshots/slack-message.png', fullPage: true });
}); 