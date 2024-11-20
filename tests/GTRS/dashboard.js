const { Builder, By, until } = require("selenium-webdriver");
const { login, testInformation, testSpendChart } = require("../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../helper/gtrsPages");
const {
    calculateStatistics,
    getMonthlyData,
    getMonthlyRecordCounts,
    getConsStatusCounter,
    getPODCounts,
    getPODCountsByState,
    getStateRecordCounts,
    getStateTotalWeights,
    getKPIStatusCounter,
} = require("../helper/chartsHelper");
const baseUrl = process.env.WEB_URL;

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
    it("user can view the dashboard", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(3000);

        // Step 2: Verify that dashboard is displayed
        const title = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
            )
        );
        assert.strictEqual(
            await title.getText(),
            "Dashboard",
            "Dashboard should be displayed."
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it(`user can navigate from ${pageName} to the dashboard`, async () => {
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
                if (text == "Dashboard") {
                    dashItem = item;
                }
            }

            // Step 3: Navigate to the dashboard
            await dashItem.click();

            // Step 2: Verify that dashboard is displayed
            const title = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
                )
            );
            assert.strictEqual(
                await title.getText(),
                "Dashboard",
                "Dashboard should be displayed."
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                baseUrl+"gtrs/dashboard",
                `Expected URL to be '${baseUrl}gtrs/dashboard' but got '${currentUrl}'.`
            );
        });
    }
});
describe("User can filter dashboard data based on date", () => {
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

    //Information graph
    it("info graph data is correct", async () => {
        // Step 1: Navigate to the dashboard page
        let ulElement = await driver.findElement(By.className("css-ewdv3l"));

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
        const startDate = new Date("2024-03-21T00:00:00Z");
        const endDate = new Date("2024-04-13T23:59:59Z");

        const fromDateInput = await driver.findElement(By.name("from-date"));
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
                        UserId: process.env.USER_ID,
                    },
                }
            );

            // Filter data based on fromDate and toDate
            data = resData.data.filter((item) => {
                const despatchDate = new Date(item.DespatchDate);
                return despatchDate >= startDate && despatchDate <= endDate;
            });

            // Fetching data from the second API endpoint
            const resSafety = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            // Assign safety data
            safetyData = resSafety.data;
        } catch (err) {
            console.error("Error occurred:", err);
            throw new Error("Test failed due to: " + err.response?.data);
        }

        // Step 4: Verify the data
        const calculatedData = calculateStatistics(data, safetyData);
        await driver.sleep(5000);
        const infoTable = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div[1]/div/div/div/table/tbody'
            )
        );

        const rows = await infoTable.findElements(By.tagName("tr"));
        if (rows.length > 0) {
            await testInformation(rows, calculatedData);
        }
    });

    //Spend graph
    it("spend graph data is correct", async () => {
        // Step 4: Compare actual data with expected data
        console.log("Calculated spend data:", getMonthlyData(data));
        const actualData = getMonthlyData(data);
        const differences = [];
        const expData = [
            {
                "month": "2024-03",
                "amount": 10650717,
                "state": "NSW"
            },
            {
                "month": "2024-03",
                "amount": 986155,
                "state": "VIC"
            },
            {
                "month": "2024-03",
                "amount": 7960672,
                "state": "QLD"
            },
            {
                "month": "2024-03",
                "amount": 3323244,
                "state": "SA"
            },
            {
                "month": "2024-03",
                "amount": 120396,
                "state": "ACT"
            },
            {
                "month": "2024-03",
                "amount": 4400400,
                "state": "WA"
            },
            {
                "month": "2024-04",
                "amount": 9684495,
                "state": "NSW"
            },
            {
                "month": "2024-04",
                "amount": 668249,
                "state": "VIC"
            },
            {
                "month": "2024-04",
                "amount": 11143118,
                "state": "QLD"
            },
            {
                "month": "2024-04",
                "amount": 2710241,
                "state": "SA"
            },
            {
                "month": "2024-04",
                "amount": 149560,
                "state": "ACT"
            }
        ];

        for (let i = 0; i < actualData.length; i++) {
            if (
                !expData[i] ||
                actualData[i].month !== expData[i].month ||
                actualData[i].amount !== expData[i].amount ||
                actualData[i].state !== expData[i].state
            ) {
                differences.push({
                    expected: expData[i],
                    actual: actualData[i],
                });
            }
        }

        if (differences.length > 0) {
            console.error("Test failed:");
            differences.forEach((diff, index) => {
                console.error(`  Difference ${index + 1}:`);
                console.error(`    Expected: ${JSON.stringify(diff.expected)}`);
                console.error(`    Actual: ${JSON.stringify(diff.actual)}`);
            });
            throw new Error("Test failed due to differences in data");
        }
    });

    //Cons by month graph
    it("cons by month graph data is correct", async () => {
        dateInputs = {
            startDate: "2024-03-21T00:00:00Z",
            endDate: "2024-04-13T23:59:59Z",
        };

        await dashboardHelper(driver, "date only", dateInputs);

        // Step 4: Compare the fetched data with the expected data
        const expectedData = [
            {
                "data": "2024-03",
                "value": 260
            },
            {
                "data": "2024-04",
                "value": 332
            }
        ];
        const actualData = getMonthlyRecordCounts(data);
        console.log("actualData", actualData);
        console.log("expectedData", expectedData);
        assert.deepmatch(
            chartData,
            expectedData,
            "Cons by month data does not match expected data"
        );
    });

    //Cons status
    it("cons status graph data is correct", async () => {
        dateInputs = {
            startDate: "2024-03-21T00:00:00Z",
            endDate: "2024-04-13T23:59:59Z",
        };

        await dashboardHelper(driver, "date only", dateInputs);
        const expectedData = [
            { label: "PASS", value: 564 },
            { label: "PENDING", value: 12 },
            { label: "FAIL", value: 16 },
        ];
        const actualData = getConsStatusCounter(data);
        console.log("actualData", actualData);
        console.log("expectedData", expectedData);
        assert.deepmatch(
            chartData,
            expectedData,
            "Cons status data does not match expected data"
        );
    });

    //POD true vs false graph
    it("POD true vs false graph data is correct", async () => {
        dateInputs = {
            startDate: "2024-03-21T00:00:00Z",
            endDate: "2024-04-13T23:59:59Z",
        };

        await dashboardHelper(driver, "date only", dateInputs);
        const expectedData = [
            {
                "pod": "true",
                "monthYear": "2024-03",
                "value": 255
            },
            {
                "pod": "false",
                "monthYear": "2024-03",
                "value": 5
            },
            {
                "pod": "true",
                "monthYear": "2024-04",
                "value": 331
            },
            {
                "pod": "false",
                "monthYear": "2024-04",
                "value": 1
            }
        ];
        const actualData = getPODCounts(data);
        console.log("actualData", actualData);
        console.log("expectedData", expectedData);
        assert.deepmatch(
            chartData,
            expectedData,
            "POD count data does not match expected data"
        );
    });

    //POD status by state graph
    it("POD status graph data is correct", async () => {
        dateInputs = {
            startDate: "2024-03-21T00:00:00Z",
            endDate: "2024-04-13T23:59:59Z",
        };

        await dashboardHelper(driver, "date only", dateInputs);
        const expectedData = [
            {
                "label": "NSW",
                "value": 295
            },
            {
                "label": "VIC",
                "value": 30
            },
            {
                "label": "QLD",
                "value": 176
            },
            {
                "label": "SA",
                "value": 72
            },
            {
                "label": "ACT",
                "value": 11
            },
            {
                "label": "WA",
                "value": 2
            }
        ];
        const actualData = getPODCountsByState(data);
        console.log("actualData", actualData);
        console.log("expectedData", expectedData);
        assert.deepmatch(
            chartData,
            expectedData,
            "POD status data does not match expected data"
        );
    });

    //Cons by state graph
    it("cons by state graph data is correct", async () => {
        dateInputs = {
            startDate: "2024-03-21T00:00:00Z",
            endDate: "2024-04-13T23:59:59Z",
        };

        await dashboardHelper(driver, "date only", dateInputs);
        const expectedData = [
            {
                "data": "NSW",
                "value": 300
            },
            {
                "data": "VIC",
                "value": 31
            },
            {
                "data": "QLD",
                "value": 176
            },
            {
                "data": "SA",
                "value": 72
            },
            {
                "data": "ACT",
                "value": 11
            },
            {
                "data": "WA",
                "value": 2
            }
        ];
        const actualData = getStateRecordCounts(data);
        console.log("actualData", actualData);
        console.log("expectedData", expectedData);
        assert.deepmatch(
            chartData,
            expectedData,
            "Cons by state data does not match expected data"
        );
    });

    //Weight by state graph
    it("weight by state graph data is correct", async () => {
        dateInputs = {
            startDate: "2024-03-21T00:00:00Z",
            endDate: "2024-04-13T23:59:59Z",
        };

        await dashboardHelper(driver, "date only", dateInputs);
        const expectedData = [
            {
                "data": "NSW",
                "value": 535.19
            },
            {
                "data": "VIC",
                "value": 188.59
            },
            {
                "data": "QLD",
                "value": 447.89
            },
            {
                "data": "SA",
                "value": 214.24
            },
            {
                "data": "ACT",
                "value": 9
            },
            {
                "data": "WA",
                "value": 17.96
            }
        ];
        const actualData = getStateTotalWeights(data);
        console.log("actualData", actualData);
        console.log("expectedData", expectedData);
        assert.deepmatch(
            chartData,
            expectedData,
            "Weight by state data does not match expected data"
        );
    });

    //KPI graph
    it("kpi graph data is correct", async () => {
        dateInputs = {
            startDate: "2024-03-21T00:00:00Z",
            endDate: "2024-04-13T23:59:59Z",
        };

        await dashboardHelper(driver, "date only", dateInputs);
        const expectedData = [
            {
                "label": "Pass",
                "value": 311
            },
            {
                "label": "N/A",
                "value": 197
            },
            {
                "label": "Fail",
                "value": 84
            }
        ];
        const actualData = getKPIStatusCounter(data);
        console.log("actualData", actualData);
        console.log("expectedData", expectedData);
        assert.deepmatch(
            chartData,
            expectedData,
            "KPI status data does not match expected data"
        );
    });
});
/*
describe("User can filter dashboard data based on receiver name", () => {
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

    //Information graph
    it("info graph data is correct", async () => {});

    //Spend graph
    it("spend graph data is correct", async () => {});

    //Cons by month graph
    it("cons by month graph data is correct", async () => {});

    //Cons status
    it("cons status graph data is correct", async () => {});

    //POD true vs false graph
    it("POD true vs false graph data is correct", async () => {});

    //POD status by state graph
    it("POD status graph data is correct", async () => {});

    //Cons by state graph
    it("cons by state graph data is correct", async () => {});

    //Weight by state graph
    it("weight by state graph data is correct", async () => {});

    //KPI graph
    it("kpi graph data is correct", async () => {});
});
describe("User can filter dashboard data based on debtor account", () => {
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

    //Information graph
    it("info graph data is correct", async () => {});

    //Spend graph
    it("spend graph data is correct", async () => {});

    //Cons by month graph
    it("cons by month graph data is correct", async () => {});

    //Cons status
    it("cons status graph data is correct", async () => {});

    //POD true vs false graph
    it("POD true vs false graph data is correct", async () => {});

    //POD status by state graph
    it("POD status graph data is correct", async () => {});

    //Cons by state graph
    it("cons by state graph data is correct", async () => {});

    //Weight by state graph
    it("weight by state graph data is correct", async () => {});

    //KPI graph
    it("kpi graph data is correct", async () => {});
});
describe("User can filter dashboard data based on date and receiver name", () => {
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

    //Information graph
    it("info graph data is correct", async () => {});

    //Spend graph
    it("spend graph data is correct", async () => {});

    //Cons by month graph
    it("cons by month graph data is correct", async () => {});

    //Cons status
    it("cons status graph data is correct", async () => {});

    //POD true vs false graph
    it("POD true vs false graph data is correct", async () => {});

    //POD status by state graph
    it("POD status graph data is correct", async () => {});

    //Cons by state graph
    it("cons by state graph data is correct", async () => {});

    //Weight by state graph
    it("weight by state graph data is correct", async () => {});

    //KPI graph
    it("kpi graph data is correct", async () => {});
});
describe("User can filter dashboard data based on date and debtor account", () => {
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

    //Information graph
    it("info graph data is correct", async () => {});

    //Spend graph
    it("spend graph data is correct", async () => {});

    //Cons by month graph
    it("cons by month graph data is correct", async () => {});

    //Cons status
    it("cons status graph data is correct", async () => {});

    //POD true vs false graph
    it("POD true vs false graph data is correct", async () => {});

    //POD status by state graph
    it("POD status graph data is correct", async () => {});

    //Cons by state graph
    it("cons by state graph data is correct", async () => {});

    //Weight by state graph
    it("weight by state graph data is correct", async () => {});

    //KPI graph
    it("kpi graph data is correct", async () => {});
});
describe("User can filter dashboard data based on receiver name and debtor account", () => {
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

    //Information graph
    it("info graph data is correct", async () => {});

    //Spend graph
    it("spend graph data is correct", async () => {});

    //Cons by month graph
    it("cons by month graph data is correct", async () => {});

    //Cons status
    it("cons status graph data is correct", async () => {});

    //POD true vs false graph
    it("POD true vs false graph data is correct", async () => {});

    //POD status by state graph
    it("POD status graph data is correct", async () => {});

    //Cons by state graph
    it("cons by state graph data is correct", async () => {});

    //Weight by state graph
    it("weight by state graph data is correct", async () => {});

    //KPI graph
    it("kpi graph data is correct", async () => {});
});
 */
