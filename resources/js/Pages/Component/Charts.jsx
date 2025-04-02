import React, { useState, useEffect, useMemo, useCallback } from "react";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import swal from "sweetalert";

// Import all child components
import MainCharts from "./Dashboard_Comp/MainCharts";
import ChartsSidebar from "./Dashboard_Comp/ChartsSidebar";
import GtrsCons from "./GtrsCons";
import KPI from "./KPI";
import ConsignmentD from "../Consignment";
import ConsPerf from "./ConsPerf";
import NoDelivery from "./Dashboard_Comp/NoDelivery";
import AdditionalCharges from "./Dashboard_Comp/AdditionalCharges";
import DriverLogin from "./Dashboard_Comp/DriverLogin";
import SafetyRep from "./safetyRep";
import RDDMain from "./RDDMain";
import FailedConsMain from "./FailedConsMain";
import MissingPOD from "./MissingPOD";
import TransitDays from "./KPI/TransitDays";
import Holidays from "./KPI/Holidays";
import KPIReasons from "./KPI/KPIReasons";
import AddTransit from "./KPI/AddTransit";
import TransportRep from "./TransportRep";
import NewKPI from "./NewKPI";
import NewTransitDays from "./NewTransitDays";
import AddNewTransitDay from "./KPI/AddNewTransitDay";
import GraphPresentation from "./Presentation/GraphPresentation";
import DailyReportPage from "./ReportsPage/DeliveryReportPage";
import RealFoodKPIPack from "./RealFoodKPIPack/RealFoodKPIPack";
import ProductStockTable from "./Products/ProductStockTable";
import ExcelDeliveryReport from "./ReportsPage/DeliveryReports/ExcelDeliveryReport";
import DeliveryReportCommentsPage from "./ReportsPage/DeliveryReports/DeliveryReportCommentsPage";
import ContactRep from "./ContactsRep/ContactRep";

// Helper function to update a filter group immutably
function updateFilterGroup(filters, filterName, newValue) {
    return filters.map((item) =>
        item.name === filterName ? { ...item, value: newValue } : item
    );
}

export default function Charts({
    setCusomterAccounts,
    userBody,
    sessionData,
    safetyData,
    debtorsData,
    customerAccounts,
    setActiveIndexGTRS,
    setactiveCon,
    consData,
    activeIndexGTRS,
    currentUser,
    activeCon,
    PerfData,
    rddReasons,
    setrddReasons,
    transportData,
    url,
    user,
    AToken,
    chartsData,
    kpireasonsData,
    setkpireasonsData,
    deliveryReportData,
}) {
    window.moment = moment;

    // ---------- Data & Miscellaneous States ----------
    const [KPIData, setKPIData] = useState([]);
    const [NewKPIData, setNewKPIData] = useState([]);
    const [transitDays, setTransitDays] = useState();
    const [newTransitDays, setNewTransitDays] = useState();
    const [holidays, setHolidays] = useState();
    const [failedReasons, setFailedReasons] = useState();
    const [rddData, setRddData] = useState();
    const [NoDelData, setNoDelData] = useState();
    const [safetyDataState, setsafetyDataState] = useState([]);
    const [AdditionalData, setAdditionalData] = useState();
    const [DriverData, setDriverData] = useState();
    const [safetyTypes, setSafetyTypes] = useState([]);
    const [safetyCauses, setSafetyCauses] = useState([]);

    // ---------- Derived Date Values ----------
    const oldestDate = useMemo(
        () => getOldestDespatchDate(consData),
        [consData]
    );
    const latestDate = useMemo(
        () => getLatestDespatchDate(consData),
        [consData]
    );
    const minDate = useMemo(
        () => getMinMaxValue(consData, "DespatchDate", 1),
        [consData]
    );
    const maxDate = useMemo(
        () => getMinMaxValue(consData, "DespatchDate", 2),
        [consData]
    );
    const minDateHol = useMemo(
        () => getMinMaxValue(holidays, "HolidayDate", 1),
        [consData]
    );
    const maxDateHol = useMemo(
        () => getMinMaxValue(holidays, "HolidayDate", 2),
        [consData]
    );
    const minDateSafety = useMemo(
        () => getMinMaxValue(safetyData, "OccuredAt", 1),
        [consData]
    );
    const maxDateSafety = useMemo(
        () => getMinMaxValue(safetyData, "OccuredAt", 2),
        [consData]
    );

    // ---------- Filter States ----------
    const [filtersCons, setFiltersCons] = useState([
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "AccountName",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Service",
            operator: "inlist",
            type: "select",
            value: "",
            emptyValue: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: null,
        },
        {
            name: "DeliveredDateTime",
            operator: "inrange",
            type: "date",
            value: null,
            emptyValue: null,
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            value: null,
            emptyValue: null,
        },
        {
            name: "Status",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderSuburb",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverSuburb",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsReferences",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "NetAmount",
            operator: "eq",
            type: "number",
            value: undefined,
            emptyValue: null,
        },
        {
            name: "TottalWeight",
            operator: "eq",
            type: "number",
            value: undefined,
            emptyValue: null,
        },
        {
            name: "POD",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
    ]);
    const [filtersRDD, setFiltersRDD] = useState([
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DebtorName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "AccountNumber",
            operator: "inlist",
            type: "select",
            value: "",
        },
        { name: "SenderName", operator: "contains", type: "string", value: "" },
        {
            name: "SenderAddress",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderSuburb",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverAddress",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverSuburb",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: null,
        },
        {
            name: "OldRdd",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "NewRdd",
            operator: "inrange",
            type: "date",
            value: "",
        },
        {
            name: "Reason",
            operator: "eq",
            type: "select",
            value: null,
        },
        {
            name: "ReasonDesc",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ChangeAt",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "ChangedBy",
            operator: "contains",
            type: "string",
            value: "",
        },
        // ...
    ]);
    const [filtersNewKPI, setFiltersNewKPI] = useState([
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            //emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
            //emptyValue: "",
        },
        {
            name: "ReceiverSuburb",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "DispatchDate",
            operator: "inrange",
            type: "date",
            value: null,
        },
        {
            name: "ReceiverPostCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: null,
        },
        {
            name: "RDD",
            operator: "inrange",
            type: "date",
            value: "",
            //emptyValue: "",
        },
        {
            name: "DeliveryDate",
            operator: "inrange",
            type: "date",
            value: "",
            //emptyValue: "",
        },
        {
            name: "TransitDays",
            operator: "eq",
            type: "number",
            value: null,
            // emptyValue: null,
        },
        {
            name: "CalculatedDelDate",
            operator: "inrange",
            type: "date",
            value: "",
            //emptyValue: "",
        },
        {
            name: "MatchDel",
            operator: "eq",
            type: "select",
            value: null,
            //emptyValue: "",
        },
        {
            name: "ReasonId",
            operator: "eq",
            type: "select",
            value: null,
            //emptyValue: null,
        },
    ]);
    const [filtersMissingPOD, setFiltersMissingPOD] = useState([
        {
            name: "DESPATCHDATE",
            operator: "inrange",
            type: "date",
            value: null,
        },
        {
            name: "CONSIGNMENTNUMBER",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SENDERNAME",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SENDERREFERENCE",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "RECEIVERNAME",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "RECEIVER REFERENCE",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "RECEIVERSTATE",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "SERVICE",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "DESPATCHDATE",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: null,
        },
        {
            name: "DELIVERYREQUIREDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
        },

        {
            name: "ARRIVEDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
        },
        {
            name: "DELIVEREDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
        },
        {
            name: "POD",
            operator: "contains",
            type: "string",
            value: "",
        },
    ]);
    const [filtersNoDelInfo, setFiltersNoDelInfo] = useState([
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DespatchDateTime",
            operator: "inrange",
            type: "date",
            value: null,
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },

        {
            name: "Send_Suburb",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "Send_State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "AdminStatusCodes_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Del_Suburb",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "Del_State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "eq",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
    ]);
    const [filtersAddCharges, setFiltersAddCharges] = useState([
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Quantity",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "TotalCharge",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "CodeRef",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "DescriptionRef",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "FuelLevyAmountRef",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "DespatchDateTime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: null,
        },
        {
            name: "Name",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Description",
            operator: "inlist",
            type: "select",
            value: "",
        },

        {
            name: "Code",
            operator: "eq",
            type: "number",
            value: null,
        },
    ]);
    const [filtersFailed, setFiltersFailed] = useState([
        {
            name: "CONSIGNMENTNUMBER",
            operator: "contains",
            type: "string",
            value: "",
        },
        { name: "SENDERNAME", operator: "contains", type: "string", value: "" },
        {
            name: "SENDERREFERENCE",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "RECEIVERNAME",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "RECEIVER REFERENCE",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "RECEIVERSTATE",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "SERVICE",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "KPI DATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "DESPATCHDATE",
            operator: "inrange",
            type: "date",
            value: null,
        },
        {
            name: "DELIVERYREQUIREDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "ARRIVEDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "DELIVEREDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "POD",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "FailedReason",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "FailedReasonDesc",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Reference",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Department",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Resolution",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "OccuredAt",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "Explanation",
            operator: "contains",
            type: "string",
            value: "",
        },
    ]);
    const [filtersTransport, setFiltersTransport] = useState([
        { name: "PickupDate", operator: "inrange", type: "date", value: null },
        {
            name: "CustomerName",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "CustomerPO",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "DeliveryNo",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "RddDate",
            operator: "inrange",
            type: "date",
            value: "",
            emptyValue: "",
        },
        {
            name: "RddTime",
            operator: "eq",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "LTLFTL",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "State",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "PostalCode",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "Carrier",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "PickupDate",
            operator: "inrange",
            type: "date",
            emptyValue: { start: null, end: null },
            value: null,
        },

        {
            name: "PickupTime",
            operator: "eq",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Status",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ActualDeliveryDate",
            operator: "inrange",
            type: "date",
            value: "",
            emptyValue: "",
        },
        {
            name: "ActualDeliveryTime",
            operator: "inrange",
            type: "date",
            value: "",
            emptyValue: "",
        },
        {
            name: "OnTime",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DelayReason",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "TransportComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
    ]);
    // Additional filters (safety, driver, transit, holidays, reasons, etc.)
    const [filtersSafety, setFiltersSafety] = useState([
        {
            name: "SafetyType",
            operator: "eq",
            type: "select",
            value: null,
        },
        {
            name: "ConsNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DebtorId",
            operator: "eq",
            type: "select",
            value: null,
        },
        {
            name: "CAUSE",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "State",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Explanation",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Resolution",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "Reference",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "OccuredAt",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: {
                start: minDateSafety,
                end: maxDateSafety,
            },
        },
        {
            name: "AddedBy",
            operator: "contains",
            type: "string",
            value: "",
        },
    ]);
    const [filtersDriver, setFiltersDriver] = useState([
        {
            name: "Name",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "DeviceCode",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "SmartSCANSoftwareVersion",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "LastActiveUTC",
            operator: "eq",
            type: "date",
            value: "",
        },
        {
            name: "Name",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SoftwareVersion",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "MobilityDeviceSimTypes_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "MobilityDeviceModels_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "MobilityDeviceMakes_Description",
            operator: "inlist",
            type: "select",
            value: "",
        },
    ]);
    const [filtersTransit, setFiltersTransit] = useState([
        {
            name: "CustomerName",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "CustomerTypeId",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: null,
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "SenderCity",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "SenderSuburb",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "SenderPostCode",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverCity",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverSuburb",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "ReceiverPostCode",
            operator: "eq",
            type: "number",
            value: null,
        },
        {
            name: "TransitTime",
            operator: "eq",
            type: "number",
            value: null,
        },
    ]);
    const [filtersHolidays, setFiltersHolidays] = useState([
        {
            name: "HolidayId",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "HolidayName",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "HolidayDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDateHol,
                end: maxDateHol,
            },
        },
        {
            name: "HolidayState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "HolidayDesc",
            operator: "contains",
            type: "string",
            value: "",
        },
    ]);
    const [filtersReasons, setFiltersReasons] = useState([]);
    const [filtersNewTransit, setFiltersNewTransit] = useState([]);

    // ---------- Other States ----------
    const [dataFromChild, setDataFromChild] = useState(null);
    const [chartName, setChartName] = useState("");
    const [lastIndex, setLastIndex] = useState(0);
    const [dailyReportData, setDailyReportData] = useState(deliveryReportData);
    const [excelDailyReportData, setExcelDailyReportData] = useState();
    const [deliveryReportComments, setDeliveryReportComments] = useState();
    const [newTransitDay, setNewTransitDay] = useState(null);

    // ---------- Helper Functions ----------
    function getOldestDespatchDate(data) {
        const validData = data.filter((item) => isValidDate(item.DespatchDate));
        const sortedData = validData.sort(
            (a, b) => new Date(a.DespatchDate) - new Date(b.DespatchDate)
        );
        if (sortedData.length === 0) return null;
        return new Date(sortedData[0].DespatchDate).toLocaleDateString("en-CA");
    }
    function getLatestDespatchDate(data) {
        const validData = data.filter((item) => isValidDate(item.DespatchDate));
        const sortedData = validData.sort(
            (a, b) => new Date(b.DespatchDate) - new Date(a.DespatchDate)
        );
        if (sortedData.length === 0) return null;
        return new Date(sortedData[0].DespatchDate).toLocaleDateString("en-CA");
    }
    function getMinMaxValue(data, fieldName, identifier) {
        if (!data || !Array.isArray(data) || data.length === 0) return null;
        const sortedData = [...data].sort((a, b) =>
            a[fieldName] < b[fieldName] ? -1 : 1
        );
        const resultDate =
            identifier === 1
                ? new Date(sortedData[0][fieldName])
                : new Date(sortedData[sortedData.length - 1][fieldName]);
        const day = String(resultDate.getDate()).padStart(2, "0");
        const month = String(resultDate.getMonth() + 1).padStart(2, "0");
        const year = resultDate.getFullYear();
        return `${day}-${month}-${year}`;
    }
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date);
    }
    const formatDate = (dateString) =>
        dateString ? dateString.split("-").reverse().join("-") : dateString;

    // ---------- Common Date Filter ----------
    const [commonDespatchDate, setCommonDespatchDate] = useState({
        start: minDate,
        end: maxDate,
    });
    const [SDate, setSDate] = useState(formatDate(commonDespatchDate.start));
    const [EDate, setEDate] = useState(formatDate(commonDespatchDate.end));

    // ---------- Sync Master Date Filter (from filtersCons) ----------
    useEffect(() => {
        const newVal = filtersCons.find((item) => item.name === "DespatchDate")
            ?.value || { start: minDate, end: maxDate };
        setCommonDespatchDate(newVal);
        setSDate(formatDate(newVal.start));
        setEDate(formatDate(newVal.end));
    }, [filtersCons, minDate, maxDate]);

    // ---------- Propagate Common Date to Other Filter Groups ----------
    useEffect(() => {
        setFiltersCons((prev) =>
            updateFilterGroup(prev, "DespatchDate", commonDespatchDate)
        );
        setFiltersRDD((prev) =>
            updateFilterGroup(prev, "DespatchDate", commonDespatchDate)
        );
        setFiltersNewKPI((prev) =>
            updateFilterGroup(prev, "DispatchDate", commonDespatchDate)
        );
        setFiltersMissingPOD((prev) =>
            updateFilterGroup(prev, "DESPATCHDATE", commonDespatchDate)
        );
        setFiltersNoDelInfo((prev) =>
            updateFilterGroup(prev, "DespatchDateTime", commonDespatchDate)
        );
        setFiltersAddCharges((prev) =>
            updateFilterGroup(prev, "DespatchDateTime", commonDespatchDate)
        );
        setFiltersFailed((prev) =>
            updateFilterGroup(prev, "DESPATCHDATE", commonDespatchDate)
        );
        setFiltersTransport((prev) =>
            updateFilterGroup(prev, "PickupDate", commonDespatchDate)
        );
    }, [commonDespatchDate]);

    // ---------- API Calls (wrapped in useCallback) ----------
    const fetchDeliveryReport = useCallback(
        async (setCellLoading) => {
            try {
                const res = await axios.get(`${url}Delivery`, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                });
                setDailyReportData(res.data || []);
                if (typeof setCellLoading === "function") setCellLoading(null);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        icon: "info",
                        button: "OK",
                    }).then(async () => {
                        await handleSessionExpiration();
                    });
                } else {
                    console.error(err);
                    if (typeof setCellLoading === "function")
                        setCellLoading(null);
                }
            }
        },
        [url, currentUser, AToken]
    );

    const fetchExcelDeliveryReportData = useCallback(
        async (setCellLoading) => {
            try {
                const res = await axios.get(`${url}DeliveryReport`, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                });
                setExcelDailyReportData(res.data || []);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        icon: "info",
                        button: "OK",
                    }).then(async () => {
                        await handleSessionExpiration();
                    });
                } else {
                    console.error(err);
                    if (typeof setCellLoading === "function")
                        setCellLoading(null);
                }
            }
        },
        [url, currentUser, AToken]
    );

    const fetchDeliveryReportCommentsData = useCallback(
        async (setCellLoading) => {
            try {
                const res = await axios.get(`${url}Delivery/Comments`, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                });
                setDeliveryReportComments(res.data || []);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        icon: "info",
                        button: "OK",
                    }).then(async () => {
                        await handleSessionExpiration();
                    });
                } else {
                    console.error(err);
                    if (typeof setCellLoading === "function")
                        setCellLoading(null);
                }
            }
        },
        [url, currentUser, AToken]
    );

    useEffect(() => {
        if (currentUser) {
            fetchDeliveryReport();
            fetchExcelDeliveryReportData();
            fetchDeliveryReportCommentsData();
        }
    }, [
        currentUser,
        fetchDeliveryReport,
        fetchExcelDeliveryReportData,
        fetchDeliveryReportCommentsData,
    ]);

    useEffect(() => {
        if (user) {
            Cookies.set("userEmail", user.Email);
        }
    }, [user]);

    const handleDataFromChild = useCallback((data) => {
        setDataFromChild(data);
    }, []);

    // ---------- Components Array (filled with all components) ----------
    const components = [
        <MainCharts
            chartsData={chartsData}
            safetyData={safetyData}
            accData={dataFromChild}
            AToken={AToken}
            currentUser={currentUser}
            EDate={EDate}
            setEDate={setEDate}
            chartName={chartName}
            setChartName={setChartName}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <GtrsCons
            oldestDate={oldestDate}
            latestDate={latestDate}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            consData={consData}
            AToken={AToken}
            userBody={userBody}
            filterValue={filtersCons}
            setFilterValue={setFiltersCons}
            minDate={minDate}
            maxDate={maxDate}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <KPI />,
        <ConsignmentD
            url={url}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            activeCon={activeCon}
            AToken={AToken}
            lastIndex={lastIndex}
            currentUser={currentUser}
        />,
        <ConsPerf
            oldestDate={oldestDate}
            latestDate={latestDate}
            currentUser={currentUser}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setLastIndex={setLastIndex}
            EDate={EDate}
            AToken={AToken}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <FailedConsMain
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            filterValue={filtersFailed}
            setFilterValue={setFiltersFailed}
            failedReasons={failedReasons}
            currentUser={currentUser}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            AToken={AToken}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            setFailedReasons={setFailedReasons}
        />,
        <NoDelivery
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            filterValue={filtersNoDelInfo}
            setFilterValue={setFiltersNoDelInfo}
            currentUser={currentUser}
            setActiveIndexGTRS={setActiveIndexGTRS}
            NoDelData={NoDelData}
            setNoDelData={setNoDelData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            AToken={AToken}
            setSDate={setSDate}
            accData={dataFromChild}
        />,
        <AdditionalCharges
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            filterValue={filtersAddCharges}
            setFilterValue={setFiltersAddCharges}
            currentUser={currentUser}
            setActiveIndexGTRS={setActiveIndexGTRS}
            AdditionalData={AdditionalData}
            setAdditionalData={setAdditionalData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            AToken={AToken}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <DriverLogin
            url={url}
            currentUser={currentUser}
            DriverData={DriverData}
            setDriverData={setDriverData}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            filterValue={filtersDriver}
            setFilterValue={setFiltersDriver}
            EDate={EDate}
            AToken={AToken}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <RDDMain
            oldestDate={oldestDate}
            latestDate={latestDate}
            currentUser={currentUser}
            userBody={userBody}
            url={url}
            filterValue={filtersRDD}
            setFilterValue={setFiltersRDD}
            accData={dataFromChild}
            rddData={rddData}
            setrddData={setRddData}
            debtorsData={debtorsData}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            AToken={AToken}
            setSDate={setSDate}
            rddReasons={rddReasons}
            setrddReasons={setrddReasons}
        />,
        <SafetyRep
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            AToken={AToken}
            customerAccounts={customerAccounts}
            filterValue={filtersSafety}
            setFilterValue={setFiltersSafety}
            setSafetyTypes={setSafetyTypes}
            safetyTypes={safetyTypes}
            safetyCauses={safetyCauses}
            setSafetyCauses={setSafetyCauses}
            failedReasons={failedReasons}
            currentUser={currentUser}
            safetyData={safetyData}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            DefaultEDate={EDate}
            setEDate={setEDate}
            DefaultSDate={SDate}
            safetyDataState={safetyDataState}
            setsafetyDataState={setsafetyDataState}
            setSDate={setSDate}
        />,
        <MissingPOD
            oldestDate={oldestDate}
            latestDate={latestDate}
            url={url}
            AToken={AToken}
            filterValue={filtersMissingPOD}
            setFilterValue={setFiltersMissingPOD}
            failedReasons={failedReasons}
            currentUser={currentUser}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            setFailedReasons={setFailedReasons}
        />,
        <TransitDays
            setTransitDay={setTransitDays}
            transitDays={transitDays}
            filterValue={filtersTransit}
            setFilterValue={setFiltersTransit}
            currentUser={currentUser}
            AToken={AToken}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setTransitDays={setTransitDays}
            url={url}
        />,
        <Holidays
            holidays={holidays}
            filterValue={filtersHolidays}
            setFilterValue={setFiltersHolidays}
            currentUser={currentUser}
            setHolidays={setHolidays}
            url={url}
            AToken={AToken}
        />,
        <KPIReasons
            url={url}
            currentUser={currentUser}
            filterValue={filtersReasons}
            setFilterValue={setFiltersReasons}
            kpireasonsData={kpireasonsData}
            AToken={AToken}
            setkpireasonsData={setkpireasonsData}
        />,
        <AddTransit
            url={url}
            currentUser={currentUser}
            setTransitDay={setTransitDays}
            setTransitDays={setTransitDays}
            AToken={AToken}
            setActiveIndexGTRS={setActiveIndexGTRS}
            transitDay={transitDays}
        />,
        <TransportRep
            oldestDate={oldestDate}
            latestDate={latestDate}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            transportData={transportData}
            AToken={AToken}
            filterValue={filtersTransport}
            setFilterValue={setFiltersTransport}
            minDate={minDate}
            maxDate={maxDate}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <NewKPI
            kpireasonsData={kpireasonsData}
            oldestDate={oldestDate}
            latestDate={latestDate}
            KPIData={NewKPIData}
            filterValue={filtersNewKPI}
            setFilterValue={setFiltersNewKPI}
            setKPIData={setNewKPIData}
            currentUser={currentUser}
            userBody={userBody}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            url={url}
            AToken={AToken}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
        />,
        <NewTransitDays
            setNewTransitDay={setNewTransitDay}
            newTransitDay={newTransitDay}
            setNewTransitDays={setNewTransitDays}
            setFilterValue={setFiltersNewTransit}
            setActiveIndexGTRS={setActiveIndexGTRS}
            newTransitDays={newTransitDays}
            filterValue={filtersNewTransit}
            currentUser={currentUser}
            accData={dataFromChild}
            AToken={AToken}
            url={url}
        />,
        <AddNewTransitDay
            url={url}
            currentUser={currentUser}
            setNewTransitDay={setNewTransitDay}
            setNewTransitDays={setNewTransitDays}
            AToken={AToken}
            setActiveIndexGTRS={setActiveIndexGTRS}
            newtransitDay={newTransitDay}
        />,
        <GraphPresentation
            url={url}
            currentUser={currentUser}
            AToken={AToken}
        />,
        <DailyReportPage
            url={url}
            currentUser={currentUser}
            AToken={AToken}
            deliveryReportData={dailyReportData}
            fetchDeliveryReport={fetchDeliveryReport}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
        />,
        <RealFoodKPIPack url={url} currentUser={currentUser} AToken={AToken} />,
        <ProductStockTable
            url={url}
            currentUser={currentUser}
            AToken={AToken}
        />,
        <DailyReportPage
            url={url}
            currentUser={currentUser}
            AToken={AToken}
            deliveryReportData={dailyReportData}
            fetchDeliveryReport={fetchDeliveryReport}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
        />,
        <ExcelDeliveryReport
            url={url}
            AToken={AToken}
            currentUser={currentUser}
            setactiveCon={setactiveCon}
            setActiveIndexGTRS={setActiveIndexGTRS}
            deliveryReportData={excelDailyReportData}
            fetchDeliveryReport={fetchExcelDeliveryReportData}
            deliveryCommentsOptions={deliveryReportComments}
        />,
        <DeliveryReportCommentsPage
            url={url}
            AToken={AToken}
            currentUser={currentUser}
            data={deliveryReportComments}
            fetchDeliveryReportCommentsData={fetchDeliveryReportCommentsData}
        />,
        <ContactRep url={url} AToken={AToken} currentUser={currentUser} />,
    ];

    return (
        <div className="">
            <div className="h-full flex">
                <div className="min-w-0 flex-1 bg-gray-100 xl:flex">
                    <div className="xl:w-64 flex-shrink-0 w-full h-auto md:block mb-4">
                        <div className="h-full">
                            <div
                                className="relative h-full"
                                style={{ minHeight: "6rem" }}
                            >
                                <div className="inset-0 rounded-lg border-dashed border-gray-200">
                                    <ChartsSidebar
                                        setCusomterAccounts={
                                            setCusomterAccounts
                                        }
                                        customerAccounts={customerAccounts}
                                        activeIndexGTRS={activeIndexGTRS}
                                        sessionData={sessionData}
                                        user={user}
                                        onData={handleDataFromChild}
                                        setActiveIndexGTRS={setActiveIndexGTRS}
                                        currentUser={currentUser}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-smooth w-full lg:min-w-0 lg:flex-1">
                        <div className="h-full">
                            <div
                                className="relative h-full"
                                style={{ minHeight: "36rem" }}
                            >
                                <div className="">
                                    {components[activeIndexGTRS]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
