import { expect, Page } from "@playwright/test";

// Button and heading text constants
const CONTINUE_BUTTON = "Continue";
const SIGN_IN_WORKSPACE_HEADING = "Sign in to your workspace";
const SIGN_IN_PASSWORD_LINK = "sign in with a password instead";
const SIGN_IN_BUTTON = "Sign In";
const ACCEPT_CONTINUE_BUTTON = "Accept and Continue";
const MY_SHOUTOUTS_TEXT = "My Shoutouts";

// Input placeholder constants
const WORKSPACE_PLACEHOLDER = "your-workspace";
const EMAIL_PLACEHOLDER = "name@work-email.com";
const PASSWORD_PLACEHOLDER = "Your password";

// Selectors
const SHOUTOUTS_PROFILES_SELECTOR = "#shoutouts-profiles-show";
const SHOUTOUTS_COUNT_SELECTOR =
  '//*[@id="shoutouts-profiles-show"]/div/div[3]/div[2]/div[2]/div[1]';

export async function signIn(page: Page, { workspaceSlug, workspaceTitle, email, password }: { workspaceSlug: string; workspaceTitle: string; email: string; password: string }) {
  await page.goto(process.env.DONUT_SIGNIN_URL!);

  await expect(page.getByPlaceholder(WORKSPACE_PLACEHOLDER)).toBeVisible({ timeout: 10000 });
  await page.getByPlaceholder(WORKSPACE_PLACEHOLDER).fill(workspaceSlug);
  await page.getByRole("button", { name: CONTINUE_BUTTON }).click();

  await expect(page.getByRole("link", { name: SIGN_IN_PASSWORD_LINK })).toBeVisible({ timeout: 10000 });
  await page.getByRole("link", { name: SIGN_IN_PASSWORD_LINK }).click();

  await expect(page.getByPlaceholder(EMAIL_PLACEHOLDER)).toBeVisible({ timeout: 10000 });
  await page.getByPlaceholder(EMAIL_PLACEHOLDER).fill(email);
  await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill(password);
  await page.getByRole("button", { name: SIGN_IN_BUTTON, exact: true }).click();

  await expect(page.getByRole("button", { name: ACCEPT_CONTINUE_BUTTON })).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: ACCEPT_CONTINUE_BUTTON }).click();
}

export async function countShoutouts(page: Page) {
  await page.goto(process.env.DONUT_SHOUTOUTS_URL!);
  await expect(page.locator(SHOUTOUTS_PROFILES_SELECTOR).getByText(MY_SHOUTOUTS_TEXT)).toBeVisible();
  const count = await page.locator(SHOUTOUTS_COUNT_SELECTOR).innerText();
  return Number(count);
}
