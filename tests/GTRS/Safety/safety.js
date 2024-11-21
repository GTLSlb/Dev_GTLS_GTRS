const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const {
    login,
    navigateToPage
} = require("../../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../../helper/gtrsPages");
let driver;
const baseUrl = process.env.WEB_URL;

before(async () => {
    // Initialize the WebDriver
    driver = await new Builder().forBrowser("chrome").build();
    await login(driver);
});

after(async () => {
    // Quit the WebDriver after tests
    await driver.quit();
});


describe("Navigation Test", () => {
    it("user can view the Safety Report page", async () => {
        // Step 1: Navigate to the Safety page
        await driver.sleep(2000);
        await navigateToPage(driver, "Safety");
        await driver.sleep(3000);

        // Step 2: Verify that Safety title is displayed
        const title = await driver.findElement(By.tagName('h1'));

        const currentUrl = await driver.getCurrentUrl();

        assert.strictEqual(
            currentUrl,
            baseUrl+"gtrs/safety",
            `Expected URL to be ${baseUrl}'gtrs/safety' but got '${currentUrl}'.`
        );

        assert.strictEqual(
            await title.getText(),
            "Safety Report",
            `Safety Report should be displayed instead got ${await title.getText()}`
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it(`user can navigate from ${pageName} to the Safety`, async () => {
            // Step 1: Navigate to the main page of GTRS
            await driver.sleep(3000);

            // Step 2: Navigate to other pages
            // Find the <ul> element with class 'css-ewdv3l'
            let ulElement = await driver.findElement(
                By.className("css-ewdv3l")
            );

            // Get all child elements with class 'ps-menuitem-root' within the <ul>
            let menuItems = await ulElement.findElements(
                By.className("ps-menuitem-root")
            );

            let dashItem;
            for (let item of menuItems) {
                let text = await item.getText();
                console.log("text", text, "pageName", pageName);
                if (text == pageName) {
                    item.click();
                }
                if (text == "Safety") {
                    dashItem = item;
                }
            }

            // Step 3: Navigate to the Safety
            await dashItem.click();

            // Step 2: Verify that Safety is displayed
            const title = await driver.findElement(By.tagName('h1'));
            assert.strictEqual(
                await title.getText(),
                "Safety Report",
                `Safety Report should be displayed instead got ${await title.getText()}`
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                baseUrl+"gtrs/safety",
                `Expected URL to be ${baseUrl}'gtrs/safety' but got '${currentUrl}'.`
            );
        });
    }
});
