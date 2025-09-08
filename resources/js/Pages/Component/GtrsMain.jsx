import { navigateToFirstAllowedPage, ProtectedRoute } from "@/CommonFunctions";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import { handleSessionExpiration } from "@/CommonFunctions";
import React, { useContext } from "react";
import PropTypes from "prop-types";
import {
    getLatestDespatchDate,
    getMinMaxValue,
    getOldestDespatchDate,
} from "@/Components/utils/dateUtils";
import {
    getFiltersAddCharges,
    getFiltersCons,
    getFiltersDifot,
    getFiltersDrivers,
    getFiltersFailed,
    getFiltersHolidays,
    getFiltersKPI,
    getFiltersNewTransit,
    getFiltersNoDelInfo,
    getFiltersPOD,
    getFiltersRDD,
    getFiltersSafety,
    getFiltersTransport,
} from "@/Components/utils/filters";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ConsDetails from "../ConsDetails";
import NotFoundRedirect from "../NotFoundRedirect";
import AdditionalCharges from "./AdditionalCharges";
import CollapseSidebar from "./CollapseSidebar";
import ConsPerf from "./ConsPerf";
import MainCharts from "./Dashboard_Comp/MainCharts";
import DriverLogin from "./DriverLogin";
import FailedConsMain from "./FailedConsignments/FailedConsMain";
import GtrsCons from "./GtrsCons";
import Incident from "./Incident/Incident";
import AddNewTransitDay from "./KPI/AddNewTransitDay";
import Holidays from "./KPI/Holidays";
import NewKPI from "./KPI/NewKPI";
import NewTransitDays from "./KPI/NewTransitDays";
import MissingPOD from "./MissingPOD";
// import NewConsignmentTracking from "./New Consignment Tracking/NewConsignmentTracking";
import NoDelivery from "./NoDelivery";
import GraphPresentation from "./Presentation/GraphPresentation";
import RDDMain from "./RDD/RDDMain";
import RealFoodKPIPack from "./RealFoodKPIPack/RealFoodKPIPack";
import DeliveryReportPage from "./ReportsPage/DeliveryReportPage";
import ExcelDeliveryReport from "./ReportsPage/ExcelDeliveryReport";
import DeliveryReportCommentsPage from "./ReportsPage/CommentsTableView/DeliveryReportCommentsPage";
import SafetyRep from "./safetyRep";
// import ConsMap from "./TrafficPage/ConsMap";
// import TrafficComp from "./TrafficPage/TrafficComp";
import TransportRep from "./TransportRep";
import ProductStockTable from "./ProductStock/ProductStockTable";
import KPIReasons from "./KPI/KPIReasons";
import SettingMiddleware from "./Settings/SettingMiddleware";
import Customers from "./Settings/Customers";
import CustomerProfile from "./Settings/CustomerProfile";
import ContactRep from "./ContactsRep/ContactRep";
import DifotReport from "./DifotReport";
import Utilization from "./UtilizationReport/Utilization";
import { CustomContext } from "@/CommonContext";
import SpendDashboard from "./SpendAnalysis/SpendDashboard";

export default function GtrsMain({
    setCustomerAccounts,
    setPerfData,
    gtccrUrl,
    safetyData,
    debtorsData,
    customerAccounts,
    setactiveCon,
    consData,
    PerfData,
    rddReasons,
    setrddReasons,
    transportData,
    chartsData,
    kpireasonsData,
    setkpireasonsData,
    sidebarElements,
    setSidebarElements,
    deliveryReportData,
    deliveryReportComments,
    fetchDeliveryReportCommentsData,
}) {
    const { url, user, Token, setToken, userPermissions, setUserPermissions } =
        useContext(CustomContext);
    window.moment = moment;
    const KPIData = [];
    const [commentsCheck, setCommentsCheck] = useState(false);
    const [NewKPIData, setNewKPIData] = useState([]);
    const [newTransitDays, setNewTransitDays] = useState();
    const [holidays, setHolidays] = useState();
    const [failedReasons, setFailedReasons] = useState();
    const [rddData, setrddData] = useState();
    const [NoDelData, setNoDelData] = useState();
    const [safetyDataState, setsafetyDataState] = useState([]);
    const [AdditionalData, setAdditionalData] = useState();
    const [DriverData, setDriverData] = useState();
    const [safetyTypes, setSafetyTypes] = useState([]);
    const [safetyCauses, setSafetyCauses] = useState([]);
    const [SDate, setSDate] = useState(getOldestDespatchDate(consData));
    const [EDate, setEDate] = useState(getLatestDespatchDate(consData));
    const oldestDate = getOldestDespatchDate(consData);
    const latestDate = getLatestDespatchDate(consData);
    const [dataFromChild, setDataFromChild] = useState(null);

    const [sharedStartDate, setSharedStartDate] = useState(
        getOldestDespatchDate(consData)
    );
    const [sharedEndDate, setSharedEndDate] = useState(
        getLatestDespatchDate(consData)
    );

    const minDate = getMinMaxValue(consData, "DespatchDate", 1);
    const maxDate = getMinMaxValue(consData, "DespatchDate", 2);
    const minDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 1);
    const maxDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 2);

    const minDateHol = getMinMaxValue(holidays, "HolidayDate", 1);
    const maxDateHol = getMinMaxValue(holidays, "HolidayDate", 2);

    const minDespatchDaterdd = getMinMaxValue(rddData, "DespatchDate", 1);
    const maxDespatchDaterdd = getMinMaxValue(rddData, "DespatchDate", 2);

    const minDateDespatchMissing = getMinMaxValue(PerfData, "DESPATCHDATE", 1);
    const maxDateDespatchMissing = getMinMaxValue(PerfData, "DESPATCHDATE", 2);

    const minDateSafety = getMinMaxValue(safetyData, "OccuredAt", 1);
    const maxDateSafety = getMinMaxValue(safetyData, "OccuredAt", 2);

    const minDateNoDel = getMinMaxValue(NoDelData, "DespatchDateTime", 1);
    const maxDateNoDel = getMinMaxValue(NoDelData, "DespatchDateTime", 2);

    const minDateAdd = getMinMaxValue(AdditionalData, "DespatchDateTime", 1);
    const maxDateAdd = getMinMaxValue(AdditionalData, "DespatchDateTime", 2);

    const [toggled, setToggled] = useState(false);
    const [broken, setBroken] = useState(false);

    // ********************************************************************
    // Each table FilterValue
    const [filtersCons, setFiltersCons] = useState(
        getFiltersCons(minDate, maxDate)
    );
    const [filtersTransport, setFiltersTransport] = useState(
        getFiltersTransport()
    );

    const [filtersNewKPI, setFiltersNewKPI] = useState(
        getFiltersKPI(minDispatchDate, maxDispatchDate)
    );
    const [filtersNewTransit, setFiltersNewTransit] = useState(
        getFiltersNewTransit()
    );
    const [filtersHolidays, setFiltersHolidays] = useState(
        getFiltersHolidays(minDateHol, maxDateHol)
    );
    const [filtersFailed, setFiltersFailed] = useState(
        getFiltersFailed(minDispatchDate, maxDispatchDate)
    );
    const [filtersRDD, setFiltersRDD] = useState(
        getFiltersRDD(minDespatchDaterdd, maxDespatchDaterdd)
    );
    const [filtersMissingPOD, setFiltersMissingPOD] = useState(
        getFiltersPOD(minDateDespatchMissing, maxDateDespatchMissing)
    );
    const [filtersSafety, setFiltersSafety] = useState(
        getFiltersSafety(minDateSafety, maxDateSafety)
    );
    const [filtersNoDelInfo, setFiltersNoDelInfo] = useState(
        getFiltersNoDelInfo(minDateNoDel, maxDateNoDel)
    );
    const [filtersAddCharges, setFiltersAddCharges] = useState(
        getFiltersAddCharges(minDateAdd, maxDateAdd)
    );
    const [filtersDriver, setFiltersDriver] = useState(getFiltersDrivers());
    const [filtersDifot, setFiltersDifot] = useState(getFiltersDifot());

    // ********************************************************************

    const handleDataFromChild = (data) => {
        setDataFromChild(data);
    };
    // Function to format the date
    const formatDate = (dateString) => {
        if (dateString) {
            const [day, month, year] = dateString.split("-");
            // Using template literals to format the date
            return `${year}-${month}-${day}`;
        } else {
            return dateString;
        }
    };
    // Function to format the date to "DD-MM-YYYY"
    const formatDateToDDMMYYYY = (dateString) => {
        if (dateString) {
            const [year, month, day] = dateString.split("-");
            return `${day}-${month}-${year}`;
        } else {
            return dateString;
        }
    };
    // Update filters if the change is in consignments
    useEffect(() => {
        let val = {};
        filtersCons?.map((item) => {
            if (item?.name == "DespatchDate") {
                val = item?.value;
            }
        });
        // Update filtersRDD
        filtersRDD?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });

        // Update filtersKPI
        filtersNewKPI?.map((item) => {
            if (item?.name === "DispatchDate") {
                item.value = val;
            }
        });

        // Update filtersMissingPOD
        filtersMissingPOD?.map((item) => {
            if (item?.name === "DESPATCHDATE") {
                item.value = val;
            }
        });

        // Update filtersNoDelInfo
        filtersNoDelInfo?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersAddCharges
        filtersAddCharges?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                item.value = val;
            }
        });
        setSDate(formatDate(val.start));
        setEDate(formatDate(val.end));
    }, [filtersCons]);

    // Update filters if the change is in add charges
    useEffect(() => {
        let val = {};
        filtersAddCharges?.map((item) => {
            if (item?.name == "DespatchDateTime") {
                val = item?.value;
            }
        });
        // Update filtersRDD
        filtersRDD?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });

        // Update filtersKPI
        filtersNewKPI?.map((item) => {
            if (item?.name === "DispatchDate") {
                item.value = val;
            }
        });

        // Update filtersMissingPOD
        filtersMissingPOD?.map((item) => {
            if (item?.name === "DESPATCHDATE") {
                item.value = val;
            }
        });

        // Update filtersNoDelInfo
        filtersNoDelInfo?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersCons
        filtersCons?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                item.value = val;
            }
        });
        setSDate(formatDate(val.start));
        setEDate(formatDate(val.end));
    }, [filtersAddCharges]);

    // Update filters if the change is in no delivery info
    useEffect(() => {
        let val = {};
        filtersNoDelInfo?.map((item) => {
            if (item?.name == "DespatchDateTime") {
                val = item?.value;
            }
        });
        // Update filtersRDD
        filtersRDD?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });

        // Update filtersKPI
        filtersNewKPI?.map((item) => {
            if (item?.name === "DispatchDate") {
                item.value = val;
            }
        });

        // Update filtersMissingPOD
        filtersMissingPOD?.map((item) => {
            if (item?.name === "DESPATCHDATE") {
                item.value = val;
            }
        });

        // Update filtersAddCharges
        filtersAddCharges?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersCons
        filtersCons?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                item.value = val;
            }
        });
        setSDate(formatDate(val.start));
        setEDate(formatDate(val.end));
    }, [filtersNoDelInfo]);

    // Update filters if the change is in RDD
    useEffect(() => {
        let val = {};
        filtersRDD?.map((item) => {
            if (item?.name == "DespatchDate") {
                val = item?.value;
            }
        });
        // Update filtersAddCharges
        filtersAddCharges?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersKPI
        filtersNewKPI?.map((item) => {
            if (item?.name === "DispatchDate") {
                item.value = val;
            }
        });

        // Update filtersMissingPOD
        filtersMissingPOD?.map((item) => {
            if (item?.name === "DESPATCHDATE") {
                item.value = val;
            }
        });

        // Update filtersNoDelInfo
        filtersNoDelInfo?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersCons
        filtersCons?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                item.value = val;
            }
        });
        setSDate(formatDate(val.start));
        setEDate(formatDate(val.end));
    }, [filtersRDD]);

    // Update filters if the change is in missing pod
    useEffect(() => {
        let val = {};
        filtersMissingPOD?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                val = item?.value;
            }
        });
        // Update filtersAddCharges
        filtersAddCharges?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersKPI
        filtersNewKPI?.map((item) => {
            if (item?.name === "DispatchDate") {
                item.value = val;
            }
        });

        // Update filtersRDD
        filtersRDD?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });

        // Update filtersNoDelInfo
        filtersNoDelInfo?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersCons
        filtersCons?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                item.value = val;
            }
        });
        setSDate(formatDate(val.start));
        setEDate(formatDate(val.end));
    }, [filtersMissingPOD]);

    const [dailyReportData, setDailyReportData] = useState(deliveryReportData);
    const fetchDeliveryReport = async (setCellLoading) => {
        try {
            const res = await axios.get(`${url}Delivery`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            });
            setDailyReportData(res.data || []);

            // Check if setCellLoading exists before calling it
            if (typeof setCellLoading === "function") {
                setCellLoading(null);
            }
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

    const [excelDailyReportData, setExcelDailyReportData] = useState();
    const fetchExcelDeliveryReportData = async (setCellLoading) => {
        try {
            const res = await axios.get(`${url}DeliveryReport`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            });
            setCommentsCheck(
                res.data.some(
                    (item) => item.Comment && item.Comment.trim().length > 0
                )
            );
            setExcelDailyReportData(res.data || []);

            // Check if setCellLoading exists before calling it
            if (typeof setCellLoading === "function") {
                setCellLoading(null);
            }
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
        if (userPermissions) {
            fetchDeliveryReport();
            fetchExcelDeliveryReportData();
            fetchDeliveryReportCommentsData();
        }
    }, [userPermissions]);

    // Update filters if the change is in kpi
    useEffect(() => {
        let val = {};
        filtersNewKPI?.map((item) => {
            if (item?.name == "DispatchDate") {
                val = item?.value;
            }
        });
        // Update filtersAddCharges
        filtersAddCharges?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersMissingPOD
        filtersMissingPOD?.map((item) => {
            if (item?.name === "DESPATCHDATE") {
                item.value = val;
            }
        });

        // Update filtersRDD
        filtersRDD?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });

        // Update filtersNoDelInfo
        filtersNoDelInfo?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersCons
        filtersCons?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                item.value = val;
            }
        });
        setSDate(formatDate(val.start));
        setEDate(formatDate(val.end));
    }, [filtersNewKPI]);
    // Update filters if the change is in failed cons
    useEffect(() => {
        let val = {};
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                val = item?.value;
            }
        });
        // Update filtersKPI
        filtersNewKPI?.map((item) => {
            if (item?.name === "DispatchDate") {
                item.value = val;
            }
        });
        // Update filtersAddCharges
        filtersAddCharges?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });
        // Update filtersMissingPOD
        filtersMissingPOD?.map((item) => {
            if (item?.name === "DESPATCHDATE") {
                item.value = val;
            }
        });
        // Update filtersRDD
        filtersRDD?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
        // Update filtersNoDelInfo
        filtersNoDelInfo?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });
        // Update filtersCons
        filtersCons?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
        setSDate(formatDate(val.start));
        setEDate(formatDate(val.end));
    }, [filtersFailed]);
    //Update Filters if the change is in the Perfromance Report
    useEffect(() => {
        const val = {
            start: formatDateToDDMMYYYY(sharedStartDate),
            end: formatDateToDDMMYYYY(sharedEndDate),
        };
        // Update filtersAddCharges
        filtersAddCharges?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersKPI
        filtersNewKPI?.map((item) => {
            if (item?.name === "DispatchDate") {
                item.value = val;
            }
        });
        // Update filtersMissingPOD
        filtersMissingPOD?.map((item) => {
            if (item?.name === "DESPATCHDATE") {
                item.value = val;
            }
        });

        // Update filtersRDD
        filtersRDD?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });

        // Update filtersNoDelInfo
        filtersNoDelInfo?.map((item) => {
            if (item?.name === "DespatchDateTime") {
                item.value = val;
            }
        });

        // Update filtersCons
        filtersCons?.map((item) => {
            if (item?.name === "DespatchDate") {
                item.value = val;
            }
        });
    }, [sharedEndDate, sharedStartDate]);

    const [chartName, setChartName] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (userPermissions) {
            navigateToFirstAllowedPage({
                setSidebarElements,
                userPermissions: userPermissions,
                navigate,
            });
        }
    }, []);

    return (
        <div className="h-full">
            <div className="h-full">
                {/* Left sidebar & main wrapper */}
                <div className=" h-full flex">
                    {/* Start left column area with collapsing sidebar */}
                    <CollapseSidebar
                        setBroken={setBroken}
                        toggled={toggled}
                        setToggled={setToggled}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        sidebarElements={sidebarElements}
                        setSidebarElements={setSidebarElements}
                        setCustomerAccounts={setCustomerAccounts}
                        customerAccounts={customerAccounts}
                        onData={handleDataFromChild}
                        userPermissions={userPermissions}
                        user={userPermissions}
                    />

                    <main className="w-full overflow-y-auto bg-smooth">
                        <div className="fixed left-0 top-20 z-10">
                            {broken && (
                                <Button
                                    aria-label="chevron right icon"
                                    className="rounded-none rounded-r hover:opcacity-100 opacity-70 bg-dark"
                                    onClick={() => setToggled(!toggled)}
                                    isIconOnly
                                >
                                    <ChevronDoubleRightIcon className="w-5 text-white h-5" />
                                </Button>
                            )}
                        </div>

                        {/* Main content area, displaying dynamically selected components */}
                        <div className="h-full">
                            <div className="rounded-lg h-full">
                                <Routes>
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="Dashboard_view"
                                                element={
                                                    <MainCharts
                                                        chartsData={chartsData}
                                                        safetyData={safetyData}
                                                        accData={dataFromChild}
                                                        chartName={chartName}
                                                        setChartName={
                                                            setChartName
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />

                                    <Route
                                        path="/spendanalysis"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="Dashboard_view"
                                                element={<SpendDashboard />}
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/consignments"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="ConsignmetsReport_view"
                                                element={
                                                    <GtrsCons
                                                        accData={dataFromChild}
                                                        consData={consData}
                                                        filterValue={
                                                            filtersCons
                                                        }
                                                        setFilterValue={
                                                            setFiltersCons
                                                        }
                                                        minDate={minDate}
                                                        maxDate={maxDate}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/consignment-details"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="ConsignmentsDetails_view"
                                                element={
                                                    <ConsDetails
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/performance"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="Performance_view"
                                                element={
                                                    <ConsPerf
                                                        setSharedStartDate={
                                                            setSharedStartDate
                                                        }
                                                        setSharedEndDate={
                                                            setSharedEndDate
                                                        }
                                                        oldestDate={oldestDate}
                                                        latestDate={latestDate}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        accData={dataFromChild}
                                                        PerfData={PerfData}
                                                        EDate={EDate}
                                                        setEDate={setEDate}
                                                        SDate={SDate}
                                                        setSDate={setSDate}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/failed-consignments"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_failedConsignment"
                                                element={
                                                    <FailedConsMain
                                                        oldestDate={oldestDate}
                                                        latestDate={latestDate}
                                                        url={url}
                                                        filterValue={
                                                            filtersFailed
                                                        }
                                                        setFilterValue={
                                                            setFiltersFailed
                                                        }
                                                        failedReasons={
                                                            failedReasons
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        accData={dataFromChild}
                                                        PerfData={PerfData}
                                                        setactiveCon={
                                                            setactiveCon
                                                        }
                                                        EDate={EDate}
                                                        gtccrUrl={gtccrUrl}
                                                        Token={Token}
                                                        setEDate={setEDate}
                                                        SDate={SDate}
                                                        setSDate={setSDate}
                                                        setPerfData={
                                                            setPerfData
                                                        }
                                                        setFailedReasons={
                                                            setFailedReasons
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/no-delivery"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="NoDeliveryInfo_view"
                                                element={
                                                    <NoDelivery
                                                        url={url}
                                                        filterValue={
                                                            filtersNoDelInfo
                                                        }
                                                        setFilterValue={
                                                            setFiltersNoDelInfo
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        NoDelData={NoDelData}
                                                        setNoDelData={
                                                            setNoDelData
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/additional-charges"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="AdditionalCharges_view"
                                                element={
                                                    <AdditionalCharges
                                                        url={url}
                                                        filterValue={
                                                            filtersAddCharges
                                                        }
                                                        setFilterValue={
                                                            setFiltersAddCharges
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        AdditionalData={
                                                            AdditionalData
                                                        }
                                                        setAdditionalData={
                                                            setAdditionalData
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/driver-login"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="DriverLogin_view"
                                                element={
                                                    <DriverLogin
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        DriverData={DriverData}
                                                        setDriverData={
                                                            setDriverData
                                                        }
                                                        filterValue={
                                                            filtersDriver
                                                        }
                                                        setFilterValue={
                                                            setFiltersDriver
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/rdd"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_RDD"
                                                element={
                                                    <RDDMain
                                                        oldestDate={oldestDate}
                                                        latestDate={latestDate}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        url={url}
                                                        filterValue={filtersRDD}
                                                        setFilterValue={
                                                            setFiltersRDD
                                                        }
                                                        accData={dataFromChild}
                                                        rddData={rddData}
                                                        setrddData={setrddData}
                                                        debtorsData={
                                                            debtorsData
                                                        }
                                                        setactiveCon={
                                                            setactiveCon
                                                        }
                                                        EDate={EDate}
                                                        setEDate={setEDate}
                                                        SDate={SDate}
                                                        Token={Token}
                                                        setSDate={setSDate}
                                                        rddReasons={rddReasons}
                                                        setrddReasons={
                                                            setrddReasons
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/safety"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_safety"
                                                element={
                                                    <SafetyRep
                                                        oldestDate={oldestDate}
                                                        latestDate={latestDate}
                                                        url={url}
                                                        Token={Token}
                                                        customerAccounts={
                                                            customerAccounts
                                                        }
                                                        filterValue={
                                                            filtersSafety
                                                        }
                                                        setFilterValue={
                                                            setFiltersSafety
                                                        }
                                                        setSafetyTypes={
                                                            setSafetyTypes
                                                        }
                                                        safetyTypes={
                                                            safetyTypes
                                                        }
                                                        safetyCauses={
                                                            safetyCauses
                                                        }
                                                        setSafetyCauses={
                                                            setSafetyCauses
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        safetyData={safetyData}
                                                        accData={dataFromChild}
                                                        DefaultEDate={EDate}
                                                        DefaultSDate={SDate}
                                                        safetyDataState={
                                                            safetyDataState
                                                        }
                                                        setsafetyDataState={
                                                            setsafetyDataState
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/missing-pod"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="MissingPOD_view"
                                                element={
                                                    <MissingPOD
                                                        filterValue={
                                                            filtersMissingPOD
                                                        }
                                                        setFilterValue={
                                                            setFiltersMissingPOD
                                                        }
                                                        accData={dataFromChild}
                                                        PerfData={PerfData}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi/holidays"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_Holidays"
                                                element={
                                                    <Holidays
                                                        holidays={holidays}
                                                        filterValue={
                                                            filtersHolidays
                                                        }
                                                        setFilterValue={
                                                            setFiltersHolidays
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        setHolidays={
                                                            setHolidays
                                                        }
                                                        url={url}
                                                        Token={Token}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi/reasons"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_KPIReasons"
                                                element={
                                                    <KPIReasons
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        kpireasonsData={
                                                            kpireasonsData
                                                        }
                                                        Token={Token}
                                                        setkpireasonsData={
                                                            setkpireasonsData
                                                        }
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/transport"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_Transport"
                                                element={
                                                    <TransportRep
                                                        accData={dataFromChild}
                                                        transportData={
                                                            transportData
                                                        }
                                                        filterValue={
                                                            filtersTransport
                                                        }
                                                        setFilterValue={
                                                            setFiltersTransport
                                                        }
                                                        minDate={minDate}
                                                        maxDate={maxDate}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="KPI_view"
                                                element={
                                                    <NewKPI
                                                        kpireasonsData={
                                                            kpireasonsData
                                                        }
                                                        KPIData={NewKPIData}
                                                        filterValue={
                                                            filtersNewKPI
                                                        }
                                                        setFilterValue={
                                                            setFiltersNewKPI
                                                        }
                                                        setKPIData={
                                                            setNewKPIData
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        accData={dataFromChild}
                                                        url={url}
                                                        Token={Token}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi/transit-days"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_TransitDays"
                                                element={
                                                    <NewTransitDays
                                                        setNewTransitDays={
                                                            setNewTransitDays
                                                        }
                                                        setFilterValue={
                                                            setFiltersNewTransit
                                                        }
                                                        newTransitDays={
                                                            newTransitDays
                                                        }
                                                        filterValue={
                                                            filtersNewTransit
                                                        }
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        url={url}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/add-transit"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="TransitDays_add"
                                                element={
                                                    <AddNewTransitDay
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        setNewTransitDays={
                                                            setNewTransitDays
                                                        }
                                                        Token={Token}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/pack-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="UnileverReport_View"
                                                element={
                                                    <GraphPresentation
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        Token={Token}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    <Route
                                        path="/real-food-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="RealFoodReport_View"
                                                element={
                                                    <RealFoodKPIPack
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        Token={Token}
                                                    />
                                                }
                                                userPermissions={
                                                    userPermissions
                                                }
                                                setToken={setToken}
                                                setUserPermissions={
                                                    setUserPermissions
                                                }
                                            />
                                        }
                                    />
                                    {/* <Route
                                        path="/traffic-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="TrafficReport_View"
                                                element={<TrafficComp />}
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    /> */}
                                    <Route
                                        path="/incident"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="IncidentDetails_View"
                                                element={
                                                    <Incident
                                                        Token={Token}
                                                        gtccrUrl={gtccrUrl}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    {/* <Route
                                        path="/consignment-tracking"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="ConsignmentTracking_View"
                                                element={
                                                    <ConsTrack
                                                        setFilterValue={
                                                            setFiltersConsTrack
                                                        }
                                                        filterValue={
                                                            filtersConsTrack
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    /> */}
                                    <Route
                                        path="/delivery-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route={[
                                                    "DeliveryReport_View",
                                                    "MetcashDeliveryReport_View",
                                                    "WoolworthsDeliveryReport_View",
                                                    "OtherDeliveryReport_View",
                                                ]}
                                                element={
                                                    <DeliveryReportPage
                                                        url={url}
                                                        Token={Token}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        deliveryReportData={
                                                            dailyReportData
                                                        }
                                                        fetchDeliveryReport={
                                                            fetchDeliveryReport
                                                        }
                                                        deliveryReportComments={
                                                            deliveryReportComments
                                                        }
                                                        fetchDeliveryReportCommentsDataGTRS={
                                                            fetchDeliveryReportCommentsData
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/excel-delivery-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route={[
                                                    "DeliveryReport_View",
                                                    "MetcashDeliveryReport_View",
                                                    "WoolworthsDeliveryReport_View",
                                                    "OtherDeliveryReport_View",
                                                ]}
                                                element={
                                                    <ExcelDeliveryReport
                                                        url={url}
                                                        Token={Token}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        deliveryReportData={
                                                            excelDailyReportData
                                                        }
                                                        commentsCheck={
                                                            commentsCheck
                                                        }
                                                        fetchDeliveryReport={
                                                            fetchExcelDeliveryReportData
                                                        }
                                                        deliveryCommentsOptions={
                                                            deliveryReportComments
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/delivery-report/comments"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route={
                                                    "DeliveryReportCommentsTable_View"
                                                }
                                                element={
                                                    <DeliveryReportCommentsPage
                                                        url={url}
                                                        Token={Token}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        data={
                                                            deliveryReportComments
                                                        }
                                                        fetchDeliveryReportCommentsData={
                                                            fetchDeliveryReportCommentsData
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    {/* <Route
                                        path="/consignment-map"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="ConsignmentMap_View"
                                                element={<ConsMap />}
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    /> */}
                                    {/* <Route
                                        path="/consignment-tracking"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="View_Tracking2"
                                                element={
                                                    <NewConsignmentTracking />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    /> */}
                                    <Route
                                        path="/*"
                                        element={<NotFoundRedirect />}
                                    />
                                    <Route
                                        path="/SOH"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="StockReport_View"
                                                element={
                                                    <ProductStockTable
                                                        url={url}
                                                        Token={Token}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/contacts-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="ContactsRep_View"
                                                element={
                                                    <ContactRep
                                                        url={url}
                                                        Token={Token}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/difot-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="DifotReport_View"
                                                element={
                                                    <DifotReport
                                                        filterValue={
                                                            filtersDifot
                                                        }
                                                        setFilterValue={
                                                            setFiltersDifot
                                                        }
                                                        accData={dataFromChild}
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/utilization-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="UtilizationReport_View"
                                                element={
                                                    <Utilization
                                                        url={url}
                                                        Token={Token}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/settings"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="Settings_View"
                                                element={
                                                    <SettingMiddleware
                                                        url={url}
                                                        Token={Token}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/customer-settings"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="Settings_View"
                                                element={
                                                    <Customers
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        Token={Token}
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                    <Route
                                        path="/customer-profile"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermissions}
                                                route="Settings_View"
                                                element={
                                                    <CustomerProfile
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        Token={Token}
                                                    />
                                                }
                                            />
                                        }
                                        userPermissions={userPermissions}
                                        setToken={setToken}
                                        setUserPermissions={setUserPermissions}
                                    />
                                </Routes>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

GtrsMain.propTypes = {
    gtccrUrl: PropTypes.string,
    Token: PropTypes.string,
    setCusomterAccounts: PropTypes.func,
    setPerfData: PropTypes.func,
    userBody: PropTypes.object,
    safetyData: PropTypes.array,
    debtorsData: PropTypes.array,
    customerAccounts: PropTypes.array,
    setactiveCons: PropTypes.func,
    consData: PropTypes.array,
    rddReasons: PropTypes.array,
    setrddReasons: PropTypes.func,
    chartsData: PropTypes.array,
    sidebarElements: PropTypes.array,
    setSidebarElements: PropTypes.func,
    deliveryReportData: PropTypes.array,
    setUserPermissions: PropTypes.func,
    setToken: PropTypes.func,
    url: PropTypes.string,
    PerfData: PropTypes.array,
    fetchDeliveryReportCommentsData: PropTypes.func,
    deliveryReportComments: PropTypes.array,
    setactiveCon: PropTypes.func,
    transportData: PropTypes.array,
    kpireasonsData: PropTypes.array,
    setkpireasonsData: PropTypes.func,
    setCustomerAccounts: PropTypes.func,
};
