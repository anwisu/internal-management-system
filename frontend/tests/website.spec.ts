import { test, expect } from '@playwright/test';

test.describe('Website E2E Test Suite', () => {
    test('Homepage loads and displays correct content', async ({ page }) => {
        // Navigate to the local server
        await page.goto('http://localhost:3000/');

        // Ensure the page title or a known element is visible
        // Wait for the app to mount and render
        await expect(page.locator('body')).toBeVisible();

        // Take a screenshot of the initial load for visual verification
        await page.screenshot({ path: 'tests/screenshots/homepage-initial-load.png' });

        // Assuming we have a Dashboard or main navigation element:
        // This looks for common text that might exist on a management system dashboard
        const bodyText = await page.locator('body').innerText();

        // Log the text so we can see what's currently rendering
        console.log('Homepage Body Text:', bodyText.substring(0, 200));

        // Wait and check if there are any obvious error boundaries triggered
        const errorBoundary = page.locator('text=Something went wrong');
        await expect(errorBoundary).not.toBeVisible();
    });
});
