import { useState } from "react";
import { useEffect } from "react";
import NoAccess from "@/Components/NoAccess";
import { fetchApiData } from "@/CommonFunctions";
import MainSidebar from "@/Components/Main-sidebar";
import MainNavbar from "@/Components/Main-navbar";
import AnimatedLoading from "@/Components/AnimatedLoading";
import GtrsMain from "./Component/GtrsMain";

export default function Gtrs({
    user,
    setToken,
    setMobileMenuOpen,
    AToken,
    setLoadingGtrs,
    currentUser,
    loadingGtrs,
    allowedApplications,
    mobileMenuOpen,
    setcurrentUser,
}) {
    const [chartsData, setchartsData] = useState([]);
    const [debtorsData, setdebtorsData] = useState([]);
    const [kpireasonsData, setkpireasonsData] = useState([]);
    const [rddReasons, setrddReasons] = useState([]);
    const [activeCon, setactiveCon] = useState(0);
    const [chartsApi, setchartsApi] = useState(false);
    const [consApi, setConsApi] = useState(false);
    const [reportApi, setReportApi] = useState(false);
    const [transportApi, setTransportApi] = useState(false);
    const [DebtorsApi, setDebtorsApi] = useState(false);
    const [KPIReasonsApi, setKPIReasonsApi] = useState(false);
    const [safetyData, setSafetyData] = useState([]);
    const [consData, setconsData] = useState([]);
    const [transportData, setTransportData] = useState([]);
    const [PerfData, setPerfData] = useState([]);
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
    let debtorIds;
    if (userdata.TypeId == 1) {
        debtorIds = debtorIdsArray;
    } else {
        debtorIds = currentUser.UserId;
    }

    useEffect(() => {
        if (AToken != null && currentUser) {
            setUserBody(debtorIds);
            setLoadingGtrs(false);
            const urls = [
                {
                    url: `${gtrsUrl}/Dashboard`,
                    setData: setchartsData,
                    setApiStatus: setchartsApi,
                },
                {
                    url: `${gtamUrl}/Customer/Accounts`,
                    setData: setCusomterAccounts,
                },
                { url: `${gtrsUrl}/SafetyReport`, setData: setSafetyData },
                {
                    url: `${gtrsUrl}/Debtors`,
                    setData: setdebtorsData,
                    setApiStatus: setDebtorsApi,
                },
                {
                    url: `${gtrsUrl}/Consignments`,
                    setData: setconsData,
                    setApiStatus: setConsApi,
                },
                {
                    url: `${gtrsUrl}/PerformanceReport`,
                    setData: setPerfData,
                    setApiStatus: setReportApi,
                },
                {
                    url: `${gtrsUrl}/KpiReasons`,
                    setData: setkpireasonsData,
                    setApiStatus: setKPIReasonsApi,
                },
                {
                    url: `${gtrsUrl}/Transport`,
                    setData: setTransportData,
                    setApiStatus: setTransportApi,
                },
            ];
            urls.forEach(({ url, setData, setApiStatus }) => {
                fetchApiData(url, setData, currentUser, AToken, setApiStatus);
            });
        }
    }, [AToken, currentUser]);

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
        } else if (loadingGtrs && currentUser == "") {
            setCanAccess(false);
        }
    }, [currentUser, loadingGtrs]);
    if (
        consApi &&
        reportApi &&
        chartsApi &&
        DebtorsApi &&
        KPIReasonsApi &&
        transportApi
    ) {
        setLoadingGtrs(true);
    }

    if (loadingGtrs && AToken) {
        if (canAccess) {
            return (
                <div>
                    {/* <mainSidebar/> */}
                    <MainSidebar
                        allowedApplications={allowedApplications}
                        setMobileMenuOpen={setMobileMenuOpen}
                        mobileMenuOpen={mobileMenuOpen}
                        setToken={setToken}
                        user={user}
                        setCurrentUser={setcurrentUser}
                    />
                    <MainNavbar setMobileMenuOpen={setMobileMenuOpen} />

                    <div className="bg-smooth h-full">
                        <div className="md:pl-20 pt-16 h-full">
                            <GtrsMain
                                transportData={transportData}
                                setCusomterAccounts={setCusomterAccounts}
                                kpireasonsData={kpireasonsData}
                                setkpireasonsData={setkpireasonsData}
                                userBody={userBody}
                                url={gtrsUrl}
                                gtccrUrl={gtccrUrl}
                                chartsData={chartsData}
                                rddReasons={rddReasons}
                                setrddReasons={setrddReasons}
                                safetyData={safetyData}
                                debtorsData={debtorsData}
                                customerAccounts={customerAccounts}
                                IDfilter={dataFromChild}
                                currentUser={currentUser}
                                user={user}
                                userPermission={user}
                                dashData={PerfData}
                                setactiveCon={setactiveCon}
                                consData={consData}
                                activeCon={activeCon}
                                AToken={AToken}
                                PerfData={PerfData}
                                setPerfData={setPerfData}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <NoAccess />;
        }
    } else {
        return (
            <AnimatedLoading />
        );
    }
}
