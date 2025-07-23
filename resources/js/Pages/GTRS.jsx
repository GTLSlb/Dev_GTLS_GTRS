import { useContext, useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from "@/CommonFunctions";
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
import { CustomContext } from "@/CommonContext";

export default function Gtrs({
    setMobileMenuOpen,
    setLoadingGtrs,
    loadingGtrs,
    mobileMenuOpen,
}) {

    const {
        currentUser,
        setCurrentUser,
        Token,
        setToken,
        user,
        setUser,
        canAccess,
        setCanAccess,
        sidebarElements,
        setSidebarElements,
        DebtorsApi, setDebtorsApi,
        debtorsData, setdebtorsData,
        chartsApi, setchartsApi,
        consApi, setConsApi,
        reportApi, setReportApi,
        transportApi, setTransportApi,
        KPIReasonsApi, setKPIReasonsApi,
        customerAccounts, setCustomerAccounts,
        transportData, setTransportData,
        kpireasonsData, setkpireasonsData,
    } = useContext(CustomContext);

    const [chartsData, setchartsData] = useState([]);

    const [rddReasons, setrddReasons] = useState([]);
    const [activeCon, setactiveCon] = useState(0);
    const [safetyData, setSafetyData] = useState([]);
    const [consData, setconsData] = useState([]);

    const [PerfData, setPerfData] = useState([]);
    const gtrsUrl = window.Laravel.gtrsUrl;
    const gtamUrl = window.Laravel.gtamUrl;
    const gtccrUrl = window.Laravel.gtccrUrl;

    const [deliveryReportData, setDeliveryReportData] = useState([]);

    const fetchDeliveryReport = () => {
        axios
            .get(`${gtrsUrl}Delivery`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve) => {
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
                                console.error(error);
                            });
                    });
                } else {
                    // Handle other errors
                    console.error(err);
                }
            });
    };

    const [deliveryReportComments, setDeliveryReportComments] = useState([]);
    const fetchDeliveryReportCommentsData = async (setCellLoading) => {
        try {
            const res = await axios.get(`${gtrsUrl}Delivery/Comments`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${Token}`,
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
                console.error(err);
                // Check if setCellLoading exists before calling it
                if (typeof setCellLoading === "function") {
                    setCellLoading(null);
                }
            }
        }
    };

    useEffect(() => {
        if (Token != null && currentUser) {
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
                    setData: setCustomerAccounts,
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
                fetchApiData(url, setData, currentUser, Token, setApiStatus);
            });
        }
    }, [Token, currentUser]);

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
    if (loadingGtrs && Token) {
        if (canAccess) {
            return (
                <Routes>
                    <Route
                        path="/gtrs/*"
                        element={
                            <div className="h-full">
                                {/* <mainSidebar/> */}
                                <MainSidebar
                                    setMobileMenuOpen={setMobileMenuOpen}
                                    mobileMenuOpen={mobileMenuOpen}
                                />
                                <MainNavbar
                                    setMobileMenuOpen={setMobileMenuOpen}
                                />

                                <div className="bg-smooth h-full">
                                    <div className="md:pl-20 pt-16 h-full">
                                        <GtrsMain
                                            transportData={transportData}
                                            setCustomerAccounts={
                                                setCustomerAccounts
                                            }
                                            kpireasonsData={kpireasonsData}
                                            setkpireasonsData={
                                                setkpireasonsData
                                            }
                                            setUser={setUser}
                                            url={gtrsUrl}
                                            gtccrUrl={gtccrUrl}
                                            chartsData={chartsData}
                                            rddReasons={rddReasons}
                                            setrddReasons={setrddReasons}
                                            safetyData={safetyData}
                                            debtorsData={debtorsData}
                                            customerAccounts={customerAccounts}
                                            currentUser={currentUser}
                                            user={user}
                                            userPermission={user}
                                            dashData={PerfData}
                                            setactiveCon={setactiveCon}
                                            consData={consData}
                                            activeCon={activeCon}
                                            Token={Token}
                                            PerfData={PerfData}
                                            setPerfData={setPerfData}
                                            setToken={setToken}
                                            setCurrentUser={setCurrentUser}
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
                    setCurrentUser={setCurrentUser}
                />
            );
        }
    } else {
        return <AnimatedLoading />;
    }
}

Gtrs.propTypes = {
    user: PropTypes.object,
    setToken: PropTypes.func.isRequired,
    setMobileMenuOpen: PropTypes.func.isRequired,
    AToken: PropTypes.string,
    setLoadingGtrs: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    loadingGtrs: PropTypes.bool.isRequired,
    allowedApplications: PropTypes.array.isRequired,
    mobileMenuOpen: PropTypes.bool.isRequired,
    setcurrentUser: PropTypes.func.isRequired,
    setSidebarElements: PropTypes.func.isRequired,
    sidebarElements: PropTypes.array.isRequired,
    setUser: PropTypes.func.isRequired,
};
