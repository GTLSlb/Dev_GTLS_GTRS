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

    it("user can view the Transit Days page", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(3000);

        // Step 2: Verify that Transit Days title is displayed
        await navigateToPage("Transit Days");
        await driver.sleep(2000);

        try {
            const title = await driver.findElement(
                By.css("text-2xl py-2 px-0 font-extrabold text-gray-600")
            );
            assert.strictEqual(
                await title.getText(),
                "Transit Days",
                "Transit Days title should be displayed."
            );
        } catch (err) {
            if (
                err.name === "TimeoutError" ||
                err.name === "NoSuchElementError"
            ) {
                throw new Error("Test failed due to: " + err);
            }
        }
    });

    for (const { pageName, url } of gtrsPages) {
        it("user can navigate from other pages to the Transit Days page", async () => {
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

            for (let item of menuItems) {
                let text = await item.getText();
                if (text == pageName) {
                    item.click();
                }
            }

            // Step 3: Navigate to the Transit Days
            const kpiReportDropdown = await driver.findElement(
                By.xpath(
                    "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[4]/nav/ul/div/div/button"
                )
            );
            await kpiReportDropdown.click();
            const dashItem = await driver.findElement(By.id("Transit Days"));
            await dashItem.click();

            // Step 2: Verify that Transit Days is displayed
            const title = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
                )
            );
            assert.strictEqual(
                await title.getText(),
                "Transit Days",
                "Transit Days title should be displayed."
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/kpi/transit-days",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/kpi/transit-days' but got '${currentUrl}'.`
            );
        });
    }
});

describe("Table Test", () => {
    const tableFilters = [
        {
            filterName: "Customer Name",
            value: "GMI",
            key: "CustomerName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Customer Type",
            value: "HPC",
            key: "CustomerType",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Sender State",
            value: "VIC",
            key: "SenderState",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Sender PostCode",
            value: 3045,
            key: "SenderPostCode",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[2]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/button",
        },
        {
            filterName: "Receiver Name",
            value: "",
            key: "ReceiverName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Receiver State",
            value: "NSW",
            key: "ReceiverState",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[2]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Receiver PostCode",
            value: 4006,
            key: "ReceiverPostCode",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[3]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Transit Time",
            value: 4,
            key: "TransitTime",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
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

    it(`Transit Days data is correct`, async () => {
        try {
            // Step 1: Navigate to the Transit Days page
            await driver.sleep(2000);
            navigateToPage(driver, "Transit Days");

            // Step 2: Fetch data from API request
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}TransitNew`,
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

            const apiValues = data.map((transit) => {
                return [
                    transit.CustomerName,
                    transit.CustomerType,
                    transit.SenderState,
                    transit.SenderPostCode,
                    transit.ReceiverName,
                    transit.ReceiverState,
                    transit.ReceiverPostCode,
                    transit.TransitTime,
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
                // Step 1: Navigate to the Transit Days page
                await driver.sleep(2000);
                navigateToPage(driver, "Transit Days");

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
                    `${process.env.GTRS_API_URL}TransitNew`,
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

                const apiValues = data.map((transit) => {
                    return [
                        transit.CustomerName,
                        transit.CustomerType,
                        transit.SenderState,
                        transit.SenderPostCode,
                        transit.ReceiverName,
                        transit.ReceiverState,
                        transit.ReceiverPostCode,
                        transit.TransitTime,
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
            // Step 1: Navigate to the Transit Days page
            await driver.sleep(6000);
            // navigateToPage(driver, "Transit Days");

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
                `${process.env.GTRS_API_URL}TransitNew`,
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

            const apiValues = data.map((transit) => {
                return [
                    transit.CustomerName,
                    transit.CustomerType,
                    transit.SenderState,
                    transit.SenderPostCode,
                    transit.ReceiverName,
                    transit.ReceiverState,
                    transit.ReceiverPostCode,
                    transit.TransitTime,
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
            // Step 1: Navigate to the Transit Days page
            await driver.sleep(2000);
            await navigateToPage(driver, "Transit Days");

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
        // Step 1: Navigate to the Transit Days page
        await driver.sleep(2000);
        await navigateToPage(driver, "Transit Days");

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
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input'
            )
        );
        await consInput.sendKeys("GMI2237");

        // Click on cons nbr
        const conNbr = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div/div/div[1]/div/span'
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

    it("user can edit transit day", async () => {
        // Step 1: Navigate to the Transit Days page
        await driver.sleep(2000);
        await navigateToPage(driver, "Transit Days");

        // Step 2: Click on edit button
        const scrollArea = await driver.findElement(
            By.css(".InovuaReactDataGrid__virtual-list")
        );
        await driver.executeScript(
            "arguments[0].scrollLeft = arguments[0].offsetWidth",
            scrollArea
        );
        const editBtn = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div[12]/div/div[9]/div/div/button'
            )
        );
        await editBtn.click();

        // Step 3: Edit the transit day
        await driver.sleep(3000);

        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl,
            "https://gtrs.gtls.store/gtrs/add-transit",
            `Expected URL to be 'https://gtrs.gtls.store/gtrs/add-transit' but got '${currentUrl}'`
        );

        const senderPostCode = await driver.findElement(By.id('SenderPostCode'));
        const receiverPostCode = await driver.findElement(By.id('ReceiverName'));
        const transitTime = await driver.findElement(By.id('TransitTime'));

        await senderPostCode.sendKeys('3044');
        await receiverPostCode.sendKeys('4005');
        await transitTime.sendKeys('6');

        await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/form/div[3]/button[2]')).click();
        await driver.sleep(6000);

        // Step 4: Verify the data
        const url = await driver.getCurrentUrl();
        assert.strictEqual(url, "https://gtrs.gtls.store/gtrs/kpi/transit-days", `URL should be https://gtrs.gtls.store/gtrs/kpi/transit-days but got ${url}`);

        const senderPostCodeFromTable = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[4]/div/div'));
        const receiverPostCodeFromTable = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[7]/div'));
        const transitTimeFromTable = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[8]/div'));

        assert.strictEqual(senderPostCodeFromTable.getText(), '3044', `Sender post code should be 3044 but got ${senderPostCodeFromTable.getText()}`);
        assert.strictEqual(receiverPostCodeFromTable.getText(), '4005', `Receiver post code should be 4005 but got ${receiverPostCodeFromTable.getText()}`);
        assert.strictEqual(transitTimeFromTable.getText(), '6', `Transit time should be 6 but got ${transitTimeFromTable.getText()}`);
    })
});
