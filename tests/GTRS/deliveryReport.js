const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const { login, navigateToPage, fetchData } = require("../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../helper/gtrsPages");

// taken from consTrack
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

    it("user can view the Consignment Tracking", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(8000);

        // Step 2: Verify that Consignment Tracking is displayed
        const title = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
            )
        );
        assert.strictEqual(
            await title.getText(),
            "Consignment Tracking",
            "Consignment Tracking should be displayed."
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it(`user can navigate from ${pageName} to the Consignment Tracking`, async () => {
            // Step 1: Navigate to the main page
            await driver.sleep(8000);

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
                if (text == "Consignment Tracking") {
                    dashItem = item;
                }
            }

            // Step 3: Navigate to the Consignment Tracking
            await dashItem.click();

            // Step 2: Verify that Consignment Tracking is displayed
            const title = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
                )
            );
            assert.strictEqual(
                await title.getText(),
                "Consignment Tracking",
                "Consignment Tracking should be displayed."
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/driver-login",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/driver-login' but got '${currentUrl}'.`
            );
        });
    }
});

describe("Table Test", () => {
    const tableFilters = [
        {
            filterName: "Account Number",
            value: "",
            key: "AccountNumber",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Despatch date",
            value: "",
            key: "DespatchDateTime",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Consignment Number",
            value: "",
            key: "ConsignmentNo",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Sender Name",
            value: "",
            key: "SenderName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Sender Reference",
            value: "",
            key: "SenderReference",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[2]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Sender Zone",
            value: "",
            key: "SenderState",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[3]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Receiver Name",
            value: "",
            key: "ReceiverName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Receiver Reference",
            value: "",
            key: "ReceiverReference",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[2]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Receiver Zone",
            value: "",
            key: "ReceiverState",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[3]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Consignment Status",
            value: "",
            key: "ConsignmentStatus",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[6]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Special Instructions",
            value: "",
            key: "DeliveryInstructions",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[7]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Delivery Required DateTime",
            value: "",
            key: "DeliveryRequiredDateTime",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[8]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Delivered DateTime",
            value: "",
            key: "DeliveredDateTime",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[9]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "POD Avl",
            value: "",
            key: "POD",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[10]/div[3]/div[1]/div[1]/span/input',
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

    it(`Consignment Tracking data is correct`, async () => {
        try {
            // Step 1: Navigate to the Consignment Tracking page
            await driver.sleep(2000);
            navigateToPage(driver, "Consignment Tracking");

            // Step 2: Fetch data from API request
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_WEB_URL}conswithevents`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            data = resData.data;
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

            const apiValues = data.map((consTrack) => {
                return [
                    consTrack.ConsignmentNo,
                    consTrack.DebtorName,
                    consTrack.SenderName,
                    consTrack.SenderState,
                    consTrack.SenderSuburb,
                    consTrack.SenderPostcode,
                    consTrack.ReceiverName,
                    consTrack.ReceiverState,
                    consTrack.ReceiverSuburb,
                    consTrack.ReceiverPostcode,
                    consTrack.DespatchDate,
                    consTrack.RDD,
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
                // Step 1: Navigate to the Consignment Tracking page
                await driver.sleep(2000);
                navigateToPage(driver, "Consignment Tracking");

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
                    `${process.env.GTRS_WEB_URL}conswithevents`,
                    {
                        headers: {
                            Authorization: `Bearer ${authCookie.value}`,
                            UserId: process.env.USER_ID,
                        },
                    }
                );

                // Filter data
                if (filterName.toLowerCase().includes("date") || filterName.toLowerCase() == "rdd"){
                    const filterDate = new Date(value);
                    data = resData.data.filter((item) => {
                        const dateAPI = new Date(item[key]);
                        return dateAPI == filterDate;
                    });
                } else {
                    data = resData.data.filter((item) => {
                        const filtered = item[key];
                        if(typeof filtered === "undefined" || filtered === null) return false;
                        else if(typeof filtered == "string") return filtered.toLowerCase().includes(value.toLowerCase());
                        else return filtered == value;
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

                const apiValues = data.map((consTrack) => {
                    return [
                        consTrack.ConsignmentNo,
                        consTrack.DebtorName,
                        consTrack.SenderName,
                        consTrack.SenderState,
                        consTrack.SenderSuburb,
                        consTrack.SenderPostcode,
                        consTrack.ReceiverName,
                        consTrack.ReceiverState,
                        consTrack.ReceiverSuburb,
                        consTrack.ReceiverPostcode,
                        consTrack.DespatchDate,
                        consTrack.RDD,
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
            // Step 1: Navigate to the Consignment Tracking page
            await driver.sleep(6000);
            // navigateToPage(driver, "Consignment Tracking");

            // Step 2: Click on the filter input
            await driver.sleep(2000);
            const filerInput = await driver.findElement(By.xpath(locator));
            await filerInput.sendKeys(value);
            const actions = driver.actions();
            await actions.sendKeys(Key.RETURN).perform();

            // Step 3: Fetch data from API request
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_WEB_URL}conswithevents`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );
            data = resData.data;

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

            const apiValues = data.map((consTrack) => {
                return [
                    consTrack.ConsignmentNo,
                    consTrack.DebtorName,
                    consTrack.SenderName,
                    consTrack.SenderState,
                    consTrack.SenderSuburb,
                    consTrack.SenderPostcode,
                    consTrack.ReceiverName,
                    consTrack.ReceiverState,
                    consTrack.ReceiverSuburb,
                    consTrack.ReceiverPostcode,
                    consTrack.DespatchDate,
                    consTrack.RDD,
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
            // Step 1: Navigate to the Consignment Tracking page
            await driver.sleep(2000);
            await navigateToPage(driver, "Consignment Tracking");

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
