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
import { fetchApiData, handleSessionExpiration } from '@/CommonFunctions';

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
    const [transportApi, setTransportApi] = useState(false);
    const [DebtorsApi, setDebtorsApi] = useState(false);
    const [KPIReasonsApi, setKPIReasonsApi] = useState(false);
    const [safetyTypes, setSafetyTypes] = useState([]);
    const [safetyCauses, setSafetyCauses] = useState([]);
    const [safetyData, setSafetyData] = useState([]);
    const [consData, setconsData] = useState([]);
    const [transportData, setTransportData] = useState([]);
    const [KPIData, setKPIData] = useState([]);
    const [PerfData, setPerfData] = useState([]);
    const [NoDelData, setNoDelData] = useState([]);
    const [AdditionalData, setAdditionalData] = useState([]);
    const [DriverData, setDriverData] = useState([]);
    const [userBody, setUserBody] = useState();
    const [dataFromChild, setDataFromChild] = useState(null);
    const gtrsUrl = window.Laravel.gtrsUrl;
    const gtamUrl = window.Laravel.gtamUrl;
    const gtccrUrl = window.Laravel.gtccrUrl;
    const [customerAccounts, setCusomterAccounts] = useState();
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
        debtorIds = currentUser.UserId;
    }

    useEffect(() => {
        setUserBody(debtorIds);
        setLoadingGtrs(false);
            const urls = [
                { url: `${gtrsUrl}/Dashboard`, setData: setchartsData, setApiStatus: setchartsApi },
                { url: `${gtamUrl}/Customer/Accounts`, setData: setCusomterAccounts },
                { url: `${gtrsUrl}/SafetyReport`, setData: setSafetyData },
                { url: `${gtrsUrl}/Debtors`, setData: setdebtorsData, setApiStatus: setDebtorsApi },
                { url: `${gtrsUrl}/Consignments`, setData: setconsData, setApiStatus: setConsApi },
                { url: `${gtrsUrl}/PerformanceReport`, setData: setPerfData, setApiStatus: setReportApi },
                { url: `${gtrsUrl}/KpiReasons`, setData: setkpireasonsData, setApiStatus: setKPIReasonsApi },
                { url: `${gtrsUrl}/Transport`, setData: setTransportData, setApiStatus: setTransportApi },
            ];
            urls.forEach(({ url, setData, setApiStatus }) => {
                fetchApiData(url, setData, currentUser, AToken, setApiStatus);
            });
    }, []);
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
        if (loadingGtrs && currentUser != "") {
            if (currentUser == {}) {
                setCanAccess(false);
            } else if (currentUser) {
                if (Object.keys(currentUser)?.length > 0) {
                    setCanAccess(true);
                } else {
                    setCanAccess(false);
                }
            }
        }else if(loadingGtrs && currentUser == ""){
            setCanAccess(false);
        }
    }, [currentUser, loadingGtrs]);
    if (consApi && reportApi && chartsApi && DebtorsApi && KPIReasonsApi && transportApi) {
        setLoadingGtrs(true);
    }

    if (loadingGtrs && AToken) {
        if (canAccess) {
            return (
                <div className="bg-smooth">
                    <div className="md:pl-20 pt-16 ">
                        <Charts
                            transportData={transportData}
                            setCusomterAccounts={setCusomterAccounts}
                            kpireasonsData={kpireasonsData}
                            setkpireasonsData={setkpireasonsData}
                            userBody={userBody}
                            url={gtrsUrl}
                            gtccrUrl={gtccrUrl}
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
                            customerAccounts={customerAccounts}
                            rddData={rddData}
                            setrddData={setrddData}
                            IDfilter={dataFromChild}
                            sessionData={sessionData}
                            currentUser={{
                                ...user,
                                UserId: currentUser.UserId,
                            }}
                            user={user}
                            userPermission={user}
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
                            AToken={AToken}
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
