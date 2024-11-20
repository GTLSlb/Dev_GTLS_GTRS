const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { login } = require("../helper/helper");
require('dotenv').config();
const baseUrl = process.env.WEB_URL;

describe('User Logout Tests with credentials', function () {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser('chrome').build();

        // Define valid credentials
        const validEmail = process.env.USERNAME + '@'+ process.env.WEB_DOMAIN; // Ensure USERNAME is set in your environment
        const validPassword = process.env.USER_PASS; // Replace with the actual password

        // Call the login helper function
        await login(driver, validEmail, validPassword);
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it('should allow a user to log out after logging in', async () => {
        // Step 1: Navigate to the main page
        await driver.wait(until.urlIs(baseUrl+'gtrs/dashboard'));

        // Step 2: Click on the Logout button
        const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button')); // Adjust selector as needed
        await logoutButton.click();

        // Step 3: Verify that the user is redirected to the login page
        await driver.wait(until.urlIs(baseUrl+'login'), 5000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, baseUrl+'login', "User should be redirected to the login page after logout.");
    });
});

describe('Microsoft Logout Tests', function () {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it('should allow a user to log out after logging in with Microsoft', async () => {
        // Step 1: Navigate to the login URL
        await driver.get(baseUrl+'login');

        // Step 2: Click on Sign in with Microsoft button
        const microsoftLoginButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/button'));
        await microsoftLoginButton.click();

        // Step 3: Wait for the user to complete Microsoft login
        console.log('Please log in with your Microsoft account and then press Enter to continue...');
        await driver.sleep(60000); // Wait for user input to continue

        // Step 4: Wait for the main page to load after login
        await driver.wait(until.urlIs(baseUrl+'gtrs/dashboard'), 10000);

        // Step 5: Click on the Logout button
        const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button')); // Adjust selector as needed
        await logoutButton.click();

        // Step 6: Verify that the user is redirected to the login page
        await driver.wait(until.urlIs(`https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${baseUrl}login`), 5000);
        await driver.sleep(60000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, baseUrl+'login', "User should be redirected to the login page after logout.");
    });
});
