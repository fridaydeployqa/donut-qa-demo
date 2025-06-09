import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { signIn, countShoutouts } from "../helpers/donut";

// Load environment variables from .env file
dotenv.config();

// Workspace constants
const WORKSPACE_SLUG = 'fridaydeploy';
const WORKSPACE_TITLE = 'Friday Deploy';

// Input placeholders
const EMAIL_PLACEHOLDER = 'name@work-email.com';
const PASSWORD_PLACEHOLDER = 'Your password';

// Button and heading text
const SIGN_IN_BUTTON = 'Sign In';
const LAUNCHING_HEADING = 'Launching Friday Deploy';
const USE_SLACK_LINK = 'use Slack in your browser';
const ACTIONS_BUTTON = 'Friday Deploy Actions';
const CHANNEL_BUTTON = '#demo-donut-qa';
const SEND_NOW_BUTTON = 'Send now';

// Message constants
const MESSAGE_TEXTBOX_NAME = 'Message to demo-donut-qa';
const SHOUTOUT_MESSAGE = '@Bar :doughnut: test';
const SHOUTOUT_TEXT = '@Bar test';

test.describe.configure({ mode: 'serial' });

test('Give and Receive Shoutouts', async ({ page }) => {  
  await signIn(page, {
    workspaceSlug: WORKSPACE_SLUG,
    workspaceTitle: WORKSPACE_TITLE,
    email: process.env.SLACK_BAR_EMAIL!,
    password: process.env.SLACK_BAR_PASSWORD!,
  });

  const shoutoutsReceived = await countShoutouts(page);

  await page.context().clearCookies();

  await page.goto(process.env.SLACK_SIGNIN_URL!, { waitUntil: "domcontentloaded" });

  // TODO expect
  await page.getByPlaceholder(EMAIL_PLACEHOLDER).fill(process.env.SLACK_FOO_EMAIL!);
  await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill(process.env.SLACK_FOO_PASSWORD!);
  await page.getByRole('button', { name: SIGN_IN_BUTTON, exact: true }).click();

  await page.getByRole('heading', { name: LAUNCHING_HEADING }).waitFor({ state: 'visible' });
  await page.getByRole('link', { name: USE_SLACK_LINK }).click();

  await page.getByRole('button', { name: ACTIONS_BUTTON }).waitFor({ state: 'visible' })
  
  await page.goto(process.env.SLACK_CHANNEL_URL!, { waitUntil: "domcontentloaded" });
  
  await page.getByRole('button', { name: CHANNEL_BUTTON, exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('textbox', { name: MESSAGE_TEXTBOX_NAME }).fill(SHOUTOUT_MESSAGE);
  await page.getByRole('button', { name: SEND_NOW_BUTTON }).click();
  
  await page.getByText(SHOUTOUT_TEXT).last().waitFor({ state: 'visible' });
  
  await page.context().clearCookies();

  await signIn(page, {
    workspaceSlug: WORKSPACE_SLUG,
    workspaceTitle: WORKSPACE_TITLE,
    email: process.env.SLACK_BAR_EMAIL!,
    password: process.env.SLACK_BAR_PASSWORD!,
  });

  const newCount = await countShoutouts(page);
  expect(newCount).toBe(shoutoutsReceived + 1);
});
