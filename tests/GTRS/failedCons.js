const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const { login, navigateToPage } = require("../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../helper/gtrsPages");

describe("Navigation Test", () => {
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

    it("user can view the Failed Consignments", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(3000);

        // Step 2: Verify that Failed Consignments is displayed
        const title = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
            )
        );
        assert.strictEqual(
            await title.getText(),
            "Failed Consignments",
            "Failed Consignments should be displayed."
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it("user can navigate from other pages to the Failed Consignments", async () => {
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
                if (text == "Failed Consignments") {
                    dashItem = item;
                }
            }

            // Step 3: Navigate to the Failed Consignments
            await dashItem.click();

            // Step 2: Verify that Failed Consignments is displayed
            const title = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
                )
            );
            assert.strictEqual(
                await title.getText(),
                "Failed Consignments",
                "Failed Consignments should be displayed."
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/failed-consignments",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/failed-consignments' but got '${currentUrl}'.`
            );
        });
    }
});

describe("Table Test", () => {
    const tableFilters = [
        {
            filterName: "Cons No",
            value: "2501016206",
            key: "ConsignmentNo",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Incident No",
            value: "IR000009",
            key: "IncidentNo",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Incident Type",
            value: "Unilever Pallet Qty Mismatch",
            key: "IncidentTypeName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Status",
            value: "CLOSED",
            key: "IncidentStatusName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/button",
        },
        {
            filterName: "Sender Name",
            value: "QUBE LOGISTICS",
            key: "SenderName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Sender Reference",
            value: "5722127237",
            key: "SenderReference",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[2]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Sender State",
            value: "NSW",
            key: "SenderState",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[3]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Receiver Name",
            value: "Epic Wright Heaton Pty Ltd",
            key: "ReceiverName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[6]/div[3]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Receiver State",
            value: "NSW",
            key: "ReceiverState",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[6]/div[3]/div[3]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Service",
            value: "GENERAL FREIGHT",
            key: "Service",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[7]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "KPI DateTime",
            value: "2024-05-07T23:59:00",
            key: "KpiDatetime",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[8]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Despatch Date",
            value: "2024-05-07T11:21:25.390",
            key: "DespatchDate",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[9]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "RDD",
            value: "2024-05-07 23:59:59",
            key: "DeliveryRequiredDateTime",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[10]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Arrived time",
            value: "2024-05-02 11:04:34",
            key: "ArrivedDatetime",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[11]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Delivered time",
            value: "2024-05-09 10:30:00",
            key: "DeliveredDate",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[12]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "POD",
            value: false,
            key: "POD",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[13]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
    ];

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

    it(`Failed consignments data is correct`, async () => {
        try {
            // Step 1: Navigate to the failed cons page
            await driver.sleep(2000);
            navigateToPage(driver, "Failed Consignments");

            // Step 2: Fetch data from API request
            let data = [],
                PerfData = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}PerformanceReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );
            PerfData = resData.data?.filter(
                (obj) =>
                    obj.Status === "FAIL" &&
                    !excludedDebtorIds.includes(obj.ChargeToID)
            );
            data = PerfData;
            // Step 3: Verify the data
            // Fetch data visible in the table
            const nbPages = Math.ceil(data?.length / 50); // Number of total pages; deafult number of rows in page is 50
            let allCellValues = [];
            for (let i = 1; i <= nbPages; i++) {
                // Navigate to the current page
                await driver
                    .findElement(
                        By.css(
                            ".inovua-react-pagination-toolbar__icon--named--NEXT_PAGE"
                        )
                    )
                    .click();
                await driver.sleep(1000); // wait for page to load

                // Extract the data from the current page
                const gridCells = await driver.findElements(
                    By.css(".InovuaReactDataGrid__cell__content")
                );
                const cellValues = await Promise.all(
                    gridCells.map(async (cell) => {
                        return await cell.getText();
                    })
                );

                // Add the data to the overall array
                allCellValues.push(...cellValues);
            }

            const apiValues = data.map((failedCons) => {
                return [
                    failedCons.ConsignmentNo,
                    failedCons.IncidentNo,
                    failedCons.IncidentTypeName,
                    failedCons.IncidentStatusName,
                    failedCons.SenderName,
                    failedCons.SenderReference,
                    failedCons.SenderState,
                    failedCons.ReceiverName,
                    failedCons.ReceiverReference,
                    failedCons.ReceiverState,
                    failedCons.Service,
                    failedCons.KpiDatetime,
                    failedCons.DespatchDate,
                    failedCons.DeliveryRequiredDateTime,
                    failedCons.ArrivedDatetime,
                    failedCons.DeliveredDate,
                    failedCons.POD,
                ];
            });

            // Map cell values to API values
            const mappedValues = cellValues.map((cellValue, index) => {
                const apiValue = apiValues[index];
                return {
                    cellValue,
                    apiValue,
                };
            });

            let differences = [];
            // Compare mapped values
            mappedValues.forEach((mappedValue) => {
                if (mappedValue.cellValue !== mappedValue.apiValue) {
                    differences.push(
                        `Mismatch: ${mappedValue.cellValue} vs ${mappedValue.apiValue}`
                    );
                }
            });

            if (differences.length > 0) {
                console.log("differences", differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });

    for (const {
        filterName,
        value,
        locator,
        key,
        clearLocator,
    } of tableFilters) {
        it(`user can filter by ${filterName}`, async () => {
            try {
                // Step 1: Navigate to the failed cons page
                await driver.sleep(2000);
                navigateToPage(driver, "Failed Consignments");

                // Step 2: Click on the filter input
                await driver.sleep(2000);
                const filerInput = await driver.findElement(By.xpath(locator));
                await filerInput.sendKeys(value);
                const actions = driver.actions();
                await actions.sendKeys(Key.RETURN).perform();

                // Step 3: Fetch data from API request
                let data = [];
                const cookies = await driver.manage().getCookies();
                const authCookie = cookies.find(
                    (c) => c.name === "access_token"
                );

                const resData = await axios.get(
                    `${process.env.GTRS_API_URL}PerformanceReport`,
                    {
                        headers: {
                            Authorization: `Bearer ${authCookie.value}`,
                            UserId: process.env.USER_ID,
                        },
                    }
                );

                // Filter data based on date
                if (filterName.toLowerCase().includes("date")) {
                    const filterDate = new Date(value);
                    data = resData.data.filter((item) => {
                        const dateAPI = new Date(item[key]);
                        return dateAPI == filterDate;
                    });
                } else {
                    data = resData.data.filter((item) => {
                        const filtered = item[key]?.toLowerCase();
                        return filtered?.includes(value.toLowerCase());
                    });
                }

                // Step 4: Verify the data
                // Fetch data visible in the table
                const nbPages = Math.ceil(data?.length / 50); // Number of total pages; deafult number of rows in page is 50
                let allCellValues = [];
                for (let i = 1; i <= nbPages; i++) {
                    // Navigate to the current page
                    await driver
                        .findElement(
                            By.css(
                                ".inovua-react-pagination-toolbar__icon--named--NEXT_PAGE"
                            )
                        )
                        .click();
                    await driver.sleep(1000); // wait for page to load

                    // Extract the data from the current page
                    const gridCells = await driver.findElements(
                        By.css(".InovuaReactDataGrid__cell__content")
                    );
                    const cellValues = await Promise.all(
                        gridCells.map(async (cell) => {
                            return await cell.getText();
                        })
                    );

                    // Add the data to the overall array
                    allCellValues.push(...cellValues);
                }

                const apiValues = data.map((failedCons) => {
                    return [
                        failedCons.ConsignmentNo,
                        failedCons.IncidentNo,
                        failedCons.IncidentTypeName,
                        failedCons.IncidentStatusName,
                        failedCons.SenderName,
                        failedCons.SenderReference,
                        failedCons.SenderState,
                        failedCons.ReceiverName,
                        failedCons.ReceiverReference,
                        failedCons.ReceiverState,
                        failedCons.Service,
                        failedCons.KpiDatetime,
                        failedCons.DespatchDate,
                        failedCons.DeliveryRequiredDateTime,
                        failedCons.ArrivedDatetime,
                        failedCons.DeliveredDate,
                        failedCons.POD,
                    ];
                });

                // Map cell values to API values
                const mappedValues = allCellValues.map((cellValue, index) => {
                    const apiValue = apiValues[index];
                    return {
                        cellValue,
                        apiValue,
                    };
                });

                let differences = [];
                // Compare mapped values
                mappedValues.forEach((mappedValue) => {
                    if (mappedValue.cellValue !== mappedValue.apiValue) {
                        differences.push(
                            `Mismatch: ${mappedValue.cellValue} vs ${mappedValue.apiValue}`
                        );
                    }
                });

                // Clear filter
                console.log(`Clear ${filterName} manually`);
                await driver.sleep(6000);

                if (differences.length > 0) {
                    console.log("differences", differences);
                    throw new Error("Test failed due to differences in data");
                }
            } catch (error) {
                console.error("Error occurred:", error);
                throw new Error("Test failed due to: " + error);
            }
        });
    }

    for (const {
        filterName,
        value,
        locator,
        key,
        clearLocator,
    } of tableFilters) {
        it(`user can clear ${filterName} filter`, async () => {
            // Step 1: Navigate to the failed cons page
            await driver.sleep(6000);
            // navigateToPage(driver, "Failed Consignments");

            // Step 2: Click on the filter input
            await driver.sleep(2000);
            const filerInput = await driver.findElement(By.xpath(locator));
            await filerInput.sendKeys(value);
            const actions = driver.actions();
            await actions.sendKeys(Key.RETURN).perform();

            // Step 3: Fetch data from API request
            let data = [],
                PerfData = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}PerformanceReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );
            PerfData = resData.data?.filter(
                (obj) =>
                    obj.Status === "FAIL" &&
                    !excludedDebtorIds.includes(obj.ChargeToID)
            );
            data = PerfData;

            // Step 4: Verify the clear filter function
            // Clear filter
            console.log(`Clear ${filterName} manually`);
            await driver.sleep(6000);

            let differences = [];
            // Check that filter input is empty
            await driver.sleep(5000);
            const filerInputNew = await driver.findElement(By.xpath(locator));
            const text = await filerInputNew.getText();

            if (text != "") {
                differences.push("Filter input field is not empty");
            }

            // Fetch data visible in the table
            const nbPages = Math.ceil(data?.length / 50); // Number of total pages; deafult number of rows in page is 50
            let allCellValues = [];
            for (let i = 1; i <= nbPages; i++) {
                // Navigate to the current page
                await driver
                    .findElement(
                        By.css(
                            ".inovua-react-pagination-toolbar__icon--named--NEXT_PAGE"
                        )
                    )
                    .click();
                await driver.sleep(1000); // wait for page to load

                // Extract the data from the current page
                const gridCells = await driver.findElements(
                    By.css(".InovuaReactDataGrid__cell__content")
                );
                const cellValues = await Promise.all(
                    gridCells.map(async (cell) => {
                        return await cell.getText();
                    })
                );

                // Add the data to the overall array
                allCellValues.push(...cellValues);
            }

            const apiValues = data.map((failedCons) => {
                return [
                    failedCons.ConsignmentNo,
                    failedCons.IncidentNo,
                    failedCons.IncidentTypeName,
                    failedCons.IncidentStatusName,
                    failedCons.SenderName,
                    failedCons.SenderReference,
                    failedCons.SenderState,
                    failedCons.ReceiverName,
                    failedCons.ReceiverReference,
                    failedCons.ReceiverState,
                    failedCons.Service,
                    failedCons.KpiDatetime,
                    failedCons.DespatchDate,
                    failedCons.DeliveryRequiredDateTime,
                    failedCons.ArrivedDatetime,
                    failedCons.DeliveredDate,
                    failedCons.POD,
                ];
            });

            // Map cell values to API values
            const mappedValues = allCellValues.map((cellValue, index) => {
                const apiValue = apiValues[index];
                return {
                    cellValue,
                    apiValue,
                };
            });
            // Compare mapped values
            mappedValues.forEach((mappedValue) => {
                if (mappedValue.cellValue !== mappedValue.apiValue) {
                    differences.push(
                        `Mismatch: ${mappedValue.cellValue} vs ${mappedValue.apiValue}`
                    );
                }
            });
        });
    }

    it("user can clear all filters", async () => {
        try {
            // Step 1: Navigate to the failed cons page
            await driver.sleep(2000);
            await navigateToPage(driver, "Failed Consignments");

            await driver.sleep(4000);
            // Step 2: Map over all filters and give them a value
            for (const { locator, value } of tableFilters) {
                let filerInput;
                try {
                    filerInput = await driver.findElement(By.xpath(locator));
                } catch (error) {
                    if (error instanceof NoSuchElementError) {
                        // Scroll to the right
                        const scrollArea = await driver.findElement(
                            By.css(".InovuaReactDataGrid__virtual-list")
                        );
                        await driver.executeScript(
                            "arguments[0].scrollLeft = arguments[0].offsetWidth",
                            scrollArea
                        );
                        // Try to find the element again
                        filerInput = await driver.findElement(
                            By.xpath(locator)
                        );
                    } else {
                        throw error;
                    }
                }

                const scrollArea = await driver.findElement(
                    By.css(".InovuaReactDataGrid__virtual-list")
                );
                const actions = driver.actions();
                await driver.executeScript(
                    "arguments[0].scrollLeft = 0",
                    scrollArea
                );
                await driver.wait(until.elementIsVisible(filerInput), 4000);
                await filerInput.sendKeys(value);
                await actions.sendKeys(Key.RETURN).perform();
            }

            // Step 3: Clear all filters
            await driver.sleep(2000);
            const headerElement = await driver.findElement(
                By.css(".InovuaReactDataGrid__header")
            );
            const divChildren = await headerElement.findElements(
                By.tagName("div")
            );
            const firstHeader = await divChildren[0];
            const filterWrapper = await firstHeader.findElement(
                By.css(".InovuaReactDataGrid__column-header__filter-wrapper")
            );

            const filterIcon = await filterWrapper.findElement(
                By.css(".InovuaReactDataGrid__column-header__filter-settings")
            );
            await filterIcon.click();

            // wait for filter menu to appear
            const filterMenu = await driver.wait(
                until.elementLocated(
                    By.css(".inovua-react-toolkit-menu__table")
                ),
                5000 // wait for up to 5 seconds
            );
            const allBtns = await filterMenu.findElements(
                By.css("inovua-react-toolkit-menu__row")
            );
            console.log("Click on Clear All Btn");
            await driver.sleep(2000);
            //const clearAllBtn = allBtns[allBtns?.length - 1];
            //await clearAllBtn.click();

            // Step 4: Verify that all filters are cleared
            let differences = [];
            for (const { locator, value } of tableFilters) {
                const filerInput = await driver.findElement(By.xpath(locator));
                const visText = await filerInput.getText();
                if (visText != "") {
                    differences.push(
                        `Expected an empty string but got instead ${visText}`
                    );
                }
            }

            if (differences?.length > 0) {
                throw new Error("Test failed, differences: " + differences);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
});

describe("Table Test", () => {
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
    it("user can navigate to consignment details page", async () => {
        // Step 1: Navigate to the Failed Consignments page
        await driver.sleep(2000);
        await navigateToPage(driver, "Failed Consignments");

        // Step 2: Fetch data from API request
        let data = [];
        const cookies = await driver.manage().getCookies();
        const authCookie = cookies.find((c) => c.name === "access_token");

        const resData = await axios.get(
            `${process.env.GTRS_API_URL}ConsignmentById`,
            {
                headers: {
                    Authorization: `Bearer ${authCookie.value}`,
                    UserId: process.env.USER_ID,
                    Consignment_id: process.env.CONS_ID,
                },
            }
        );

        data = resData.data;

        // Step 3: Click on consignment details
        //Get con nbr that corresponds to this id
        const consInput = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input'
            )
        );
        await consInput.sendKeys("GMI2237");

        // Click on cons nbr
        const conNbr = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div/div/div[1]/div/span'
            )
        );
        await conNbr.click();

        await driver.sleep(10000);

        // Step 4: Verify the data
        const url = await driver.getCurrentUrl();

        assert.strictEqual(
            url,
            "https://gtrs.gtls.store/gtrs/consignment-details",
            `URL should be https://gtrs.gtls.store/gtrs/consignment-details but got ${url}`
        );
        const consNumber = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[1]/div[1]/h4/span'
            )
        );

        assert.strictEqual(
            consNumber.getText(),
            "GMI2237",
            `Cons number should be GMI2237 but got ${consNumber.getText()}`
        );
    });

    it("user can navigate to incident details page", async () => {
        // Step 1: Navigate to the Failed Consignments page
        await driver.sleep(2000);
        await navigateToPage(driver, "Failed Consignments");

        // Step 2: Fetch data from API request
        let data = [];
        const cookies = await driver.manage().getCookies();
        const authCookie = cookies.find((c) => c.name === "access_token");

        const resData = await axios.get(
            `${process.env.GTCCR_API_URL}IncidentById`,
            {
                headers: {
                    Authorization: `Bearer ${authCookie.value}`,
                    UserId: process.env.USER_ID,
                    Incident_id: process.env.INC_ID,
                },
            }
        );

        data = resData.data;

        // Step 3: Click on consignment details
        //Get con nbr that corresponds to this id
        const consInput = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input'
            )
        );
        await consInput.sendKeys("GMI2237");

        // Click on cons nbr
        const incNbr = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[2]/div/span'
            )
        );
        await incNbr.click();

        await driver.sleep(10000);

        // Step 4: Verify the data
        const url = await driver.getCurrentUrl();

        assert.strictEqual(
            url,
            "https://gtrs.gtls.store/gtrs/incident",
            `URL should be https://gtrs.gtls.store/gtrs/incident but got ${url}`
        );

        const incNumber = await driver.findElement(
            By.xpath('//*[@id="CdirForm"]/div[1]/div[2]/div/div[3]/label[2]')
        );

        assert.strictEqual(
            incNumber.getText(),
            "IR000008",
            `Cons number should be IR000008 but got ${incNumber.getText()}`
        );
    });

    it("user can filter data by debtor account", async () => {
        //Step 1: Filter data in GTRS
        const debAccDropdown = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[2]/div'
            )
        );
        await debAccDropdown.click();

        const ualDebtor = await driver.findElement(By.id("1507      "));
        await ualDebtor.click();

        let PerfData = await fetchData("PerformanceReport", {});
        PerfData = PerfData?.filter(
            (obj) =>
                obj.Status === "FAIL" &&
                !excludedDebtorIds.includes(obj.ChargeToID)
        );
        let data = PerfData;

        //Step 2: Filter api data
        let filteredAPIData = [];
        data.map((item) => {
            if (item.ChargeToID == "1507") {
                filteredAPIData.push({
                    ConsignmentNo: failedCons.ConsignmentNo,
                    IncidentNo: failedCons.IncidentNo,
                    IncidentTypeName: failedCons.IncidentTypeName,
                    IncidentStatusName: failedCons.IncidentStatusName,
                    SenderName: failedCons.SenderName,
                    SenderReference: failedCons.SenderReference,
                    SenderState: failedCons.SenderState,
                    ReceiverName: failedCons.ReceiverName,
                    ReceiverReference: failedCons.ReceiverReference,
                    ReceiverState: failedCons.ReceiverState,
                    Service: failedCons.Service,
                    KpiDatetime: failedCons.KpiDatetime,
                    DespatchDate: failedCons.DespatchDate,
                    DeliveryRequiredDateTime:
                        failedCons.DeliveryRequiredDateTime,
                    ArrivedDatetime: failedCons.ArrivedDatetime,
                    DeliveredDate: failedCons.DeliveredDate,
                    POD: failedCons.POD,
                });
            }
        });

        // Step 3: Filter data in GTRS
        const nbPages = Math.ceil(filteredAPIData?.length / 50); // Number of total pages; deafult number of rows in page is 50
        let allCellValues = [];
        for (let i = 1; i <= nbPages; i++) {
            // Navigate to the current page
            await driver
                .findElement(
                    By.css(
                        ".inovua-react-pagination-toolbar__icon--named--NEXT_PAGE"
                    )
                )
                .click();
            await driver.sleep(1000); // wait for page to load

            // Extract the data from the current page
            const gridCells = await driver.findElements(
                By.css(".InovuaReactDataGrid__cell__content")
            );
            const cellValues = await Promise.all(
                gridCells.map(async (cell) => {
                    return await cell.getText();
                })
            );

            // Add the data to the overall array
            allCellValues.push(...cellValues);
        }

        const apiValues = filteredAPIData.map((failCons) => {
            return [
                failCons.ConsignmentNo,
                failCons.IncidentNo,
                failCons.IncidentTypeName,
                failCons.IncidentStatusName,
                failCons.SenderName,
                failCons.SenderReference,
                failCons.SenderState,
                failCons.ReceiverName,
                failCons.ReceiverReference,
                failCons.ReceiverState,
                failCons.Service,
                failCons.KpiDatetime,
                failCons.DespatchDate,
                failCons.DeliveryRequiredDateTime,
                failCons.ArrivedDatetime,
                failCons.DeliveredDate,
                failCons.POD,
            ];
        });

        // Step 4: Compare data

        // Map cell values to API values
        const mappedValues = allCellValues.map((cellValue, index) => {
            const apiValue = apiValues[index];
            return {
                cellValue,
                apiValue,
            };
        });

        let differences = [];
        // Compare mapped values
        mappedValues.forEach((mappedValue) => {
            if (mappedValue.cellValue !== mappedValue.apiValue) {
                differences.push(
                    `Mismatch: ${mappedValue.cellValue} vs ${mappedValue.apiValue}`
                );
            }
        });

        if (discrepancies?.length > 0) {
            assert.fail(
                "There are differences between filtered API data and filtered data in GTRS"
            );
        }

        //Step 5: Clean up filter
        await ualDebtor.click();
        await debAccDropdown.click();
    });
});
