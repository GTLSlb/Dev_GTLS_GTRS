import Sidebar from "./Layout";
import { useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Charts from "./Component/Charts";

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
    setActiveIndexGTRS,
    setLoadingGtrs,
    currentUser,
    loadingGtrs,
}) {
    const [rddData, setrddData] = useState([]);
    const [chartsData, setchartsData] = useState([]);
    const [debtorsData, setdebtorsData] = useState([]);
    const [kpireasonsData, setkpireasonsData] = useState([]);
    const [failedReasons, setFailedReasons] = useState([]);
    const [rddReasons, setrddReasons] = useState([]);
    const [activeCon, setactiveCon] = useState(0);
    const [lastIndex, setLastIndex] = useState(0);
    const [chartsApi, setchartsApi] = useState(false);
    const [consApi, setConsApi] = useState(false);
    const [reportApi, setReportApi] = useState(false);
    const [DebtorsApi, setDebtorsApi] = useState(false);
    const [KPIReasonsApi, setKPIReasonsApi] = useState(false);
    const [safetyTypes, setSafetyTypes] = useState([]);
    const [safetyCauses, setSafetyCauses] = useState([]);
    const [safetyData, setSafetyData] = useState([]);
    const [consData, setconsData] = useState([]);
    const [KPIData, setKPIData] = useState([]);
    const [PerfData, setPerfData] = useState([]);
    const [NoDelData, setNoDelData] = useState([]);

    const [AdditionalData, setAdditionalData] = useState([]);
    const [DriverData, setDriverData] = useState([]);
    const [userBody, setUserBody] = useState();
    const [dataFromChild, setDataFromChild] = useState(null);
    //production URL
    // const url = "https://gtlsnsws10-vm.gtls.com.au:5478/";
    //test URL
    const url = "https://gtlslebs06-vm.gtls.com.au:8084/";
    const userdata = currentUser;
    const [canAccess, setCanAccess] = useState(true);
    const debtorIdsArray = userdata?.Accounts?.map((account) => {
        return { UserId: account.DebtorId };
    });

    // Usage

    let debtorIds;
    if (userdata.TypeId == 1) {
        debtorIds = debtorIdsArray;
    } else {
        debtorIds = userdata.UserId;
    }

    let param;
    if (userdata.TypeId !=1) { //employee or driver
         param = userdata.UserId;
    } else {
        param = userdata.RoleId; //customer
    }

    useEffect(() => {
        setUserBody(debtorIds);
        setLoadingGtrs(false);

        axios
            .post(`${url}api/GTRS/Dashboard`, debtorIds, {
                headers: {
                    RoleId: param,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setchartsData(parsedData);
                    setchartsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get(`${url}api/SafetyReport`, {
                headers: {
                    RoleId: param,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });

                parsedDataPromise.then((parsedData) => {
                    setSafetyData(parsedData || []);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get(`${url}api/Debtors`, {
                headers: {
                    RoleId: param,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setdebtorsData(parsedData || []);
                    setDebtorsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .post(`${url}api/GTRS/Consignments`, debtorIds, {
                headers: {
                    RoleId: param,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });

                parsedDataPromise.then((parsedData) => {
                    setconsData(parsedData || []);
                    setConsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .post(`${url}api/GTRS/PerformanceReport`, debtorIds, {
                headers: {
                    RoleId: param,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedData = JSON.parse(x);
                setPerfData(parsedData || []);
                setReportApi(true);
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get(`${url}api/GTRS/KpiReasons`, {
                headers: {
                    RoleId: param,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setkpireasonsData(parsedData || []);
                    setKPIReasonsApi(true);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (loadingGtrs) {
            if (user == {}) {
                setCanAccess(false);
            } else if (user) {
                user.Pages?.map((page) => {
                    if (page?.hasOwnProperty("Features")) {
                        if (page.Features?.length == 0 || page.Features == null) {
                            setCanAccess(false);
                        }
                    }else{
                        setCanAccess(false);
                    }
                });
            }
        }
    }, [user, loadingGtrs]);

    if (consApi && reportApi && chartsApi && DebtorsApi && KPIReasonsApi) {
        setLoadingGtrs(true);
    }

    if (loadingGtrs) {
        if (canAccess) {
            return (
                <div className="bg-smooth">
                    <div className="md:pl-20 pt-16 ">
                        <Charts
                            kpireasonsData={kpireasonsData}
                            setkpireasonsData={setkpireasonsData}
                            userBody={userBody}
                            url={url}
                            chartsData={chartsData}
                            safetyTypes={safetyTypes}
                            setSafetyTypes={setSafetyTypes}
                            safetyCauses={safetyCauses}
                            setSafetyCauses={setSafetyCauses}
                            failedReasons={failedReasons}
                            rddReasons={rddReasons}
                            setrddReasons={setrddReasons}
                            setFailedReasons={setFailedReasons}
                            safetyData={safetyData}
                            debtorsData={debtorsData}
                            customerAccounts={userdata}
                            rddData={rddData}
                            setrddData={setrddData}
                            IDfilter={dataFromChild}
                            sessionData={sessionData}
                            currentUser={{
                                ...user[0],
                                UserId: userdata.UserId,
                            }}
                            dashData={PerfData}
                            setActiveIndexGTRS={setActiveIndexGTRS}
                            activeIndexGTRS={activeIndexGTRS}
                            setactiveCon={setactiveCon}
                            consData={consData}
                            setLastIndex={setLastIndex}
                            KPIData={KPIData}
                            DriverData={DriverData}
                            AdditionalData={AdditionalData}
                            NoDelData={NoDelData}
                            activeCon={activeCon}
                            lastIndex={lastIndex}
                            PerfData={PerfData}
                            setPerfData={setPerfData}
                        />
                    </div>
                </div>
            );
        } else {
            return <NoAccess />;
        }
    } else {
        return (
            <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                    <div
                        className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                    ></div>
                    <div
                        className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                    ></div>
                    <div
                        className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                    ></div>
                </div>
                <div className="text-dark mt-4 font-bold">
                    Please wait while we get the data for you.
                </div>
            </div>
        );
    }
}
