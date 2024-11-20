const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const { login, navigateToPage, fetchData } = require("../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
require("dotenv").config();
const gtrsPages = require("../helper/gtrsPages");
const baseUrl = process.env.WEB_URL;

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

    it("user can view the Driver Login", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(3000);

        // Step 2: Verify that Driver Login is displayed
        const title = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
            )
        );
        assert.strictEqual(
            await title.getText(),
            "Driver Login",
            "Driver Login should be displayed."
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it(`user can navigate from ${pageName} to the Driver Login`, async () => {
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
                if (text == "Driver Login") {
                    dashItem = item;
                }
            }

            // Step 3: Navigate to the Driver Login
            await dashItem.click();

            // Step 2: Verify that Driver Login is displayed
            const title = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
                )
            );
            assert.strictEqual(
                await title.getText(),
                "Driver Login",
                "Driver Login should be displayed."
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                baseUrl+"gtrs/driver-login",
                `Expected URL to be '${baseUrl}gtrs/driver-login' but got '${currentUrl}'.`
            );
        });
    }
});

describe("Table Test", () => {
    const tableFilters = [
        {
            filterName: "Name",
            value: "Melbourne",
            key: "Name",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Device Code",
            value: "JAIX SS TEST",
            key: "DeviceCode",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Smart SCAN Version",
            value: "20.16",
            key: "SmartSCANSoftwareVersion",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[5]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Description",
            value: "",
            key: "Description",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[6]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Last Active UTC",
            value: "2021-11-09 04:57:59",
            key: "LastActiveUTC",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[7]/div[3]/div[1]/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Software Version",
            value: "21.18.2",
            key: "SoftwareVersion",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[9]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]",
        },
        {
            filterName: "Device Sim Type",
            value: "4G",
            key: "MobilityDeviceSimTypes_Description",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[10]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[13]/td",
        },
        {
            filterName: "Device Model",
            value: "S8",
            key: "MobilityDeviceModels_Description",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[11]/div[3]/div[1]/div[1]/span/input',
            clearLocator:
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div[5]/div/div/div/div/div[1]/div[1]/div[2]/table/tbody/tr[9]",
        },
        {
            filterName: "Device Make",
            value: "SAMSUNG",
            key: "MobilityDeviceMakes_Description",
            locator:
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[12]/div[3]/div[1]/div[1]/span/input',
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

    it(`Driver Login data is correct`, async () => {
        try {
            // Step 1: Navigate to the Driver Login page
            await driver.sleep(2000);
            navigateToPage(driver, "Driver Login");

            // Step 2: Fetch data from API request
            let data = [];
            const cookies = await driver.manage().getCookies();
            const authCookie = cookies.find((c) => c.name === "access_token");

            const resData = await axios.get(
                `${process.env.GTRS_API_URL}NoDelInfo`,
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

            const apiValues = data.map((driverLog) => {
                return [
                    driverLog.Name,
                    driverLog.DeviceCode,
                    driverLog.SmartSCANSoftwareVersion,
                    driverLog.Description,
                    driverLog.LastActiveUTC,
                    driverLog.SoftwareVersion,
                    driverLog.MobilityDeviceSimTypes_Description,
                    driverLog.MobilityDeviceModels_Description,
                    driverLog.MobilityDeviceMakes_Description,
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
                // Step 1: Navigate to the Driver Login page
                await driver.sleep(2000);
                navigateToPage(driver, "Driver Login");

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
                    `${process.env.GTRS_API_URL}NoDelInfo`,
                    {
                        headers: {
                            Authorization: `Bearer ${authCookie.value}`,
                            UserId: process.env.USER_ID,
                        },
                    }
                );

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

                const apiValues = data.map((driverLog) => {
                    return [
                        driverLog.Name,
                        driverLog.DeviceCode,
                        driverLog.SmartSCANSoftwareVersion,
                        driverLog.Description,
                        driverLog.LastActiveUTC,
                        driverLog.SoftwareVersion,
                        driverLog.MobilityDeviceSimTypes_Description,
                        driverLog.MobilityDeviceModels_Description,
                        driverLog.MobilityDeviceMakes_Description,
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
            // Step 1: Navigate to the Driver Login page
            await driver.sleep(6000);
            // navigateToPage(driver, "Driver Login");

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
                `${process.env.GTRS_API_URL}NoDelInfo`,
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

            const apiValues = data.map((driverLog) => {
                return [
                    driverLog.Name,
                    driverLog.DeviceCode,
                    driverLog.SmartSCANSoftwareVersion,
                    driverLog.Description,
                    driverLog.LastActiveUTC,
                    driverLog.SoftwareVersion,
                    driverLog.MobilityDeviceSimTypes_Description,
                    driverLog.MobilityDeviceModels_Description,
                    driverLog.MobilityDeviceMakes_Description,
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
            // Step 1: Navigate to the Driver Login page
            await driver.sleep(2000);
            await navigateToPage(driver, "Driver Login");

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

        let data = await fetchData("Transport", {});

        //Step 2: Filter api data
        let filteredAPIData = [];
        data.map((item) => {
            if (item.ChargeToID == "1507") {
                filteredAPIData.push({
                    ConsignmentNo: item.ConsignmentNo,
                    SenderReference: item.SenderReference,
                    ReceiverReference: item.ReceiverReference,
                    Quantity: item.Quantity,
                    TotalCharge: item.TotalCharge,
                    CodeRef: item.CodeRef,
                    DescriptionRef: item.DescriptionRef,
                    FuelLevyAmountRef: item.FuelLevyAmountRef,
                    DespatchDateTime: item.DespatchDateTime,
                    Name: item.Name,
                    Description: item.Description,
                    Code: item.Code,
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

        const apiValues = filteredAPIData.map((driverLog) => {
            return [
                driverLog.Name,
                driverLog.DeviceCode,
                driverLog.SmartSCANSoftwareVersion,
                driverLog.Description,
                driverLog.LastActiveUTC,
                driverLog.SoftwareVersion,
                driverLog.MobilityDeviceSimTypes_Description,
                driverLog.MobilityDeviceModels_Description,
                driverLog.MobilityDeviceMakes_Description,
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

    it("user can navigate to consignment details page", async () => {
        // Step 1: Navigate to the consignment tracking page
        await driver.sleep(2000);
        await navigateToPage(driver, "Consignments");

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
        await consInput.sendKeys("OC3862");

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
            baseUrl+"gtrs/consignment-details",
            `URL should be ${baseUrl}gtrs/consignment-details but got ${url}`
        );

        const consNumber = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div/div[1]/div[1]/h4/span'
            )
        );

        assert.strictEqual(
            consNumber.getText(),
            "OC3862",
            `Cons number should be OC3862 but got ${consNumber.getText()}`
        );
    });
});
