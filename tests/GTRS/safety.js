const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const {
    login,
    navigateToPage,
    navigateToSafetyTab,
} = require("../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../helper/gtrsPages");
const { type } = require("os");
const {
    getCountByState,
    compareLabels,
    countSafetyTypesByMonth,
    countRecordsByMonth,
    countRecordsByStateAndType,
    countReportsBySafetyType,
    normalizeData,
} = require("../helper/safetyChartsHelper");

/*
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

    it("user can view the Safety Report page", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(3000);

        // Step 2: Verify that Safety is displayed
        // const title = await driver.findElement(
        //     By.xpath(
        //         '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[1]/div/h1'
        //     )
        // );

        const currentUrl = await driver.getCurrentUrl();

        assert.strictEqual(
            currentUrl,
            "https://gtrs.gtls.store/gtrs/safety",
            `Expected URL to be 'https://gtrs.gtls.store/gtrs/safety' but got '${currentUrl}'.`
        );

        assert.strictEqual(
            await title.getText(),
            "Safety Report",
            "Safety Report should be displayed."
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it(`user can navigate from ${pageName} to the Safety`, async () => {
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
            // const title = await driver.findElement(
            //     By.xpath(
            //         '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[1]/div/h1'
            //     )
            // );
            // assert.strictEqual(
            //     await title.getText(),
            //     "Safety Report",
            //     "Safety Report should be displayed."
            // );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/safety",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/safety' but got '${currentUrl}'.`
            );
        });
    }
});
*/
describe("Table Test", () => {
    const tableFilters = [
        {
            filterName: "Safety Type",
            value: "Damage",
            key: "SafetyType",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Cons No",
            value: "NA",
            key: "ConsNo",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Account Name",
            value: "UAL - PRIMARY NR SHUTTLE",
            key: "DebtorName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Main Cause",
            value: "Forklift Driver Linfox unaware of the pole on truck",
            key: "CAUSE",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "State",
            value: "NSW",
            key: "State",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Explanation",
            value: "Forklift Driver Linfox collided with the pole of the trailer while loading a pallet on  the trailer",
            key: "Explanation",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[6]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Resolution",
            value: "Informed managment",
            key: "Resolution",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[7]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Reference",
            value: "External",
            key: "Reference",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[8]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Occured at",
            value: "2024-04-02T00:00:00",
            key: "OccuredAt",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[9]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Added By",
            value: "Al Nehmani",
            key: "AddedBy",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[10]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
    ];
    const referenceOptions = [
        {
            id: 1,
            label: "Internal",
        },
        {
            id: 2,
            label: "External",
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

    it(`Safety Report data is correct`, async () => {
        try {
            // Step 1: Navigate to the Safety Report page
            await driver.sleep(2000);
            await navigateToPage(driver, "Safety");

            await driver.sleep(4000);
            await navigateToSafetyTab(driver, "Report");
            await driver.sleep(2000);

            // Step 2: Fetch data from API request
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
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

            const apiValues = data.map((safety) => {
                return [
                    safety.SafetyType,
                    safety.ConsNo,
                    safety.DebtorName,
                    safety.CAUSE,
                    safety.State,
                    safety.Explanation,
                    safety.Resolution,
                    safety.Reference,
                    safety.OccuredAt,
                    safety.AddedBy,
                ];
            });

            // Map over api values to change safety reference to internal or external
            apiValues.forEach((apiValue) => {
                apiValue.Reference = referenceOptions.find(
                    (ref) => ref.id === apiValue.Reference
                )?.label;
            });

            // Map over api values to change safety type according to safety type id
            let safetyTypes = [];
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
            apiValues.forEach((apiValue) => {
                apiValue.SafetyType = safetyTypes?.find(
                    (type) => type.SafetyTypeId === apiValue.SafetyType
                )?.SafetyTypeName;
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
                // Step 1: Navigate to the Safety Report page
                await driver.sleep(2000);
                await navigateToPage(driver, "Safety");

                await driver.sleep(4000);
                await navigateToSafetyTab(driver, "Report");
                await driver.sleep(2000);

                // Step 2: Click on the filter input
                await driver.sleep(2000);
                const filerInput = await driver.findElement(By.xpath(locator));
                await filerInput.sendKeys(value);
                await filerInput.click();
                const actions = driver.actions();
                await actions.sendKeys(Key.RETURN).perform();

                // Step 3: Fetch data from API request
                let data = [];
                const cookies = await driver.manage().getCookies();
                const authCookie = cookies.find(
                    (c) => c.name === "access_token"
                );

                const resData = await axios.get(
                    `${process.env.GTRS_API_URL}SafetyReport`,
                    {
                        headers: {
                            Authorization: `Bearer ${authCookie.value}`,
                            UserId: process.env.USER_ID,
                        },
                    }
                );

                let safetyTypes = [];
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

                // Filter data
                if (filterName.toLowerCase().includes("date")) {
                    const filterDate = new Date(value);
                    data = resData.data.filter((item) => {
                        const dateAPI = new Date(item[key]);
                        return dateAPI == filterDate;
                    });
                } else {
                    data = resData.data.filter((item) => {
                        const filtered = item[key];
                        if (key == "SafetyType") {
                            // Get the id of the safety type that you filtered by
                            const idFromSafetyAPI = safetyTypes?.find(
                                (type) =>
                                    type.SafetyTypeName.toLowerCase() ===
                                    value.toLowerCase()
                            )?.SafetyTypeId;
                            return filtered == idFromSafetyAPI;
                        } else if (key == "Reference") {
                            // Get the id of the reference that you filtered by
                            const idFromreferenceOptions =
                            referenceOptions?.find(
                                    (ref) =>
                                        ref.label.toLowerCase() ===
                                        value.toLowerCase()
                                )?.id;
                            return filtered == idFromreferenceOptions;
                        } else {
                            if (
                                typeof filtered === "undefined" ||
                                filtered === null
                            )
                                return false;
                            else if (typeof filtered == "string")
                                return filtered
                                    .toLowerCase()
                                    .includes(value.toLowerCase());
                            else return filtered == value;
                        }
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

                const apiValues = data.map((safety) => {
                    return [
                        safety.SafetyType,
                        safety.ConsNo,
                        safety.DebtorName,
                        safety.CAUSE,
                        safety.State,
                        safety.Explanation,
                        safety.Resolution,
                        safety.Reference,
                        safety.OccuredAt,
                        safety.AddedBy,
                    ];
                });

                // Map over api values to change safety reference to internal or external
                apiValues.forEach((apiValue) => {
                    apiValue.Reference = referenceOptions.find(
                        (ref) => ref.id === apiValue.Reference
                    )?.label;
                });

                // Map over api values to change safety type according to safety type id
                apiValues.forEach((apiValue) => {
                    apiValue.SafetyType = safetyTypes?.find(
                        (type) => type.SafetyTypeId === apiValue.SafetyType
                    )?.SafetyTypeName;
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
            // Step 1: Navigate to the Safety Report page
            await driver.sleep(4000);
            await navigateToPage(driver, "Safety");

            await driver.sleep(4000);
            await navigateToSafetyTab(driver, "Report");
            await driver.sleep(2000);

            // Step 2: Click on the filter input
            await driver.sleep(2000);
            const filerInput = await driver.findElement(By.xpath(locator));
            await filerInput.sendKeys(value);
            await filerInput.click();
            const actions = driver.actions();
            await actions.sendKeys(Key.RETURN).perform();

            // Step 3: Fetch data from API request
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
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

            const apiValues = data.map((safety) => {
                return [
                    safety.SafetyType,
                    safety.ConsNo,
                    safety.DebtorName,
                    safety.CAUSE,
                    safety.State,
                    safety.Explanation,
                    safety.Resolution,
                    safety.Reference,
                    safety.OccuredAt,
                    safety.AddedBy,
                ];
            });

            // Map over api values to change safety reference to internal or external
            apiValues.forEach((apiValue) => {
                apiValue.Reference = referenceOptions.find(
                    (ref) => ref.id === apiValue.Reference
                )?.label;
            });

            // Map over api values to change safety type according to safety type id
            let safetyTypes = [];
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
            apiValues.forEach((apiValue) => {
                apiValue.SafetyType = safetyTypes?.find(
                    (type) => type.SafetyTypeId === apiValue.SafetyType
                )?.SafetyTypeName;
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
            // Step 1: Navigate to the Safety Report page
            await driver.sleep(2000);
            await navigateToPage(driver, "Safety");

            await driver.sleep(4000);
            await navigateToSafetyTab(driver, "Report");
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

                const actions = driver.actions();
                const scrollArea = await driver.findElement(
                    By.css(".InovuaReactDataGrid__virtual-list")
                );
                await driver.executeScript(
                    "arguments[0].scrollRight = arguments[0].offsetWidth",
                    scrollArea
                );
                await driver.wait(until.elementIsVisible(filerInput), 4000);
                await filerInput.sendKeys(value);
                await filerInput.click();
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
            await driver.sleep(4000);
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

/*
describe("Safety Report Table Actions", () => {
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

    const referenceOptions = [
        {
            id: 1,
            label: "Internal",
        },
        {
            id: 2,
            label: "External",
        },
    ];

    it("user can edit a safety report", async () => {
        try {
            // Step 1: Navigate to the Safety Report page
            await driver.sleep(2000);
            await navigateToPage(driver, "Safety");
            await driver.sleep(4000);
            await navigateToSafetyTab(driver, "Report");
            await driver.sleep(2000);

            // Step 2: Click on the edit button
            // Scroll to the end of the table
            const scrollArea = await driver.findElement(
                By.css(".InovuaReactDataGrid__virtual-list")
            );
            await driver.executeScript(
                "arguments[0].scrollLeft = arguments[0].offsetWidth",
                scrollArea
            );
            // Try to find edit btn
            const editBtn = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[11]/div/div/button'
                )
            );

            await driver.wait(until.elementIsVisible(editBtn), 4000);
            await editBtn.click();

            // Step 3: Find inputs and give them a value
            const consNo = await driver.findElement(By.id("ConsNo"));
            await consNo.sendKeys("");
            await consNo.sendKeys("1234567890");

            // Click on create button
            // Scroll to the end of the form
            const scrollForm = await driver.findElement(
                By.xpath("/html/body/div[5]/div/div/div/form")
            );
            await driver.executeScript(
                "arguments[0].scrollTop = arguments[0].offsetWidth",
                scrollForm
            );
            // Try to find save btn
            const saveBtn = await driver.findElement(
                By.xpath("/html/body/div[5]/div/div/div/form/div/button")
            );

            await driver.wait(until.elementIsVisible(saveBtn), 4000);
            await saveBtn.click();

            // Step 4: Check if safety report is edited
            await driver.sleep(2000);
            await driver.executeScript(
                "arguments[0].scrollRight = arguments[0].offsetWidth",
                scrollArea
            );

            const newConsNo = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[2]/div'
                )
            );
            const newConNoText = await newConsNo.getText();
            assert.strictEqual(newConNoText, "NA1234567890"),
                `Expected ConsNo to be NA1234567890 but got ${newConNoText}`;
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });

    it("user can filter safety report based on account name", async () => {
        // Step 1: Navigate to the Safety Report page
        await driver.sleep(2000);
        await navigateToPage(driver, "Safety");
        await driver.sleep(4000);
        await navigateToSafetyTab(driver, "Report");
        await driver.sleep(2000);

        // Step 2: Filter by debtor
        const debtorDropdown = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[2]/div/div[1]'
            )
        );
        await debtorDropdown.click();

        const ualDebtor = await driver.findElement(By.id("1507      "));
        await ualDebtor.click();

        await debtorDropdown.click();

        // Step 3: Verify that the filtered data is displayed
        let data = [];
        const cookies = await driver.manage().getCookies();
        const authCookie = cookies.find((c) => c.name === "access_token");

        const resData = await axios.get(
            `${process.env.GTRS_API_URL}SafetyReport`,
            {
                headers: {
                    Authorization: `Bearer ${authCookie.value}`,
                    UserId: process.env.USER_ID,
                },
            }
        );
        data = resData.data?.filter((obj) => obj.DebtorId == "1507");

        // Fetch data visible in the table
        let safetyTypes = [];
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

        const apiValues = data?.map((safety) => {
            return [
                safety.SafetyType,
                safety.ConsNo,
                safety.DebtorName,
                safety.CAUSE,
                safety.State,
                safety.Explanation,
                safety.Resolution,
                safety.Reference,
                safety.OccuredAt,
                safety.AddedBy,
            ];
        });

        // Map over api values to change safety reference to internal or external
        apiValues?.forEach((apiValue) => {
            apiValue.Reference = referenceOptions.find(
                (ref) => ref.id === apiValue.Reference
            )?.label;
        });

        // Map over api values to change safety type according to safety type id
        apiValues.forEach((apiValue) => {
            apiValue.SafetyType = safetyTypes?.find(
                (type) => type.SafetyTypeId === apiValue.SafetyType
            )?.SafetyTypeName;
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
    });
});



describe("Safety Types Table Test", () => {
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

    it("safety types are displayed correctly", async () => {
        // Step 1: Navigate to the Safety Types page
        await driver.sleep(2000);
        await navigateToPage(driver, "Safety");

        await driver.sleep(4000);
        await navigateToSafetyTab(driver, "Types");
        await driver.sleep(2000);

        // Step 2: Fetch data from API request
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

        // Step 3: Fetch data from table
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

        // Step 4: Check if safety types are displayed correctly
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
    });

    it("user can edit a safety type", async () => {
        try {
            // Step 1: Navigate to the Safety Report page
            await driver.sleep(2000);
            await navigateToPage(driver, "Safety");
            await driver.sleep(4000);
            await navigateToSafetyTab(driver, "Types");
            await driver.sleep(2000);

            // Step 2: Click on the edit button
            const editBtn = await driver.findElement(
                By.xpath('//*[@id="details"]/tbody/tr[1]/td[3]/button')
            );
            await editBtn.click();

            // Step 3: Find inputs and give them a value
            const safTypeNameInput = await driver.findElement(By.id("name"));
            await safTypeNameInput.clear();
            await safTypeNameInput.sendKeys("Near Miss");

            // Click on create button
            // Try to find save btn
            const saveBtn = await driver.findElement(
                By.xpath("/html/body/div[4]/div/div/div/form/div[2]/button")
            );

            await saveBtn.click();

            // Step 4: Check if safety type is edited
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
            // Step 1: Navigate to the Safety Report page
            await driver.sleep(2000);
            await navigateToPage(driver, "Safety");
            await driver.sleep(4000);
            await navigateToSafetyTab(driver, "Types");
            await driver.sleep(2000);

            // Step 2: Click on the add button
            const addBtn = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div[1]/div[2]/button'
                )
            );
            await addBtn.click();

            // Step 3: Find inputs and give them a value
            const safTypeNameInput = await driver.findElement(By.id("name"));
            await safTypeNameInput.sendKeys("");
            await safTypeNameInput.sendKeys("Test-Type");

            // Click on create button
            // Try to find save btn
            const saveBtn = await driver.findElement(
                By.xpath("/html/body/div[4]/div/div/div/form/div[2]/button")
            );

            await saveBtn.click();

            // Step 4: Check if safety type is added
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


describe("Safety Charts Test", () => {
    let driver;
    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser("chrome").build();
        await login(driver);
        await driver.sleep(2000);

        //Navigate to safety charts page
        await navigateToPage(driver, "Safety");
        await driver.sleep(4000);
        await navigateToSafetyTab(driver, "Charts");
        await driver.sleep(2000);
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it("reports by month data is correct", async () => {
        try {
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            data = resData.data;
            const expData = countRecordsByMonth(data);
            const actualData = {
                "04-01-2024": 2,
                "03-01-2024": 2,
                "06-01-2023": 332,
            };

            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("reports by state data is correct", async () => {
        try {
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            data = resData.data;
            const expData = getCountByState(data);
            const actualData = {
                NSW: 335,
                SA: 1,
            };
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("POD status by state data is correct", async () => {
        try {
            let data = [],
                safetyTypes = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            data = resData.data;
            const safetyTypesResData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyTypes`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            safetyTypes = safetyTypesResData.data;
            const counter = countReportsBySafetyType(data);
            const expData = compareLabels(counter, safetyTypes);
            const actualData = [
                {
                    label: "Hazard",
                    value: 334,
                },
                {
                    label: "Vehicle Accident",
                    value: 1,
                },
                {
                    label: "Damage",
                    value: 1,
                },
            ];
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("reports by state & by type data is correct", async () => {
        try {
            let data = [], safetyTypes = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            data = resData.data;

            const safetyTypesResData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyTypes`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            safetyTypes = safetyTypesResData.data;
            const expData = countRecordsByStateAndType(data, safetyTypes);
            const actualData = [
                {
                    state: "NSW",
                    value: 333,
                    type: "Hazard",
                },
                {
                    state: "NSW",
                    value: 1,
                    type: "Vehicle Accident",
                },
                {
                    state: "NSW",
                    value: 1,
                    type: "Damage",
                },
                {
                    state: "SA",
                    value: 1,
                    type: "Hazard",
                },
            ];
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("report type by month data is correct", async () => {
        try {
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyReport`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            data = resData.data;
            let expData = countSafetyTypesByMonth(data);
            let actualData = {
                "04-01-2024": {
                    "2": 1,
                    "4": 1,
                },
                "03-01-2024": {
                    "2": 1,
                    "3": 1,
                },
                "06-01-2023": {
                    "2": 332,
                },
            };
            expData = normalizeData(expData);
            actualData = normalizeData(actualData);
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
});

*/
