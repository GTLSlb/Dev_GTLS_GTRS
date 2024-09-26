
import { useLayoutEffect, useRef, useState } from "react";
import { format, parse } from "date-fns";
import { useEffect } from "react";
import { Bartest } from "@/Components/charts/bartest";

export default function GtrsDashboard(dashData) {

    const createdDatesArray = [];
    const totalsByYear = {};
    let passCount = 0;
    let failCount = 0;
    let pendingCount = 0;

    let awaitingCount = 0;
    let pickedCount = 0;
    let loadingCount = 0;
    let depotCount = 0;
    let deliveryCount = 0;
    let deliveredCount = 0;

        const result = {};
        const resultPODTrue = {};
        const resultPODFalse = {};

        const parsdeData = dashData.dashData;
        const totalAmount = parsdeData.reduce((total, parsdeData) => {
            return total + parsdeData.NETTAMOUNT;
        }, 0);
        parsdeData.forEach((cons) => {
            const month = cons.DESPATCHDATE.slice(0, 7);
            const createdFullDate = new Date(cons.DESPATCHDATE);
            const firstDayOfMonth = new Date(
                createdFullDate.getFullYear(),
                createdFullDate.getMonth(),
                1
            ); // Get first day of month
            const formattedDate2 = firstDayOfMonth
                .toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
                .replace(/\//g, "-");
            if (!createdDatesArray.includes(formattedDate2)) {
                // Check if year-month exists in array
                createdDatesArray.push(formattedDate2); // Add year-month and first day of month to array
            }

            const onlymonth = formattedDate2.split("-")[0];
            const year = parseInt(onlymonth);
            const netAmount = parseInt(cons.NETTAMOUNT);

            // Check if the netAmount is a valid number
            if (!result[month]) {
                result[month] = 0; // initialize the total for this month to 0
            }
            result[month] += netAmount;
            //POD TRUE COUNTER
            if (!resultPODTrue[month]) {
                resultPODTrue[month] = 0;
            }
            if (cons.POD === true) {
                resultPODTrue[month] += 1;
            }
            //POD FALSE COUNTER
            if (!resultPODFalse[month]) {
                resultPODFalse[month] = 0;
            }
            if (cons.POD === false) {
                resultPODFalse[month] += 1;
            }
            if (cons.STATUS === "PASS") {
                passCount++;
            } else if (cons.STATUS === "FAIL") {
                failCount++;
            } else if (cons.STATUS === "PENDING") {
                pendingCount++;
            }
            if (cons.CONSIGNMENTSTATUS === "DELIVERED") {
                deliveredCount++;
            } else if (cons.CONSIGNMENTSTATUS === "AWAITING PICKUP") {
                awaitingCount++;
            } else if (cons.CONSIGNMENTSTATUS === "ON-FOR-DELIVERY") {
                deliveryCount++;
            } else if (cons.CONSIGNMENTSTATUS === "PICKEDUP") {
                pickedCount++;
            } else if (cons.CONSIGNMENTSTATUS === "DEPOT") {
                depotCount++;
            } else if (cons.CONSIGNMENTSTATUS === "LOADED") {
                loadingCount++;
            }
            // add the nettamount to the total for this month
            if (!isNaN(netAmount)) {
                // If the year has not been encountered before, initialize the total to zero
                if (!totalsByYear.hasOwnProperty(year)) {
                    totalsByYear[year] = 0;
                }
                // Add the net amount to the total for the current year
                totalsByYear[year] += netAmount;
            }
        });

        // Initialize empty arrays to hold the years and totals
        const years = [];
        const totals = [];
        const truePOD = Object.values(resultPODTrue);
        const falsePOD = Object.values(resultPODFalse);

        const resultArray = Object.values(result);
        // Loop through the totalsByYear object and push the years and totals to their respective arrays
        for (const [year, total] of Object.entries(totalsByYear)) {
            years.push(year);
            totals.push(total);
        }
        sessionStorage.setItem("consYear", years);
        sessionStorage.setItem("consAmount", totals);
        sessionStorage.setItem("consMonth", createdDatesArray);
        sessionStorage.setItem("consAmountByMonth", resultArray);
        sessionStorage.setItem("consTruePOD", truePOD);
        sessionStorage.setItem("consFalsePOD", falsePOD);
        sessionStorage.setItem("consPassStatus", passCount);
        sessionStorage.setItem("consFailStatus", failCount);
        sessionStorage.setItem("consPendStatus", pendingCount);
        sessionStorage.setItem("consDeliveredStatus", deliveredCount);
        sessionStorage.setItem("consAwaitingStatus", awaitingCount);
        sessionStorage.setItem("consDeliveryStatus", deliveryCount);
        sessionStorage.setItem("consPickedCountStatus", pickedCount);
        sessionStorage.setItem("consDepotStatus", depotCount);
        sessionStorage.setItem("consLoadingStatus", loadingCount);
    

    return (
        <div className=" px-4 sm:px-6 lg:px-8 py-6 bg-smooth">
            <div className="grid grid-cols-12 gap-6">
                {/* <DashboardCard08 />
                <DashboardCard06 />
                <DashboardCard04 />
                <DashboardCard03 /> */}
                {/* <DashboardCard11 /> */}
                <Bartest/>
            </div>
        </div>
    );
}
