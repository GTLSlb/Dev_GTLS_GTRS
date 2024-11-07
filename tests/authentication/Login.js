const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("../helper/helper");
const assert = require('assert');
require('dotenv').config();

describe("Invalid Session Test", () => {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it("should show login screen if session is invalid/expired", async () => {
        // Step 1: Clear all cookies to simulate an invalid session
        await driver.manage().deleteAllCookies();

        // Step 2: Navigate to the application URL
        await driver.get("https://gtrs.gtls.store");

        // Step 3: Wait until the URL is the login page
        await driver.wait(until.urlIs("https://gtrs.gtls.store/login"), 5000);

        // Step 4: Verify that the current URL is as expected
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, 'https://gtrs.gtls.store/login', `Expected URL to be 'https://gtrs.gtls.store/login' but got '${currentUrl}'.`);
    });

    it("should show login screen if entering wrong route", async () => {
        // Step 1: Clear all cookies to simulate an invalid session
        await driver.manage().deleteAllCookies();

        // Step 2: Navigate to the invalid route URL
        await driver.get("https://gtrs.gtls.store/left");

        // Step 3: Wait until the URL is the login page
        await driver.wait(until.urlIs("https://gtrs.gtls.store/login"), 5000);

        // Step 4: Verify that the current URL is as expected
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, 'https://gtrs.gtls.store/login', `Expected URL to be 'https://gtrs.gtls.store/login' but got '${currentUrl}'.`);

    });

    it("go to login route", async () => {
        // Step 1: Clear all cookies to simulate an invalid session
        await driver.manage().deleteAllCookies();

        // Step 2: Navigate to the login route URL
        await driver.get("https://gtrs.gtls.store/login");

        // Step 3: Wait until the URL is the login page
        await driver.wait(until.urlIs("https://gtrs.gtls.store/login"), 5000);

        // Step 4: Verify that the login screen is displayed
        const loginScreenEmailInput = driver.findElement(By.name("email"));
        const loginScreenPassInput = driver.findElement(By.name("password"));

        // Expect both input fields to be visible
        await driver.wait(until.elementIsVisible(loginScreenEmailInput));
        await driver.wait(until.elementIsVisible(loginScreenPassInput));

        // Assert that both input fields are displayed
        assert.strictEqual(await loginScreenEmailInput.isDisplayed(), true, "Email input field should be visible");
        assert.strictEqual(await loginScreenPassInput.isDisplayed(), true, "Password input field should be visible");
    });

    it("Sign in button is disabled unless i do the recaptcha", async () => {
        // Step 1: Clear all cookies to simulate an invalid session
        await driver.manage().deleteAllCookies();

        // Step 2: Navigate to the application URL
        await driver.get("https://gtrs.gtls.store/login");

        // Step 3: Verify that the Sign In button is disabled
        const signInButton = await driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div/div/div/div[2]/div/div[1]/div[3]/button"));

        // Assert that the button is disabled
        assert.strictEqual(await signInButton.isEnabled(), false, "Sign In button should be disabled before reCAPTCHA");

        // Step 4: Click the reCAPTCHA checkbox and do it manually then resume test
        await driver.sleep(60000); // Wait for the user to complete the reCAPTCHA

        // Step 5: Verify that the Sign In button is enabled
        await driver.wait(until.elementIsEnabled(signInButton), 10000); // Wait up to 10 seconds for the button to be enabled

        // Assert that the button is enabled
        assert.strictEqual(await signInButton.isEnabled(), true, "Sign In button should be enabled after reCAPTCHA");
    });

    it("Clicking on Back to home button redirects me to website", async () => {
        // Assuming the session is invalid, you may need to clear cookies or set up the state accordingly
        await driver.manage().deleteAllCookies();

        // Step 1: Navigate to the application URL
        await driver.get("https://gtrs.gtls.store/login");

        // Step 2: Click on back to home button
        const backToHomeLink = await driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div/div/div/div[2]/div/div[1]/div[1]/a"));
        await backToHomeLink.click();

        console.log('url',process.env.BACK_TO_HOME_URL);

        // Step 3: Wait until the URL is the login page
        await driver.wait(until.urlIs(process.env.BACK_TO_HOME_URL), 5000);

        // Step 4: Verify that the current URL is as expected
        assert.strictEqual(until.urlIs(process.env.BACK_TO_HOME_URL), true, "Back to home should redirect me to ", process.env.BACK_TO_HOME_URL);
    });
});

describe("Login Test", () => {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it("login with wrong credentials", async () => {
        // Step 1: Navigate to the login URL
        await driver.get("https://gtrs.gtls.store/login");

        // Step 2: Enter wrong credentials
        const wrongEmail = "wrongemail@gtls.com.au"; // Replace with an invalid email
        const wrongPassword = "wrongpassword"; // Replace with an invalid password

        await driver.findElement(By.name("email")).sendKeys(wrongEmail); // Fill in the email input
        await driver.findElement(By.name("password")).sendKeys(wrongPassword); // Fill in the password input

        // Step 3: Click the Sign In button
        await driver
            .findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[3]/button'))
            .click();

        // Step 4: Define the locator for the error message
        const errorMessageLocator = By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/div/div[3]');

        // Step 5: Wait for the error message to be located
        await driver.wait(until.elementLocated(errorMessageLocator), 5000); // Wait for the element to be located

        // Step 6: Wait for the error message to be visible
        const errorMessageElement = await driver.findElement(errorMessageLocator);
        await driver.wait(until.elementIsVisible(errorMessageElement), 5000); // Wait for the error message to be visible

        // Assert that the error message is displayed
        const isErrorMessageVisible = await errorMessageLocator.isDisplayed();
        assert.strictEqual(isErrorMessageVisible, true, "Error message should be displayed for wrong credentials.");

        // Step 7: Check if the URL remains the same
        await driver.wait(until.urlIs("https://gtrs.gtls.store/login"), 5000); // Ensure the URL is still the login page

        // Assert that the URL is correct
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, "https://gtrs.gtls.store/login", "User should remain on the login page.");
    });
});

describe("Valid Session Tests", () => {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    beforeEach(async () => {
        // Call the login helper function before each test
        await login(driver);
    });

    it('should show main screen if session is valid', async () => {
        // Step 1: Check for the gtls_session cookie
        const cookies = await driver.manage().getCookies();
        const hasSessionCookie = cookies.some(cookie => cookie.name === 'gtls_session');

        // Step 2: Verify that the main screen is displayed
        if (hasSessionCookie) {
            // Wait for the sidebar div to be visible
            const mainScreenDiv = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div'));
            await driver.wait(until.elementIsVisible(mainScreenDiv), 5000); // Wait for the main screen to be visible

            // Assert that the main screen div is visible
            const isDisplayed = await mainScreenDiv.isDisplayed();
            assert.strictEqual(isDisplayed, true, "Main screen should be visible.");
        } else {
            // Fail test if it does not have a session
            throw new Error('No session cookie found');
        }
    });
})

describe('Microsoft Login Tests', function () {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it('Verify that pressing Sign in with Microsoft shows login popup', async () => {
        // Step 1: Navigate to the application URL
        await driver.get('https://gtrs.gtls.store/login');

        // Step 2: Click on the "Sign in with Microsoft" button
        await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/button')).click();

        // Step 3: Switch to the Microsoft login popup
        const windows = await driver.getAllWindowHandles();
        assert.strictEqual(windows.length, 2, "There should be two windows open");

        await driver.switchTo().window(windows[1]); // Switch to the new popup window

        // Verify that the popup URL contains Microsoft's login domain
        await driver.sleep(2000); // Wait for the popup to load completely
        const currentUrl = await driver.getCurrentUrl();
        assert.match(currentUrl, /https:\/\/login\.microsoftonline\.com/, "Popup URL should contain Microsoft's login domain.");

        // Close the popup after verification
        await driver.close();
        await driver.switchTo().window(windows[0]); // Switch back to the main window
    });

    // it('Verify that entering invalid credentials in Microsoft popup does not redirect', async () => {
    //     // Step 1: Navigate to the application URL and open Microsoft login
    //     await driver.get('https://gtrs.gtls.store/login');
    //     await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/button')).click();

    //     const windows = await driver.getAllWindowHandles();
    //     assert.strictEqual(windows.length, 2, "There should be two windows open");

    //     await driver.switchTo().window(windows[1]); // Switch to the popup window

    //     // Step 2: Enter invalid credentials in the Microsoft login popup
    //     await driver.sleep(60000); // Pause for manual entry of invalid credentials

    //     // Step 3: Verify that the popup remains open and the user is not redirected
    //     const currentUrl = await driver.getCurrentUrl();
    //     assert.match(currentUrl, /.*login.*error/, "Popup URL should indicate an error.");

    //     // Close the popup after verification
    //     await driver.close();
    //     await driver.switchTo().window(windows[0]); // Switch back to the main window
    // });

    it('Verify that entering valid credentials in Microsoft popup redirects to the system', async () => {
        // Step 1: Navigate to the application URL and open Microsoft login
        await driver.get('https://gtrs.gtls.store/login');
        await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/button')).click();

        // Step 2: Enter valid credentials in the Microsoft login popup
        console.log("Enter microsoft credentials manually");
        await driver.sleep(60000); // Pause for manual entry of valid credentials

        // Step 3: Wait for redirection to the application
       // Wait for the sidebar div to be visible
       const mainScreenDiv = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div'));
       await driver.wait(until.elementIsVisible(mainScreenDiv), 5000); // Wait for the main screen to be visible

       // Assert that the main screen div is visible
       const isDisplayed = await mainScreenDiv.isDisplayed();
       assert.strictEqual(isDisplayed, true, "Main screen should be visible.");
    });
});
