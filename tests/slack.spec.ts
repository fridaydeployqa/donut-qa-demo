import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('send message to Slack channel', async ({ page }) => {
  // Get environment variables
  const workspaceUrl = process.env.SLACK_WORKSPACE_URL;
  const email = process.env.SLACK_EMAIL;
  const password = process.env.SLACK_PASSWORD;
  const channel = process.env.SLACK_CHANNEL;

  // Verify environment variables are set
  if (!workspaceUrl || !email || !password || !channel) {
    console.error('Missing environment variables:');
    console.error('SLACK_WORKSPACE_URL:', workspaceUrl ? '✓' : '✗');
    console.error('SLACK_EMAIL:', email ? '✓' : '✗');
    console.error('SLACK_PASSWORD:', password ? '✓' : '✗');
    console.error('SLACK_CHANNEL:', channel ? '✓' : '✗');
    throw new Error('Required environment variables are not set. Please check your .env file');
  }

  // Configure longer timeout for Slack operations
  page.setDefaultTimeout(30000);

  try {
    // Navigate to Slack workspace
    await page.goto(`https://${workspaceUrl}`);

    // Check if we need to sign in (might be already signed in)
    const signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
    if (await signInButton.isVisible()) {
      // Handle sign in
      await page.getByLabel('Email', { exact: true }).fill(email);
      await page.getByLabel('Password', { exact: true }).fill(password);
      await signInButton.click();
    }

    // Wait for Slack to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to channel
    await page.goto(`https://${workspaceUrl}/messages/${channel}`);
    await page.waitForLoadState('networkidle');

    // Wait for the channel to load
    await page.waitForSelector('[data-qa="message_input"]', { state: 'visible' });

    // Ensure we're in the right channel
    const channelTitle = await page.locator('[data-qa="channel_name"]').textContent();
    expect(channelTitle?.toLowerCase()).toContain(channel.toLowerCase());

    // Type and send message
    const messageInput = page.locator('[data-qa="message_input"]');
    await messageInput.click();
    await messageInput.clear();
    await messageInput.fill('@Bar :doughnut: test');
    await page.keyboard.press('Enter');

    // Wait for message to be sent (look for the sending indicator to disappear)
    await page.waitForSelector('[data-qa="message_sending_indicator"]', { state: 'hidden', timeout: 10000 }).catch(() => {
      console.log('Message sending indicator not found, continuing...');
    });

    // Verify message was sent (look for it in the message list)
    // We'll wait a bit longer for this verification
    await expect(page.locator('.p-rich_text_block', { hasText: '@Bar' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.c-message__body', { hasText: 'test' })).toBeVisible({ timeout: 10000 });

    // Optional: Verify emoji rendered
    await expect(page.locator('img[data-qa="emoji"]')).toBeVisible({ timeout: 10000 });

  } catch (error) {
    console.error('Test failed:', error);
    // Take a screenshot on failure
    await page.screenshot({ path: 'slack-test-failure.png', fullPage: true });
    throw error;
  }
}); 