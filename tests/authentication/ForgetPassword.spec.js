// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Navigate to forget password page", () => {
    let context; // Variable to hold the browser context
    let page; // Variable to hold the page reference

    test.beforeAll(async ({ browser }) => {
        // Create a new context before all tests
        context = await browser.newContext();
        page = await context.newPage(); // Create a new page in the context
    });

    test.afterAll(async () => {
        // Close the context after all tests are done
        await context.close();
    });

    test("Redirect user to forgot password page ", async ({}) => {
        // Step 1: Navigate to the login URL
        await page.goto("https://gtrs.gtls.store/login");

        // Step 2: Click on Forgot your password
        const forgetPassBtn = page.locator(
            'button:has-text("Forgot your password?")'
        );
        await forgetPassBtn.click();

        // Step 3: Verify that the user is redirected to the forgot password page
        await expect(page).toHaveURL("https://gtrs.gtls.store/forgot-password");
    });

    test("User enters his email in the input in forgot password page it will send an email", async ({
        page,
    }) => {
        // Step 1: Navigate to the login URL
        await page.goto("https://gtrs.gtls.store/login");

        // Step 2: Click on Forgot your password
        const forgetPassBtn = page.locator(
            'button:has-text("Forgot your password?")'
        );
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + "@gtls.com.au";
        await page.fill('input[name="email"]', userName);

        // Step 4: Click on Forgot your password
        const resetPassBtn = page.locator('button:has-text("Reset Password")');
        await resetPassBtn.click();

        // Step 5: Verify that the user is shown OTP input fields
        const OTPFields = page.locator('input:has-type("number")');
        await expect(OTPFields).toBeVisible();
    });

    test("User enters an invalid OTP", async ({}) => {
        // Step 1: Navigate to the login URL
        await page.goto("https://gtrs.gtls.store/login");

        // Step 2: Click on Forgot your password
        const forgetPassBtn = page.locator(
            'button:has-text("Forgot your password?")'
        );
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + "@gtls.com.au";
        await page.fill('input[name="email"]', userName);

        // Step 4: Click on Forgot your password
        const resetPassBtn = page.locator('button:has-text("Reset Password")');
        await resetPassBtn.click();

        // Step 5: Enter invalid OTP then resume test
        await page.pause();

        // Step 6: Check invalid message
        const invalidMsg = page.locator(
            'xpath=//*[@id="app"]/div/div/div/div[2]/div[3]/span'
        );
        await expect(invalidMsg).toBeVisible();
    });

    test("User enters an valid OTP", async ({}) => {
        // Step 1: Navigate to the login URL
        await page.goto("https://gtrs.gtls.store/login");

        // Step 2: Click on Forgot your password
        const forgetPassBtn = page.locator(
            'button:has-text("Forgot your password?")'
        );
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + "@gtls.com.au";
        await page.fill('input[name="email"]', userName);

        // Step 4: Click on Forgot your password
        const resetPassBtn = page.locator('button:has-text("Reset Password")');
        await resetPassBtn.click();

        // Step 5: Enter valid OTP then resume test
        await page.pause();

        // Step 6: Check that new password field is visible
        const newPasswordField = page.locator('input[name="newpassword"]');
        await expect(newPasswordField).toBeVisible();
    });

    test("User enters a new password", async ({}) => {
        // Step 1: Navigate to the login URL
        await page.goto("https://gtrs.gtls.store/login");

        // Step 2: Click on Forgot your password
        const forgetPassBtn = page.locator(
            'button:has-text("Forgot your password?")'
        );
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + "@gtls.com.au";
        await page.fill('input[name="email"]', userName);

        // Step 4: Click on Forgot your password
        const resetPassBtn = page.locator('button:has-text("Reset Password")');
        await resetPassBtn.click();

        // Step 5: Enter valid OTP then resume test
        await page.pause();

        // Step 6: Enter new password
        await page.fill('input[name="newpassword"]', "PWD123");
        await page.fill('input[name="confirm-password"]', "PWD123");

        // Step 7: Save password
        const saveBtn = page.locator('button:has-text("SAVE")');
        await saveBtn.click();

        // Step 8: Verify that the user is redirected to the login page
        await page.pause();
        await expect(page).toHaveURL("https://gtrs.gtls.store/login");
    });
});
