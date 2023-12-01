const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");
const axios = require("axios");
let driver;

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

    await driver.get("http://127.0.0.1:8000/main");
    await driver.manage().addCookie({
        name: "gtls_session",
        value: "eyJpdiI6IitpaVZ6ZkNieEp3YTVjbjkzN0VKWVE9PSIsInZhbHVlIjoiSUgydWFPUy9BT1ZJU1A0d3p6ZFhyd29DWXNPNFdLaU1FU2xVcG9Ed3czQlVjRTR2SkJSaDVaRG52VnRVUk1jSFU4Y0IwQnY3SjA4aklQdFl5Q3lQRGhueUcvR1hjdzM3UmNRb3lLSVBzbFR4MmhVRFlrekFweDliRHRMdzIxOTYiLCJtYWMiOiIxNmVmNDRlMWZhMmYzMWQ4YjZiOTA4MjA4ZjM1NzljZTllMjJlZTI0NTAxYTIwMWRjYjY4NzQ1MTcyZDk1NmMxIiwidGFnIjoiIn0%3D",
    });
    await driver.get("http://127.0.0.1:8000/main");
});

describe("Testing User Permissions", function () {
    let permissions = [], editPerm=[], addPerm=[];
    it("fetch permissions and check view", async function () {
        const response = await axios
            .get(
                `https://gtlslebs06-vm.gtls.com.au:5432/api/GTAM/User/AppPermissions`,
                {
                    headers: {
                        UserId: 2,
                        AppId: 3,
                    },
                }
            )
            const user = response.data[0];
            const Pages = user.Pages;
            let PagesFromDb = [];let kpiPages = [];
              
            for (let i = 0; i < Pages?.length; i++) {
                    for (let j =0 ;j < Pages[i]?.Features?.length; j++) {
                        console.log(Pages[i].Features[j].FeatureName);
                        permissions.push(Pages[i].Features[j].FeatureName);
                    }
                    
                    if(Pages[i].hasOwnProperty('Features')){
                        if(Pages[i].PageName.includes('KPI') || Pages[i].PageName == 'Transit Days' || Pages[i].PageName == 'Holidays'){
                            kpiPages.push(Pages[i].PageName);
                        }else{
                            PagesFromDb.push(Pages[i].PageName);
                        }
                    }
                }

                for (let i = 0; i < PagesFromDb.length; i++) {
                    let ele;
                    try {
                      ele = await driver.wait(
                        until.elementLocated(By.id(PagesFromDb[i]))
                      );
                    } catch (error) {
                      // Handle the case when the element is not located
                      //console.log(PagesFromDb[i], 'not located');
                      const canView = permissions.includes(PagesFromDb[i]);
                  
                      if (!canView) {
                        assert.fail("Element not located");
                      }
                    }
                  }

                    let kpiReportDropdown = await driver.wait(
                        until.elementLocated(By.id("KPI Report"))
                    );
                    await kpiReportDropdown.click();
                    for(let i=0; i<kpiPages;i++){
                        let ele;
                    try {
                        ele = await driver.wait(
                            until.elementLocated(By.id(kpiPages[i]))
                        );
                        if (!ele) {
                            assert.fail("Element in kpi dropdown not located");
                        }
                    } catch (error) {
                        assert.fail("Element in kpi dropdown not located");
                    }
                        
                    }
                    

    });

    it("Check other permissions than view", async function () {
        let otherPerm = [];
        for (let i = 0; i < permissions.length; i++) {
            if(!permissions[i].includes('view')){
                otherPerm.push(permissions[i]);
            }
        }
        if(otherPerm.length > 0){
            for (let i = 0; i < permissions.length; i++) {
                if(permissions[i].includes('add')){
                    addPerm.push(permissions[i]);
                }else if(permissions[i].includes('edit')){
                    editPerm.push(permissions[i]);
                }
            }
        }
    })
});
