const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { login, loginToApp } = require("../helper/helper");
require("dotenv").config();

const chrome = require('selenium-webdriver/chrome');

describe("Apps Integration Tests", function () {
    let driver;

    // Login to GTAM
    before(async () => {
        // Initialize the WebDriver
        driver = await new Builder().forBrowser("chrome").build();

        // Define system variables
        const url = "https://gtam.gtls.store";
        const mainUrl = "gtam";

        // Call the login helper function
        await loginToApp(driver, url, mainUrl);
    });

    after(async () => {
        // Quit the WebDriver after tests
        await driver.quit();
    });

it("User cannot access if he has an inactive role in GTAM", async () => {
    // Step 1: Remove user access of GTRS from GTAM
    await driver.get('https://gtam.gtls.store/gtam/employees');

    // Search for user
    await driver.sleep(6000); // Wait for search to complete

    // Select GTRS app
    await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div[3]/div[2]/div/div/div/div[2]/div/div[1]/div[2]/div[2]/div[2]')).click();

    // Remove access
    const overlay = await driver.findElement(By.xpath('/html/body/div[3]/div/div/div/div[2]/div/div/div/div'));
    const activeCheckbox = await driver.findElement(By.xpath('/html/body/div[3]/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div[3]/div[2]/label'));

    // Scroll the overlay until the checkbox is visible
    while (!(await activeCheckbox.isDisplayed())) {
        await driver.executeScript("arguments[0].scrollBy(0, 100);", overlay); // Scroll down by 100 pixels
        await driver.sleep(100); // Wait for the scroll animation to complete
    }
    activeCheckbox.click();
    await driver.findElement(By.xpath('/html/body/div[3]/div/div/div/div[2]/div/div/div/div/div/div[2]/div/button')).click();

    // Step 2: Navigate to GTRS
    await driver.get('https://gtrs.gtls.store/gtrs/dashboard');

    // Step 3: Verify that the user is not allowed access
    await driver.sleep(30000);
    const noAccess = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]'));
    assert.ok(await noAccess.isDisplayed(), "User should not be able to access the app.");
})

const GtrsPages = [
    { pageName: "Dashboard", url: "gtrs/dashboard" },
    { pageName: "Consignments", url: "gtrs/consignments" },
    { pageName: "KPI", url: "gtrs/kpi" },
    { pageName: "Transit Days", url: "gtrs/kpi/transit-days" },
    { pageName: "Holidays", url: "gtrs/kpi/holidays" },
    { pageName: "Consignments performance", url: "gtrs/performance" },
    { pageName: "Failed Consignments", url: "gtrs/failed-consignments" },
    { pageName: "Transport Report", url: "gtrs/transport" },
    { pageName: "RDD", url: "gtrs/rdd" },
    { pageName: "Missing pod", url: "gtrs/missing-pod" },
    { pageName: "Safety", url: "gtrs/safety" },
    { pageName: "No Delivery", url: "gtrs/no-delivery" },
    { pageName: "Additional Charges", url: "gtrs/additional-charges" },
    { pageName: "Driver Login", url: "gtrs/driver-login" },
    { pageName: "Unilever Pack Report", url: "gtrs/pack-report" },
    { pageName: "Traffic Report", url: "gtrs/traffic-report" },
    { pageName: "Consignment Tracking", url: "gtrs/consignment-tracking" },
    {
        pageName: "Consignment Tracking 2",
        url: "gtrs/consignment-tracking-2",
    },
    { pageName: "Unilever Delivery Report", url: "gtrs/delivery-report" },
];

   for (const { pageName, url } of GtrsPages) {
    it(`User can't access page ${pageName} if he has no access`, async () => {
        // Step 1: Navigate to applications page in GTAM
        await driver.findElement(
            By.xpath(
                "/html/body/div[1]/div/div/div/div/div[1]/div/div[3]/div[1]/div/div/aside/div/div/div[3]/nav/ul/li[4]/a/span/div"
            )
        ).click();

        // Select GTRS app
        console.log('Remove access manually');
        await driver.sleep(30000); // Wait 30s for manual action

        // Step 2: Verify that the user is not allowed access
        await driver.get(`https://gtrs.gtls.store/${url}`);
        await driver.sleep(60000); // Wait 60s for website to load

        // Wait for the element to be present and visible
        await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]'))), 10000);

        // Step 3: Verify that the user is not allowed access
        const noAccess = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div[2]'));
        assert.ok(await noAccess.isDisplayed(), "User should not be able to access the app.");
    });
    }
 });

describe("Apps Integration Tests", function () {
    let driver;

    before(async () => {
        const options = new chrome.Options();
        options.addArguments("--log-level=1"); // add this line
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    // Prerequisites:
    // 1. User is logged in to GTRS
    // 2. User has access to GTRS
    // 3. User has no access to dashboard
    it("User doesn't have dashboard in sidebar after having no access", async () => {
        await login(driver);

        const dashboardSelector = await driver.findElement(
            By.xpath(
                "/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[4]/nav/ul/li[1]/div/span/div"
            )
        );

        await driver.wait(until.elementIsVisible(dashboardSelector), 500);
        const firstElement = await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[4]/nav/ul/li[1]/div/span/div"));
        const firstElementText = await firstElement.getText();
        const currentUrl = await driver.getCurrentUrl();

        assert.notStrictEqual(
            firstElementText,
            "Dashboard",
            "User still has access to 'Dashboard' in the sidebar"
        );
        assert.notStrictEqual(
            currentUrl,
            "https://gtrs.gtls.store/gtrs/dashboard",
            "User is still able to access the dashboard URL"
        );
    });

    //Test can be re-used for all li elements
    it('should ensure that no <li> elements contain "Consignments"', async () => {
        // Navigate to the application URL
        await driver.get('https://gtrs.gtls.store/login');

        // Wait for the <ul> element to be present
        const ulLocator = By.xpath('/html/body/div[1]/div/div/div/div/div[2]/div/div/div/div/div/aside/div/div/div[4]/nav/ul');
        await driver.wait(until.elementLocated(ulLocator), 5000);

        // Find the <ul> element
        const ulElement = await driver.findElement(ulLocator);

        // Get all <li> elements within the <ul>
        const liElements = await ulElement.findElements(By.tagName('li'));

        // Check each <li> element to ensure it does not contain "Consignments"
        for (let li of liElements) {
            const text = await li.getText();
            if (text == 'Consignments') {
                throw new Error('Found an <li> element containing "Consignments": ' + text);
            }
        }

        console.log('No <li> elements contain "Consignments".');
    });
});
