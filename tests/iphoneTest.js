const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

let driver, cookie;

before(async function () {
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

    await driver.manage().window().setRect({ width: 390, height: 844 });
    await driver.get("http://127.0.0.1:8000/Main");
    await driver.manage().addCookie({
        name: "gtls_session",
        value: "",
    });
    await driver.get("http://127.0.0.1:8000/Main");
});

describe("Testing GTAM/Apps", function () {
    it("checks Apps/GTAM default title text and style in Chrome browser iphone view", async function () {
        try {
            let navBtn = await driver.wait(
                until.elementLocated(
                    By.xpath('//*[@id="app"]/div/div/header/div/button')
                )
            );
            await driver.wait(until.elementIsEnabled(navBtn));
            navBtn.click();
            
            let childElement = await driver.wait(
                until.elementLocated(
                  By.id('GTAM')
                )
              );
            
            let gtamBtn = childElement.findElement(By.xpath('..'));

            await driver.wait(until.elementIsEnabled(gtamBtn));
            await gtamBtn.click();

            let appsBtn = await driver.wait(
                until.elementLocated(By.id("Apps"))
            );
            await driver.executeScript(
                "arguments[0].scrollIntoView();",
                appsBtn
            );
            await driver.wait(until.elementIsEnabled(appsBtn));
            await appsBtn.click();

            let appsGtamBtn = await driver.wait(
                until.elementLocated(By.id("Gold Tiger Account Manager"))
            );
            await appsGtamBtn.click();

            let gtamTitle = await driver
                .wait(
                    until.elementLocated(
                        By.xpath(
                            '//*[@id="app"]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/h1'
                        )
                    )
                )
                .getText();
            let gtamSubTitle = await driver
                .wait(
                    until.elementLocated(
                        By.xpath(
                            '//*[@id="app"]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/p'
                        )
                    )
                )
                .getText();
            if (
                gtamTitle == "GTAM" &&
                gtamSubTitle == "Gold Tiger Account Manager"
            ) {
                assert.ok(true);
            } else {
                assert.ok(false, "Apps/GTAM title and subtitle are incorrect");
            }
        } catch (err) {
            assert.ok(false, err);
        }
    });

    it("checks Apps/GTAM default Pages style in Chrome browser iphone view", async function () {
        await driver.sleep(1000);
        let pagesBtn = await driver.wait(until.elementLocated(By.id("Pages")));
        let pagesClass = await pagesBtn.getAttribute("class");
        const hasDesiredClasses =
            pagesClass.includes("text-dark") &&
            pagesClass.includes("border-b-4") &&
            pagesClass.includes("border-goldd") &&
            pagesClass.includes("font-bold");

        if (hasDesiredClasses) {
            let title = await driver
                .findElement(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[5]/div/div/div[4]/div/div[1]/div/div[1]/h1'
                    )
                )
                .getText();
            if (title === "GTAM") {
                assert.ok(true);
            } else {
                assert.ok(false, "Apps/GTAM title in pages is incorrect");
            }
        } else {
            assert.ok(false, "Apps/GTAM pages style is incorrect");
        }
    });

    it("checks Apps/GTIS default title text and style in Chrome browser iphone view", async function () {
        await driver.sleep(1000);
        try {
            let navBtn = await driver.wait(
                until.elementLocated(
                    By.xpath('//*[@id="app"]/div/div/header/div/button')
                )
            );
            await driver.wait(until.elementIsEnabled(navBtn));
            navBtn.click();
            
            let childElement = await driver.wait(
                until.elementLocated(
                  By.id('GTAM')
                )
              );
            
            let gtamBtn = childElement.findElement(By.xpath('..'));

            await driver.wait(until.elementIsEnabled(gtamBtn));
            await gtamBtn.click();

            let appsBtn = await driver.wait(
                until.elementLocated(By.id("Apps"))
            );
            await driver.executeScript(
                "arguments[0].scrollIntoView();",
                appsBtn
            );
            await driver.wait(until.elementIsEnabled(appsBtn));
            await appsBtn.click();

        let appsInvoices = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[5]"
                )
            )
        );
        await appsInvoices.click();
        let invoicesTitle = await driver
            .wait(
                until.elementLocated(
                    By.xpath(
                        '/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/h1'
                    )
                )
            )
            .getText();
        let invoicesSubTitle = await driver
            .wait(
                until.elementLocated(
                    By.xpath(
                        '/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/p'
                    )
                )
            )
            .getText();
        if (invoicesTitle == "GTIS" && invoicesSubTitle == "Invoices") {
            assert.ok(true);
        } else {
            assert.ok(false, "Apps/GTIS title and subtitle are incorrect");
        }
    }catch(err){
        assert.ok(false, err)
    }
    });

    it("checks Apps/GTIS app default page style in Chrome browser iphone view", async function () {
        await driver.sleep(1000);
        let pagesBtn = await driver.wait(until.elementLocated(By.id("Pages")));
        let pagesClass = await pagesBtn.getAttribute("class");
        const hasDesiredClasses =
            pagesClass.includes("text-dark") &&
            pagesClass.includes("border-b-4") &&
            pagesClass.includes("border-goldd") &&
            pagesClass.includes("font-bold");
        if (hasDesiredClasses) {
            let title = await driver
                .findElement(
                    By.xpath(
                        '/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[5]/div/div/div[4]/div/div[1]/div/div[1]/h1'
                    )
                )
                .getText();
            if (title == 'GTIS') {
                assert.ok(true);
            } else {
                assert.ok(false, "Apps/GTIS title in pages is incorrect");
            }
        } else {
            assert.ok(false, "Apps/GTIS pages style is incorrect");
        }
    });

    it("checks Apps/GTMS default title text and style in Chrome browser iphone view", async function () {
        await driver.sleep(1000);
        try {
            let navBtn = await driver.wait(
                until.elementLocated(
                    By.xpath('//*[@id="app"]/div/div/header/div/button')
                )
            );
            await driver.wait(until.elementIsEnabled(navBtn));
            navBtn.click();
            
            let childElement = await driver.wait(
                until.elementLocated(
                  By.id('GTAM')
                )
              );
            
            let gtamBtn = childElement.findElement(By.xpath('..'));

            await driver.wait(until.elementIsEnabled(gtamBtn));
            await gtamBtn.click();

            let appsBtn = await driver.wait(
                until.elementLocated(By.id("Apps"))
            );
            await driver.executeScript(
                "arguments[0].scrollIntoView();",
                appsBtn
            );
            await driver.wait(until.elementIsEnabled(appsBtn));
            await appsBtn.click();

        let appsGTMS = await driver.wait(
            until.elementLocated(By.id("Gold Tiger Management System"))
        );
        await driver.wait(until.elementIsEnabled(appsGTMS));
        await appsGTMS.click();
        let gtmsTitle = await driver
            .wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/h1'
                    )
                )
            )
            .getText();
        let gtmsSubTitle = await driver
            .wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/p'
                    )
                )
            )
            .getText();
        if (
            gtmsTitle == "GTMS" &&
            gtmsSubTitle == "Gold Tiger Management System"
        ) {
            assert.ok(true);
        } else {
            assert.ok(false, "Apps/GTMS title and subtitle are incorrect");
        }
    }catch(err){
        assert.ok(false, err)
    }
    });

    it("checks Apps/GTMS app default page style in Chrome browser iphone view", async function () {
        await driver.sleep(1000);
        let pagesBtn = await driver.wait(until.elementLocated(By.id("Pages")));
        let pagesClass = await pagesBtn.getAttribute("class");
        const hasDesiredClasses =
            pagesClass.includes("text-dark") &&
            pagesClass.includes("border-b-4") &&
            pagesClass.includes("border-goldd") &&
            pagesClass.includes("font-bold");
        if (hasDesiredClasses) {
            let title = await driver
                .findElement(
                    By.xpath(
                        '/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[5]/div/div/div[4]/div/div[1]/div/div[1]/h1'
                    )
                )
                .getText();
            if (title == 'GTMS') {
                assert.ok(true);
            } else {
                assert.ok(false, "Apps/GTMS title in pages is incorrect");
            }
        } else {
            assert.ok(false, "Apps/GTMS pages style is incorrect");
        }
    });

    it("checks Apps/d default title text and style in Chrome browser iphone view", async function () {
        await driver.sleep(500);
        try {
            let navBtn = await driver.wait(
                until.elementLocated(
                    By.xpath('//*[@id="app"]/div/div/header/div/button')
                )
            );
            await driver.wait(until.elementIsEnabled(navBtn));
            navBtn.click();
            
            let childElement = await driver.wait(
                until.elementLocated(
                  By.id('GTAM')
                )
              );
            
            let gtamBtn = childElement.findElement(By.xpath('..'));

            await driver.wait(until.elementIsEnabled(gtamBtn));
            await gtamBtn.click();

            let appsBtn = await driver.wait(
                until.elementLocated(By.id("Apps"))
            );
            await driver.executeScript(
                "arguments[0].scrollIntoView();",
                appsBtn
            );
            await driver.wait(until.elementIsEnabled(appsBtn));
            await appsBtn.click();
        let appsD = await driver.wait(until.elementLocated(By.id("d")));
        await appsD.click();
        let dTitle = await driver
            .wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/h1'
                    )
                )
            )
            .getText();
        let dSubTitle = await driver
            .wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[4]/div/div[2]/div[1]/p'
                    )
                )
            )
            .getText();
        if (dTitle == "d" && dSubTitle == "d") {
            assert.ok(true);
        } else {
            assert.ok(false, "Apps/d title and subtitle are incorrect");
        }
    }catch(err){
        assert.ok(false, err)
    }
    });

    it("checks Apps/d app default page style in Chrome browser iphone view", async function () {
        await driver.sleep(1000);
        let pagesBtn = await driver.wait(until.elementLocated(By.id("Pages")));
        let pagesClass = await pagesBtn.getAttribute("class");
        const hasDesiredClasses =
            pagesClass.includes("text-dark") &&
            pagesClass.includes("border-b-4") &&
            pagesClass.includes("border-goldd") &&
            pagesClass.includes("font-bold");
        if (hasDesiredClasses) {
            let title = await driver
                .findElement(
                    By.xpath(
                        '/html/body/div[1]/div/div/div[2]/div[1]/div/div[2]/div/div/div/div/div[5]/div/div/div[4]/div/div[1]/div/div[1]/h1'
                    )
                )
                .getText();
            if (title == "d") {
                assert.ok(true);
            } else {
                assert.ok(false, "Apps/d title in pages is incorrect");
            }
        } else {
            assert.ok(false, "Apps/d pages style is incorrect");
        }
    });
});
