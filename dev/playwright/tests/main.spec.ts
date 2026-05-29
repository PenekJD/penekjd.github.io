import { test, expect } from '@playwright/test';

const MAIN_URL:string = process.env.BASE_URL ?? 'http://127.0.0.1:5500';

const TEST_DATA:any = {
    "assessment-url" : "/pages/page1.html",
    "correct-translation" : ["Правильный Ввод", "Correct Input"]
};

test('Main features checking', async ({ page }) => {
    
    /** Check Main page */
    await page.goto(MAIN_URL);
    await page.content();

    await test.step("Check the page title", async () => {
        await expect(page).toHaveTitle(/Languager/);
    });

    let pageNavigation = null;
    await test.step("Check page navigation", async () => {
        pageNavigation = await page.locator('nav[role="navigation"]');
        await expect(pageNavigation).toBeVisible();
    });

    let mainInput = null;
    let submitButton = null;
    let inputStringSample = TEST_DATA["correct-translation"][0] + '+++' + TEST_DATA["correct-translation"][1]
    await test.step("Check main Log input", async () => {
        mainInput = await page.locator('.abstract_input_field input');
        submitButton = await page.locator('.abstract_input_field button')
        await expect(mainInput).toBeVisible();
        await mainInput.fill(inputStringSample);
        await submitButton.click();
    });

    let wordListEl = null;
    await test.step("Check if the Log input has been saved", async () => {
        wordListEl = await page.locator(".words-column .string-row .lang");
        const inputResult = await wordListEl.innerText();
        expect(inputResult).toBe(TEST_DATA["correct-translation"][1]);
    });


    /** Check Assessment Page */
    await page.goto(MAIN_URL + TEST_DATA["assessment-url"]);
    await page.content();

    let assessmentButton = null;
    await test.step("Check Assessment Start Button", async () => {
        assessmentButton = await page.locator(".assessment-block button");
        await expect(assessmentButton).toBeVisible();
        await assessmentButton.click();
    });

    let suggestedTranslationElement = null; //
    await test.step("Wait for Suggested text element", async () => {
        suggestedTranslationElement = await page.locator(".suggested-translation");
        await expect(suggestedTranslationElement).toBeVisible();

        const inputResult = await suggestedTranslationElement.innerText();
        expect(inputResult).toBe(TEST_DATA["correct-translation"][0]);
    });
});
