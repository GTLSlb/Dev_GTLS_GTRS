const { Builder, By, until } = require("selenium-webdriver");
const assert = require('assert');
require("dotenv").config();

async function login(driver) {
    try {
        // Navigate to the login page
        await driver.get("https://gtrs.gtls.store/login");

        const userName = process.env.USERNAME + "@gtls.com.au";
        const pass = process.env.USER_PASS;

        // Fill in the login form (update selectors and values as needed)
        await driver.findElement(By.name("email")).sendKeys(userName); // Replace with your username
        await driver.findElement(By.name("password")).sendKeys(pass); // Replace with your password

        // Wait for the user to complete the reCAPTCHA
        console.log("Please complete the reCAPTCHA manually");
        await driver.sleep(30000); // 30 seconds

        // Wait for the page to finish loading after submitting the login form
        // await driver.wait(until.urlContains('dashboard'));

        // Wait for a specific element to appear on the page after login
        await driver.wait(
            until.elementIsVisible(
                driver.findElement(
                    By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div')
                )
            )
        );
    } catch (error) {
        console.error("Error during login:", error);
    }
}

async function loginToApp(driver, url, mainUrl) {
    try {
        // Navigate to the login page
        await driver.get(`${url}/login`);

        const userName = process.env.USERNAME + "@gtls.com.au";
        const pass = process.env.USER_PASS;

        // Fill in the login form (update selectors and values as needed)
        await driver.findElement(By.name("email")).sendKeys(userName); // Replace with your username
        await driver.findElement(By.name("password")).sendKeys(pass); // Replace with your password

        // Wait for the user to complete the reCAPTCHA
        console.log("Please complete the reCAPTCHA manually");
        await driver.sleep(30000); // 30 seconds

        // Wait for the page to finish loading after submitting the login form
        await driver.wait(until.urlContains(mainUrl));
    } catch (error) {
        console.error("Error during login:", error);
    }
}

async function loginMicrosoft(driver) {
    try {
        // Step 1: Navigate to the application URL and open Microsoft login
        await driver.get("https://gtrs.gtls.store/login");
        await driver
            .findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/button'
                )
            )
            .click();

        // Step 2: Enter valid credentials in the Microsoft login popup
        console.log("Enter microsoft credentials manually");
        await driver.sleep(60000); // Pause for manual entry of valid credentials

        // Step 3: Wait for redirection to the application
        // Wait for the sidebar div to be visible
        const mainScreenDiv = await driver.findElement(
            By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div')
        );
        await driver.wait(until.elementIsVisible(mainScreenDiv), 5000); // Wait for the main screen to be visible
    } catch (error) {
        console.error("Error during login:", error);
    }
}

async function loginToAppMicrosoft(driver, url, mainUrl) {
    try {
        // Step 1: Navigate to the application URL and open Microsoft login
        await driver.get(`${url}/login`);
        await driver
            .findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[2]/button'
                )
            )
            .click();

        // Step 2: Enter valid credentials in the Microsoft login popup
        console.log("Enter microsoft credentials manually");
        await driver.sleep(60000); // Pause for manual entry of valid credentials

        // Step 3: Wait for redirection to the application
        // Wait for the sidebar div to be visible
        const mainScreenDiv = await driver.findElement(
            By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div')
        );
        await driver.wait(until.elementIsVisible(mainScreenDiv), 5000); // Wait for the main screen to be visible

        // Wait for the page to finish loading after submitting the login form
        await driver.wait(until.urlContains(mainUrl));
    } catch (error) {
        console.error("Error during login:", error);
    }
}

async function testInformation(rows, calculatedData) {
    try {
        for (let row of rows) {
            // Get the first and second <td> elements
            const firstTd = await row.findElement(By.xpath('./td[1]'));
            const secondTd = await row.findElement(By.xpath('./td[2]'));

            // Get the text content of the first <td>
            const firstTdText = await firstTd.getText();

            // Check the text in the first <td> and perform assertions
            let secondTdText = await secondTd.getText();

            switch (firstTdText) {
                case "# of Rec's":
                    assert.strictEqual(secondTdText, calculatedData.numUniqueReceivers, `Total number of Rec should be ${calculatedData.numUniqueReceivers}`);
                    break;
                case "Total Weight":
                    assert.strictEqual(secondTdText, `${calculatedData.totalWeight?.toFixed(2)} KG`, `Total Weight should be ${calculatedData.totalWeight?.toFixed(2)}`);
                    break;
                case "Total Pallet Space":
                    assert.strictEqual(secondTdText, `${calculatedData.totalPalletSpace}`, `Total Pallet Space should be ${calculatedData.totalPalletSpace}`);
                    break;
                case "Total CHEP":
                    assert.strictEqual(secondTdText, `${calculatedData.totalChep}`, `Total CHEP should be ${calculatedData.totalChep}`);
                    break;
                case "Total LOSCAM":
                    assert.strictEqual(secondTdText, `${calculatedData.totalLoscam}`, `Total LOSCAM should be ${calculatedData.totalLoscam}`);
                    break;
                case "Total CUSTOMER OWN":
                    assert.strictEqual(secondTdText, `${calculatedData.totalCustomerOwn}`, `Total CUSTOMER OWN should be ${calculatedData.totalCustomerOwn}`);
                    break;
                case "Cost":
                    assert.strictEqual(secondTdText, `${calculatedData.totalCost}`, `Cost should be ${calculatedData.totalCost}`);
                    break;
                case "Fuel Surcharge cost":
                    assert.strictEqual(secondTdText, `${calculatedData.fuelLevy}`, `Fuel Surcharge cost should be ${calculatedData.fuelLevy}`);
                    break;
                case "Total No. Cons Shipped":
                    assert.strictEqual(secondTdText, `${calculatedData.totalNoConsShipped}`, `Total number of consignments shipped should be ${calculatedData.totalNoConsShipped}`);
                    break;
                case "Total No. Cons Passed":
                    const expectedPassed = `${data.totalNoConsPassed} / ${percentagePassed?.toFixed(2)} %`;
                    assert.strictEqual(secondTdText, expectedPassed, `Total number of Cons Passed should be ${expectedPassed}`);
                    break;
                case "Total No. Cons Failed":
                    const expectedFailed = `${data.totalConsFailed} / ${percentageFailed?.toFixed(2)} %`;
                    assert.strictEqual(secondTdText, expectedFailed, `Total number of Cons Failed should be ${expectedFailed}`);
                    break;
                case "# of True PODs":
                    assert.strictEqual(secondTdText, `${calculatedData.podCounter}`, `Total number of True PODs should be ${calculatedData.podCounter}`);
                    break;
                case "% of True PODs":
                    const expectedPercentage = `${data.podPercentage?.toFixed(2)} %`;
                    assert.strictEqual(secondTdText, expectedPercentage, `Total % of True PODs should be ${expectedPercentage}`);
                    break;
                case "# of safety issues":
                    assert.strictEqual(secondTdText, data.safetyCounter, `Total number of safety issues should be ${data.safetyCounter}`);
                    break;
                default:
                    console.warn(`No assertion for: ${firstTdText}`);
            }
        }
    } catch (error) {
        console.error('Assertion failed:', error);
        throw error; // Rethrow the error to fail the test
    }
}

async function testSpendChart(rows, calculatedData) {
    try {
        // Step 1: Locate the chart element
        const chartSelector = By.css('data-chart-source-type="G2Plot"');
        const chartElement = await driver.findElement(chartSelector);

        // Step 4: Extract data points
        const dataPoints = await chartElement.findElements(By.css('.g2-tooltip-list')); // Adjust the selector based on your chart's structure

        // Step 5: Validate the data points
        const expectedData = [/* Your expected data points go here */];

        for (let i = 0; i < dataPoints.length; i++) {
            const pointValue = await dataPoints[i].getText();
            assert.strictEqual(pointValue, expectedData[i].toString(), `Data point ${i} should be ${expectedData[i]}`);
        }

        console.log("All data points are correct.");

    } catch (error) {
        console.error('Error occurred:', error);
    }
}
module.exports = { login, loginToApp, loginMicrosoft, loginToAppMicrosoft, testInformation, testSpendChart };
