import { test, expect } from '@playwright/test';

test('send message to Slack channel', async ({ page }) => {
  // Get environment variables
  const workspaceUrl = process.env.SLACK_WORKSPACE_URL;
  const email = process.env.SLACK_EMAIL;
  const password = process.env.SLACK_PASSWORD;
  const channel = process.env.SLACK_CHANNEL;

  // Verify environment variables are set
  if (!workspaceUrl || !email || !password || !channel) {
    throw new Error('Required environment variables are not set');
  }

  // Navigate to Slack workspace
  await page.goto(`https://${workspaceUrl}`);

  // Handle sign in
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  // Wait for Slack to load
  await page.waitForLoadState('networkidle');

  // Navigate to channel
  await page.goto(`https://${workspaceUrl}/messages/${channel}`);
  await page.waitForLoadState('networkidle');

  // Type and send message
  const messageInput = page.locator('[data-qa="message_input"]');
  await messageInput.click();
  await messageInput.fill('@Bar :doughnut: test');
  await page.keyboard.press('Enter');

  // Verify message was sent (look for it in the message list)
  await expect(page.locator('.p-rich_text_block', { hasText: '@Bar 🍩 test' })).toBeVisible();
}); 