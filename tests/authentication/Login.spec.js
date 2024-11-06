// @ts-check
const { test, expect, webkit } = require('@playwright/test');
const { login } = require('../helper');

test.describe('Invalid Session Test', () => {

    test('should show login screen if session is invalid/expired', async ({ page }) => {
      // Assuming the session is invalid, you may need to clear cookies or set up the state accordingly
      await page.context().clearCookies();

      // Step 1: Navigate to the application URL
      await page.goto('https://gtrs.gtls.store');

      // Step 2: Verify that the login screen is displayed
      await expect(page).toHaveURL('https://gtrs.gtls.store/login');
    });

    test('should show login screen if entering wrong route', async ({ page }) => {
        // Assuming the session is invalid, you may need to clear cookies or set up the state accordingly
        await page.context().clearCookies();

        // Step 1: Navigate to the application URL
        await page.goto('https://gtrs.gtls.store/left');

        // Step 2: Verify that the login screen is displayed
        await expect(page).toHaveURL('https://gtrs.gtls.store/login');
    });

    test('go to login route', async ({ page }) => {
        // Assuming the session is invalid, you may need to clear cookies or set up the state accordingly
        await page.context().clearCookies();

        // Step 1: Navigate to the application URL
        await page.goto('https://gtrs.gtls.store/login');

        // Step 2: Verify that the login screen is displayed
        const loginScreenEmailInput = page.locator('input[name="email"]');
        const loginScreenPassInput = page.locator('input[name="password"]');

        // Expect both input fields to be visible
        await expect(loginScreenEmailInput).toBeVisible();
        await expect(loginScreenPassInput).toBeVisible();
    });

    test('Sign in button is disabled unless i do the recaptcha', async ({ page }) => {
        // Assuming the session is invalid, you may need to clear cookies or set up the state accordingly
        await page.context().clearCookies();

        // Step 1: Navigate to the application URL
        await page.goto('https://gtrs.gtls.store/login');

        // Step 2: Verify that the Sign In button is disabled
        const signInButton = page.locator('button[type="button"]:has-text("Sign In")');
        await expect(signInButton).toBeDisabled();

        // Step 3: Click the reCAPTCHA checkbox and do it manually then resume test
        await page.pause();

        // Step 4: Verify that the Sign In button is enabled
        await expect(signInButton).toBeEnabled();

    });

    test('Clicking on Back to home button redirects me to website', async ({ page }) => {
        // Assuming the session is invalid, you may need to clear cookies or set up the state accordingly
        await page.context().clearCookies();

        // Step 1: Navigate to the application URL
        await page.goto('https://gtrs.gtls.store/login');

        // Step 2: Click on back to home button
        const backToHomeLink = page.locator('a:has-text("Back to home")');
        await backToHomeLink.click();

        // Step 3: Verify that the user is redirected to the home page
        await expect(page).toHaveURL(process.env.BACK_TO_HOME_URL);

    });
});

test.describe('Login Test', () => {
    test('login with wrong credentials', async ({ page }) => {
        // Step 1: Navigate to the login URL
        await page.goto('https://gtrs.gtls.store/login');

        // Step 2: Enter wrong credentials
        const wrongEmail = 'wrongemail@gtls.com.au'; // Replace with an invalid email
        const wrongPassword = 'wrongpassword'; // Replace with an invalid password

        await page.fill('input[name="email"]', wrongEmail); // Fill in the email input
        await page.fill('input[name="password"]', wrongPassword); // Fill in the password input

        // Step 3: Click the Sign In button
        await page.click('button[type="button"]:has-text("Sign In")');

        // Check if an error message appears
        const errorMessageLocator = page.getByText('An error has occurred.'); // Replace with the actual selector for the error message
        await expect(errorMessageLocator).toBeVisible(); // Check that the error message is displayed

        // Check if the URL remains the same
        await expect(page).toHaveURL('https://gtrs.gtls.store/login');
    });
});


test.describe('Valid Session Test', () => {
    test.beforeEach(async ({ page }) => {
        // Call the login helper function before each test
        await login(page);
    })
    test('should show main screen if session is valid', async ({ page }) => {
      // Check for the gtls_session cookie
      const cookies = await page.context().cookies();
      const hasSessionCookie = cookies.some(cookie => cookie.name === 'gtls_session');

      // Step 1: Verify that the main screen is displayed
      if (hasSessionCookie) {
        // Wait for the sidebar div to be visible
        const mainScreenDiv = page.locator('div.md\\:pl-20.pt-16.h-full');
        await expect(mainScreenDiv).toBeVisible(); // Check that the div is visible
      }
      // Fail test if it does not have a session
      else {
        throw new Error('No session cookie found');
      }
    });
});

test.describe('Microsoft Login Tests', () => {

    test('Verify that pressing Sign in with Microsoft shows login popup', async ({ page }) => {
        // Step 1: Navigate to the application URL
        await page.goto('https://gtrs.gtls.store/login');

        // Step 2: Click on the "Sign in with Microsoft" button
        await page.click('button:has-text("Sign in with Microsoft")');

        // Step 3: Verify that the Microsoft login popup appears
        const [microsoftPopup] = await Promise.all([
            page.waitForEvent('popup'), // Wait for the popup event
            page.click('button:has-text("Sign in with Microsoft")'), // Click the button
        ]);

        // Verify that the popup URL contains Microsoft's login domain
        await expect(microsoftPopup).toHaveURL(/https:\/\/login\.microsoftonline\.com/);
    });

    test('Verify that entering invalid credentials in Microsoft popup does not redirect', async ({ page }) => {
        // Step 1: Navigate to the application URL and open Microsoft login
        await page.goto('https://gtrs.gtls.store/login');
        await page.click('button:has-text("Sign in with Microsoft")');
        const [microsoftPopup] = await Promise.all([
            page.waitForEvent('popup'),
            page.click('button:has-text("Sign in with Microsoft")'),
        ]);

        // Step 2: Enter invalid credentials in the Microsoft login popup
        await page.pause(); //Enter wrong credentials then resume test

        // Step 3: Verify that the popup remains open and the user is not redirected
        await expect(microsoftPopup).toHaveURL(/.*login.*error/); // Adjust the URL pattern based on error response
    });

    test('Verify that entering valid credentials in Microsoft popup redirects to the system', async ({ page }) => {
        // Step 1: Navigate to the application URL and open Microsoft login
        await page.goto('https://gtrs.gtls.store/login');
        await page.click('button:has-text("Sign in with Microsoft")');
        const [microsoftPopup] = await Promise.all([
            page.waitForEvent('popup'),
            page.click('button:has-text("Sign in with Microsoft")'),
        ]);

        // Step 2: Enter valid credentials in the Microsoft login popup
        await page.pause(); //Enter valid credentials then resume test

        // Step 3: Wait for redirection to the application
        await expect(page).toHaveURL('https://gtrs.gtls.store/main'); // Adjust URL as per your application
    });
});
