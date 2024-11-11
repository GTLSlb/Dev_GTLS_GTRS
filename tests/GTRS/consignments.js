const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("../helper/helper");
const assert = require("assert");
require("dotenv").config();
const gtrsPages = require("../helper/gtrsPages");

describe("Invalid Session Test", () => {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser("chrome").build();
        await login(driver);
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it("user can view the Consignments", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(3000);

        // Step 2: Verify that Consignments is displayed
        const title = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
            )
        );
        assert.strictEqual(
            await title.getText(),
            "Consignments",
            "Consignments should be displayed."
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it("user can navigate from other pages to the Consignments", async () => {
            // Step 1: Navigate to the main page
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
                if (text == pageName) {
                    item.click();
                }
                if (text == "Consignments") {
                    dashItem = item;
                }
            }

            // Step 3: Navigate to the Consignments
            await dashItem.click();

            // Step 2: Verify that Consignments is displayed
            const title = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
                )
            );
            assert.strictEqual(
                await title.getText(),
                "Consignments",
                "Consignments should be displayed."
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/Consignments",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/Consignments' but got '${currentUrl}'.`
            );
        });
    }

});
