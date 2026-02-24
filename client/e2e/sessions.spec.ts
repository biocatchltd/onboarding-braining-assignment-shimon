import { test, expect } from '@playwright/test';

test.describe('Sessions page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15_000 });
  });

  test('shows sessions page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sessions' })).toBeVisible();
  });

  test('shows Add Session button in footer', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add Session' })).toBeVisible();
  });

  test('opens create dialog when Add Session is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Session' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel(/multi user id/i)).toBeVisible();
  });

  test('can create a new session', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Session' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel(/multi user id/i).fill('550e8400-e29b-41d4-a716-446655440000');
    await page.getByLabel(/device/i).click();
    await page.getByRole('option', { name: 'PC' }).click();
    await page.getByLabel(/transfer usd/i).fill('150.50');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Session created successfully')).toBeVisible({ timeout: 5000 });
  });

  test('can open edit dialog by clicking a session row', async ({ page }) => {
    await page.waitForSelector('table tbody tr, [class*="MuiCard"]', { timeout: 10000 });
    const firstRow = page.locator('table tbody tr').first();
    if (await firstRow.count() > 0) {
      await firstRow.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    } else {
      const firstCard = page.locator('[class*="MuiCard"]').first();
      await firstCard.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('shows table or empty state', async ({ page }) => {
    // Wait for loading to finish (loader disappears)
    await expect(page.getByText('Loading sessions…')).not.toBeVisible({ timeout: 15_000 });
    const hasTable = (await page.locator('table').count()) > 0;
    const hasEmptyState = (await page.getByText('No sessions yet').count()) > 0;
    const hasCards = (await page.locator('[class*="MuiCard"]').count()) > 0;
    const hasError = (await page.getByRole('button', { name: /retry/i }).count()) > 0;
    expect(hasTable || hasEmptyState || hasCards || hasError).toBeTruthy();
  });
});
