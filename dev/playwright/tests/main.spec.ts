import { test, expect, type Locator } from '@playwright/test';

const MAIN_URL:string = process.env.BASE_URL ?? 'http://127.0.0.1:5500';

const TEST_DATA:any = {
    "assessment-url" : "/pages/page1.html",
    "correct-translation" : ["Правильный Ввод", "Correct Input"],
    "incorrect-check" : "Incorrect Inpat",
    "menu-check": [
        { title: "Languager", url: "/index.html" },
        { title: "Languager | Assessment", url: "/pages/page1.html" },
        { title: "Languager | Progress Data", url: "/pages/save.html" },
        { title: "Languager | About", url: "/pages/about.html" },
    ]
};

test('Main features checking', async ({ page }) => {
    
    /** Check Main page */
    await page.goto(MAIN_URL);
    await page.content();


    await test.step("Check Homepage title", async () => {
        await expect(page).toHaveTitle(/Languager/);
    });

    let pageNavigation:Locator|null = null;
    await test.step("Check page navigation", async () => {
        pageNavigation = await page.locator('nav[role="navigation"]');
        await expect(pageNavigation).toBeVisible();

        const menuItems = await page.locator('a.menu-tab').all();
        for (let idx = 0; idx < menuItems.length; idx++) {
            const escapedPath = TEST_DATA['menu-check'][idx].url.replace(/\./g, '\\.');
            const urlRegExp = new RegExp('.*' + escapedPath);
            await menuItems[idx].click();
            await expect(page).toHaveTitle(TEST_DATA['menu-check'][idx].title);
            await expect(page).toHaveURL(urlRegExp);
        }
    });


    // Back to main page
    await page.goto(MAIN_URL);

    let mainInput: Locator|null = null;
    let submitButton: Locator|null = null;
    let inputStringSample: string = TEST_DATA["correct-translation"][0] + '+++' + TEST_DATA["correct-translation"][1];
    let inputStringWrong: string = "Example of wrong input";

    await test.step("Check the Log input - Correct", async () => {
        mainInput = await page.locator('.abstract_input_field input');
        submitButton = await page.locator('.abstract_input_field button');
        await expect(mainInput).toBeVisible();
        await mainInput.fill(inputStringSample);
        await submitButton.click();
    });
    await test.step("Check the Log input - Wrong", async () => {
        if (!mainInput || !submitButton) {
            throw new Error("Something wrong with the Homepage input interface");
        };
        await mainInput.fill(inputStringWrong);
        await submitButton.click();
        const errorMessageElement: Locator = await page.getByTestId('error-message');
        await expect(errorMessageElement).toBeVisible();
    });

    let wordListEl:Locator|null = null;

    await test.step("Check if the Log input has been saved", async () => {
        wordListEl = await page.locator(".words-column .string-row .lang");
        const inputResult = await wordListEl.innerText();
        expect(inputResult).toBe(TEST_DATA["correct-translation"][1]);
    });



    /** Check Assessment Page */

    await page.goto(MAIN_URL + TEST_DATA["assessment-url"]);
    await page.content();


    let assessmentButton:Locator|null = null;

    await test.step("Check Assessment Start Button", async () => {
        assessmentButton = await page.locator(".assessment-block button");
        await expect(assessmentButton).toBeVisible();
        await assessmentButton.click();
    });


    let suggestedTranslationElement:Locator|null = null;

    await test.step("Wait for Suggested text element", async () => {
        suggestedTranslationElement = await page.locator(".suggested-translation");
        await expect(suggestedTranslationElement).toBeVisible();

        const inputResult = await suggestedTranslationElement.innerText();
        expect(inputResult).toBe(TEST_DATA["correct-translation"][0]);
    });


    let assessmentInput:Locator|null = null;
    let evaluationGoodElement: Locator|null = null;
    let evaluationBadElement: Locator|null = null;
    
    await test.step("Enter valid answer", async () => {
        assessmentInput = await page.locator(".assessment-block input");
        await assessmentInput.fill(TEST_DATA["correct-translation"][1]);
        if (!assessmentButton) {
            throw new Error("Something went wrong with Assessment interface - Button");
        }
        await assessmentButton.click();
        evaluationGoodElement = await page.locator('.eval_score_4');
        await expect(evaluationGoodElement).toBeVisible();
        // Refresh input by click on the button
        await assessmentButton.click();
    });
    await test.step("Enter wrong answer", async () => {
        if (!assessmentButton || !assessmentInput) {
            throw new Error("Something went wrong with Assessment interface - Button and Input");
        }
        await assessmentInput.fill(TEST_DATA["incorrect-check"]);
        await assessmentButton.click();
        evaluationBadElement = await page.locator('.eval_score_0');
        await expect(evaluationBadElement).toBeVisible();
    });
    // await page.waitForTimeout(30000);
});
