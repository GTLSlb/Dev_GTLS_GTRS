const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {
    login,
    bypassLogin,
    navigateToPage,
    navigateToSafetyTab,
    areObjectsEqual,
    scrollandFilter,
} = require("../../../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../../../helper/gtrsPages");
const { type } = require("os");
const moment = require("moment");
let driver;
const baseUrl = process.env.WEB_URL;

before(async () => {
    // Initialize the WebDriver
    let options = new chrome.Options();
    options.addArguments("start-maximized");
    options.addArguments("disable-infobars");
    options.addArguments("--disable-extensions");
    // options.addArguments("headless");
    options.excludeSwitches("enable-logging");

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
    await bypassLogin(driver);

    //Navigate to the Safety page
    await driver.sleep(2000);
    await navigateToPage(driver, "Safety");

    // Navigate to the Safety reports page
    await driver.sleep(2000);
    await navigateToSafetyTab(driver, "Report");
    await driver.sleep(2000);
});

after(async () => {
    // Quit the WebDriver after tests
    await driver.quit();
});

describe("Table Test", () => {
    const tableFilters = [
        {
            filterName: "Safety Type",
            value: "Damage",
            key: "SafetyType",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/span/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]/td',
        },
        {
            filterName: "Cons No",
            value: "NA",
            key: "ConsNo",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[1]/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td',
        },
        {
            filterName: "Account Name",
            value: "",
            key: "DebtorName",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[1]/span/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]/td',
        },
        {
            filterName: "Main Cause",
            value: "Forklift Driver Linfox unaware of the pole on truck",
            key: "CAUSE",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[1]/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td',
        },
        {
            filterName: "State",
            value: "NSW",
            key: "State",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[1]/div[1]/span/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]/td',
        },
        {
            filterName: "Explanation",
            value: "Forklift Driver Linfox collided with the pole of the trailer while loading a pallet on  the trailer",
            key: "Explanation",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[6]/div[3]/div[1]/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[6]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td',
        },
        {
            filterName: "Resolution",
            value: "Informed managment",
            key: "Resolution",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[7]/div[3]/div[1]/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[7]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td',
        },
        {
            filterName: "Reference",
            value: "External",
            key: "Reference",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[8]/div[3]/div[1]/div[1]/span/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[8]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]/td',
        },
        {
            filterName: "Occured at",
            value: "2024-04-02T00:00:00",
            key: "OccuredAt",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[9]/div[3]/div[1]/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[9]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td',
        },
        {
            filterName: "Added By",
            value: "Al Nehmani",
            key: "AddedBy",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[10]/div[3]/div[1]/input',
            filterLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[10]/div[3]/div[2]',
            clearLocator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td',
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

    it(`Safety Report data is correct`, async () => {
        try {
            // Step 1: Fetch data from API request
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
            // Step 2: Verify the data
            // Fetch data visible in the table
            const nbPages = Math.ceil(data?.length / 50); // Number of total pages; deafult number of rows in page is 50
            let allCellValues = [];
            for (let i = 0; i < nbPages; i++) {
                // Extract the data from the current page
                const gridCells = await driver.findElements(
                    By.css(".InovuaReactDataGrid__cell__content")
                );
                // This will get all cell values including Edit column and not mapped according to the key
                const cellValues = await Promise.all(
                    gridCells.map(async (cell) => {
                        return await cell.getText();
                    })
                );
                console.log("cellValues before", cellValues);
                // Remove "Edit" values
                const filteredCellValues = cellValues.filter(
                    (value) => value !== "Edit"
                );

                // Split the cell values into rows
                const rows = [];
                for (let j = 0; j < filteredCellValues.length; j += 10) {
                    //10 since we have 10 columns in the table (excluding edit column)
                    rows.push(filteredCellValues.slice(j, j + 10));
                }
                // Map the data to key-value pairs
                const cellPairs = rows.map((row) => {
                    return {
                        SafetyType: row[0],
                        ConsNo: row[1],
                        DebtorName: row[2],
                        CAUSE: row[3],
                        State: row[4],
                        Explanation: row[5],
                        Resolution: row[6],
                        Reference: row[7],
                        OccuredAt: row[8],
                        AddedBy: row[9],
                    };
                });

                // Add the data to the overall array
                allCellValues.push(...cellPairs);

                // Navigate to the next page
                await driver
                    .findElement(
                        By.css(
                            ".inovua-react-pagination-toolbar__icon--named--NEXT_PAGE"
                        )
                    )
                    .click();
                await driver.sleep(1000); // wait for page to load
            }

            const apiValues = data.map((safety) => {
                return {
                    SafetyType: safety.SafetyType,
                    ConsNo: safety.ConsNo,
                    DebtorName: safety.DebtorName,
                    CAUSE: safety.CAUSE,
                    State: safety.State,
                    Explanation: safety.Explanation,
                    Resolution: safety.Resolution,
                    Reference: safety.Reference,
                    OccuredAt: safety.OccuredAt,
                    AddedBy: safety.AddedBy,
                };
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

            apiValues.forEach((apiValue) => {
                apiValue.OccuredAt = moment(apiValue.OccuredAt).format(
                    "DD-MM-YYYY hh:mm A"
                );
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
            mappedValues.forEach((mappedValue, index) => {
                if (
                    !areObjectsEqual(
                        mappedValue.cellValue,
                        mappedValue.apiValue
                    )
                ) {
                    differences.push(
                        `Mismatch: ${JSON.stringify(
                            mappedValue.cellValue
                        )} vs ${JSON.stringify(mappedValue.apiValue)}`
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
        filterLocator,
        clearLocator,
    } of tableFilters) {
        it(`user can filter by ${filterName}`, async () => {
            try {
                // Step 1: Filter table by filter value
                let filterInput;
                const actions = driver.actions();
                try {
                    filterInput = await driver.findElement(By.xpath(locator));
                    await filterInput.sendKeys(value.toString());
                    await filterInput.click();
                    await actions.sendKeys(Key.RETURN).perform();
                } catch (error) {
                    console.log("error name", error.name);
                    if (
                        error.name == "NoSuchElementError" ||
                        error.name == "StaleElementReferenceError" ||
                        error.name == "ElementNotInteractableError" ||
                        error.name == "TypeError"
                    ) {
                        // Scroll to the right
                        const scrollArea = await driver.findElement(
                            By.css(".InovuaReactDataGrid__virtual-list")
                        );
                        const maxAttempts = 50; // Set a maximum number of attempts
                        let attempts = 0;

                        while (attempts < maxAttempts) {
                            // Check if the target element is displayed
                            let targetElement;
                            try {
                                targetElement = await driver.findElement(
                                    By.xpath(locator)
                                ); // Replace with actual locator
                            } catch (e) {
                                console.log(
                                    "Target element not found, scrolling..."
                                );
                            }
                            if (targetElement) {
                                const isVisible =
                                    await targetElement.isDisplayed();

                                if (isVisible) {
                                    console.log(
                                        "Target element is now visible."
                                    );
                                    await targetElement.sendKeys(value);
                                    await targetElement.click();
                                    await actions
                                        .sendKeys(Key.RETURN)
                                        .perform();
                                    break; // Exit the loop if the target element is visible
                                }
                            }

                            // Scroll to the right
                            // Send the right arrow key to scroll
                            await actions
                                .move({ origin: scrollArea })
                                .sendKeys(Key.RIGHT)
                                .perform();

                            // Optional: Wait briefly to allow the scroll action to take effect
                            await driver.sleep(200);
                            attempts++;
                        }
                    } else {
                        throw error;
                    }
                }

                // Step 2: Fetch data from API request
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

                // Step 3: Verify the data
                // Fetch data visible in the table
                const nbPages = Math.ceil(data?.length / 50); // Number of total pages; deafult number of rows in page is 50
                let allCellValues = [];

                for (let i = 1; i <= nbPages; i++) {
                    // Extract the data from the current page
                    const gridCells = await driver.findElements(
                        By.css(".InovuaReactDataGrid__cell__content")
                    );
                    const cellValues = await Promise.all(
                        gridCells.map(async (cell) => {
                            return await cell.getText();
                        })
                    );

                    // Remove "Edit" values
                    const filteredCellValues = cellValues.filter(
                        (value) => value !== "Edit"
                    );

                    // Split the cell values into rows
                    const rows = [];
                    for (let j = 0; j < filteredCellValues.length; j += 10) {
                        //10 since we have 10 columns in the table (excluding edit column)
                        rows.push(filteredCellValues.slice(j, j + 10));
                    }
                    // Map the data to key-value pairs
                    const cellPairs = rows.map((row) => {
                        return {
                            SafetyType: row[0],
                            ConsNo: row[1],
                            DebtorName: row[2],
                            CAUSE: row[3],
                            State: row[4],
                            Explanation: row[5],
                            Resolution: row[6],
                            Reference: row[7],
                            OccuredAt: row[8],
                            AddedBy: row[9],
                        };
                    });

                    // Add the data to the overall array
                    allCellValues.push(...cellPairs);
                    // Navigate to the next page
                    await driver
                        .findElement(
                            By.css(
                                ".inovua-react-pagination-toolbar__icon--named--NEXT_PAGE"
                            )
                        )
                        .click();
                    await driver.sleep(1000); // wait for page to load
                }

                const apiValues = data.map((safety) => {
                    return {
                        SafetyType: safety.SafetyType,
                        ConsNo: safety.ConsNo,
                        DebtorName: safety.DebtorName,
                        CAUSE: safety.CAUSE,
                        State: safety.State,
                        Explanation: safety.Explanation,
                        Resolution: safety.Resolution,
                        Reference: safety.Reference,
                        OccuredAt: safety.OccuredAt,
                        AddedBy: safety.AddedBy,
                    };
                });

                // Map over api values to change safety reference to internal or external
                apiValues.forEach((apiValue) => {
                    apiValue.Reference = referenceOptions.find(
                        (ref) => ref.id === apiValue.Reference
                    )?.label;
                });

                // Map over api values to change safety type according to safety type id
                safetyTypes = resSafetTypesData.data;
                apiValues.forEach((apiValue) => {
                    apiValue.SafetyType = safetyTypes?.find(
                        (type) => type.SafetyTypeId === apiValue.SafetyType
                    )?.SafetyTypeName;
                });

                apiValues.forEach((apiValue) => {
                    apiValue.OccuredAt = moment(apiValue.OccuredAt).format(
                        "DD-MM-YYYY hh:mm A"
                    );
                });

                apiValues.filter((apiVal) => {
                    if (key == "OccuredAt") {
                        return (
                            moment(apiVal[key]).format("DD-MM-YYYY hh:mm A") ===
                            moment(value).format("DD-MM-YYYY hh:mm A")
                        );
                    } else if (typeof value === "string") {
                        return apiVal[key].trim().includes(value.trim());
                    } else {
                        return apiVal[key] === value;
                    }
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
                mappedValues.forEach((mappedValue, index) => {
                    if (
                        !areObjectsEqual(
                            mappedValue.cellValue,
                            mappedValue.apiValue
                        )
                    ) {
                        differences.push(
                            `Mismatch: ${JSON.stringify(
                                mappedValue.cellValue
                            )} vs ${JSON.stringify(mappedValue.apiValue)}`
                        );
                    }
                });

                // Clear filter
                const filterIcon = await driver.findElement(
                    By.xpath(filterLocator)
                );
                await filterIcon.click();

                const clearBtn = await driver.findElement(
                    By.xpath(clearLocator)
                );
                // Use JavaScript to click if the standard click fails
                await driver.executeScript("arguments[0].click();", clearBtn);

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
        filterLocator,
        clearLocator,
    } of tableFilters) {
        it(`user can clear ${filterName} filter`, async () => {
            // Step 1: Click on the filter input
            const filterInput = await driver.findElement(By.xpath(locator));
            await filterInput.sendKeys(value);
            await filterInput.click();
            const actions = driver.actions();
            await actions.sendKeys(Key.RETURN).perform();

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

            // Step 3: Verify the clear filter function
            // Clear filter
            console.log(`Clear ${filterName} manually`);
            await driver.sleep(6000);

            let differences = [];
            // Check that filter input is empty
            await driver.sleep(5000);
            const filterInputNew = await driver.findElement(By.xpath(locator));
            const text = await filterInputNew.getText();

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
                return {
                    SafetyType: safety.SafetyType,
                    ConsNo: safety.ConsNo,
                    DebtorName: safety.DebtorName,
                    CAUSE: safety.CAUSE,
                    State: safety.State,
                    Explanation: safety.Explanation,
                    Resolution: safety.Resolution,
                    Reference: safety.Reference,
                    OccuredAt: safety.OccuredAt,
                    AddedBy: safety.AddedBy,
                };
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
            mappedValues.forEach((mappedValue, index) => {
                if (
                    !areObjectsEqual(
                        mappedValue.cellValue,
                        mappedValue.apiValue
                    )
                ) {
                    differences.push(
                        `Mismatch: ${JSON.stringify(
                            mappedValue.cellValue
                        )} vs ${JSON.stringify(mappedValue.apiValue)}`
                    );
                }
            });

            // Clear filter
            const filterIcon = await driver.findElement(
                By.xpath(filterLocator)
            );
            await filterIcon.click();

            const clearBtn = await driver.findElement(By.xpath(clearLocator));
            // Use JavaScript to click if the standard click fails
            await driver.executeScript("arguments[0].click();", clearBtn);

            const firstPageBtn = await driver.findElement(
                By.css(
                    ".inovua-react-pagination-toolbar__icon--named--FIRST_PAGE"
                )
            );
            await firstPageBtn.click();
        });
    }
    it("user can clear all filters", async () => {
        try {
            // Step 1: Map over all filters and give them a value
            for (const { locator, value } of tableFilters) {
                let filterInput;
                const actions = driver.actions();
                try {
                    filterInput = await driver.findElement(By.xpath(locator));
                    await filterInput.sendKeys(value.toString());
                    await filterInput.click();
                    await actions.sendKeys(Key.RETURN).perform();
                } catch (error) {
                    console.log("error name", error.name);
                    if (
                        error.name == "NoSuchElementError" ||
                        error.name == "StaleElementReferenceError" ||
                        error.name == "ElementNotInteractableError" ||
                        error.name == "TypeError"
                    ) {
                        // Scroll to the right
                        const scrollArea = await driver.findElement(
                            By.css(".InovuaReactDataGrid__virtual-list")
                        );
                        const maxAttempts = 50; // Set a maximum number of attempts
                        let attempts = 0;

                        while (attempts < maxAttempts) {
                            // Check if the target element is displayed
                            let targetElement;
                            try {
                                targetElement = await driver.findElement(
                                    By.xpath(locator)
                                ); // Replace with actual locator
                            } catch (e) {
                                console.log(
                                    "Target element not found, scrolling..."
                                );
                            }
                            if (targetElement) {
                                const isVisible =
                                    await targetElement.isDisplayed();

                                if (isVisible) {
                                    console.log(
                                        "Target element is now visible."
                                    );
                                    await targetElement.sendKeys(value);
                                    await targetElement.click();
                                    await actions
                                        .sendKeys(Key.RETURN)
                                        .perform();
                                    break; // Exit the loop if the target element is visible
                                }
                            }

                            // Scroll to the right
                            // Send the right arrow key to scroll
                            await actions
                                .move({ origin: scrollArea })
                                .sendKeys(Key.RIGHT)
                                .perform();

                            // Optional: Wait briefly to allow the scroll action to take effect
                            await driver.sleep(200);
                            attempts++;
                        }
                    } else {
                        throw error;
                    }
                }
            }

            // Step 2: Clear all filters
            await driver.sleep(2000);
            // Clear filter
            const filterIcon = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[10]/div[3]/div[2]'
                )
            );
            await filterIcon.click();

            const clearBtn = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[3]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[14]/td'
                )
            );
            // Use JavaScript to click if the standard click fails
            await driver.executeScript("arguments[0].click();", clearBtn);

            // Step 3: Verify that all filters are cleared
            let differences = [];
            for (const { locator, value } of tableFilters) {
                const filterInput = await driver.findElement(By.xpath(locator));
                const visText = await filterInput.getText();
                if (visText != "") {
                    differences.push(
                        `Expected an empty string but got instead ${visText}`
                    );
                }
            }

            if (differences?.length > 0) {
                throw new Error("Test failed, differences: " + differences);
            }

            // Clean up and scroll to top
            const locator = tableFilters[0].locator;
            const value = "";
            const scrollAreaLocator = ".InovuaReactDataGrid__virtual-list";
            await scrollandFilter(
                driver,
                locator,
                value,
                scrollAreaLocator,
                "left"
            );
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
});

describe("Safety Report Table Actions", () => {
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
            // Step 1: Click on the edit button
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

            // Step 2: Find inputs and give them a value
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

            // Step 3: Check if safety report is edited
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
        // Step 1: Filter by debtor
        const debtorDropdown = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[2]/div/div[1]'
            )
        );
        await debtorDropdown.click();

        const ualDebtor = await driver.findElement(By.id("1507      "));
        await ualDebtor.click();

        await debtorDropdown.click();

        // Step 2: Verify that the filtered data is displayed
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

        const apiValues = data.map((safety) => {
                return {
                    SafetyType: safety.SafetyType,
                    ConsNo: safety.ConsNo,
                    DebtorName: safety.DebtorName,
                    CAUSE: safety.CAUSE,
                    State: safety.State,
                    Explanation: safety.Explanation,
                    Resolution: safety.Resolution,
                    Reference: safety.Reference,
                    OccuredAt: safety.OccuredAt,
                    AddedBy: safety.AddedBy,
                };
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
    });
});
