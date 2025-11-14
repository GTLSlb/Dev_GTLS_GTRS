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
import SpendDashboard from "./SpendAnalysis/SpendDashboard";
import SettingMiddleware from "./Settings/SettingMiddleware";
import Customers from "./Settings/Customers";
import CustomerProfile from "./Settings/CustomerProfile";
import ContactRep from "./ContactsRep/ContactRep";
import DifotReport from "./DifotReport";
import Utilization from "./UtilizationReport/Utilisation";
import { CustomContext } from "@/CommonContext";
import TimeSlotReport from "./Timeslot/TimeSlotReport";
import { getRoute } from "@/Components/utils/routing.jsx";
import GMIKPIPack from "./GMI/GMIKPIPack";

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
            const res = await axios.get(`${url}Delivery/Report`, {
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
            const res = await axios.get(`${url}Delivery/Report`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            });
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

    const childComponents = {
        "/dashboard": (
            <MainCharts
                chartsData={chartsData}
                safetyData={safetyData}
                accData={dataFromChild}
                chartName={chartName}
                setChartName={setChartName}
                userPermissions={userPermissions}
            />
        ),
        "/consignments": (
            <GtrsCons
                accData={dataFromChild}
                consData={consData}
                filterValue={filtersCons}
                setFilterValue={setFiltersCons}
                minDate={minDate}
                maxDate={maxDate}
                userPermissions={userPermissions}
            />
        ),
        "/spendanalysis": <SpendDashboard />,
        "/kpi": (
            <NewKPI
                kpireasonsData={kpireasonsData}
                KPIData={NewKPIData}
                filterValue={filtersNewKPI}
                setFilterValue={setFiltersNewKPI}
                setKPIData={setNewKPIData}
                userPermissions={userPermissions}
                accData={dataFromChild}
                url={url}
                Token={Token}
            />
        ),
        "/kpi/transit-days": (
            <NewTransitDays
                setNewTransitDays={setNewTransitDays}
                setFilterValue={setFiltersNewTransit}
                newTransitDays={newTransitDays}
                filterValue={filtersNewTransit}
                userPermissions={userPermissions}
                url={url}
            />
        ),
        "/kpi/holidays": (
            <Holidays
                holidays={holidays}
                filterValue={filtersHolidays}
                setFilterValue={setFiltersHolidays}
                userPermissions={userPermissions}
                setHolidays={setHolidays}
                url={url}
                Token={Token}
            />
        ),
        "/kpi/reasons": (
            <KPIReasons
                url={url}
                userPermissions={userPermissions}
                kpireasonsData={kpireasonsData}
                Token={Token}
                setkpireasonsData={setkpireasonsData}
            />
        ),
        "/performance": (
            <ConsPerf
                setSharedStartDate={setSharedStartDate}
                setSharedEndDate={setSharedEndDate}
                oldestDate={oldestDate}
                latestDate={latestDate}
                userPermissions={userPermissions}
                accData={dataFromChild}
                PerfData={PerfData}
                EDate={EDate}
                setEDate={setEDate}
                SDate={SDate}
                setSDate={setSDate}
            />
        ),
        "/failed-consignments": (
            <FailedConsMain
                oldestDate={oldestDate}
                latestDate={latestDate}
                url={url}
                filterValue={filtersFailed}
                setFilterValue={setFiltersFailed}
                failedReasons={failedReasons}
                userPermissions={userPermissions}
                accData={dataFromChild}
                PerfData={PerfData}
                setactiveCon={setactiveCon}
                EDate={EDate}
                gtccrUrl={gtccrUrl}
                Token={Token}
                setEDate={setEDate}
                SDate={SDate}
                setSDate={setSDate}
                setPerfData={setPerfData}
                setFailedReasons={setFailedReasons}
            />
        ),
        "/rdd": (
            <RDDMain
                oldestDate={oldestDate}
                latestDate={latestDate}
                userPermissions={userPermissions}
                url={url}
                filterValue={filtersRDD}
                setFilterValue={setFiltersRDD}
                accData={dataFromChild}
                rddData={rddData}
                setrddData={setrddData}
                debtorsData={debtorsData}
                setactiveCon={setactiveCon}
                EDate={EDate}
                setEDate={setEDate}
                SDate={SDate}
                Token={Token}
                setSDate={setSDate}
                rddReasons={rddReasons}
                setrddReasons={setrddReasons}
            />
        ),
        "/missing-pod": (
            <MissingPOD
                filterValue={filtersMissingPOD}
                setFilterValue={setFiltersMissingPOD}
                accData={dataFromChild}
                PerfData={PerfData}
                userPermissions={userPermissions}
            />
        ),
        "/transport": (
            <TransportRep
                accData={dataFromChild}
                transportData={transportData}
                filterValue={filtersTransport}
                setFilterValue={setFiltersTransport}
                minDate={minDate}
                maxDate={maxDate}
            />
        ),
        "/delivery-report": (
            <DeliveryReportPage
                url={url}
                Token={Token}
                userPermissions={userPermissions}
                deliveryReportData={dailyReportData}
                fetchDeliveryReport={fetchDeliveryReport}
                deliveryReportComments={deliveryReportComments}
                fetchDeliveryReportCommentsDataGTRS={
                    fetchDeliveryReportCommentsData
                }
            />
        ),
        "/delivery-report/comments": (
            <DeliveryReportCommentsPage
                url={url}
                Token={Token}
                userPermissions={userPermissions}
                data={deliveryReportComments}
                fetchDeliveryReportCommentsData={
                    fetchDeliveryReportCommentsData
                }
            />
        ),
        "/pack-report": (
            <GraphPresentation
                url={url}
                userPermissions={userPermissions}
                Token={Token}
            />
        ),
        "/real-food-report": (
            <RealFoodKPIPack
                url={url}
                userPermissions={userPermissions}
                Token={Token}
            />
        ),

        "/safety": (
            <SafetyRep
                oldestDate={oldestDate}
                latestDate={latestDate}
                url={url}
                Token={Token}
                customerAccounts={customerAccounts}
                filterValue={filtersSafety}
                setFilterValue={setFiltersSafety}
                setSafetyTypes={setSafetyTypes}
                safetyTypes={safetyTypes}
                safetyCauses={safetyCauses}
                setSafetyCauses={setSafetyCauses}
                userPermissions={userPermissions}
                safetyData={safetyData}
                accData={dataFromChild}
                DefaultEDate={EDate}
                DefaultSDate={SDate}
                safetyDataState={safetyDataState}
                setsafetyDataState={setsafetyDataState}
            />
        ),
        "/additional-charges": (
            <AdditionalCharges
                url={url}
                filterValue={filtersAddCharges}
                setFilterValue={setFiltersAddCharges}
                userPermissions={userPermissions}
                AdditionalData={AdditionalData}
                setAdditionalData={setAdditionalData}
            />
        ),
        "/no-delivery": (
            <NoDelivery
                url={url}
                filterValue={filtersNoDelInfo}
                setFilterValue={setFiltersNoDelInfo}
                userPermissions={userPermissions}
                NoDelData={NoDelData}
                setNoDelData={setNoDelData}
            />
        ),
        "/driver-login": (
            <DriverLogin
                url={url}
                userPermissions={userPermissions}
                DriverData={DriverData}
                setDriverData={setDriverData}
                filterValue={filtersDriver}
                setFilterValue={setFiltersDriver}
            />
        ),
        "/SOH": (
            <ProductStockTable
                url={url}
                Token={Token}
                userPermissions={userPermissions}
                filterValue={filtersDifot}
                accData={dataFromChild}
                setFilterValue={setFiltersDifot}
            />
        ),
        "/contacts-report": (
            <ContactRep
                url={url}
                Token={Token}
                userPermissions={userPermissions}
            />
        ),
        "/difot-report": (
            <DifotReport
                filterValue={filtersDifot}
                setFilterValue={setFiltersDifot}
                accData={dataFromChild}
            />
        ),
        "/utilisation-report": (
            <Utilization
                permission={userPermissions}
                route="UtilizationReport_View"
                element={
                    <ProductStockTable
                        url={url}
                        Token={Token}
                        userPermissions={userPermissions}
                    />
                }
            />
        ),
        "/timeslot-report": (
            <ProductStockTable
                url={url}
                Token={Token}
                userPermissions={userPermissions}
            />
        ),
        "/settings": (
            <SettingMiddleware
                url={url}
                Token={Token}
                userPermissions={userPermissions}
            />
        ),
        // "/consignment-tracking": <ConsTrack
        //                                                 setFilterValue={
        //                                                     setFiltersConsTrack
        //                                                 }
        //                                                 filterValue={
        //                                                     filtersConsTrack
        //                                                 }
        //                                             />,
        "/consignment-details": (
            <ConsDetails url={url} userPermissions={userPermissions} />
        ),
        "/add-transit": (
            <AddNewTransitDay
                url={url}
                userPermissions={userPermissions}
                setNewTransitDays={setNewTransitDays}
                Token={Token}
            />
        ),
        // "/traffic-report": <TrafficComp />,
        "/incident": (
            <Incident
                Token={Token}
                gtccrUrl={gtccrUrl}
                userPermissions={userPermissions}
            />
        ),
        "/excel-delivery-report": (
            <ExcelDeliveryReport
                url={url}
                Token={Token}
                userPermissions={userPermissions}
                deliveryReportData={excelDailyReportData}
                fetchDeliveryReport={fetchExcelDeliveryReportData}
                deliveryCommentsOptions={deliveryReportComments}
            />
        ),
        // "/consignment-map": <ConsMap />,
        "/customer-profile": (
            <CustomerProfile
                url={url}
                userPermissions={userPermissions}
                Token={Token}
            />
        ),
        "/timeslot-report": <TimeSlotReport accData={dataFromChild} />,
        "/customer-settings": (
            <Customers
                url={url}
                userPermissions={userPermissions}
                Token={Token}
            />
        ),
        "/gmi-kpi-pack": (
            <GMIKPIPack
                                                        url={url}
                                                        userPermissions={
                                                            userPermissions
                                                        }
                                                        Token={Token}
                                                    />
        )
    };
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

                    <main className="w-full overflow-y-auto">
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
                                {getRoute(
                                    userPermissions,
                                    setUserPermissions,
                                    setToken,
                                    childComponents
                                )}
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
