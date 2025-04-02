import Sidebar from "./Layout";
import { useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Charts from "./Component/Charts";
import swal from "sweetalert";
import debtors from "./Component/JsonData/debtors.json";
import rddData from "./Component/JsonData/RddData.json";
import { useStepContext } from "@mui/material";
import NoAccess from "@/Components/NoAccess";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Gtrs({
    sessionData,
    activeIndexGTRS,
    user,
    setUser,
    setToken,
    AToken,
    setActiveIndexGTRS,
    setLoadingGtrs,
    currentUser,
    loadingGtrs,
}) {
    const gtrsUrl = window.Laravel.gtrsUrl;
    const gtamUrl = window.Laravel.gtamUrl;
    const [canAccess, setCanAccess] = useState(true);
    const [rddReasons, setrddReasons] = useState([]);
    const [activeCon, setactiveCon] = useState(0);
    const [allData, setAllData] = useState({
        chartsData: [],
        debtorsData: [],
        safetyData: [],
        consData: [],
        perfData: [],
        kpiReasonsData: [],
        transportData: [],
        deliveryReportData: [],
        customerAccounts: [],
    });

    const [debtorIds, setDebtorIds] = useState(null);
    useEffect(() => {
        document.cookie =
            "previous_page=" + encodeURIComponent(window.location.href);
    }, []);

    useEffect(() => {
        const debtorIdsArray =
            currentUser?.Accounts?.map((account) => ({
                UserId: account.DebtorId,
            })) || [];
        if (currentUser.TypeId === 1) {
            setDebtorIds(debtorIdsArray);
        } else {
            setDebtorIds(currentUser.UserId);
        }
    }, [currentUser]);

    // Single useEffect that loads ALL data at once:
    useEffect(() => {
        // Start loading
        setLoadingGtrs(true);

        const headers = {
            headers: {
                UserId: currentUser.UserId,
                Authorization: `Bearer ${AToken}`,
            },
        };

        // Prepare all the GET requests
        const dashReq = axios.get(`${gtrsUrl}/Dashboard`, headers);
        const debtorsReq = axios.get(`${gtrsUrl}/Debtors`, headers);
        const consReq = axios.get(`${gtrsUrl}/Consignments`, headers);
        const perfReq = axios.get(`${gtrsUrl}/PerformanceReport`, headers);
        const kpiReq = axios.get(`${gtrsUrl}/KpiReasons`, headers);
        const safetyReq = axios.get(`${gtrsUrl}/SafetyReport`, headers);
        const transportReq = axios.get(`${gtrsUrl}/Transport`, headers);
        const deliveryReq = axios.get(`${gtrsUrl}/Delivery`, headers);
        const accountsReq = axios.get(`${gtamUrl}/Customer/Accounts`, headers);

        // Now fetch everything in parallel:
        Promise.all([
            dashReq,
            debtorsReq,
            consReq,
            perfReq,
            kpiReq,
            safetyReq,
            transportReq,
            deliveryReq,
            accountsReq,
        ])
            .then(
                ([
                    dashRes,
                    debtorsRes,
                    consRes,
                    perfRes,
                    kpiRes,
                    safetyRes,
                    transportRes,
                    deliveryRes,
                    accountsRes,
                ]) => {
                    // Combine the results into one big object
                    let customerAccounts = accountsRes.data || [];
                    // Example: remove duplicates based on DebtorId
                    customerAccounts = customerAccounts.reduce(
                        (acc, current) => {
                            if (
                                !acc.some(
                                    (account) =>
                                        account.DebtorId.trim() ===
                                        current.DebtorId.trim()
                                )
                            ) {
                                acc.push(current);
                            }
                            return acc;
                        },
                        []
                    );

                    // Update our single piece of state
                    setAllData({
                        chartsData: dashRes.data || [],
                        debtorsData: debtorsRes.data || [],
                        consData: consRes.data || [],
                        perfData: perfRes.data || [],
                        kpiReasonsData: kpiRes.data || [],
                        safetyData: safetyRes.data || [],
                        transportData: transportRes.data || [],
                        deliveryReportData: deliveryRes.data || [],
                        customerAccounts,
                    });

                    // Done loading
                    setLoadingGtrs(false);
                }
            )
            .catch((err) => {
                setLoadingGtrs(false);
                // Handle 401 with SweetAlert
                if (err.response && err.response.status === 401) {
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(() => {
                        axios
                            .post("/logoutAPI")
                            .then((response) => {
                                if (response.status === 200) {
                                    window.location.href = "/";
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                }
            });
    }, [AToken, currentUser.UserId, gtrsUrl, gtamUrl, setLoadingGtrs]);
    function checkFeaturesInPages(jsonData) {
        // Iterate over the Pages array in the JSON data
        for (let i = 0; i < jsonData?.Pages?.length; i++) {
            // Check if the page has a 'Features' key and it's not empty
            if (
                jsonData.Pages[i].Features &&
                jsonData.Pages[i].Features.length > 0
            ) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        if (loadingGtrs) {
            if (user == {}) {
                setCanAccess(false);
            } else if (user) {
                if (checkFeaturesInPages(user[0])) {
                    setCanAccess(true);
                } else {
                    setCanAccess(false);
                }
            }
        }
    }, [user, loadingGtrs]);

    // Once the data is loaded, check if user can access
    useEffect(() => {
        if (!loadingGtrs) {
            if (!user || Object.keys(user).length === 0) {
                setCanAccess(false);
            } else if (user && checkFeaturesInPages(user[0])) {
                setCanAccess(true);
            } else {
                setCanAccess(false);
            }
        }
    }, [user, loadingGtrs]);

    if (loadingGtrs) {
        return (
            <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                    <div className="h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce"></div>
                    <div className="h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200"></div>
                    <div className="h-5 w-5 bg-goldd rounded-full animate-bounce400"></div>
                </div>
                <div className="text-dark mt-4 font-bold">
                    Please wait while we get the data for you.
                </div>
            </div>
        );
    }

    // 2) If user does NOT have access:
    if (!canAccess) {
        return <NoAccess />;
    }

    return (
        <div className="bg-smooth">
            <div className="md:pl-20 pt-16">
                <Charts
                    transportData={allData.transportData}
                    kpireasonsData={allData.kpiReasonsData}
                    debtorsData={allData.debtorsData}
                    chartsData={allData.chartsData}
                    safetyData={allData.safetyData}
                    customerAccounts={allData.customerAccounts}
                    consData={allData.consData}
                    deliveryReportData={allData.deliveryReportData}
                    PerfData={allData.perfData}
                    setCusomterAccounts={(newValue) =>
                        setAllData((prevData) => ({
                            ...prevData,
                            customerAccounts: newValue,
                        }))
                    }
                    setkpireasonsData={(newValue) =>
                        setAllData((prevData) => ({
                            ...prevData,
                            kpiReasonsData: newValue,
                        }))
                    }
                    userBody={debtorIds}
                    url={gtrsUrl}
                    rddReasons={rddReasons}
                    setrddReasons={setrddReasons}
                    sessionData={sessionData}
                    currentUser={{
                        ...user[0],
                        UserId: currentUser.UserId,
                    }}
                    user={currentUser}
                    setActiveIndexGTRS={setActiveIndexGTRS}
                    activeIndexGTRS={activeIndexGTRS}
                    setactiveCon={setactiveCon}
                    activeCon={activeCon}
                    AToken={AToken}
                />
            </div>
        </div>
    );
}
