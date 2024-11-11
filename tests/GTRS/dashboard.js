const { Builder, By, until } = require("selenium-webdriver");
const { login, testInformation } = require("../helper/helper");
const assert = require("assert");
const axios = require('axios');
const cookie = require('cookie-js');
require("dotenv").config();
const gtrsPages = require("../helper/gtrsPages");
const { calculateStatistics } = require("@/Components/utils/chartFunc");

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
        it("user can navigate from other pages to the dashboard", async () => {
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
                "https://gtrs.gtls.store/gtrs/dashboard",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/dashboard' but got '${currentUrl}'.`
            );
        });
    }

    it("user can filter the graphs by date", async () => {
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
        const startDate = new Date("2024-03-21");
        const endDate = new Date("2024-04-18");
        const fromDateInput = await driver.findElement(
            By.name("from-date")
        );
        fromDateInput.sendKeys("21-03-2024");
        const toDateInput = await driver.findElement(
            By.name("to-date")
        );
        toDateInput.sendKeys("18-04-2024");

        // Step 3: Fetch data from API request
        let data= [];
        let safetyData = [];
        const cookies = await driver.manage().getCookies();
        const authCookie = cookies.find(c => c.name === 'auth_token');

        axios.get(`${process.env.GTRS_API_URL}/Dashboard`,{
            headers: {
                Authorization: `Bearer ${authCookie.value}`
            }
        })
        .then((res) => {
            // Filter data based on fromDate and toDate
            data = res.data.filter(item => {
                const despatchDate = new Date(item.DespatchDate);
                return despatchDate > startDate && despatchDate < endDate;
            });
        })
        .catch((err) => {
            console.error('Error occurred:', err);
        })

        axios.get(`${process.env.GTRS_API_URL}/SafetyReport`,{
            headers: {
                Authorization: `Bearer ${authCookie.value}`
            }
        })
        .then((res) => {
            // Filter data based on fromDate and toDate
            safetyData = res.data;
        })
        .catch((err) => {
            console.error('Error occurred:', err);
        })

        // Step 4: Verify the data
        const calculatedData = calculateStatistics(data, safetyData);
        const infoTable = await driver.findElement(
            By.xpath(
                '//*[@id="app"]/div/div/div/div/div[2]/div/div/div/div/main/div[2]/div/div/div[3]/div[1]/div/div/div/table/tbody'
            )
        );
        const rows = await infoTable.findElements(By.tagName("tr"));
        testInformation(rows, calculatedData);

    })

    it("user can filter the graphs by receiver name", async () => {

    })

    it("user can filter the graphs by account", async () => {

    })

    it("user can filter the graphs by date and receiver name", async () => {

    })

    it("user can filter the graphs by date and account", async () => {

    })

    it("user can filter the graphs by receiver name and account", async () => {

    })
});
