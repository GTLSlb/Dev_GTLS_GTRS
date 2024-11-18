const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const {
    login,
    navigateToPage,
    fetchData,
    fetchPerformanceDataFromView,
    comparePerformanceData,
} = require("../helper/helper");
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

    it("user can view the Performance Report", async () => {
        // Step 1: Navigate to the main page
        await driver.sleep(3000);

        // Step 2: Verify that Performance Report is displayed
        const title = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
            )
        );
        assert.strictEqual(
            await title.getText(),
            "Performance Report",
            "Performance Report should be displayed."
        );
    });

    for (const { pageName, url } of gtrsPages) {
        it(`user can navigate from ${pageName} to the Performance Report`, async () => {
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
                if (text == "Performance Report") {
                    dashItem = item;
                }
            }

            // Step 3: Navigate to the Performance Report
            await dashItem.click();

            // Step 2: Verify that Performance Report is displayed
            const title = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[1]/div/h1'
                )
            );
            assert.strictEqual(
                await title.getText(),
                "Performance Report",
                "Performance Report should be displayed."
            );

            const currentUrl = await driver.getCurrentUrl();

            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/performance",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/performance' but got '${currentUrl}'.`
            );
        });
    }
});

describe("Table data test", () => {
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
    const keys = [
        { "CONSIGNMENT STATUS": "ConsignmentStatus" },
        { "KPI DATETIME": "KpiDatetime" },
        { "ACCOUNT NAME": "AccountNumber" },
        { "POD DATETIME": "PodDateTime" },
        { POD: "POD" },
        { STATUS: "Status" },
        { SERVICE: "Service" },
        { "MANIFEST NO": "ManifestNo" },
        { "LOADING TIME": "LoadingTime" },
        { "TOTAL QUANTITY": "TotalQuantity" },
        { "TOTAL WEIGHT": "TotalWeight" },
        { "DELIVERY REQUIRED DATETIME": "DeliveryRequiredDateTime" },
        { "DELIVERED DATE TIME": "DeliveredDate" },
        { DESPATCHDATE: "KpiDatetime" },
        { FUELLEVY: "FuelLevy" },
        { "NETT AMOUNT": "NettAmount" },
        { "RATED AMOUNT": "RateAmount" },
        { "SENDER NAME": "SenderName" },
        { "SENDER ZONE": "SenderZone" },
        { "SENDER SUBURB": "SenderSuburb" },
        { "SENDER POSTCODE": "SenderPostcode" },
        { "SENDER REFERENCE": "SenderReference" },
        { "RECEIVER NAME": "ReceiverName" },
        { "RECEIVER ZONE": "ReceiverZone" },
        { "RECEIVER SUBURB": "ReceiverSuburb" },
        { "RECEIVER POSTCODE": "ReceiverPostcode" },
        { "RECEIVER REFERENCE": "ReceiverReference" },
    ];
    it("data shown is correct", async () => {
        // Step 1: Navigate to main page
        await driver.sleep(6000);
        await navigateToPage("Performance Report");

        // Step 2: Fetch data
        const data = await fetchData("PerformanceReport", {});

        // Step 3: Fetch data from performance
        // Find all elements by css (all cards in view)
        const dataLength = data?.length;
        let diffrences = [],
            performanceDataInView = [];

        let hasNextPage = true;

        while (hasNextPage) {
            const cards = await driver.findElements(
                By.css(
                    "relative border-b border-gray-400 py-5 sm:pb-0 px-5 mt-5 h-auto bg-white rounded-xl shadow-md"
                )
            );
            for (const card of cards) {
                let keyValuePairs = {};
                // Get AccountNumber
                const consNo = await card
                    .findElement(By.css("text-goldd"))
                    .getText();
                const allTabs = await card.findElements(By.tagName("a"));
                for (const tab of allTabs) {
                    await tab.click();
                    const allHeadersInTab = await card.findElements(
                        By.tagName("dt")
                    );
                    const allInfoInTab = await card.findElements(
                        By.tagName("dd")
                    );
                    for (let i = 0; i < allInfoInTab.length; i++) {
                        const keyFromView = await allHeadersInTab[i].getText();
                        const keyAsFromApi = keys.find(
                            (key) => Object.keys(key)[0] === keyFromView
                        );
                        const key =
                            keyAsFromApi &&
                            keyAsFromApi[Object.keys(keyAsFromApi)[0]];
                        const value = await allInfoInTab[i].getText();
                        keyValuePairs[key] = value;
                    }
                    keyValuePairs[ConsignmentNo] = consNo;
                    if (i + 1 < allTabs?.length) {
                        allTabs[i + 1].click();
                    }
                }
                performanceDataInView.push(keyValuePairs);
            }
            // Step 2: Check for the next page button and click it
            //Scroll to the bottom to get to next button
            const scrollArea = await driver.findElement(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div'
                )
            );
            await driver.executeScript(
                "arguments[0].scrollTop = arguments[0].offsetHeight",
                scrollArea
            );
            const nextButton = await driver.findElements(
                By.xpath(
                    '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[5]/ul/li[9]/a'
                )
            );
            if (
                performanceDataInView.length < dataLength &&
                (await nextButton[0].isEnabled())
            ) {
                await nextButton[0].click(); // Click the next button
                await driver.sleep(3000); // Wait for the next page to load
            } else {
                hasNextPage = false; // No more pages
            }
        }
    });
});

describe("Table data test", () => {
    let driver;

    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser("chrome").build();
        await login(driver);
        await driver.sleep(6000);
        await navigateToPage("Performance Report");
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

    it("user can filter data by date", async () => {
        //Step 1: Filter data in GTRS
        const dateFromInput = await driver.findElement(By.id("from-date"));
        const dateToInput = await driver.findElement(By.id("to-date"));

        await dateFromInput.sendKeys("09-05-2024");
        await dateToInput.sendKeys("12-05-2024");

        const performanceDataInView = fetchPerformanceDataFromView(driver);
        let data = await fetchData("PerformanceReport", {});

        //Step 2: Filter api data
        const startDate = new Date("09-05-2024");
        const endDate = new Date("12-05-2024");
        let filteredAPIData = [];
        data.map((item) => {
            const disDate = new Date(item?.DespatchDate);
            if (disDate >= startDate && disDate <= endDate) {
                filteredAPIData.push({
                    ConsignmentStatus: item.ConsignmentStatus,
                    KpiDatetime: item.KpiDatetime,
                    AccountNumber: item.AccountNumber,
                    PodDateTime: item.PodDateTime,
                    POD: item.POD,
                    Status: item.Status,
                    Service: item.Service,
                    ManifestNo: item.ManifestNo,
                    LoadingTime: item.LoadingTime,
                    TotalQuantity: item.TotalQuantity,
                    TotalWeight: item.TotalWeight,
                    DeliveryRequiredDateTime: item.DeliveryRequiredDateTime,
                    DeliveredDate: item.DeliveredDate,
                    KpiDatetime: item.KpiDatetime,
                    FuelLevy: item.FuelLevy,
                    NettAmount: item.NettAmount,
                    RateAmount: item.RateAmount,
                    SenderName: item.SenderName,
                    SenderZone: item.SenderZone,
                    SenderSuburb: item.SenderSuburb,
                    SenderPostcode: item.SenderPostcode,
                    SenderReference: item.SenderReference,
                    ReceiverName: item.ReceiverName,
                    ReceiverZone: item.ReceiverZone,
                    ReceiverSuburb: item.ReceiverSuburb,
                    ReceiverPostcode: item.ReceiverPostcode,
                    ReceiverReference: item.ReceiverReference,
                });
            }
        });

        // Step 3: Compare data
        const discrepancies = await comparePerformanceData(performanceDataInView, filteredAPIData);
        if(discrepancies?.length > 0){
            assert.fail("There are differences between filtered API data and filtered data in GTRS");
        }

        //Step 4: Clean up filter
        await dateFromInput.sendKeys("");
        await dateToInput.sendKeys("");
    });

    it("user can filter data by cons no", async () => {
        //Step 1: Filter data in GTRS
        const consNo = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[2]/div/div/div[3]/div/input'
            )
        );
        await consNo.sendKeys("2501016204");

        const performanceDataInView = fetchPerformanceDataFromView(driver);
        let data = await fetchData("PerformanceReport", {});

        //Step 2: Filter api data
        let filteredAPIData = [];
        data.map((item) => {
            if (item.ConsignmentNo == "2501016204") {
                filteredAPIData.push({
                    ConsignmentStatus: item.ConsignmentStatus,
                    KpiDatetime: item.KpiDatetime,
                    AccountNumber: item.AccountNumber,
                    PodDateTime: item.PodDateTime,
                    POD: item.POD,
                    Status: item.Status,
                    Service: item.Service,
                    ManifestNo: item.ManifestNo,
                    LoadingTime: item.LoadingTime,
                    TotalQuantity: item.TotalQuantity,
                    TotalWeight: item.TotalWeight,
                    DeliveryRequiredDateTime: item.DeliveryRequiredDateTime,
                    DeliveredDate: item.DeliveredDate,
                    KpiDatetime: item.KpiDatetime,
                    FuelLevy: item.FuelLevy,
                    NettAmount: item.NettAmount,
                    RateAmount: item.RateAmount,
                    SenderName: item.SenderName,
                    SenderZone: item.SenderZone,
                    SenderSuburb: item.SenderSuburb,
                    SenderPostcode: item.SenderPostcode,
                    SenderReference: item.SenderReference,
                    ReceiverName: item.ReceiverName,
                    ReceiverZone: item.ReceiverZone,
                    ReceiverSuburb: item.ReceiverSuburb,
                    ReceiverPostcode: item.ReceiverPostcode,
                    ReceiverReference: item.ReceiverReference,
                });
            }
        });

        // Step 3: Compare data
        const discrepancies = await comparePerformanceData(performanceDataInView, filteredAPIData);
        if(discrepancies?.length > 0){
            assert.fail("There are differences between filtered API data and filtered data in GTRS");
        }

        //Step 4: Clean up filter
        await consNo.clear();
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

        const performanceDataInView = fetchPerformanceDataFromView(driver);
        let data = await fetchData("PerformanceReport", {});

        //Step 2: Filter api data
        let filteredAPIData = [];
        data.map((item) => {
            if (item.ChargeToID == "1507") {
                filteredAPIData.push({
                    ConsignmentStatus: item.ConsignmentStatus,
                    KpiDatetime: item.KpiDatetime,
                    AccountNumber: item.AccountNumber,
                    PodDateTime: item.PodDateTime,
                    POD: item.POD,
                    Status: item.Status,
                    Service: item.Service,
                    ManifestNo: item.ManifestNo,
                    LoadingTime: item.LoadingTime,
                    TotalQuantity: item.TotalQuantity,
                    TotalWeight: item.TotalWeight,
                    DeliveryRequiredDateTime: item.DeliveryRequiredDateTime,
                    DeliveredDate: item.DeliveredDate,
                    KpiDatetime: item.KpiDatetime,
                    FuelLevy: item.FuelLevy,
                    NettAmount: item.NettAmount,
                    RateAmount: item.RateAmount,
                    SenderName: item.SenderName,
                    SenderZone: item.SenderZone,
                    SenderSuburb: item.SenderSuburb,
                    SenderPostcode: item.SenderPostcode,
                    SenderReference: item.SenderReference,
                    ReceiverName: item.ReceiverName,
                    ReceiverZone: item.ReceiverZone,
                    ReceiverSuburb: item.ReceiverSuburb,
                    ReceiverPostcode: item.ReceiverPostcode,
                    ReceiverReference: item.ReceiverReference,
                });
            }
        });

        // Step 3: Compare data
        const discrepancies = await comparePerformanceData(performanceDataInView, filteredAPIData);
        if(discrepancies?.length > 0){
            assert.fail("There are differences between filtered API data and filtered data in GTRS");
        }

        //Step 4: Clean up filter
        await ualDebtor.click();
        await debAccDropdown.click();
    });

    it("user can filter data by date and cons no", async () => {
        //Step 1: Filter data in GTRS
        const dateFromInput = await driver.findElement(By.id("from-date"));
        const dateToInput = await driver.findElement(By.id("to-date"));

        await dateFromInput.sendKeys("09-05-2024");
        await dateToInput.sendKeys("12-05-2024");

        const consNo = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[2]/div/div/div[3]/div/input'
            )
        );
        await consNo.sendKeys("2501016204");

        const performanceDataInView = fetchPerformanceDataFromView(driver);
        let data = await fetchData("PerformanceReport", {});

        //Step 2: Filter api data
        const startDate = new Date("09-05-2024");
        const endDate = new Date("12-05-2024");
        let filteredAPIData = [];
        data.map((item) => {
            const disDate = new Date(item?.DespatchDate);
            if (
                disDate >= startDate &&
                disDate <= endDate &&
                item.ConsignmentNo == "2501016204"
            ) {
                filteredAPIData.push({
                    ConsignmentStatus: item.ConsignmentStatus,
                    KpiDatetime: item.KpiDatetime,
                    AccountNumber: item.AccountNumber,
                    PodDateTime: item.PodDateTime,
                    POD: item.POD,
                    Status: item.Status,
                    Service: item.Service,
                    ManifestNo: item.ManifestNo,
                    LoadingTime: item.LoadingTime,
                    TotalQuantity: item.TotalQuantity,
                    TotalWeight: item.TotalWeight,
                    DeliveryRequiredDateTime: item.DeliveryRequiredDateTime,
                    DeliveredDate: item.DeliveredDate,
                    KpiDatetime: item.KpiDatetime,
                    FuelLevy: item.FuelLevy,
                    NettAmount: item.NettAmount,
                    RateAmount: item.RateAmount,
                    SenderName: item.SenderName,
                    SenderZone: item.SenderZone,
                    SenderSuburb: item.SenderSuburb,
                    SenderPostcode: item.SenderPostcode,
                    SenderReference: item.SenderReference,
                    ReceiverName: item.ReceiverName,
                    ReceiverZone: item.ReceiverZone,
                    ReceiverSuburb: item.ReceiverSuburb,
                    ReceiverPostcode: item.ReceiverPostcode,
                    ReceiverReference: item.ReceiverReference,
                });
            }
        });

        // Step 3: Compare data
        const discrepancies = await comparePerformanceData(performanceDataInView, filteredAPIData);
        if(discrepancies?.length > 0){
            assert.fail("There are differences between filtered API data and filtered data in GTRS");
        }

        //Step 4: Clean up filter
        await consNo.clear();
        await dateFromInput.sendKeys("");
        await dateToInput.sendKeys("");
    });

    it("user can filter data by date and debtor account", async () => {
        //Step 1: Filter data in GTRS
        const dateFromInput = await driver.findElement(By.id("from-date"));
        const dateToInput = await driver.findElement(By.id("to-date"));

        await dateFromInput.sendKeys("09-05-2024");
        await dateToInput.sendKeys("12-05-2024");

        const debAccDropdown = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[2]/div'
            )
        );
        await debAccDropdown.click();

        const ualDebtor = await driver.findElement(By.id("1507      "));
        await ualDebtor.click();

        const performanceDataInView = fetchPerformanceDataFromView(driver);
        let data = await fetchData("PerformanceReport", {});

        //Step 2: Filter api data
        const startDate = new Date("09-05-2024");
        const endDate = new Date("12-05-2024");
        let filteredAPIData = [];
        data.map((item) => {
            const disDate = new Date(item?.DespatchDate);
            if (
                disDate >= startDate &&
                disDate <= endDate &&
                item.ChargeToID == "1507"
            ) {
                filteredAPIData.push({
                    ConsignmentStatus: item.ConsignmentStatus,
                    KpiDatetime: item.KpiDatetime,
                    AccountNumber: item.AccountNumber,
                    PodDateTime: item.PodDateTime,
                    POD: item.POD,
                    Status: item.Status,
                    Service: item.Service,
                    ManifestNo: item.ManifestNo,
                    LoadingTime: item.LoadingTime,
                    TotalQuantity: item.TotalQuantity,
                    TotalWeight: item.TotalWeight,
                    DeliveryRequiredDateTime: item.DeliveryRequiredDateTime,
                    DeliveredDate: item.DeliveredDate,
                    KpiDatetime: item.KpiDatetime,
                    FuelLevy: item.FuelLevy,
                    NettAmount: item.NettAmount,
                    RateAmount: item.RateAmount,
                    SenderName: item.SenderName,
                    SenderZone: item.SenderZone,
                    SenderSuburb: item.SenderSuburb,
                    SenderPostcode: item.SenderPostcode,
                    SenderReference: item.SenderReference,
                    ReceiverName: item.ReceiverName,
                    ReceiverZone: item.ReceiverZone,
                    ReceiverSuburb: item.ReceiverSuburb,
                    ReceiverPostcode: item.ReceiverPostcode,
                    ReceiverReference: item.ReceiverReference,
                });
            }
        });

        // Step 3: Compare data
        const discrepancies = await comparePerformanceData(
            performanceDataInView,
            filteredAPIData
        );
        if(discrepancies?.length > 0){
            assert.fail("There are differences between filtered API data and filtered data in GTRS");
        }

        //Step 4: Clean up filter
        await ualDebtor.click();
        await debAccDropdown.click();
        await dateFromInput.sendKeys("");
        await dateToInput.sendKeys("");
    });

    it("user can filter data by cons no and debtor account", async () => {
        //Step 1: Filter data in GTRS
        const debAccDropdown = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[2]/div'
            )
        );
        await debAccDropdown.click();

        const ualDebtor = await driver.findElement(By.id("1507      "));
        await ualDebtor.click();

        const consNo = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[2]/div/div/div[3]/div/input'
            )
        );
        await consNo.sendKeys("2501016204");

        const performanceDataInView = fetchPerformanceDataFromView(driver);
        let data = await fetchData("PerformanceReport", {});

        //Step 2: Filter api data
        let filteredAPIData = [];
        data.map((item) => {
            if (
                item.ConsignmentNo == "2501016204" &&
                item.ChargeToID == "1507"
            ) {
                filteredAPIData.push({
                    ConsignmentStatus: item.ConsignmentStatus,
                    KpiDatetime: item.KpiDatetime,
                    AccountNumber: item.AccountNumber,
                    PodDateTime: item.PodDateTime,
                    POD: item.POD,
                    Status: item.Status,
                    Service: item.Service,
                    ManifestNo: item.ManifestNo,
                    LoadingTime: item.LoadingTime,
                    TotalQuantity: item.TotalQuantity,
                    TotalWeight: item.TotalWeight,
                    DeliveryRequiredDateTime: item.DeliveryRequiredDateTime,
                    DeliveredDate: item.DeliveredDate,
                    KpiDatetime: item.KpiDatetime,
                    FuelLevy: item.FuelLevy,
                    NettAmount: item.NettAmount,
                    RateAmount: item.RateAmount,
                    SenderName: item.SenderName,
                    SenderZone: item.SenderZone,
                    SenderSuburb: item.SenderSuburb,
                    SenderPostcode: item.SenderPostcode,
                    SenderReference: item.SenderReference,
                    ReceiverName: item.ReceiverName,
                    ReceiverZone: item.ReceiverZone,
                    ReceiverSuburb: item.ReceiverSuburb,
                    ReceiverPostcode: item.ReceiverPostcode,
                    ReceiverReference: item.ReceiverReference,
                });
            }
        });
        // Step 3: Compare data
        const discrepancies = await comparePerformanceData(
            performanceDataInView,
            filteredAPIData
        );
        if(discrepancies?.length > 0){
            assert.fail("There are differences between filtered API data and filtered data in GTRS");
        }

        //Step 4: Clean up filter
        await ualDebtor.click();
        await debAccDropdown.click();
        await consNo.clear();
    });

    it("user can filter data by date, cons no and debtor account", async () => {
        //Step 1: Filter data in GTRS
        const dateFromInput = await driver.findElement(By.id("from-date"));
        const dateToInput = await driver.findElement(By.id("to-date"));

        await dateFromInput.sendKeys("09-05-2024");
        await dateToInput.sendKeys("12-05-2024");

        const debAccDropdown = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[2]/div'
            )
        );
        await debAccDropdown.click();

        const ualDebtor = await driver.findElement(By.id("1507      "));
        await ualDebtor.click();

        const consNo = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[2]/div/div/div[3]/div/input'
            )
        );
        await consNo.sendKeys("2501016204");

        const performanceDataInView = fetchPerformanceDataFromView(driver);
        let data = await fetchData("PerformanceReport", {});

        //Step 2: Filter api data
        const startDate = new Date("09-05-2024");
        const endDate = new Date("12-05-2024");
        let filteredAPIData = [];
        data.map((item) => {
            const disDate = new Date(item?.DespatchDate);
            if (
                item.ConsignmentNo == "2501016204" &&
                item.ChargeToID == "1507" &&
                disDate >= startDate && disDate <= endDate
            ) {
                filteredAPIData.push({
                    ConsignmentStatus: item.ConsignmentStatus,
                    KpiDatetime: item.KpiDatetime,
                    AccountNumber: item.AccountNumber,
                    PodDateTime: item.PodDateTime,
                    POD: item.POD,
                    Status: item.Status,
                    Service: item.Service,
                    ManifestNo: item.ManifestNo,
                    LoadingTime: item.LoadingTime,
                    TotalQuantity: item.TotalQuantity,
                    TotalWeight: item.TotalWeight,
                    DeliveryRequiredDateTime: item.DeliveryRequiredDateTime,
                    DeliveredDate: item.DeliveredDate,
                    KpiDatetime: item.KpiDatetime,
                    FuelLevy: item.FuelLevy,
                    NettAmount: item.NettAmount,
                    RateAmount: item.RateAmount,
                    SenderName: item.SenderName,
                    SenderZone: item.SenderZone,
                    SenderSuburb: item.SenderSuburb,
                    SenderPostcode: item.SenderPostcode,
                    SenderReference: item.SenderReference,
                    ReceiverName: item.ReceiverName,
                    ReceiverZone: item.ReceiverZone,
                    ReceiverSuburb: item.ReceiverSuburb,
                    ReceiverPostcode: item.ReceiverPostcode,
                    ReceiverReference: item.ReceiverReference,
                });
            }
        });
        // Step 3: Compare data
        const discrepancies = await comparePerformanceData(
            performanceDataInView,
            filteredAPIData
        );
        if(discrepancies?.length > 0){
            assert.fail("There are differences between filtered API data and filtered data in GTRS");
        }

        //Step 4: Clean up filter
        await ualDebtor.click();
        await debAccDropdown.click();
        await consNo.clear();
        await dateFromInput.sendKeys("");
        await dateToInput.sendKeys("");
    });
});
