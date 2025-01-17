import MainCharts from "./Dashboard_Comp/MainCharts";
import { useState } from "react";
import GtrsCons from "./GtrsCons";
import ConsPerf from "./ConsPerf";
import NoDelivery from "./NoDelivery";
import AdditionalCharges from "./AdditionalCharges";
import DriverLogin from "./DriverLogin";
import SafetyRep from "./safetyRep";
import RDDMain from "./RDD/RDDMain";
import FailedConsMain from "./FailedConsignments/FailedConsMain";
import MissingPOD from "./MissingPOD";
import { useEffect } from "react";
import Holidays from "./KPI/Holidays";
import TransportRep from "./TransportRep";
import NewKPI from "./KPI/NewKPI";
import NewTransitDays from "./KPI/NewTransitDays";
import AddNewTransitDay from "./KPI/AddNewTransitDay";
import GraphPresentation from "./Presentation/GraphPresentation";
import DeliveryReportPage from "./ReportsPage/DeliveryReportPage";
import Incident from "./Incident/Incident";
import { ProtectedRoute } from "@/CommonFunctions";
import {
    getLatestDespatchDate,
    getMinMaxValue,
    getOldestDespatchDate,
} from "@/Components/utils/dateUtils";
import TrafficComp from "./TrafficPage/TrafficComp";
import CollapseSidebar from "./CollapseSidebar";
import { Button } from "@nextui-org/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import ConsMap from "./TrafficPage/ConsMap";
import { Routes, Route } from "react-router-dom";
import NotFoundRedirect from "../NotFoundRedirect";
import {ToastContainer} from 'react-toastify';
import {
    getFiltersAddCharges,
    getFiltersCons,
    getFiltersConsTrack,
    getFiltersDrivers,
    getFiltersFailed,
    getFiltersHolidays,
    getFiltersKPI,
    getFiltersNewTransit,
    getFiltersKPIReasons,
    getFiltersNoDelInfo,
    getFiltersPOD,
    getFiltersRDD,
    getFiltersSafety,
    getFiltersTransport,
} from "@/Components/utils/filters";
import ConsDetails from "../ConsDetails";
import NewConsignmentTracking from "./New Consignment Tracking/NewConsignmentTracking";
import MainPageGTRS from "../MainPageGTRS";
import RealFoodKPIPack from "./RealFoodKPIPack/RealFoodKPIPack";
import KPIReasons from "./KPI/KPIReasons";

export default function GtrsMain({
    setCusomterAccounts,
    setPerfData,
    userBody,
    gtccrUrl,
    safetyData,
    debtorsData,
    customerAccounts,
    setactiveCon,
    consData,
    currentUser,
    PerfData,
    IDfilter,
    rddReasons,
    setrddReasons,
    transportData,
    url,
    AToken,
    chartsData,
    kpireasonsData,
    setkpireasonsData,
    userPermission,
    sidebarElements,
    setSidebarElements,
    setToken,
    setCurrentUser,
    setUser,
    deliveryReportData,
}) {
    window.moment = moment;
    const [KPIData, setKPIData] = useState([]);
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
    const [collapsed, setCollapsed] = useState(false);
    const [dataFromChild, setDataFromChild] = useState(null);
    const [newtransitDay, setNewTransitDay] = useState(null);
    const [incidentId, setIncidentId] = useState(null);

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
    const [rtl, setRtl] = useState(false);

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
    const [filtersKPIReasons, setFiltersKPIReasons] = useState(
        getFiltersKPIReasons()
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
    const [filtersConsTrack, setFiltersConsTrack] = useState(
        getFiltersConsTrack(minDispatchDate, maxDispatchDate)
    );

    // ********************************************************************

    const handleDataFromChild = (data) => {
        setDataFromChild(data);
    };
    const [lastIndex, setLastIndex] = useState(0);
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
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
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
                console.log(err);
                // Check if setCellLoading exists before calling it
                if (typeof setCellLoading === "function") {
                    setCellLoading(null);
                }
            }
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchDeliveryReport();
        }
    }, [currentUser]);

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

    return (
        <div className="h-full">
            {/* Added toast container since it wasn't showing */}
            <ToastContainer />
            <div className="h-full">
                {/* Left sidebar & main wrapper */}
                <div className=" h-full flex">
                    {/* Start left column area with collapsing sidebar */}
                    <CollapseSidebar
                        setBroken={setBroken}
                        rtl={rtl}
                        toggled={toggled}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        setToggled={setToggled}
                        sidebarElements={sidebarElements}
                        setSidebarElements={setSidebarElements}
                        setCusomterAccounts={setCusomterAccounts}
                        customerAccounts={customerAccounts}
                        onData={handleDataFromChild}
                        currentUser={currentUser}
                        user={userPermission}
                    />

                    <main className="w-full overflow-y-auto ">
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
                                        path="/main"
                                        element={
                                            <MainPageGTRS
                                                user={userPermission}
                                                setUser={setUser}
                                                setSidebarElements={
                                                    setSidebarElements
                                                }
                                                sidebarElements={
                                                    sidebarElements
                                                }
                                                AToken={AToken}
                                                currentUser={currentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="Dashboard_view"
                                                element={
                                                    <MainCharts
                                                        sideBarToggle={
                                                            collapsed
                                                        }
                                                        chartsData={chartsData}
                                                        safetyData={safetyData}
                                                        accData={dataFromChild}
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/consignments"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/consignment-details"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="ConsignmentsDetails_view"
                                                element={
                                                    <ConsDetails
                                                        url={url}
                                                        currentUser={
                                                            currentUser
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/performance"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        accData={dataFromChild}
                                                        PerfData={PerfData}
                                                        EDate={EDate}
                                                        setEDate={setEDate}
                                                        SDate={SDate}
                                                        setSDate={setSDate}
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/failed-consignments"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="View_failedConsignment"
                                                element={
                                                    <FailedConsMain
                                                        oldestDate={oldestDate}
                                                        latestDate={latestDate}
                                                        setIncidentId={
                                                            setIncidentId
                                                        }
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        accData={dataFromChild}
                                                        PerfData={PerfData}
                                                        setactiveCon={
                                                            setactiveCon
                                                        }
                                                        setLastIndex={
                                                            setLastIndex
                                                        }
                                                        IDfilter={IDfilter}
                                                        EDate={EDate}
                                                        gtccrUrl={gtccrUrl}
                                                        AToken={AToken}
                                                        setEDate={setEDate}
                                                        SDate={SDate}
                                                        setSDate={setSDate}
                                                        setPerfData={
                                                            setPerfData
                                                        }
                                                        setFailedReasons={
                                                            setFailedReasons
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/no-delivery"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        NoDelData={NoDelData}
                                                        setNoDelData={
                                                            setNoDelData
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/additional-charges"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        AdditionalData={
                                                            AdditionalData
                                                        }
                                                        setAdditionalData={
                                                            setAdditionalData
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/driver-login"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="DriverLogin_view"
                                                element={
                                                    <DriverLogin
                                                        url={url}
                                                        currentUser={
                                                            currentUser
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
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/rdd"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="View_RDD"
                                                element={
                                                    <RDDMain
                                                        oldestDate={oldestDate}
                                                        latestDate={latestDate}
                                                        setIncidentId={
                                                            setIncidentId
                                                        }
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        userBody={userBody}
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
                                                        setLastIndex={
                                                            setLastIndex
                                                        }
                                                        EDate={EDate}
                                                        setEDate={setEDate}
                                                        SDate={SDate}
                                                        AToken={AToken}
                                                        setSDate={setSDate}
                                                        rddReasons={rddReasons}
                                                        setrddReasons={
                                                            setrddReasons
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/safety"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="View_safety"
                                                element={
                                                    <SafetyRep
                                                        oldestDate={oldestDate}
                                                        latestDate={latestDate}
                                                        url={url}
                                                        AToken={AToken}
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        safetyData={safetyData}
                                                        accData={dataFromChild}
                                                        setLastIndex={
                                                            setLastIndex
                                                        }
                                                        DefaultEDate={EDate}
                                                        DefaultSDate={SDate}
                                                        safetyDataState={
                                                            safetyDataState
                                                        }
                                                        setsafetyDataState={
                                                            setsafetyDataState
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/missing-pod"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi/holidays"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        setHolidays={
                                                            setHolidays
                                                        }
                                                        url={url}
                                                        AToken={AToken}
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi/reasons"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="View_KPIReasons"
                                                element={
                                                    <KPIReasons
                                                        url={url}
                                                        filterValue={
                                                            filtersKPIReasons
                                                        }
                                                        setFilterValue={
                                                            setFiltersKPIReasons
                                                        }
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        kpireasonsData={
                                                            kpireasonsData
                                                        }
                                                        AToken={AToken}
                                                        setkpireasonsData={
                                                            setkpireasonsData
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                        currentUser={currentUser}
                                        setToken={setToken}
                                        setCurrentUser={setCurrentUser}
                                    />
                                    <Route
                                        path="/transport"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        accData={dataFromChild}
                                                        url={url}
                                                        AToken={AToken}
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/kpi/transit-days"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        url={url}
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/add-transit"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="TransitDays_add"
                                                element={
                                                    <AddNewTransitDay
                                                        url={url}
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        setNewTransitDay={
                                                            setNewTransitDay
                                                        }
                                                        setNewTransitDays={
                                                            setNewTransitDays
                                                        }
                                                        AToken={AToken}
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/pack-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="UnileverReport_View"
                                                element={
                                                    <GraphPresentation
                                                        url={url}
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        AToken={AToken}
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/real-food-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="RealFoodReport_View"
                                                element={
                                                    <RealFoodKPIPack
                                                        url={url}
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        AToken={AToken}
                                                    />
                                                }
                                                currentUser={currentUser}
                                                setToken={setToken}
                                                setCurrentUser={setCurrentUser}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/traffic-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="TrafficReport_View"
                                                element={<TrafficComp />}
                                            />
                                        }
                                        currentUser={currentUser}
                                        setToken={setToken}
                                        setCurrentUser={setCurrentUser}
                                    />
                                    <Route
                                        path="/incident"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="IncidentDetails_View"
                                                element={
                                                    <Incident
                                                        AToken={AToken}
                                                        gtccrUrl={gtccrUrl}
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        currentUser={currentUser}
                                        setToken={setToken}
                                        setCurrentUser={setCurrentUser}
                                    />
                                    {/* <Route
                                        path="/consignment-tracking"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
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
                                        currentUser={currentUser}
                                        setToken={setToken}
                                        setCurrentUser={setCurrentUser}
                                    /> */}
                                    <Route
                                        path="/delivery-report"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route={[
                                                    "DeliveryReport_View",
                                                    "MetcashDeliveryReport_View",
                                                    "WoolworthsDeliveryReport_View",
                                                    "OtherDeliveryReport_View",
                                                ]}
                                                element={
                                                    <DeliveryReportPage
                                                        url={url}
                                                        AToken={AToken}
                                                        currentUser={
                                                            currentUser
                                                        }
                                                        userPermission={
                                                            userPermission
                                                        }
                                                        deliveryReportData={
                                                            dailyReportData
                                                        }
                                                        fetchDeliveryReport={
                                                            fetchDeliveryReport
                                                        }
                                                    />
                                                }
                                            />
                                        }
                                        currentUser={currentUser}
                                        setToken={setToken}
                                        setCurrentUser={setCurrentUser}
                                    />
                                    <Route
                                        path="/consignment-map"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="ConsignmentMap_View"
                                                element={<ConsMap />}
                                            />
                                        }
                                        currentUser={currentUser}
                                        setToken={setToken}
                                        setCurrentUser={setCurrentUser}
                                    />
                                    <Route
                                        path="/consignment-tracking"
                                        element={
                                            <ProtectedRoute
                                                permission={userPermission}
                                                route="View_Tracking2"
                                                element={
                                                    <NewConsignmentTracking />
                                                }
                                            />
                                        }
                                        currentUser={currentUser}
                                        setToken={setToken}
                                        setCurrentUser={setCurrentUser}
                                    />
                                    <Route
                                        path="/*"
                                        element={<NotFoundRedirect />}
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
