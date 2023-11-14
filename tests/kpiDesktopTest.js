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

    await driver.get("http://127.0.0.1:8000/Main");
    await driver.manage().addCookie({
        name: "gtls_session",
        value: "eyJpdiI6InNlL2dBemdzZ1BqNXdKclF2N3VDMlE9PSIsInZhbHVlIjoiNUIwY21ML3RMRHhjbGR5QWJUbzdwMFVudjlnYjBkSklWYjg1enUyNzIwem5kTk5hNzM4VHB6KzVxMW84d1dNaEZ2YXRVSVBpQWFkYlF3Z0lMbWVydm1BT0JCMklYMnVWREVEWUJqK3JsdlBNSXZHWVhBdWZLMTVVZEVPV01LcFIiLCJtYWMiOiI2Yzg5N2EwYWIwOWQ1OWIzZjI3YWQxMzAzYTk3ZWZkYTUwMjUxMjBhYjEwMmE2NzNmNjdkY2VjMDA3NjUxZDMxIiwidGFnIjoiIn0%3D",
    });
    await driver.get("http://127.0.0.1:8000/Main");
});

// describe("Testing KPI", function () {
//     it("check reasons page style", async function () {
//         try {
//             let KPIBtn = await driver.wait(
//                 until.elementLocated(
//                     By.xpath(
//                         "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
//                     )
//                 )
//             );
//             await driver.wait(until.elementIsEnabled(KPIBtn));
//             await KPIBtn.click();

//             let ReasonsBtn = await driver.wait(
//                 until.elementLocated(By.id("Reasons"))
//             );
//             await driver.sleep(100);
//             await driver.wait(until.elementIsEnabled(ReasonsBtn));
//             await ReasonsBtn.click();

//             let title = await driver.wait(
//                 until.elementLocated(
//                     By.xpath(
//                         '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[1]/h1'
//                     )
//                 )
//             );
//             let titleClass = await title.getAttribute("class");
//             let Titletext = await title.getText();

//             const hasDesiredClasses =
//                 titleClass.includes("text-dark") &&
//                 titleClass.includes("text-xl") &&
//                 titleClass.includes("font-bold");
//             if (hasDesiredClasses && Titletext == "Reasons") {
//                 assert.ok(true);
//             } else {
//                 assert.ok(false, "Incorrect Title or style");
//             }
//         } catch (err) {
//             assert.ok(false, err);
//         }
//     });

// it("check reasons page index matches table element number", async function () {
//     try {
//         let KPIBtn = await driver.wait(
//             until.elementLocated(
//                 By.xpath(
//                     "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
//                 )
//             )
//         );
//         await driver.wait(until.elementIsEnabled(KPIBtn));
//         KPIBtn.click();

//         let ReasonsBtn = await driver.wait(
//             until.elementLocated(By.id("Reasons"))
//         );
//         await driver.sleep(100);
//         await driver.wait(until.elementIsEnabled(ReasonsBtn));
//         ReasonsBtn.click();

//         let titleIndx = await driver.wait(
//             until.elementLocated(
//                 By.xpath(
//                     '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[1]/p'
//                 )
//             )
//         );
//         let tableLastElement = await driver.wait(
//             until.elementLocated(
//                 By.xpath(
//                     '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[3]/div/div/div/div/div[1]/div/div/div/table/tbody/tr[14]/td[1]'
//                 )
//             )
//         );
//         let indxTable = await tableLastElement.getText();
//         let indxTitle = await titleIndx.getText();

//         const numberArray = indxTitle.replace(/[()]/g, "").split("");

//         if (indxTable == numberArray.join("")) {
//             assert.ok(true);
//         } else {
//             assert.ok(
//                 false,
//                 "Page title index not same as last table element"
//             );
//         }
//     } catch (err) {
//         assert.ok(false, err);
//     }
// });

// it("add reason", async function () {
//     try {
//         let KPIBtn = await driver.wait(
//             until.elementLocated(
//                 By.xpath(
//                     "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
//                 )
//             )
//         );
//         await driver.wait(until.elementIsEnabled(KPIBtn));
//         await KPIBtn.click();

//         let ReasonsBtn = await driver.wait(
//             until.elementLocated(By.id("Reasons"))
//         );
//         await driver.sleep(100);
//         await driver.wait(until.elementIsEnabled(ReasonsBtn));
//         await ReasonsBtn.click();

//         let addReasonBtn = await driver.wait(
//             until.elementLocated(
//                 By.xpath(
//                     '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div[2]/div/button'
//                 )
//             )
//         );
//         await driver.wait(until.elementIsEnabled(addReasonBtn));
//         await addReasonBtn.click();

//         let inputField = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[3]/div/div/div/div/div[1]/div/div/div/table/tbody/tr[1]/td[2]/div/input')))
//         await inputField.sendKeys('testReason')

//         let statusInactive = await driver.wait(until.elementLocated(By.xpath('//*[@id="inactive"]')));
//         await statusInactive.click();

//         let addBtn = await driver.wait(until.elementLocated(By.xpath('//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[3]/div/div/div/div/div[1]/div/div/div/table/tbody/tr[1]/td[4]/button')));
//         await addBtn.click();
//     } catch (err) {
//         assert.ok(false, err);
//     }
// });

// it("edit reason", async function () {
//     try {
//         let editReasonBtn = await driver.wait(
//             until.elementLocated(
//                 By.id(
//                     'edit14'
//                 )
//             )
//         );
//         await driver.wait(until.elementIsEnabled(editReasonBtn));
//         await driver.executeScript('arguments[0].scrollIntoView()', editReasonBtn);
//         await editReasonBtn.click();

//         let inputField = await driver.wait(until.elementLocated(By.xpath('//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[3]/div/div/div/div/div[1]/div/div/div/table/tbody/tr[15]/td[2]/div/div/input')))
//         await inputField.sendKeys('testReason2')

//         let statusInactive = await driver.wait(until.elementLocated(By.xpath('//*[@id="inactive"]')));
//         await statusInactive.click();

//         let saveBtn = await driver.wait(until.elementLocated(By.xpath('//*[@id="save14"]')));
//         await saveBtn.click();
//     } catch (err) {
//         assert.ok(false, err);
//     }
// });

// });

describe("Testing Holidays", function () {
    /*it("filter holidays by name", async function () {
        try {
            let KPIBtn = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
                    )
                )
            );
            await driver.wait(until.elementIsEnabled(KPIBtn));
            await KPIBtn.click();

            let HolidaysBtn = await driver.wait(
                until.elementLocated(By.id("Holidays"))
            );
            await driver.sleep(100);
            await driver.wait(until.elementIsEnabled(HolidaysBtn));
            await HolidaysBtn.click();

            await driver.sleep(400);
            let holidayName = await driver.wait(until.elementLocated(By.xpath('//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/span/input')));
            //await holidayName.sendKeys('Australia Day');
            // await holidayName.sendKeys("New Year's Day");
            //await holidayName.sendKeys('Royal Hobart Regatta');
            await holidayName.sendKeys("Labour Day");
            await driver.sleep(2000);
            await holidayName.sendKeys("Eight Hours Day");
            const filteredItems = await driver.findElements(By.className('InovuaReactDataGrid__cell--first'))
            
            for (let ele of filteredItems){
                const text = await ele.getText();
                if(text != "Labour Day" && text != "Eight Hours Day"){
                    assert.ok(false, 'Value does not match filtered value')
                }
            }

        }catch(err){
            assert.ok(false, err)
        }
    })*/

    it("Filter Holidays by state", async function () {
        try {
            let KPIBtn = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
                    )
                )
            );
            await driver.wait(until.elementIsEnabled(KPIBtn));
            await KPIBtn.click();

            let HolidaysBtn = await driver.wait(
                until.elementLocated(By.id("Holidays"))
            );
            await driver.sleep(100);
            await driver.wait(until.elementIsEnabled(HolidaysBtn));
            await HolidaysBtn.click();

            await driver.sleep(400);

            let stateInput = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[1]/span/input'
                    )
                )
            );
            await stateInput.sendKeys("NAT");
            await driver.sleep(2000);
            const cellItems = await driver.findElements(
                By.className("InovuaReactDataGrid__cell")
            );

            const filteredItems = [];
            for (let cell of cellItems) {
                const style = await cell.getAttribute("style");
                if (style === 'left: 566px') {
                    filteredItems.push(element);
                }
            }
            console.log(filteredItems);
            for (let ele of filteredItems) {
                const text = await ele.getText();
                console.log(text);
                if (text != "NAT") {
                    assert.ok(false, "Value does not match filtered value");
                }
            }
        } catch (err) {
            assert.ok(false, err);
        }
    });
});
