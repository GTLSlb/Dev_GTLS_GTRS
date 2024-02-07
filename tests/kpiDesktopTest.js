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

///////////////// Edit Reason Test Case ///////////////////

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

describe("Testing KPI", function () {
    ///////////////// Filter Holiday by Name Test Case ///////////////////

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

    ///////////////// Filter Holiday by State Test Case ///////////////////

    // it("Filter Holidays by state", async function () {
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

    //         let HolidaysBtn = await driver.wait(
    //             until.elementLocated(By.id("Holidays"))
    //         );
    //         await driver.sleep(100);
    //         await driver.wait(until.elementIsEnabled(HolidaysBtn));
    //         await HolidaysBtn.click();

    //         await driver.sleep(400);

    //         let stateInput = await driver.wait(
    //             until.elementLocated(
    //                 By.xpath(
    //                     '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[3]/div[1]/div[1]/span/input'
    //                 )
    //             )
    //         );
    //         await stateInput.sendKeys("NAT");
    //         await driver.sleep(2000);
    //         const cellItems = await driver.findElements(
    //             By.className("InovuaReactDataGrid__cell")
    //         );

    //         const filteredItems = [];
    //         for (let cell of cellItems) {
    //             const style = await cell.getAttribute("style");
    //             if (style === 'left: 566px') {
    //                 filteredItems.push(element);
    //             }
    //         }
    //         console.log(filteredItems);
    //         for (let ele of filteredItems) {
    //             const text = await ele.getText();
    //             console.log(text);
    //             if (text != "NAT") {
    //                 assert.ok(false, "Value does not match filtered value");
    //             }
    //         }
    //     } catch (err) {
    //         assert.ok(false, err);
    //     }
    // });

    ///////////////// GMI Test Case ///////////////////

    /*it("Test transit days for GMI First Batch", async function () {
        try {
            let holidays = [];
            try {
                axios
                    .get(`https://gtlslebs06-vm.gtls.com.au:8084/api/GTRS/Holidays`, {
                        headers: {
                            RoleId: 1,
                        },
                    })
                    .then((res) => {
                        holidays = res.data;
                        // Handle errors or proceed with parsing data
                      })
                      .catch((error) => {
                        console.error('Error fetching data:', error);
                      });
            } catch (error) {
                console.error("Error fetching data:", error);
            } 
            console.log('holidays',holidays)
            let KPIBtn = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
                    )
                )
            );
            await driver.wait(until.elementIsEnabled(KPIBtn));
            await KPIBtn.click();

            let KPIReportBtn = await driver.wait(
                until.elementLocated(By.id("KPI Report "))
            );
            await driver.sleep(100);
            await driver.wait(until.elementIsEnabled(KPIReportBtn));
            await KPIReportBtn.click();

            await driver.sleep(400);
            let customerNameInput = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input'
                    )
                )
            );

            await customerNameInput.sendKeys("GMI");
            await driver.sleep(3000);
            const tableElement = await driver.findElement(
                By.className("InovuaReactDataGrid__body")
            );

            // Scroll vertically to the bottom
            await driver.executeScript(
                "arguments[0].scrollTop = arguments[0].scrollHeight",
                tableElement
            );

            // Scroll horizontally to the right
            await driver.executeScript(
                "arguments[0].scrollLeft = arguments[0].scrollWidth",
                tableElement
            );

            // Wait for the table to load or for a specific delay (adjust as needed)
            await driver.sleep(2000);
            const cellClassName = "InovuaReactDataGrid__cell";
            const timeout = 4000;

            const initialCellCount = (
                await driver.findElements(By.className(cellClassName))
            ).length;

            // Scroll vertically to the bottom
            await driver.executeScript(
                "arguments[0].scrollTop = 550",
                tableElement
            );

            // Scroll horizontally to the right
            await driver.executeScript(
                "arguments[0].scrollLeft = arguments[0].scrollWidth",
                tableElement
            );

            let currentCellCount = 0;
            let elapsedTime = 0;

            while (
                currentCellCount < initialCellCount ||
                elapsedTime < timeout
            ) {
                await driver.sleep(1000); // Wait for elements to load after scrolling

                const cellItems = await driver.findElements(
                    By.className(cellClassName)
                );
                currentCellCount = cellItems.length;

                // Scroll vertically to the bottom if there are still unloaded elements
                if (currentCellCount < initialCellCount) {
                    await driver.executeScript(
                        "arguments[0].scrollTop = 550",
                        tableElement
                    );
                }

                elapsedTime += 1000;
            }

            const cellItems = await driver.findElements(
                By.className(cellClassName)
            );

            // Process the captured elements as needed
            let dis = [],
                reasons = [],
                cal = [],
                ReceiverState = [],
                transit = [];
            for (const cell of cellItems) {
                const dataPropsId = await cell.getAttribute(
                    "data-state-props-id"
                );

                if (
                    dataPropsId === "DispatchDate" ||
                    dataPropsId.includes("DispatchDate")
                ) {
                    dis.push(await cell.getText());
                }

                if (
                    dataPropsId === "TransitDays" ||
                    dataPropsId.includes("TransitDays")
                ) {
                    transit.push(await cell.getText());
                }

                if (
                    dataPropsId === "CalculatedDelDate" ||
                    dataPropsId.includes("CalculatedDelDate")
                ) {
                    cal.push(await cell.getText());
                }

                if (
                    dataPropsId === "ReceiverState" ||
                    dataPropsId.includes("ReceiverState")
                ) {
                    ReceiverState.push(await cell.getText());
                }

                if (
                    dataPropsId === "ReasonId" ||
                    dataPropsId.includes("ReasonId")
                ) {
                    reasons.push(await cell.getText());
                }
            }

            for (let i = 0; i < dis.length; i++) {
                let dateString = await dis[i];
                let dateParts = dateString.split("-"); // Split the string into day, month, and year

                let day = parseInt(dateParts[0]);
                let month = parseInt(dateParts[1]) - 1; // Subtract 1 from the month since JavaScript months are zero-based
                let year = parseInt(dateParts[2]);

                let disDate = new Date(year, month, day);

                let dateStringC = await cal[i];
                let datePartsC = dateStringC.split("-"); // Split the string into day, month, and year

                let dayC = parseInt(datePartsC[0]);
                let monthC = parseInt(datePartsC[1]) - 1; // Subtract 1 from the month since JavaScript months are zero-based
                let yearC = parseInt(datePartsC[2]);

                let calDate = new Date(yearC, monthC, dayC);
                
                let reas = await reasons[i], trans = await transit[i];

                if (trans.trim().length > 0) {
                    switch (trans) {
                        case '0':
                            if (disDate.toLocaleDateString() !== calDate.toLocaleDateString()) {
                                if (!reas.trim().length > 0) {
                                    console.log(
                                        `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                    );
                                }
                            }
                            break;
                        case '1':
                            const nextDayCalDate = new Date(disDate);
                            nextDayCalDate.setDate(
                                nextDayCalDate.getDate() + 1
                            );
                            if(nextDayCalDate.getDay() === 0){ // is a Sunday
                                nextDayCalDate.setDate(
                                    nextDayCalDate.getDate() + 1
                                );
                                if (
                                    nextDayCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                ) {
                                    if (!reas.trim().length > 0) {
                                        console.log(
                                            `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                        );
                                    }
                                } 
                            } else if(nextDayCalDate.getDay() === 6) // is a Saturday
                                {
                                    nextDayCalDate.setDate(
                                        nextDayCalDate.getDate() + 2
                                    );
                                    if (
                                        nextDayCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                } else if(holidays.find((holiday)=> ReceiverState[i] == holiday.HolidayState && calDate == holiday.HolidayDate)){
                                    nextDayCalDate.setDate(
                                        nextDayCalDate.getDate() + 1
                                    );
                                    if (
                                        nextDayCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }
                                else{

                                    if (
                                        nextDayCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }
                            break;
                        case '2':
                            const twoDaysLaterCalDate = new Date(disDate);
                            twoDaysLaterCalDate.setDate(
                                twoDaysLaterCalDate.getDate() + 2
                            );

                            if(twoDaysLaterCalDate.getDay() === 0){ // is a Sunday
                                twoDaysLaterCalDate.setDate(
                                    twoDaysLaterCalDate.getDate() + 1
                                );
                                if (
                                    twoDaysLaterCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                ) {
                                    if (!reas.trim().length > 0) {
                                        console.log(
                                            `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                        );
                                    }
                                } 
                            } else if(twoDaysLaterCalDate.getDay() === 6) // is a Saturday
                                {
                                    twoDaysLaterCalDate.setDate(
                                        twoDaysLaterCalDate.getDate() + 2
                                    );
                                    if (
                                        twoDaysLaterCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }
                                else if(holidays.find((holiday)=> ReceiverState[i] == holiday.HolidayState && calDate == holiday.HolidayDate)){
                                    nextDayCalDate.setDate(
                                        nextDayCalDate.getDate() + 1
                                    );
                                    if (
                                        nextDayCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }               
                                else{
                                    if (
                                        twoDaysLaterCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }
                            break;
                            case '3':
                                const threeDaysLaterCalDate = new Date(disDate);
                                threeDaysLaterCalDate.setDate(
                                threeDaysLaterCalDate.getDate() + 3
                            );
    
                            if(threeDaysLaterCalDate.getDay() === 0){ // is a Sunday
                                threeDaysLaterCalDate.setDate(
                                    threeDaysLaterCalDate.getDate() + 1
                                );
                                if (
                                    threeDaysLaterCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                ) {
                                    if (!reas.trim().length > 0) {
                                        console.log(
                                            `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                        );
                                    }
                                } 
                            } else if(threeDaysLaterCalDate.getDay() === 6) // is a Saturday
                                {
                                    threeDaysLaterCalDate.setDate(
                                        threeDaysLaterCalDate.getDate() + 2
                                    );
                                    if (
                                        threeDaysLaterCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }
                                else if(holidays.find((holiday)=> ReceiverState[i] == holiday.HolidayState && calDate == holiday.HolidayDate)){
                                    nextDayCalDate.setDate(
                                        nextDayCalDate.getDate() + 1
                                    );
                                    if (
                                        nextDayCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }
                                else{
                                    if (
                                        threeDaysLaterCalDate.toLocaleDateString() !== new Date(calDate).toLocaleDateString()
                                    ) {
                                        if (!reas.trim().length > 0) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.toLocaleDateString()} with transit ${trans} and calculated ${calDate.toLocaleDateString()}`
                                            );
                                        }
                                    }
                                }
                            break;

                        default:
                            break;
                    }
                }
            }

            
        } catch (err) {
            assert.ok(false, err);
        }
    });*/

    ///////////////// Freight People Test Case ///////////////////

    it("Test transit days for Freight People First Batch", async function () {
        try {
            let holidays = [];
            try {
                axios
                    .get(
                        `https://gtlslebs06-vm.gtls.com.au:8084/api/GTRS/Holidays`,
                        {
                            headers: {
                                RoleId: 1,
                            },
                        }
                    )
                    .then((res) => {
                        holidays = res.data;
                        // Handle errors or proceed with parsing data
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            } catch (error) {
                console.error("Error fetching data:", error);
            }

            let KPIBtn = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
                    )
                )
            );
            await driver.wait(until.elementIsEnabled(KPIBtn));
            await KPIBtn.click();

            let KPIReportBtn = await driver.wait(
                until.elementLocated(By.id("KPI Report "))
            );
            await driver.sleep(100);
            await driver.wait(until.elementIsEnabled(KPIReportBtn));
            await KPIReportBtn.click();

            await driver.sleep(400);
            let customerNameInput = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/input'
                    )
                )
            );

            await customerNameInput.sendKeys("Freight People");
            await driver.sleep(3000);
            const tableElement = await driver.findElement(
                By.className("InovuaReactDataGrid__body")
            );

            // Scroll vertically to the bottom
            // await driver.executeScript(
            //     "arguments[0].scrollTop = arguments[0].scrollHeight",
            //     tableElement
            // );

            // // Scroll horizontally to the right
            // await driver.executeScript(
            //     "arguments[0].scrollLeft = arguments[0].scrollWidth",
            //     tableElement
            // );

            // Wait for the table to load or for a specific delay (adjust as needed)
            await driver.sleep(1000);
            const cellClassName = "InovuaReactDataGrid__cell";
            const timeout = 4000;

            const initialCellCount = (
                await driver.findElements(By.className(cellClassName))
            ).length;

            // Scroll vertically to the bottom
            await driver.executeScript(
                "arguments[0].scrollTop = 550",
                tableElement
            );
            
            await driver.sleep(2000);
            const FirstItems = await driver.findElements(
                By.className(cellClassName)
            );

            // Process the captured elements as needed
            let conNbr = [];
            for (const cell of FirstItems) {
                const dataPropsId = await cell.getAttribute(
                    "data-state-props-id"
                );
                if (
                    dataPropsId == "ConsignmentNo" ||
                    dataPropsId.includes("ConsignmentNo")
                ) {
                    conNbr.push(await cell.getText());
                }
            }
            await driver.sleep(2000);

            // Scroll horizontally to the right
            await driver.executeScript(
                "arguments[0].scrollLeft = arguments[0].scrollWidth",
                tableElement
            );

            let currentCellCount = 0;
            let elapsedTime = 0;

            while (
                currentCellCount < initialCellCount ||
                elapsedTime < timeout
            ) {
                await driver.sleep(1000); // Wait for elements to load after scrolling

                const cellItems = await driver.findElements(
                    By.className(cellClassName)
                );
                currentCellCount = cellItems.length;

                // Scroll vertically to the bottom if there are still unloaded elements
                if (currentCellCount < initialCellCount) {
                    await driver.executeScript(
                        "arguments[0].scrollTop = 550",
                        tableElement
                    );
                }

                elapsedTime += 1000;
            }

            const cellItems = await driver.findElements(
                By.className(cellClassName)
            );

            // Process the captured elements as needed
            let dis = [],
                reasons = [],
                cal = [],
                ReceiverState = [],
                transit = [];
            for (const cell of cellItems) {
                const dataPropsId = await cell.getAttribute(
                    "data-state-props-id"
                );

                if (
                    dataPropsId === "DispatchDate" ||
                    dataPropsId.includes("DispatchDate")
                ) {
                    dis.push(await cell.getText());
                }

                if (
                    dataPropsId === "TransitDays" ||
                    dataPropsId.includes("TransitDays")
                ) {
                    transit.push(await cell.getText());
                }

                if (
                    dataPropsId === "CalculatedDelDate" ||
                    dataPropsId.includes("CalculatedDelDate")
                ) {
                    cal.push(await cell.getText());
                }

                if (
                    dataPropsId === "ReceiverState" ||
                    dataPropsId.includes("ReceiverState")
                ) {
                    ReceiverState.push(await cell.getText());
                }

                if (
                    dataPropsId === "ReasonId" ||
                    dataPropsId.includes("ReasonId")
                ) {
                    reasons.push(await cell.getText());
                }
            }

            for (let i = 0; i < dis.length; i++) {
                let dateString = await dis[i];
                let dateParts = dateString.split("-"); // Split the string into day, month, and year

                let day = parseInt(dateParts[0]);
                let month = parseInt(dateParts[1]) - 1; // Subtract 1 from the month since JavaScript months are zero-based
                let year = parseInt(dateParts[2]);

                let disDate = moment([year, month, day, 0, 0, 0]);

                let dateStringC = await cal[i];
                let datePartsC = dateStringC.split("-"); // Split the string into day, month, and year

                let dayC = parseInt(datePartsC[0]);
                let monthC = parseInt(datePartsC[1]) - 1; // Subtract 1 from the month since JavaScript months are zero-based
                let yearC = parseInt(datePartsC[2]);

                let calDate = moment([yearC, monthC, dayC, 0, 0, 0]);

                let reas = await reasons[i],
                    trans = await transit[i],
                    receiver = ReceiverState[i],
                    cons = conNbr[i];

                if (trans.trim().length > 0) {
                    switch (receiver) {
                        case "SA": /// same day delivery
                            if (
                                !disDate.isSame(calDate, 'day')
                            ) {
                                if (!reas.trim().length > 0) {
                                    const holiday = holidays.find(
                                        (holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                threeDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                holidayDate.isSame(
                                                    disDate.format(
                                                        "YYYY-MM-DD"
                                                    )
                                                )
                                            );
                                        }
                                    );
                                    if (holiday) {
                                        threeDaysLaterCalDate =
                                        threeDaysLaterCalDate.add(
                                                1,
                                                "days"
                                            );
                                        if (
                                            !moment(
                                                threeDaysLaterCalDate
                                            ).isSame(calDate)
                                        ) {
                                            // console.log(
                                            //     `Inaccurate calculated date for date ${disDate.format(
                                            //         "YYYY-MM-DD"
                                            //     )} to state NSW and calculated ${calDate.format(
                                            //         "YYYY-MM-DD"
                                            //     )} for consignment ${cons} even with holiday`
                                            // );
                                        }
                                    }
                                }
                            }
                            break;
                        case "ACT": /// same day delivery
                            if (
                                !disDate.isSame(calDate, 'day')
                            ) {
                                if (!reas.trim().length > 0) {
                                    const holiday = holidays.find(
                                        (holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                threeDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                holidayDate.isSame(
                                                    disDate.format(
                                                        "YYYY-MM-DD"
                                                    )
                                                )
                                            );
                                        }
                                    );
                                    if (holiday) {
                                        threeDaysLaterCalDate =
                                        threeDaysLaterCalDate.add(
                                                1,
                                                "days"
                                            );
                                        if (
                                            !moment(
                                                threeDaysLaterCalDate
                                            ).isSame(calDate)
                                        ) {
                                            // console.log(
                                            //     `Inaccurate calculated date for date ${disDate.format(
                                            //         "YYYY-MM-DD"
                                            //     )} to state NSW and calculated ${calDate.format(
                                            //         "YYYY-MM-DD"
                                            //     )} for consignment ${cons} even with holiday`
                                            // );
                                        }
                                    }
                                }
                            }
                            break;
                        case "QLD": /// same day delivery
                            if (
                                !disDate.isSame(calDate, 'day')
                            ) {
                                if (!reas.trim().length > 0) {
                                    const holiday = holidays.find(
                                        (holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                threeDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                holidayDate.isSame(
                                                    disDate.format(
                                                        "YYYY-MM-DD"
                                                    )
                                                )
                                            );
                                        }
                                    );
                                    if (holiday) {
                                        threeDaysLaterCalDate =
                                        threeDaysLaterCalDate.add(
                                                1,
                                                "days"
                                            );
                                        if (
                                            !moment(
                                                threeDaysLaterCalDate
                                            ).isSame(calDate)
                                        ) {
                                            // console.log(
                                            //     `Inaccurate calculated date for date ${disDate.format(
                                            //         "YYYY-MM-DD"
                                            //     )} to state NSW and calculated ${calDate.format(
                                            //         "YYYY-MM-DD"
                                            //     )} for consignment ${cons} even with holiday`
                                            // );
                                        }
                                    }
                                }
                            }
                            break;
                        case "NSW": // 2 days later delivery
                            let twoDaysLaterCalDate = moment(disDate).add(2, 'days');

                            if (disDate.day() === 5) {

                                // is a Friday
                                twoDaysLaterCalDate = twoDaysLaterCalDate.add(3, 'days');

                                if (
                                    !twoDaysLaterCalDate.isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    twoDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        twoDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            twoDaysLaterCalDate =
                                            twoDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    twoDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                // console.log(
                                                //     `Inaccurate calculated date for date ${disDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} to state NSW and calculated ${calDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} for consignment ${cons} even with holiday`
                                                // );
                                            }
                                        }
                                    }
                                }
                            } else if (twoDaysLaterCalDate.day() === 0) {
                                // is a Sunday
                                twoDaysLaterCalDate = twoDaysLaterCalDate.add(1, 'days');
                                if (
                                    !twoDaysLaterCalDate.isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    twoDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        twoDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            twoDaysLaterCalDate =
                                            twoDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    twoDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                // console.log(
                                                //     `Inaccurate calculated date for date ${disDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} to state NSW and calculated ${calDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} for consignment ${cons} even with holiday`
                                                // );
                                            }
                                        }
                                    }
                                }
                            } else if (twoDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                twoDaysLaterCalDate = twoDaysLaterCalDate.add(2, 'days');
                                if (
                                    !moment(twoDaysLaterCalDate).isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    twoDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        twoDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            twoDaysLaterCalDate =
                                            twoDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    twoDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                // console.log(
                                                //     `Inaccurate calculated date for date ${disDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} to state NSW and calculated ${calDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} for consignment ${cons} even with holiday`
                                                // );
                                            }
                                        }
                                    }
                                }
                            }

                            break;
                        case "VIC": /// 3 days later delivery
                            let threeDaysLaterCalDate = moment(disDate).add(3, 'days');
                            
                            if (disDate.day() === 5) {
                                // is a Friday

                                threeDaysLaterCalDate = threeDaysLaterCalDate.add(3, 'days');
                                if (
                                    !threeDaysLaterCalDate.isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    threeDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        threeDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            threeDaysLaterCalDate =
                                            threeDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    threeDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                // console.log(
                                                //     `Inaccurate calculated date for date ${disDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} to state NSW and calculated ${calDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} for consignment ${cons} even with holiday`
                                                // );
                                            }
                                        }
                                    }
                                }
                            } else if (threeDaysLaterCalDate.day() === 0) {
                                // is a Sunday
                                threeDaysLaterCalDate = threeDaysLaterCalDate.add(1, 'days');
                                if (
                                    !threeDaysLaterCalDate.isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    threeDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        threeDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            threeDaysLaterCalDate =
                                            threeDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    threeDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                // console.log(
                                                //     `Inaccurate calculated date for date ${disDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} to state NSW and calculated ${calDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} for consignment ${cons} even with holiday`
                                                // );
                                            }
                                        }
                                    }
                                }
                            } else if (threeDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                threeDaysLaterCalDate = threeDaysLaterCalDate.add(2, 'days');
                                if (
                                    !threeDaysLaterCalDate.isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    threeDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        threeDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            threeDaysLaterCalDate =
                                            threeDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    threeDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                // console.log(
                                                //     `Inaccurate calculated date for date ${disDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} to state NSW and calculated ${calDate.format(
                                                //         "YYYY-MM-DD"
                                                //     )} for consignment ${cons} even with holiday`
                                                // );
                                            }
                                        }
                                    }
                                }

                            }

                            break;

                        default:
                            break;
                    }
                }
            }
        } catch (err) {
            assert.ok(false, err);
        }
    });

    /*it("Test transit days for Unilever First Batch", async function () {
        try {
            let holidays = [];
            try {
                axios
                    .get(
                        `https://gtlslebs06-vm.gtls.com.au:8084/api/GTRS/Holidays`,
                        {
                            headers: {
                                RoleId: 1,
                            },
                        }
                    )
                    .then((res) => {
                        holidays = res.data;
                        // Handle errors or proceed with parsing data
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            } catch (error) {
                console.error("Error fetching data:", error);
            }

            let KPIBtn = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        "/html/body/div[1]/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div/div[2]/nav/div[3]/div/button"
                    )
                )
            );
            await driver.wait(until.elementIsEnabled(KPIBtn));
            await KPIBtn.click();

            let KPIReportBtn = await driver.wait(
                until.elementLocated(By.id("KPI Report "))
            );
            await driver.sleep(100);
            await driver.wait(until.elementIsEnabled(KPIReportBtn));
            await KPIReportBtn.click();

            await driver.sleep(400);
            let customerNameInput = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        '//*[@id="app"]/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[3]/div[1]/input'
                    )
                )
            );

            await customerNameInput.sendKeys("unilever");
            await driver.sleep(3000);
            const tableElement = await driver.findElement(
                By.className("InovuaReactDataGrid__body")
            );

            // Wait for the table to load or for a specific delay (adjust as needed)
            await driver.sleep(1000);
            const cellClassName = "InovuaReactDataGrid__cell";
            const timeout = 4000;

            const initialCellCount = (
                await driver.findElements(By.className(cellClassName))
            ).length;

            // Scroll vertically to the bottom
            await driver.executeScript(
                "arguments[0].scrollTop = 550",
                tableElement
            );

            await driver.sleep(2000);
            const FirstItems = await driver.findElements(
                By.className(cellClassName)
            );

            // Process the captured elements as needed
            let conNbr = [],
                SenderState = [];
            for (const cell of FirstItems) {
                const dataPropsId = await cell.getAttribute(
                    "data-state-props-id"
                );
                if (
                    dataPropsId === "ConsignmentNo" ||
                    dataPropsId.includes("ConsignmentNo")
                ) {
                    conNbr.push(await cell.getText());
                }

                if (
                    dataPropsId === "SenderState" ||
                    dataPropsId.includes("SenderState")
                ) {
                    SenderState.push(await cell.getText());
                }
            }
            await driver.sleep(2000);

            // Scroll horizontally to the right
            await driver.executeScript(
                "arguments[0].scrollLeft = arguments[0].scrollWidth",
                tableElement
            );

            let currentCellCount = 0;
            let elapsedTime = 0;

            while (
                currentCellCount < initialCellCount ||
                elapsedTime < timeout
            ) {
                await driver.sleep(1000); // Wait for elements to load after scrolling

                const cellItems = await driver.findElements(
                    By.className(cellClassName)
                );
                currentCellCount = cellItems.length;

                // Scroll vertically to the bottom if there are still unloaded elements
                if (currentCellCount < initialCellCount) {
                    await driver.executeScript(
                        "arguments[0].scrollTop = 550",
                        tableElement
                    );
                }

                elapsedTime += 1000;
            }

            const cellItems = await driver.findElements(
                By.className(cellClassName)
            );

            // Process the captured elements as needed
            let dis = [],
                reasons = [],
                cal = [],
                ReceiverState = [],
                transit = [];
            for (const cell of cellItems) {
                const dataPropsId = await cell.getAttribute(
                    "data-state-props-id"
                );

                if (
                    dataPropsId === "DispatchDate" ||
                    dataPropsId.includes("DispatchDate")
                ) {
                    dis.push(await cell.getText());
                }

                if (
                    dataPropsId === "TransitDays" ||
                    dataPropsId.includes("TransitDays")
                ) {
                    transit.push(await cell.getText());
                }

                if (
                    dataPropsId === "CalculatedDelDate" ||
                    dataPropsId.includes("CalculatedDelDate")
                ) {
                    cal.push(await cell.getText());
                }

                if (
                    dataPropsId === "ReceiverState" ||
                    dataPropsId.includes("ReceiverState")
                ) {
                    ReceiverState.push(await cell.getText());
                }

                if (
                    dataPropsId === "ReasonId" ||
                    dataPropsId.includes("ReasonId")
                ) {
                    reasons.push(await cell.getText());
                }
            }

            for (let i = 0; i < dis.length; i++) {
                let dateString = await dis[i];
                let dateParts = dateString.split("-"); // Split the string into day, month, and year

                let day = parseInt(dateParts[0]);
                let month = parseInt(dateParts[1]) - 1; // Subtract 1 from the month since JavaScript months are zero-based
                let year = parseInt(dateParts[2]);

                let disDate = moment([year, month, day, 0, 0, 0]);

                let dateStringC = await cal[i];
                let datePartsC = dateStringC.split("-"); // Split the string into day, month, and year

                let dayC = parseInt(datePartsC[0]);
                let monthC = parseInt(datePartsC[1]) - 1; // Subtract 1 from the month since JavaScript months are zero-based
                let yearC = parseInt(datePartsC[2]);

                let calDate = moment([yearC, monthC, dayC, 0, 0, 0]);

                let reas = await reasons[i],
                    trans = await transit[i],
                    receiver = ReceiverState[i],
                    sender = SenderState[i],
                    cons = conNbr[i];

                if (trans.trim().length > 0) {
                    switch (trans) {
                        case "1": /// same day delivery
                            if (!disDate.isSame(calDate, "day")) {
                                if (!reas.trim().length > 0) {
                                    const holiday = holidays.find(
                                        (holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                threeDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                holidayDate.isBetween(
                                                    disDate.format(
                                                        "YYYY-MM-DD"
                                                    ),
                                                    threeDaysLaterCalDate.format(
                                                        "YYYY-MM-DD"
                                                    )
                                                )
                                            );
                                        }
                                    );
                                    if (holiday) {
                                        threeDaysLaterCalDate =
                                        threeDaysLaterCalDate.add(
                                                1,
                                                "days"
                                            );
                                        if (
                                            !moment(
                                                threeDaysLaterCalDate
                                            ).isSame(calDate)
                                        ) {
                                            console.log(
                                                `Inaccurate calculated date for date ${disDate.format(
                                                    "YYYY-MM-DD"
                                                )} to state NSW and calculated ${calDate.format(
                                                    "YYYY-MM-DD"
                                                )} for consignment ${cons} even with holiday`
                                            );
                                        }
                                    }
                                }
                            }
                            break;

                        case "2": // 1 day later delivery
                            let oneDayLaterCalDate = moment(disDate).add(
                                1,
                                "days"
                            );

                            // if(receiver === sender){
                            //         oneDayLaterCalDate = moment(disDate);
                            //     }else{

                            //     }

                            if (disDate.day() === 5) {
                                // is a Friday
                                oneDayLaterCalDate = oneDayLaterCalDate.add(
                                    3,
                                    "days"
                                );

                                if (!oneDayLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    oneDayLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        oneDayLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            oneDayLaterCalDate =
                                            oneDayLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    oneDayLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (oneDayLaterCalDate.day() === 0) {
                                // is a Sunday
                                oneDayLaterCalDate = oneDayLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (!oneDayLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    oneDayLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        oneDayLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            oneDayLaterCalDate =
                                            oneDayLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    oneDayLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (oneDayLaterCalDate.day() === 6) {
                                // is a Saturday
                                oneDayLaterCalDate = oneDayLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (
                                    !moment(oneDayLaterCalDate).isSame(calDate)
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    oneDayLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        oneDayLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            oneDayLaterCalDate =
                                            oneDayLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    oneDayLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            break;

                        case "3": // 2 days later delivery
                            let twoDaysLaterCalDate = moment(disDate).add(
                                2,
                                "days"
                            );

                            if (disDate.day() === 5) {
                                // is a Friday
                                twoDaysLaterCalDate = twoDaysLaterCalDate.add(
                                    3,
                                    "days"
                                );

                                if (!twoDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    twoDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        twoDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            twoDaysLaterCalDate =
                                            twoDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    twoDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (twoDaysLaterCalDate.day() === 0) {
                                // is a Sunday
                                twoDaysLaterCalDate = twoDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (!twoDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    twoDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        twoDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            twoDaysLaterCalDate =
                                            twoDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    twoDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (twoDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                twoDaysLaterCalDate = twoDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (
                                    !moment(twoDaysLaterCalDate).isSame(calDate)
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    twoDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        twoDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            twoDaysLaterCalDate =
                                            twoDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    twoDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            break;

                        case "4": // 3 days later delivery
                            let threeDaysLaterCalDate = moment(disDate).add(
                                3,
                                "days"
                            );

                            if (disDate.day() === 5) {
                                // is a Friday
                                threeDaysLaterCalDate =
                                    threeDaysLaterCalDate.add(3, "days");

                                if (!threeDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    threeDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        threeDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            threeDaysLaterCalDate =
                                            threeDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    threeDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (threeDaysLaterCalDate.day() === 0) {
                                // is a Sunday
                                threeDaysLaterCalDate =
                                    threeDaysLaterCalDate.add(2, "days");
                                if (!threeDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    threeDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        threeDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            threeDaysLaterCalDate =
                                            threeDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    threeDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (threeDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                threeDaysLaterCalDate =
                                    threeDaysLaterCalDate.add(2, "days");
                                if (
                                    !moment(threeDaysLaterCalDate).isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    threeDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        threeDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            threeDaysLaterCalDate =
                                            threeDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    threeDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            break;

                        case "5": // 4 days later delivery
                            let fourDaysLaterCalDate = moment(disDate).add(
                                4,
                                "days"
                            );

                            if (disDate.day() === 5) {
                                // is a Friday
                                fourDaysLaterCalDate = fourDaysLaterCalDate.add(
                                    3,
                                    "days"
                                );

                                if (!fourDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fourDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fourDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fourDaysLaterCalDate =
                                                fourDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fourDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (disDate.day() === 4) {
                                // is a Thursday

                                fourDaysLaterCalDate = fourDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );

                                if (!fourDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fourDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fourDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fourDaysLaterCalDate =
                                                fourDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fourDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (fourDaysLaterCalDate.day() === 0) {
                                // is a Sunday
                                fourDaysLaterCalDate = fourDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (!fourDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fourDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fourDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fourDaysLaterCalDate =
                                                fourDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fourDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (fourDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                fourDaysLaterCalDate = fourDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (
                                    !moment(fourDaysLaterCalDate).isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fourDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fourDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fourDaysLaterCalDate =
                                                fourDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fourDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            break;

                        case "6": // 5 days later delivery
                            let fiveDaysLaterCalDate = moment(disDate).add(
                                5,
                                "days"
                            );

                            if (disDate.day() === 5) {
                                // is a Friday
                                fiveDaysLaterCalDate = fiveDaysLaterCalDate.add(
                                    3,
                                    "days"
                                );

                                if (!fiveDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fiveDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fiveDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fiveDaysLaterCalDate =
                                                fiveDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fiveDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (
                                disDate.day() === 3 ||
                                disDate.day() === 4
                            ) {
                                // is a Wednesday or Thursday
                                fiveDaysLaterCalDate = fiveDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );

                                if (!fiveDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fiveDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fiveDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fiveDaysLaterCalDate =
                                                fiveDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fiveDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (fiveDaysLaterCalDate.day() === 0) {
                                // is a Sunday

                                fiveDaysLaterCalDate = fiveDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (!fiveDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fiveDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fiveDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fiveDaysLaterCalDate =
                                                fiveDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fiveDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (fiveDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                fiveDaysLaterCalDate = fiveDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (
                                    !moment(fiveDaysLaterCalDate).isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    fiveDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        fiveDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            fiveDaysLaterCalDate =
                                                fiveDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    fiveDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            break;

                        case "7": // 6 days later delivery
                            let sixDaysLaterCalDate = moment(disDate).add(
                                6,
                                "days"
                            );

                            if (disDate.day() === 5) {
                                // is a Friday
                                sixDaysLaterCalDate = sixDaysLaterCalDate.add(
                                    3,
                                    "days"
                                );

                                if (!sixDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    sixDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        sixDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            sixDaysLaterCalDate =
                                                sixDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    sixDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (
                                disDate.day() === 2 ||
                                disDate.day() === 3 ||
                                disDate.day() === 4
                            ) {
                                // is a Tuesday or Wednesday or Thursday
                                sixDaysLaterCalDate = sixDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );

                                if (!sixDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    sixDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        sixDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            sixDaysLaterCalDate =
                                                sixDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    sixDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (sixDaysLaterCalDate.day() === 0) {
                                // is a Sunday
                                sixDaysLaterCalDate = sixDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (!sixDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    sixDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        sixDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            sixDaysLaterCalDate =
                                                sixDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    sixDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            } else if (sixDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                sixDaysLaterCalDate = sixDaysLaterCalDate.add(
                                    2,
                                    "days"
                                );
                                if (
                                    !moment(sixDaysLaterCalDate).isSame(calDate)
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find(
                                            (holiday) => {
                                                const holidayDate = moment(
                                                    holiday.HolidayDate,
                                                    "YYYY-MM-DD"
                                                );
                                                const twoDaysLaterM = moment(
                                                    sixDaysLaterCalDate,
                                                    "YYYY-MM-DD"
                                                );
                                                
                                                return (
                                                    ReceiverState[i] ===
                                                        holiday.HolidayState &&
                                                    holidayDate.isBetween(
                                                        disDate.format(
                                                            "YYYY-MM-DD"
                                                        ),
                                                        sixDaysLaterCalDate.format(
                                                            "YYYY-MM-DD"
                                                        )
                                                    )
                                                );
                                            }
                                        );
                                        if (holiday) {
                                            sixDaysLaterCalDate =
                                                sixDaysLaterCalDate.add(
                                                    1,
                                                    "days"
                                                );
                                            if (
                                                !moment(
                                                    sixDaysLaterCalDate
                                                ).isSame(calDate)
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format(
                                                        "YYYY-MM-DD"
                                                    )} to state NSW and calculated ${calDate.format(
                                                        "YYYY-MM-DD"
                                                    )} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            break;

                        case "8": // 7 days later delivery
                            let sevenDaysLaterCalDate = moment(disDate).add(
                                7,
                                "days"
                            );

                            if (disDate.day() === 5) {
                                // is a Friday
                                sevenDaysLaterCalDate =
                                    sevenDaysLaterCalDate.add(3, "days");

                                if (!sevenDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find((holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                sevenDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            console.log(holiday.HolidayState, ReceiverState[i])
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                    holidayDate.isBetween(disDate.format('YYYY-MM-DD'), sevenDaysLaterCalDate.format('YYYY-MM-DD'))
                                            );
                                        });
                                        if (holiday) {
                                            sevenDaysLaterCalDate = sevenDaysLaterCalDate.add(1, 'days');
                                            if (
                                                !moment(sevenDaysLaterCalDate).isSame(
                                                    calDate
                                                )
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format('YYYY-MM-DD')} to state NSW and calculated ${calDate.format('YYYY-MM-DD')} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }  
                                }
                                }
                            } else if (
                                disDate.day() === 1 ||
                                disDate.day() === 2 ||
                                disDate.day() === 3 ||
                                disDate.day() === 4
                            ) {
                                // is a Monday or Tuesday or Wednesday or Thursday
                                sevenDaysLaterCalDate =
                                    sevenDaysLaterCalDate.add(2, "days");

                                if (!sevenDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find((holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                sevenDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            console.log(holiday.HolidayState, ReceiverState[i])
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                    holidayDate.isBetween(disDate.format('YYYY-MM-DD'), sevenDaysLaterCalDate.format('YYYY-MM-DD'))
                                            );
                                        });
                                        if (holiday) {
                                            sevenDaysLaterCalDate = sevenDaysLaterCalDate.add(1, 'days');
                                            if (
                                                !moment(sevenDaysLaterCalDate).isSame(
                                                    calDate
                                                )
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format('YYYY-MM-DD')} to state NSW and calculated ${calDate.format('YYYY-MM-DD')} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }  
                                }
                                }
                            } else if (sevenDaysLaterCalDate.day() === 0) {
                                // is a Sunday
                                sevenDaysLaterCalDate =
                                    sevenDaysLaterCalDate.add(2, "days");
                                if (!sevenDaysLaterCalDate.isSame(calDate)) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find((holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                sevenDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            console.log(holiday.HolidayState, ReceiverState[i])
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                    holidayDate.isBetween(disDate.format('YYYY-MM-DD'), sevenDaysLaterCalDate.format('YYYY-MM-DD'))
                                            );
                                        });
                                        if (holiday) {
                                            sevenDaysLaterCalDate = sevenDaysLaterCalDate.add(1, 'days');
                                            if (
                                                !moment(sevenDaysLaterCalDate).isSame(
                                                    calDate
                                                )
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format('YYYY-MM-DD')} to state NSW and calculated ${calDate.format('YYYY-MM-DD')} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }  
                                }
                                }
                            } else if (sevenDaysLaterCalDate.day() === 6) {
                                // is a Saturday
                                sevenDaysLaterCalDate =
                                    sevenDaysLaterCalDate.add(2, "days");
                                if (
                                    !moment(sevenDaysLaterCalDate).isSame(
                                        calDate
                                    )
                                ) {
                                    if (!reas.trim().length > 0) {
                                        const holiday = holidays.find((holiday) => {
                                            const holidayDate = moment(
                                                holiday.HolidayDate,
                                                "YYYY-MM-DD"
                                            );
                                            const twoDaysLaterM = moment(
                                                sevenDaysLaterCalDate,
                                                "YYYY-MM-DD"
                                            );
                                            console.log(holiday.HolidayState, ReceiverState[i])
                                            return (
                                                ReceiverState[i] ===
                                                    holiday.HolidayState &&
                                                    holidayDate.isBetween(disDate.format('YYYY-MM-DD'), sevenDaysLaterCalDate.format('YYYY-MM-DD'))
                                            );
                                        });
                                        if (holiday) {
                                            sevenDaysLaterCalDate = sevenDaysLaterCalDate.add(1, 'days');
                                            if (
                                                !moment(sevenDaysLaterCalDate).isSame(
                                                    calDate
                                                )
                                            ) {
                                                console.log(
                                                    `Inaccurate calculated date for date ${disDate.format('YYYY-MM-DD')} to state NSW and calculated ${calDate.format('YYYY-MM-DD')} for consignment ${cons} even with holiday`
                                                );
                                            }
                                        }  
                                }
                                }
                            }

                            break;

                        default:
                            break;
                    }
                }
            }
        } catch (err) {
            assert.ok(false, err);
        }
    });*/
})