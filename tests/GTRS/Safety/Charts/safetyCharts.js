const { Builder, By, until, Key, actions } = require("selenium-webdriver");
const {
    login,
    navigateToPage,
    navigateToSafetyTab,
    areObjectsEqual,
} = require("../helper/helper");
const assert = require("assert");
const axios = require("axios");
const cookie = require("cookie-js");
const baseUrl = process.env.WEB_URL;
require("dotenv").config();

const {
    getCountByState,
    compareLabels,
    countSafetyTypesByMonth,
    countRecordsByMonth,
    countRecordsByStateAndType,
    countReportsBySafetyType,
    normalizeData,
} = require("../../../helper/safetyChartsHelper");
const moment = require("moment");
let driver;


before(async () => {
    // Initialize the WebDriver
    driver = await new Builder().forBrowser("chrome").build();
    await login(driver);

    //Navigate to safety charts page
    await navigateToPage(driver, "Safety");
    await driver.sleep(4000);

    await navigateToSafetyTab(driver, "Charts");
    await driver.sleep(2000);
});

after(async () => {
    // Quit the WebDriver after tests
    await driver.quit();
});

describe("Safety Charts Test", () => {
    it("reports by month data is correct", async () => {
        try {
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
            const expData = countRecordsByMonth(data);
            const actualData = {
                "04-01-2024": 2,
                "03-01-2024": 2,
                "06-01-2023": 332,
            };

            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("reports by state data is correct", async () => {
        try {
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
            const expData = getCountByState(data);
            const actualData = {
                NSW: 335,
                SA: 1,
            };
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("POD status by state data is correct", async () => {
        try {
            let data = [],
                safetyTypes = [];
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
            const safetyTypesResData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyTypes`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            safetyTypes = safetyTypesResData.data;
            const counter = countReportsBySafetyType(data);
            const expData = compareLabels(counter, safetyTypes);
            const actualData = [
                {
                    label: "Hazard",
                    value: 334,
                },
                {
                    label: "Vehicle Accident",
                    value: 1,
                },
                {
                    label: "Damage",
                    value: 1,
                },
            ];
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("reports by state & by type data is correct", async () => {
        try {
            let data = [], safetyTypes = [];
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

            const safetyTypesResData = await axios.get(
                `${process.env.GTRS_API_URL}SafetyTypes`,
                {
                    headers: {
                        Authorization: `Bearer ${authCookie.value}`,
                        UserId: process.env.USER_ID,
                    },
                }
            );

            safetyTypes = safetyTypesResData.data;
            const expData = countRecordsByStateAndType(data, safetyTypes);
            const actualData = [
                {
                    state: "NSW",
                    value: 333,
                    type: "Hazard",
                },
                {
                    state: "NSW",
                    value: 1,
                    type: "Vehicle Accident",
                },
                {
                    state: "NSW",
                    value: 1,
                    type: "Damage",
                },
                {
                    state: "SA",
                    value: 1,
                    type: "Hazard",
                },
            ];
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
    it("report type by month data is correct", async () => {
        try {
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
            let expData = countSafetyTypesByMonth(data);
            let actualData = {
                "04-01-2024": {
                    "2": 1,
                    "4": 1,
                },
                "03-01-2024": {
                    "2": 1,
                    "3": 1,
                },
                "06-01-2023": {
                    "2": 332,
                },
            };
            expData = normalizeData(expData);
            actualData = normalizeData(actualData);
            const differences = [];
            if (Array.isArray(expData)) {
                if (Array.isArray(actualData)) {
                    // Both are arrays, use forEach
                    expData.forEach((expItem, index) => {
                        const actualItem = actualData[index];
                        if (
                            expItem.label !== actualItem.label ||
                            expItem.value !== actualItem.value
                        ) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // expData is an array, actualData is an object
                    Object.keys(actualData).forEach((key) => {
                        const expItem = expData.find(
                            (item) => item.label === key
                        );
                        if (!expItem || expItem.value !== actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            } else {
                // expData is an object
                if (Array.isArray(actualData)) {
                    // expData is an object, actualData is an array
                    actualData.forEach((actualItem, index) => {
                        const expItem = expData[actualItem.label];
                        if (!expItem || expItem !== actualItem.value) {
                            differences.push(
                                `Mismatch at key ${actualItem.label}: ${JSON.stringify(
                                    expItem
                                )} vs ${JSON.stringify(actualItem)}`
                            );
                        }
                    });
                } else {
                    // Both are objects
                    Object.keys(expData).forEach((key) => {
                        if (expData[key] != actualData[key]) {
                            differences.push(
                                `Mismatch at key ${key}: ${JSON.stringify(
                                    expData[key]
                                )} vs ${JSON.stringify(actualData[key])}`
                            );
                        }
                    });
                }
            }

            if (differences.length > 0) {
                console.log("Test failed due to differences in data:");
                console.log(differences);
                throw new Error("Test failed due to differences in data");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw new Error("Test failed due to: " + error);
        }
    });
});
