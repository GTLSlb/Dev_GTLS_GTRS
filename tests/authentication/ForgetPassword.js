const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { login } = require("../helper/helper");
require('dotenv').config();

describe('Forgot Password Tests', function () {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it('Redirect user to forgot password page', async () => {
        // Step 1: Navigate to the login URL
        await driver.get('https://gtrs.gtls.store/login');

        // Step 2: Click on Forgot your password
        const forgetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/div/div[2]/button'));
        await forgetPassBtn.click();

        // Step 3: Verify that the user is redirected to the forgot password page
        await driver.wait(until.urlIs('https://gtrs.gtls.store/forgot-password'), 5000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, 'https://gtrs.gtls.store/forgot-password', "User should be redirected to the forgot password page.");
    });

    it('User enters his email in the input in forgot password page it will send an email', async () => {
        // Step 1: Navigate to the login URL
        await driver.get('https://gtrs.gtls.store/login');

        // Step 2: Click on Forgot your password
        const forgetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/div/div[2]/button'));
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + '@gtls.com.au';
        await driver.findElement(By.name('email')).sendKeys(userName);

        // Step 4: Click on Reset Password
        const resetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]/div[3]/div/button'));
        await resetPassBtn.click();

        // Step 5: Verify that the user is shown OTP input fields
        const OTPFields = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]/div[2]/div'));
        await driver.wait(until.elementIsVisible(OTPFields), 5000);
        assert.ok(await OTPFields.isDisplayed(), "OTP input fields should be visible.");
    });

    it('User enters an invalid OTP', async () => {
        // Step 1: Navigate to the login URL
        await driver.get('https://gtrs.gtls.store/login');

        // Step 2: Click on Forgot your password
        const forgetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/div/div[2]/button'));
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + '@gtls.com.au';
        await driver.findElement(By.name('email')).sendKeys(userName);

        // Step 4: Click on Reset Password
        const resetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]/div[3]/div/button'));
        await resetPassBtn.click();

        // Step 5: Enter invalid OTP then resume test
        await driver.sleep(60000); // Pause for user to enter invalid OTP

        // Step 6: Check invalid message
        const invalidMsg = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]/div[3]/span'));
        await driver.wait(until.elementIsVisible(invalidMsg), 5000);
        assert.ok(await invalidMsg.isDisplayed(), "Invalid message should be visible.");
    });

    it('User enters a valid OTP', async () => {
        // Step 1: Navigate to the login URL
        await driver.get('https://gtrs.gtls.store/login');

        // Step 2: Click on Forgot your password
        const forgetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/div/div[2]/button'));
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + '@gtls.com.au';
        await driver.findElement(By.name('email')).sendKeys(userName);

        // Step 4: Click on Reset Password
        const resetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]/div[3]/div/button'));
        await resetPassBtn.click();

        // Step 5: Enter valid OTP then resume test
        await driver.sleep(60000); // Pause for user to enter valid OTP

        // Step 6: Check that new password field is visible
        const newPasswordField = await driver.findElement(By.name('newpassword'));
        await driver.wait(until.elementIsVisible(newPasswordField), 5000);
        assert.ok(await newPasswordField.isDisplayed(), "New password field should be visible.");
    });

    it('User enters a new password', async () => {
        // Step 1: Navigate to the login URL
        await driver.get('https://gtrs.gtls.store/login');

        // Step 2: Click on Forgot your password
        const forgetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/div/div[2]/button'));
        await forgetPassBtn.click();

        // Step 3: Fill in the email input
        const userName = process.env.USERNAME + '@gtls.com.au';
        await driver.findElement(By.name('email')).sendKeys(userName);

        // Step 4: Click on Reset Password
        const resetPassBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]/div[3]/div/button'));
        await resetPassBtn.click();

        // Step 5: Enter valid OTP then resume test
        await driver.sleep(60000); // Pause for user to enter valid OTP

        // Step 6: Enter new password
        await driver.findElement(By.name('newpassword')).sendKeys("PWD123");
        await driver.findElement(By.name('confirm-password')).sendKeys("PWD123");

        // Step 7: Save password
        const saveBtn = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]/div[2]/div/div/button'));
        await saveBtn.click();

        // Step 8: Verify that the user is redirected to the login page
        await driver.wait(until.urlIs('https://gtrs.gtls.store/login'), 5000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, 'https://gtrs.gtls.store/login', "User should be redirected to the login page.");
    });
});
