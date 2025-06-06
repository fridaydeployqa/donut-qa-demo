import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test.describe.configure({ mode: 'serial' });

let shoutoutsReceived: number;

test('Bar Checks Received Shoutouts', async ({ page }) => {
  await page.goto(process.env.DONUT_SIGNIN_URL!);
  await expect(page.getByRole('heading', { name: 'Sign in to your workspace' })).toBeVisible();
  await page.getByPlaceholder('your-workspace').fill('fridaydeploy');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  await expect(page.getByRole('heading', { name: 'Sign in to Friday Deploy' })).toBeVisible();
  await page.getByRole('link', { name: 'sign in with a password instead' }).click();
  
  await expect(page.getByText('Email address' )).toBeVisible();
  await page.getByPlaceholder('name@work-email.com').fill(process.env.SLACK_BAR_EMAIL!);
  await page.getByPlaceholder('Your password').fill(process.env.SLACK_BAR_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Sign in to Donut with Slack' })).toBeVisible();
  await page.getByRole('button', { name: 'Accept and Continue' }).click();

  await page.goto(process.env.DONUT_SHOUTOUTS_URL!);
  await expect(page.locator('#shoutouts-profiles-show').getByText('My Shoutouts' )).toBeVisible();
  await page.screenshot({ path: 'test-screenshots/donut-shoutouts.png', fullPage: true });

  shoutoutsReceived = Number(await page.locator('//*[@id="shoutouts-profiles-show"]/div/div[3]/div[2]/div[2]/div[1]').innerText());
  // console.log(shoutoutsReceived);
})

test('Foo Sends Shoutout To Bar', async ({ page }) => {

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

test('Bar Re-Checks Received Shoutouts', async ({ page }) => {
  await page.goto(process.env.DONUT_SIGNIN_URL!);
  await expect(page.getByRole('heading', { name: 'Sign in to your workspace' })).toBeVisible();
  await page.getByPlaceholder('your-workspace').fill('fridaydeploy');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  await expect(page.getByRole('heading', { name: 'Sign in to Friday Deploy' })).toBeVisible();
  await page.getByRole('link', { name: 'sign in with a password instead' }).click();
  
  await expect(page.getByText('Email address' )).toBeVisible();
  await page.getByPlaceholder('name@work-email.com').fill(process.env.SLACK_BAR_EMAIL!);
  await page.getByPlaceholder('Your password').fill(process.env.SLACK_BAR_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Sign in to Donut with Slack' })).toBeVisible();
  await page.getByRole('button', { name: 'Accept and Continue' }).click();

  await page.goto(process.env.DONUT_SHOUTOUTS_URL!);
  await expect(page.locator('#shoutouts-profiles-show').getByText('My Shoutouts' )).toBeVisible();
  await page.screenshot({ path: 'test-screenshots/donut-shoutouts-2.png', fullPage: true });

  expect(await page.locator('//*[@id="shoutouts-profiles-show"]/div/div[3]/div[2]/div[2]/div[1]').innerText()).toBe(String(++shoutoutsReceived));
})