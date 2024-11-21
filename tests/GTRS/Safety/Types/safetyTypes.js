const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const {
    login,
    navigateToPage,
    navigateToSafetyTab,
    areObjectsEqual,
} = require("../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../../../helper/gtrsPages");
const baseUrl = process.env.WEB_URL;
const moment = require("moment");
let driver;


before(async () => {
    // Initialize the WebDriver
    driver = await new Builder().forBrowser("chrome").build();
    await login(driver);

    // Navigate to the Safety Types page
    await driver.sleep(2000);
    await navigateToPage(driver, "Safety");

    await driver.sleep(4000);
    await navigateToSafetyTab(driver, "Types");
    await driver.sleep(2000);
});

after(async () => {
    // Quit the WebDriver after tests
    await driver.quit();
});

describe("Safety Types Table Test", () => {
    it("safety types are displayed correctly", async () => {
        // Step 1: Fetch data from API request
        let safetyTypes = [];
        const cookies = await driver.manage().getCookies();
        const authCookie = cookies.find((c) => c.name === "access_token");

        const resSafetTypesData = await axios.get(
            `${process.env.GTRS_API_URL}SafetyTypes`,
            {
                headers: {
                    Authorization: `Bearer ${authCookie.value}`,
                    UserId: process.env.USER_ID,
                },
            }
        );

        safetyTypes = resSafetTypesData.data;

        // Step 2: Fetch data from table
        // Check if safety types are displayed correctly
        const safetyTypesTable = await driver.findElement(By.id("details"));
        await driver.wait(until.elementIsVisible(safetyTypesTable), 1000);

        const safetyTypesTableBody = await safetyTypesTable.findElement(
            By.tagName("tbody")
        );
        const rows = await safetyTypesTableBody.findElements(By.tagName("tr"));

        let dataFromTable = [];
        // Get the text of each row but without the last column
        for (let i = 0; i < rows.length; i++) {
            const cells = await rows[i].findElements(By.tagName("td"));
            cells.pop();
            // final object will look like this
            // {SafetyTypeName: 'Safety Type 1', SafetyStatus: true}
            const rowObject = {};
            cells.map(async (cell, index) => {
                const text = await cell.getText();
                const key = index === 0 ? "SafetyTypeName" : "SafetyStatus";
                rowObject[key] =
                    index === 0 ? text : text === "Active" ? true : false;
            });
            dataFromTable.push(rowObject);
        }

        // Step 3: Check if safety types are displayed correctly
        // map over API data to take relevant fields
        const mappedValues = dataFromTable.map((row, index) => {
            const apiValue = safetyTypes[index];
            return {
                safetyTypeName: row.SafetyTypeName,
                safetyStatus: row.SafetyStatus,
                apiSafetyTypeName: apiValue.SafetyTypeName,
                apiSafetyStatus: apiValue.SafetyStatus,
            };
        });

        let differences = [];
        // Compare mapped values
        mappedValues.forEach((mappedValue, index) => {
                if (!areObjectsEqual(mappedValue.cellValue, mappedValue.apiValue)) {
                  differences.push(
                    `Mismatch: ${JSON.stringify(mappedValue.cellValue)} vs ${JSON.stringify(mappedValue.apiValue)}`
                  );
                }
              });

            const firstPageBtn = await driver.findElement(
                By.css(
                    ".inovua-react-pagination-toolbar__icon--named--FIRST_PAGE"
                )
            );
            await firstPageBtn.click();

        if (differences.length > 0) {
            console.log("differences", differences);
            throw new Error("Test failed due to differences in data");
        }
    });

    it("user can edit a safety type", async () => {
        try {
            // Step 1: Click on the edit button
            const editBtn = await driver.findElement(
                By.xpath('//*[@id="details"]/tbody/tr[1]/td[3]/button')
            );
            await editBtn.click();

            // Step 2: Find inputs and give them a value
            const safTypeNameInput = await driver.findElement(By.id("name"));
            await safTypeNameInput.clear();
            await safTypeNameInput.sendKeys("Near Miss");

            // Click on create button
            // Try to find save btn
            const saveBtn = await driver.findElement(
                By.xpath("/html/body/div[4]/div/div/div/form/div[2]/button")
            );

            await saveBtn.click();

            // Step 3: Check if safety type is edited
            await driver.sleep(15000);

            const newSafType = await driver.findElement(
                By.xpath('//*[@id="details"]/tbody/tr[1]/td[1]')
            );
            const newSafTypeName = await newSafType.getText();
            assert.strictEqual(newSafTypeName, "Near Miss"),
                `Expected safety type name to be Near Miss but got ${newSafTypeName}`;
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });

    it("user can add a safety type", async () => {
        try {
            // Step 1: Click on the add button
            const addBtn = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div[1]/div[2]/button'
                )
            );
            await addBtn.click();

            // Step 2: Find inputs and give them a value
            const safTypeNameInput = await driver.findElement(By.id("name"));
            await safTypeNameInput.sendKeys("");
            await safTypeNameInput.sendKeys("Test-Type");

            // Click on create button
            // Try to find save btn
            const saveBtn = await driver.findElement(
                By.xpath("/html/body/div[4]/div/div/div/form/div[2]/button")
            );

            await saveBtn.click();

            // Step 3: Check if safety type is added
            await driver.sleep(15000);

            // Go over all table data
            const safetyTypesTable = await driver.findElement(By.id("details"));
            await driver.wait(until.elementIsVisible(safetyTypesTable), 1000);

            const safetyTypesTableBody = await safetyTypesTable.findElement(
                By.tagName("tbody")
            );
            const rows = await safetyTypesTableBody.findElements(
                By.tagName("tr")
            );

            // Get the text of each row but without the last column
            for (let i = 0; i < rows.length; i++) {
                const cells = await rows[i].findElements(By.tagName("td"));
                cells.pop();
                // final object will look like this
                let isFound = true;

                for (let i = 0; i < cells.length; i++) {
                    const text = await cells[i].getText();
                    // Check that safety type is added correctly
                    if (
                        text == "Test-Type" &&
                        (await cells[i + 1].getText()) == "active"
                    ) {
                        isFound = true;
                    }
                }

                if (!isFound) {
                    throw new Error(
                        "Test failed due to safety type not being added"
                    );
                }
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
});
