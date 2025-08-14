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
        userPermissions,
        setUserPermissions,
        Token,
        setToken,
        user,
        setUser,
        canAccess,
        setCanAccess,
        sidebarElements,
        setSidebarElements,
        DebtorsApi,
        setDebtorsApi,
        debtorsData,
        setdebtorsData,
        chartsApi,
        setchartsApi,
        consApi,
        setConsApi,
        reportApi,
        setReportApi,
        transportApi,
        setTransportApi,
        KPIReasonsApi,
        setKPIReasonsApi,
        customerAccounts,
        setCustomerAccounts,
        transportData,
        setTransportData,
        kpireasonsData,
        setkpireasonsData,
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
                    UserId: user.UserId,
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
                    UserId: user.UserId,
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
        if (Token != null && user) {
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
            console.log(user);
            urls.forEach(({ url, setData, setApiStatus }) => {
                fetchApiData(url, setData, user, Token, setApiStatus);
            });
        }
    }, [Token, user]);

    useEffect(() => {
        if (loadingGtrs && userPermissions != "") {
            if (userPermissions == {}) {
                setCanAccess(false);
            } else if (userPermissions) {
                if (Object.keys(userPermissions)?.length > 0) {
                    setCanAccess(true);
                } else {
                    setCanAccess(false);
                }
            }
        } else if (loadingGtrs && userPermissions == "") {
            setCanAccess(false);
        }
    }, [userPermissions, loadingGtrs]);

    const navigate = useNavigate();
    useEffect(() => {
        if (userPermissions) {
            navigateToFirstAllowedPage({
                setSidebarElements,
                userPermissions: userPermissions,
                navigate,
            });
        }
    }, [userPermissions]);

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
                                            userPermissions={userPermissions}
                                            user={user}
                                            dashData={PerfData}
                                            setactiveCon={setactiveCon}
                                            consData={consData}
                                            activeCon={activeCon}
                                            Token={Token}
                                            PerfData={PerfData}
                                            setPerfData={setPerfData}
                                            setToken={setToken}
                                            setUserPermissions={
                                                setUserPermissions
                                            }
                                            sidebarElements={sidebarElements}
                                            setSidebarElements={
                                                setSidebarElements
                                            }
                                            deliveryReportData={
                                                deliveryReportData
                                            }
                                            deliveryReportComments={
                                                deliveryReportComments
                                            }
                                            fetchDeliveryReportCommentsData={
                                                fetchDeliveryReportCommentsData
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            );
        } else {
            return <NoAccess />;
        }
    } else {
        return <AnimatedLoading />;
    }
}

Gtrs.propTypes = {
    user: PropTypes.object,
    setToken: PropTypes.func,
    setMobileMenuOpen: PropTypes.func,
    Token: PropTypes.string,
    setLoadingGtrs: PropTypes.func,
    userPermissions: PropTypes.object,
    loadingGtrs: PropTypes.bool,
    allowedApplications: PropTypes.array,
    mobileMenuOpen: PropTypes.bool,
    setUserPermission: PropTypes.func,
    setSidebarElements: PropTypes.func,
    sidebarElements: PropTypes.array,
    setUser: PropTypes.func,
};
