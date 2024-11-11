const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { login, loginToApp } = require("../helper/helper");
require("dotenv").config();

const allSystems = [
    { name: "GTAM", url: "https://gtam.gtls.store", main: "/gtam/employees" },
    { name: "GTIS", url: "https://gtis.gtls.store", main: "/gtis/main" },
    { name: "GTCCR", url: "https://gtccr.gtls.store", main: "/gtccr/main" },
];

// Using user credentials
describe("Test login to and from all systems using credentials", function () {
    let driver;

    before(async () => {
        const options = new chrome.Options();
        options.addArguments("--log-level=1");
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    it("user can navigate to GTRS from website", async () => {
        // Step 1: Navigate to the main page
        await loginToApp(driver, "https://web.gtls.store", "web");
        await driver.sleep(5000);

        // Step 2: Press on GTRS in the landing page
        await driver.findElement(By.id("Reporting system")).click();

        // Step 3: Wait for the new tab to open
        const windows = await driver.getAllWindowHandles();
        assert.strictEqual(
            windows.length,
            2,
            "There should be two windows open after clicking the link."
        );

        // Step 4: Switch to the new tab
        await driver.switchTo().window(windows[1]);

        // Step 5: Verify that the user is redirected to GTRS
        await driver.wait(
            until.urlIs("https://gtrs.gtls.store/gtrs/dashboard"),
            10000
        );

        // Step 6: Verify that the user is logged in
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl,
            "https://gtrs.gtls.store/gtrs/dashboard",
            `Expected URL to be 'https://gtrs.gtls.store/gtrs/dashboard' but got '${currentUrl}'.`
        );
        await driver.switchTo().window(windows[0]); // Switch back to the original tab
    });

    for (const system of allSystems) {
        it(`user can navigate to GTRS from ${system.name}`, async () => {
            // Step 1: Navigate to the main page
            await loginToApp(driver, system.url, system.name);
            await driver.sleep(5000);

            // Step 2: Press on GTRS in the sidebar
            const nav = await driver.findElement(
                By.css("[aria-label=Sidebar]")
            );
            // find a link with the href https://gtrs.gtls.store/
            const link = await nav.findElement(
                By.css('a[href="https://gtrs.gtls.store/"]')
            );
            await link.click();

            // Step 3: Wait for the new tab to open
            const windows = await driver.getAllWindowHandles();
            assert.strictEqual(
                windows.length,
                2,
                "There should be two windows open after clicking the link."
            );

            // Step 4: Switch to the new tab
            await driver.switchTo().window(windows[1]);

            // Step 5: Verify that the user is redirected to GTRS
            await driver.wait(
                until.urlIs("https://gtrs.gtls.store/gtrs/dashboard"),
                10000
            );

            // Step 6: Verify that the user is logged in
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/dashboard",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/dashboard' but got '${currentUrl}'.`
            );
            await driver.switchTo().window(windows[0]); // Switch back to the original tab
        });
    }

    for (const system of allSystems) {
        it(`user can navigate from GTRS to ${system.name}`, async () => {
            // Step 1: Login to GTRS
            await login(driver);
            await driver.sleep(5000);

            // Step 2: Press on system in the sidebar
            const nav = await driver.findElement(
                By.css("[aria-label=Sidebar]")
            );
            // find a link with the app's url
            const link = await nav.findElement(
                By.css(`a[href=${system.url}]`)
            );
            await link.click();

            // Step 3: Verify that the user is redirected to GTRS
            await driver.wait(
                until.urlIs(`${system.url}${system.main}`),
                10000
            );

            // Step 4: Verify that the user is logged in
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                `${system.url}${system.main}`,
                `Expected URL to be ${system.url}${system.main} but got '${currentUrl}'.`
            );
        });
    }

    it(`user can navigate from GTRS to website`, async () => {
        // Step 1: Login to GTRS
        await login(driver);
        await driver.sleep(5000);

        // Step 2: Go to website's landing page
        await driver.get('https://web.gtls.store/landingPage');

        // Step 3: Verify that the user is redirected to the website's landing page
        const title = await driver.findElement(By.xpath("/html/body/div/div/div/div[1]/div/div/div[2]/h1"));

        // Step 4: Verify that the user is logged in
        assert.strictEqual(
            title.isDisplayed()
            `Expected user to be redirected to the website's landing page.`
        );
    });
});

describe("Test logout to and from all systems using credentials", function () {
    let driver;

    before(async () => {
        const options = new chrome.Options();
        options.addArguments("--log-level=1");
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    for (const system of allSystems) {
        it(`user can logout from ${system.name} and be logged out from GTRS`, async () => {
            //Step 1: Login to system
            await loginToApp(driver, system.url, system.name);
            await driver.sleep(5000);

            //Step 2: Logout from system
            // scroll to logout button if it's not in view
            await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
            const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button'));
            await logoutButton.click();

            //Step 3: Verify that the user is logged out from GTRS
            await driver.get('https://gtrs.gtls.store/gtrs/dashboard');
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                'https://gtrs.gtls.store/login',
                `Expected user to be redirected to login page but got '${currentUrl}'.`
            )
        })
    }

    for (const system of allSystems) {
        it(`user can logout from GTRS and be logged out from ${system.name}`, async () => {
            //Step 1: Login to GTRS
            await login(driver);
            await driver.sleep(5000);

            //Step 2: Logout from GTRS
            // scroll to logout button if it's not in view
            await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
            const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button'));
            await logoutButton.click();

            //Step 3: Verify that the user is logged out from system
            await driver.get(`${system.url}${system.main}`);
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                `${system.url}/login`,
                `Expected user to be redirected to login page but got '${currentUrl}'.`
            )
        })
    }

    it(`user can logout from the website and be logged out from GTRS`, async () => {
        //Step 1: Login to the website
        await loginToApp(driver, "https://web.gtls.store", "web");
        await driver.sleep(5000);

        //Step 2: Logout from the website
        const logoutButton = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/button'));
        await logoutButton.click();

        //Step 3: Verify that the user is logged out from GTRS
        await driver.get('https://gtrs.gtls.store/gtrs/dashboard');
        await driver.sleep(3000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl,
            'https://gtrs.gtls.store/login',
            `Expected user to be redirected to login page but got '${currentUrl}'.`
        )
    })

    it(`user can logout from GTRS and be logged out from the website`, async () => {
        //Step 1: Login to GTRS
        await login(driver);
        await driver.sleep(5000);

        //Step 2: Logout from GTRS
        // scroll to logout button if it's not in view
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button'));
        await logoutButton.click();

        //Step 3: Verify that the user is logged out from the website
        await driver.get('https://web.gtls.store/landingPage');
        await driver.sleep(3000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl,
            'https://web.gtls.store/login',
            `Expected user to be redirected to login page but got '${currentUrl}'.`
        )
    })
});


// Using Microsoft login
describe("Test login to and from all systems using credentials", function () {
    let driver;

    before(async () => {
        const options = new chrome.Options();
        options.addArguments("--log-level=1");
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    it("user can navigate to GTRS from website", async () => {
        // Step 1: Navigate to the main page
        await loginToAppMicrosoft(driver, "https://web.gtls.store", "web");
        await driver.sleep(5000);

        // Step 2: Press on GTRS in the landing page
        await driver.findElement(By.id("Reporting system")).click();

        // Step 3: Wait for the new tab to open
        const windows = await driver.getAllWindowHandles();
        assert.strictEqual(
            windows.length,
            2,
            "There should be two windows open after clicking the link."
        );

        // Step 4: Switch to the new tab
        await driver.switchTo().window(windows[1]);

        // Step 5: Verify that the user is redirected to GTRS
        await driver.wait(
            until.urlIs("https://gtrs.gtls.store/gtrs/dashboard"),
            10000
        );

        // Step 6: Verify that the user is logged in
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl,
            "https://gtrs.gtls.store/gtrs/dashboard",
            `Expected URL to be 'https://gtrs.gtls.store/gtrs/dashboard' but got '${currentUrl}'.`
        );
        await driver.switchTo().window(windows[0]); // Switch back to the original tab
    });

    for (const system of allSystems) {
        it(`user can navigate to GTRS from ${system.name}`, async () => {
            // Step 1: Navigate to the main page
            await loginToAppMicrosoft(driver, system.url, system.name);
            await driver.sleep(5000);

            // Step 2: Press on GTRS in the sidebar
            const nav = await driver.findElement(
                By.css("[aria-label=Sidebar]")
            );
            // find a link with the href https://gtrs.gtls.store/
            const link = await nav.findElement(
                By.css('a[href="https://gtrs.gtls.store/"]')
            );
            await link.click();

            // Step 3: Wait for the new tab to open
            const windows = await driver.getAllWindowHandles();
            assert.strictEqual(
                windows.length,
                2,
                "There should be two windows open after clicking the link."
            );

            // Step 4: Switch to the new tab
            await driver.switchTo().window(windows[1]);

            // Step 5: Verify that the user is redirected to GTRS
            await driver.wait(
                until.urlIs("https://gtrs.gtls.store/gtrs/dashboard"),
                10000
            );

            // Step 6: Verify that the user is logged in
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                "https://gtrs.gtls.store/gtrs/dashboard",
                `Expected URL to be 'https://gtrs.gtls.store/gtrs/dashboard' but got '${currentUrl}'.`
            );
            await driver.switchTo().window(windows[0]); // Switch back to the original tab
        });
    }

    for (const system of allSystems) {
        it(`user can navigate from GTRS to ${system.name}`, async () => {
            // Step 1: Login to GTRS
            await loginMicrosoft(driver);
            await driver.sleep(5000);

            // Step 2: Press on system in the sidebar
            const nav = await driver.findElement(
                By.css("[aria-label=Sidebar]")
            );
            // find a link with the app's url
            const link = await nav.findElement(
                By.css(`a[href=${system.url}]`)
            );
            await link.click();

            // Step 3: Verify that the user is redirected to GTRS
            await driver.wait(
                until.urlIs(`${system.url}${system.main}`),
                10000
            );

            // Step 4: Verify that the user is logged in
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                `${system.url}${system.main}`,
                `Expected URL to be ${system.url}${system.main} but got '${currentUrl}'.`
            );
        });
    }

    it(`user can navigate from GTRS to website`, async () => {
        // Step 1: Login to GTRS
        await loginMicrosoft(driver);
        await driver.sleep(5000);

        // Step 2: Go to website's landing page
        await driver.get('https://web.gtls.store/landingPage');

        // Step 3: Verify that the user is redirected to the website's landing page
        const title = await driver.findElement(By.xpath("/html/body/div/div/div/div[1]/div/div/div[2]/h1"));

        // Step 4: Verify that the user is logged in
        assert.strictEqual(
            title.isDisplayed()
            `Expected user to be redirected to the website's landing page.`
        );
    });
});

describe("Test logout to and from all systems using credentials", function () {
    let driver;

    before(async () => {
        const options = new chrome.Options();
        options.addArguments("--log-level=1");
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    for (const system of allSystems) {
        it(`user can logout from ${system.name} and be logged out from GTRS`, async () => {
            //Step 1: Login to system
            await loginToAppMicrosoft(driver, system.url, system.name);
            await driver.sleep(5000);

            //Step 2: Logout from system
            // scroll to logout button if it's not in view
            await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
            const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button'));
            await logoutButton.click();

            //Step 3: Verify that the user is logged out from GTRS
            await driver.get('https://gtrs.gtls.store/gtrs/dashboard');
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                'https://gtrs.gtls.store/login',
                `Expected user to be redirected to login page but got '${currentUrl}'.`
            )
        })
    }

    for (const system of allSystems) {
        it(`user can logout from GTRS and be logged out from ${system.name}`, async () => {
            //Step 1: Login to GTRS
            await loginMicrosoft(driver);
            await driver.sleep(5000);

            //Step 2: Logout from GTRS
            // scroll to logout button if it's not in view
            await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
            const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button'));
            await logoutButton.click();

            //Step 3: Verify that the user is logged out from system
            await driver.get(`${system.url}${system.main}`);
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(
                currentUrl,
                `${system.url}/login`,
                `Expected user to be redirected to login page but got '${currentUrl}'.`
            )
        })
    }

    it(`user can logout from the website and be logged out from GTRS`, async () => {
        //Step 1: Login to the website
        await loginToAppMicrosoft(driver, "https://web.gtls.store", "web");
        await driver.sleep(5000);

        //Step 2: Logout from the website
        const logoutButton = await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div/div/div[1]/div/button'));
        await logoutButton.click();

        //Step 3: Verify that the user is logged out from GTRS
        await driver.get('https://gtrs.gtls.store/gtrs/dashboard');
        await driver.sleep(3000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl,
            'https://gtrs.gtls.store/login',
            `Expected user to be redirected to login page but got '${currentUrl}'.`
        )
    })

    it(`user can logout from GTRS and be logged out from the website`, async () => {
        //Step 1: Login to GTRS
        await loginMicrosoft(driver);
        await driver.sleep(5000);

        //Step 2: Logout from GTRS
        // scroll to logout button if it's not in view
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        const logoutButton = await driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div/div/div[2]/button/button'));
        await logoutButton.click();

        //Step 3: Verify that the user is logged out from the website
        await driver.get('https://web.gtls.store/landingPage');
        await driver.sleep(3000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(
            currentUrl,
            'https://web.gtls.store/login',
            `Expected user to be redirected to login page but got '${currentUrl}'.`
        )
    })
});
