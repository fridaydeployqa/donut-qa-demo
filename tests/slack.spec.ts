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

  // Configure longer timeout for Slack operations
  page.setDefaultTimeout(30000);

  try {
    // Navigate to Slack workspace
    await page.goto(`${signinUrl}`);

    // Wait for login form to be ready
    await page.waitForSelector('[data-qa="login_email"]', { state: 'visible' });
    await page.waitForSelector('[data-qa="login_password"]', { state: 'visible' });
    
    // Fill login form
    await page.fill('[data-qa="login_email"]', fooEmail!);
    await page.fill('[data-qa="login_password"]', fooPassword!);
    
    // Wait for button to be clickable and click it
    await page.waitForSelector('[data-qa="signin_button"]', { state: 'visible' });
    await Promise.all([
      page.waitForNavigation(), // Wait for navigation to complete
      page.click('[data-qa="signin_button"]')
    ]);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    // Wait for and click the "Open in browser" button if it exists
    await page.waitForSelector('[data-qa="ssb_redirect_open_in_browser"]', { timeout: 10000 })
      .then(async () => {
        await Promise.all([
          page.waitForNavigation(),
          page.click('[data-qa="ssb_redirect_open_in_browser"]')
        ]);
      })
      .catch(() => console.log('No browser redirect button found, continuing...'));

    // Wait again for page to be stable
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    // Take screenshot of workspace
    await page.screenshot({ path: 'test-screenshots/slack-workspace.png', fullPage: true });

    // Navigate to channel with navigation wait
    await Promise.all([
      page.waitForNavigation(),
      page.goto(`${channelURL}`)
    ]);

    // Wait for channel page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    // Wait for message input to be ready
    await page.waitForSelector('[data-qa="message_input"]', { state: 'visible', timeout: 10000 });
    
    // Take screenshot of channel
    await page.screenshot({ path: 'test-screenshots/slack-channel.png', fullPage: true });

    // Type and send message with proper waits
    const messageInput = page.locator('[data-qa="message_input"]');
    await messageInput.waitFor({ state: 'visible' });
    await messageInput.click();
    await messageInput.fill('@Bar :doughnut: test');

    // Wait for send button and click
    const sendButton = page.locator('[data-qa="texty_send_button"]');
    await sendButton.waitFor({ state: 'visible' });
    
    // Click send and wait for network activity to settle
    await Promise.all([
      page.waitForResponse(response => 
        response.url().includes('/api/chat.postMessage') && 
        response.status() === 200
      ),
      sendButton.click()
    ]);

    // Wait a moment for the UI to update
    await page.waitForTimeout(2000);

    // Take final screenshot
    await page.screenshot({ path: 'test-screenshots/slack-message.png', fullPage: true });

  } catch (error) {
    console.error('Test failed:', error);
    
    // Take error screenshot
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ 
        path: `test-screenshots/slack-error-${timestamp}.png`,
        fullPage: true 
      });
    } catch (screenshotError) {
      console.error('Failed to take error screenshot:', screenshotError);
    }
    
    throw error;
  }
}); 