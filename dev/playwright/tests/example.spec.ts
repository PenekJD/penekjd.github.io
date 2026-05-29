import { test, expect } from '@playwright/test';

const MAIN_URL:string = process.env.BASE_URL ?? 'http://127.0.0.1:5500';

test('Main functions', async ({ page }) => {
    await page.goto(MAIN_URL);

    await test.step("Check the page title", async () => {
        await expect(page).toHaveTitle(/Languager/);
    });

    const pageNavigation = await page.locator('nav[role="navigation"]');
    await test.step("Check page navigation", async () => {
        await expect(pageNavigation).toBeVisible();
    });

    await page.content();
});
