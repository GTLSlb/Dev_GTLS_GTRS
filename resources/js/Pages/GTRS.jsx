import { useState } from "react";
import { useEffect } from "react";
import NoAccess from "@/Components/NoAccess";
import { fetchApiData } from "@/CommonFunctions";
import MainSidebar from "@/Components/Main-sidebar";
import MainNavbar from "@/Components/Main-navbar";
import AnimatedLoading from "@/Components/AnimatedLoading";
import GtrsMain from "./Component/GtrsMain";
import { Routes, Route } from "react-router-dom";
import { navigateToFirstAllowedPage } from "@/CommonFunctions";
import { useNavigate } from "react-router-dom";
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
    setSidebarElements,
    sidebarElements,
    setUser,
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
    const [customerAccounts, setCusomterAccounts] = useState([]);
    const userdata = currentUser;
    const [canAccess, setCanAccess] = useState(true);
    const [deliveryReportData, setDeliveryReportData] = useState([]);
    const debtorIdsArray = userdata?.Accounts?.map((account) => {
        return { UserId: account.DebtorId };
    });
    let debtorIds;
    if (userdata.TypeId == 1) {
        debtorIds = debtorIdsArray;
    } else {
        debtorIds = currentUser.UserId;
    }

    const fetchDeliveryReport = () => {
        axios
            .get(`${gtrsUrl}Delivery`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setDeliveryReportData(parsedData || []);
                });
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(function () {
                        axios
                            .post("/logoutAPI")
                            .then((response) => {
                                if (response.status == 200) {
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
    };

    const [deliveryReportComments, setDeliveryReportComments] = useState([]);
    const fetchDeliveryReportCommentsData = async (setCellLoading) => {
        try {
            const res = await axios.get(`${gtrsUrl}Delivery/Comments`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            });
            setDeliveryReportComments(res.data || []);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "success",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
                    await handleSessionExpiration();
                });
            } else {
                // Handle other errors
                console.log(err);
                // Check if setCellLoading exists before calling it
                if (typeof setCellLoading === "function") {
                    setCellLoading(null);
                }
            }
        }
    };
    useEffect(() => {
        if (AToken != null && currentUser) {
            setUserBody(debtorIds);
            setLoadingGtrs(false);
            fetchDeliveryReport();
            fetchDeliveryReportCommentsData();
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


    const navigate = useNavigate();
    useEffect(() => {
        if(user){
            console.log("GTRS")
            navigateToFirstAllowedPage({setSidebarElements, user, navigate})
        }
    },[user])

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
                <Routes>
                    <Route
                        path="/testX/*"
                        element={
                            <div className="h-full">
                                {/* <mainSidebar/> */}
                                <MainSidebar
                                    allowedApplications={allowedApplications}
                                    setMobileMenuOpen={setMobileMenuOpen}
                                    mobileMenuOpen={mobileMenuOpen}
                                    setToken={setToken}
                                    user={user}
                                    currentUser={currentUser}
                                    setCurrentUser={setcurrentUser}
                                />
                                <MainNavbar
                                    setMobileMenuOpen={setMobileMenuOpen}
                                />

                                <div className="bg-smooth h-full">
                                    <div className="md:pl-20 pt-16 h-full">
                                        <GtrsMain
                                            transportData={transportData}
                                            setCusomterAccounts={
                                                setCusomterAccounts
                                            }
                                            kpireasonsData={kpireasonsData}
                                            setkpireasonsData={
                                                setkpireasonsData
                                            }
                                            userBody={userBody}
                                            setUser={setUser}
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
                                            setToken={setToken}
                                            setCurrentUser={setcurrentUser}
                                            sidebarElements={sidebarElements}
                                            setSidebarElements={
                                                setSidebarElements
                                            }
                                            deliveryReportData ={deliveryReportData}
                                            deliveryReportComments={deliveryReportComments}
                                            fetchDeliveryReportCommentsData={fetchDeliveryReportCommentsData}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            );
        } else {
            return (
                <NoAccess
                    currentUser={currentUser}
                    setToken={setToken}
                    setCurrentUser={setcurrentUser}
                />
            );
        }
    } else {
        return <AnimatedLoading />;
    }
}
