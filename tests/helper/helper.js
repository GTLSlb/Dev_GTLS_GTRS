const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
require("dotenv").config();
const fs = require("fs");
const { PNG } = require("pngjs");
const pixelmatch = require("pixelmatch");
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
            const firstTd = await row.findElement(By.xpath("./td[1]"));
            const secondTd = await row.findElement(By.xpath("./td[2]"));

            // Get the text content of the first <td>
            const firstTdText = await firstTd.getText();

            // Check the text in the first <td> and perform assertions
            let secondTdText = await secondTd.getText();

            let discrepancies = [];
            switch (firstTdText) {
                case "# of Rec's":
                    if (secondTdText != calculatedData.numUniqueReceivers) {
                        discrepancies.push(
                            `Expected: ${calculatedData.numUniqueReceivers}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     calculatedData.numUniqueReceivers,
                    //     `Total number of Rec should be ${calculatedData.numUniqueReceivers}`
                    // );
                    break;
                case "Total Weight":
                    if (
                        secondTdText !=
                        `${calculatedData.totalWeight?.toFixed(2)} KG`
                    ) {
                        discrepancies.push(
                            `Expected: ${calculatedData.totalWeight?.toFixed(
                                2
                            )} KG, Found: ${secondTdText}`
                        );
                    }
                    // assert.Equal(
                    //     secondTdText,
                    //     `${calculatedData.totalWeight?.toFixed(2)} KG`,
                    //     `Total Weight should be ${calculatedData.totalWeight?.toFixed(
                    //         2
                    //     )}`
                    // );
                    break;
                case "Total Pallet Space":
                    if (secondTdText != `${calculatedData.totalPalletSpace}`) {
                        discrepancies.push(
                            `Expected: ${calculatedData.totalPalletSpace}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.totalPalletSpace}`,
                    //     `Total Pallet Space should be ${calculatedData.totalPalletSpace}`
                    // );
                    break;
                case "Total CHEP":
                    if (secondTdText != `${calculatedData.totalChep}`) {
                        discrepancies.push(
                            `Expected: ${calculatedData.totalChep}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.totalChep}`,
                    //     `Total CHEP should be ${calculatedData.totalChep}`
                    // );
                    break;
                case "Total LOSCAM":
                    if (secondTdText != `${calculatedData.totalLoscam}`) {
                        discrepancies.push(
                            `Expected: ${calculatedData.totalLoscam}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.totalLoscam}`,
                    //     `Total LOSCAM should be ${calculatedData.totalLoscam}`
                    // );
                    break;
                case "Total CUSTOMER OWN":
                    if (secondTdText != `${calculatedData.totalCustomerOwn}`) {
                        discrepancies.push(
                            `Expected: ${calculatedData.totalCustomerOwn}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.totalCustomerOwn}`,
                    //     `Total CUSTOMER OWN should be ${calculatedData.totalCustomerOwn}`
                    // );
                    break;
                case "Cost":
                    if (secondTdText != `${calculatedData.totalCost}`) {
                        discrepancies.push(
                            `Expected: ${calculatedData.totalCost}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.totalCost}`,
                    //     `Cost should be ${calculatedData.totalCost}`
                    // );
                    break;
                case "Fuel Surcharge cost":
                    if (secondTdText != `${calculatedData.fuelLevy}`) {
                        discrepancies.push(
                            `Expected: ${calculatedData.fuelLevy}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.fuelLevy}`,
                    //     `Fuel Surcharge cost should be ${calculatedData.fuelLevy}`
                    // );
                    break;
                case "Total No. Cons Shipped":
                    if (
                        secondTdText != `${calculatedData.totalNoConsShipped}`
                    ) {
                        discrepancies.push(
                            `Expected: ${calculatedData.totalNoConsShipped}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.totalNoConsShipped}`,
                    //     `Total number of consignments shipped should be ${calculatedData.totalNoConsShipped}`
                    // );
                    break;
                case "Total No. Cons Passed":
                    const expectedPassed = `${
                        data.totalNoConsPassed
                    } / ${percentagePassed?.toFixed(2)} %`;
                    if (secondTdText != expectedPassed) {
                        discrepancies.push(
                            `Expected: ${expectedPassed}, Found: ${secondTdText}`
                        );
                    }
                    // const expectedPassed = `${
                    //     data.totalNoConsPassed
                    // } / ${percentagePassed?.toFixed(2)} %`;
                    // assert.match(
                    //     secondTdText,
                    //     expectedPassed,
                    //     `Total number of Cons Passed should be ${expectedPassed}`
                    // );
                    break;
                case "Total No. Cons Failed":
                    const expectedFailed = `${
                        data.totalConsFailed
                    } / ${percentageFailed?.toFixed(2)} %`;
                    if (secondTdText != expectedFailed) {
                        discrepancies.push(
                            `Expected: ${expectedFailed}, Found: ${secondTdText}`
                        );
                    }
                    // const expectedFailed = `${
                    //     data.totalConsFailed
                    // } / ${percentageFailed?.toFixed(2)} %`;
                    // assert.match(
                    //     secondTdText,
                    //     expectedFailed,
                    //     `Total number of Cons Failed should be ${expectedFailed}`
                    // );
                    break;
                case "# of True PODs":
                    if (secondTdText != `${calculatedData.podCounter}`) {
                        discrepancies.push(
                            `Expected: ${calculatedData.podCounter}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     `${calculatedData.podCounter}`,
                    //     `Total number of True PODs should be ${calculatedData.podCounter}`
                    // );
                    break;
                case "% of True PODs":
                    const expectedPercentage = `${data.podPercentage?.toFixed(
                        2
                    )} %`;
                    if (secondTdText != expectedPercentage) {
                        discrepancies.push(
                            `Expected: ${expectedPercentage}, Found: ${secondTdText}`
                        );
                    }
                    // const expectedPercentage = `${data.podPercentage?.toFixed(
                    //     2
                    // )} %`;
                    // assert.match(
                    //     secondTdText,
                    //     expectedPercentage,
                    //     `Total % of True PODs should be ${expectedPercentage}`
                    // );
                    break;
                case "# of safety issues":
                    if (secondTdText != data.safetyCounter) {
                        discrepancies.push(
                            `Expected: ${data.safetyCounter}, Found: ${secondTdText}`
                        );
                    }
                    // assert.match(
                    //     secondTdText,
                    //     data.safetyCounter,
                    //     `Total number of safety issues should be ${data.safetyCounter}`
                    // );
                    break;
                default:
                    console.warn(`No assertion for: ${firstTdText}`);
            }
            // At the end of the test, check for discrepancies
            if (discrepancies.length > 0) {
                console.error("Test failed:");
                discrepancies.forEach((diff, index) => {
                    console.error(`${JSON.stringify(diff)}`);
                });
                throw new Error("Test failed due to differences in data");
            }
        }
    } catch (error) {
        console.error("Assertion failed:", error);
        throw error; // Rethrow the error to fail the test
    }
}

// async function testSpendChart(driver, data) {
//     try {
//         // Step 1: Locate the chart element
//         const chartLocator = By.xpath(
//             '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div[2]/div/div/div/canvas'
//         );
//         const graphElement = await driver.wait(
//             until.elementLocated(chartLocator),
//             10000
//         );
//         await driver.sleep(2000);

//         // if graph element is found and visible and not a promise
//         if (graphElement) {
//             // Capture the website chart
//             try {
//                 await graphElement.takeScreenshot().then((image) => {
//                     fs.writeFileSync(
//                         "spend-by-state-chart.png",
//                         image,
//                         "base64"
//                     );
//                 });
//             } catch (error) {
//                 throw new Error("Error occurred: " + error);
//             }

//             // Step 2: Inject `@ant-design/plots` if not loaded
//             const plotScript = fs.readFileSync(
//                 'C:/xampp/htdocs/Dev_GTLS_GTRS/node_modules/@ant-design/plots/es/index.js'
//               );

//             // Inject the module code directly into the browser
//             await driver.executeScript(`
//         (function() {
//             ${plotScript}
//             window['@ant-design/plots'] = require('@ant-design/plots');
//         })();
//     `);

//             // Confirm that @ant-design/plots is available
//             const isLoaded = await driver.executeScript(
//                 "return typeof window['@ant-design/plots'] != 'undefined';"
//             );
//             if (!isLoaded) throw new Error("@ant-design/plots failed to load");

//             // Render the chart using the loaded module
//             await driver.executeScript(`
//         const { Line } = window['@ant-design/plots'];
//         const data = ${JSON.stringify(data)};
//         const container = document.createElement('div');
//         container.style.position = 'absolute';
//         container.style.top = '0';
//         container.style.left = '0';
//         container.style.width = '724px';
//         container.style.height = '395px';
//         document.body.appendChild(container);
//         ReactDOM.render(React.createElement(Line, { data }), container);
//     `);

//             console.log("oscular chart rendered");
//             // Wait for the chart to render
//             await driver.sleep(1000);

//             // Capture the Ocular chart
//             await driver.takeScreenshot().then((image) => {
//                 fs.writeFileSync("ocular-chart.png", image, "base64");
//             });

//             // Step 3: Compare the images
//             const img1 = PNG.sync.read(fs.readFileSync("website-chart.png"));
//             const img2 = PNG.sync.read(fs.readFileSync("ocular-chart.png"));

//             console.log("Imgs", img1, img2);
//             const { width, height } = img1;
//             const diff = new PNG({ width, height });

//             const numDiffPixels = pixelmatch(
//                 img1.data,
//                 img2.data,
//                 diff.data,
//                 width,
//                 height,
//                 { threshold: 0.1 }
//             );

//             fs.writeFileSync("diff.png", PNG.sync.write(diff));

//             console.log(`Number of different pixels: ${numDiffPixels}`);

//             // Step 4: Assert that the charts are similar enough
//             assert(numDiffPixels < 1000, "Charts differ too much!");
//         } else {
//             throw new Error("Canvas not found");
//         }
//     } catch (error) {
//         console.error("Error occurred:", error);
//         throw new Error("Test failed due to: " + error);
//     }
// }

async function testSpendChart(driver, expectedData) {
    try {
        // Step 1: Locate the chart element (assuming it's rendered as a canvas or SVG)
        const chartLocator = By.xpath(
            "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div[2]/div/div/div/canvas"
        );
        const graphElement = await driver.wait(
            until.elementLocated(chartLocator),
            10000
        );
        await driver.sleep(2000);

        // Step 2: Extract the data from the chart element
        const chartData = await driver.executeScript(() => {
            const chartInstance = window.chartInstance;
            return chartInstance ? chartInstance.chart.getData() : null;
        });
        console.log("chartData", chartData);

        if (!chartData) {
            throw new Error("Chart data could not be retrieved.");
        }

        console.log("Extracted chart data:", chartData);
        console.log("Expected chart data:", expectedData);

        // Step 3: Compare extracted data with expected data
        assert.deepmatch(
            chartData,
            expectedData,
            "Chart data does not match expected data"
        );

        console.log("Chart data matches expected data.");
    } catch (error) {
        console.error("Error occurred:", error);
        throw new Error("Test failed due to: " + error);
    }
}

async function dashboardHelper(driver, testIs, testInput) {
    try{
        // Step 1: Navigate to the dashboard page
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
            if (text == "Dashboard") {
                dashItem = item;
            }
        }

        // Step 2: Select the date range
        let startDate, endDate, account, receiver;

        if(testIs == 'date only'){
            startDate = new Date(testInput.startDate);
            endDate = new Date(testInput.endDate);
        }
        else if(testIs == 'account only'){
            account = testInput.account;
        }else if(testIs == 'receiver only'){
            receiver = testInput.receiver;
        }else if(testIs == 'date and account'){
            startDate = new Date(testInput.startDate);
            endDate = new Date(testInput.endDate);
            account = testInput.account;
        }else if(testIs == 'date and receiver'){
            startDate = new Date(testInput.startDate);
            endDate = new Date(testInput.endDate);
            receiver = testInput.receiver;
        }else if(testIs == 'account and receiver'){
            account = testInput.account;
            receiver = testInput.receiver;
        }

        const fromDateInput = await driver.findElement(
            By.name("from-date")
        );
        await fromDateInput.sendKeys("2024-03-21"); // Ensure to await this
        const toDateInput = await driver.findElement(By.name("to-date"));
        await toDateInput.sendKeys("2024-04-13"); // Ensure to await this

        // Step 3: Fetch data from API request
        let data = [];
        let safetyData = [];
        const cookies = await driver.manage().getCookies();
        const authCookie = cookies.find((c) => c.name === "access_token");

        try {
            // Fetching data from the first API endpoint
            const resData = await axios.get(
                `${process.env.GTRS_API_URL}Dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: 9,
                    },
                }
            );

            // Filter data based on filters
            if(testIs == 'date only'){
                data = resData.data.filter((item) => {
                    const despatchDate = new Date(item.DespatchDate);
                    return despatchDate >= startDate && despatchDate <= endDate;
                });
            }
            else if(testIs == 'account only'){
                const filtered = data.filter((item) => {
                    const chargeToMatch =
                        account?.length === 0 || account?.includes(item.ChargeToId);
                    return (
                        chargeToMatch
                    );
                });
            data = filtered;
            }else if(testIs == 'receiver only'){
                const filtered = data.filter((item) => {
                    const isIncluded =
                        receiver.length === 0 ||
                        receiver?.includes(item.ReceiverName);
                    return (
                        isIncluded
                    );
                });
                data = filtered;
            }else if(testIs == 'date and account'){
                const filtered = data.filter((item) => {
                    const itemDate = new Date(item.DespatchDate);
                    const filterStartDate = new Date(startDate);
                    const filterEndDate = new Date(endDate);
                    filterStartDate.setHours(0);
                    filterEndDate.setSeconds(59);
                    filterEndDate.setMinutes(59);
                    filterEndDate.setHours(23);

                    const chargeToMatch =
                        account?.length === 0 || account?.includes(item.ChargeToId);

                    return (
                        itemDate >= filterStartDate &&
                        itemDate <= filterEndDate &&
                        chargeToMatch
                    );
                });
                data = filtered;
            }else if(testIs == 'date and receiver'){
                const filtered = chartsData.filter((item) => {
                    const isIncluded =
                        receiver.length === 0 ||
                        receiver?.includes(item.ReceiverName);

                    const itemDate = new Date(item.DespatchDate);
                    const filterStartDate = new Date(startDate);
                    const filterEndDate = new Date(endDate);
                    filterStartDate.setHours(0);
                    filterEndDate.setSeconds(59);
                    filterEndDate.setMinutes(59);
                    filterEndDate.setHours(23);
                    return (
                        itemDate >= filterStartDate &&
                        itemDate <= filterEndDate &&
                        isIncluded
                    );
                });
                data = filtered;
            }else if(testIs == 'account and receiver'){
                const filtered = chartsData.filter((item) => {
                    const isIncluded =
                        receiver.length === 0 ||
                        receiver?.includes(item.ReceiverName);

                    const chargeToMatch =
                        account?.length === 0 || account?.includes(item.ChargeToId);

                    return (
                        isIncluded &&
                        chargeToMatch
                    );
                });
                data = filtered;
            }

            // Fetching data from the second API endpoint
            const resSafety = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: 9,
                    },
                }
            );

            //Filter safety data
            if (account) {
                if (account && account?.length > 0) {
                    resSafety.data = resSafety.data.filter((data) => account.includes(data.DebtorId));
                }
            }

            // Assign safety data
            safetyData = resSafety.data;

        } catch (error) {
            console.error("Error occurred:", error);
        throw new Error("Test failed due to: " + error);
    }
    }catch (error) {
        console.error("Error occurred:", error);
        throw new Error("Test failed due to: " + error);
    }
}

module.exports = {
    login,
    loginToApp,
    loginMicrosoft,
    loginToAppMicrosoft,
    testInformation,
    testSpendChart,
    dashboardHelper,
};
