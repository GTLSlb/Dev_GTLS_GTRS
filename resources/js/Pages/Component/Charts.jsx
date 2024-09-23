import MainCharts from "./Dashboard_Comp/MainCharts";
import React, { useState } from "react";
import ChartsSidebar from "./Dashboard_Comp/ChartsSidebar";
import GtrsCons from "./GtrsCons";
import KPI from "./KPI";
import ConsignmentD from "../Consignment";
import ConsPerf from "./ConsPerf";
import FailedCons from "./FailedCons";
import NoDelivery from "./Dashboard_Comp/NoDelivery";
import AdditionalCharges from "./Dashboard_Comp/AdditionalCharges";
import DriverLogin from "./Dashboard_Comp/DriverLogin";
import SafetyRep from "./safetyRep";
import RDDMain from "./RDDMain";
import FailedConsMain from "./FailedConsMain";
import MissingPOD from "./MissingPOD";
import { useEffect } from "react";
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
import Incident from "./Incident";
import swal from "sweetalert";
import { handleSessionExpiration } from '@/CommonFunctions';
import TrafficComp from "./TrafficPage/TrafficComp";
import ConsTrack from "./ConsignmentTracking/ConsTrack";
import CollapseSidebar from "./CollapseSidebar";
import { Button } from "@nextui-org/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import ConsMap from "./TrafficPage/ConsMap";

export default function charts({
    setCusomterAccounts,
    setPerfData,
    userBody,
    sessionData,
    gtccrUrl,
    safetyData,
    debtorsData,
    customerAccounts,
    dashData,
    setActiveIndexGTRS,
    setactiveCon,
    consData,
    activeIndexGTRS,
    currentUser,
    activeCon,
    PerfData,
    IDfilter,
    rddReasons,
    setrddReasons,
    transportData,
    url,
    user,
    AToken,
    chartsData,
    kpireasonsData,
    setkpireasonsData,
    userPermission,
}) {
    window.moment = moment;
    const current = new Date();
    const month = current.getMonth() + 1;
    const [KPIData, setKPIData] = useState([]);
    const [consignmentToTrack, setConsignmentToTrack] = useState();
    const [NewKPIData, setNewKPIData] = useState([]);
    const [transitDays, setTransitDays] = useState();
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
    const [transitDay, setTransitDay] = useState(null);
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

    const [activeModel, setActiveModel] = useState(0);
    const [activePage, setActivePage] = useState(0);
    const [toggled, setToggled] = useState(false);
    const [assets, setAssets] = useState([]);
    const [broken, setBroken] = useState(false);
    const [rtl, setRtl] = useState(false);

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
            value: {
                start: minDate,
                end: maxDate,
            },
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
    ]);
    const [filtersTransport, setFiltersTransport] = useState([
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
            value: {
                start: "2023-07-01",
                end: "2023-07-31",
            },
            emptyValue: "",
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

    const [filtersKPI, setFiltersKPI] = useState([
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
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
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
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
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
            value: undefined,
            emptyValue: null,
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
    const [filtersNewTransit, setFiltersNewTransit] = useState([
        {
            name: "CustomerName",
            operator: "inlist",
            type: "select",
            value: null,
        },
        {
            name: "CustomerTypeId",
            operator: "eq",
            type: "select",
            value: null,
            // emptyValue: "",
        },
        {
            name: "SenderState",
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
    const [filtersReasons, setFiltersReasons] = useState();
    const [filtersFailed, setFiltersFailed] = useState([
        {
            name: "CONSIGNMENTNUMBER",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentTypeName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentStatusName",
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
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
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
    const [filtersRDD, setFiltersRDD] = useState([
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentTypeName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "IncidentStatusName",
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
            value: {
                start: minDespatchDaterdd,
                end: maxDespatchDaterdd,
            },
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
    ]);
    const [filtersMissingPOD, setFiltersMissingPOD] = useState([
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
            value: {
                start: minDateDespatchMissing,
                end: maxDateDespatchMissing,
            },
        },
        {
            name: "DELIVERYREQUIREDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDaterdd,
            //     end: maxDaterdd,
            // },
        },

        {
            name: "ARRIVEDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDateArrive,
            //     end: maxDateArrive,
            // },
        },
        {
            name: "DELIVEREDDATETIME",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDateDel,
            //     end: maxDateDel,
            // },
        },
        {
            name: "POD",
            operator: "contains",
            type: "string",
            value: "",
        },
    ]);
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
            emptyValue: "",
            value: {
                start: minDateNoDel,
                end: maxDateNoDel,
            },
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
            value: {
                start: minDateAdd,
                end: maxDateAdd,
            },
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
    const [filtersConsTrack, setFiltersConsTrack] = useState([
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "DebtorName",
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
            name: "SenderSuburb",
            operator: "contains",
            type: "string",
            value: "",
            //emptyValue: "",
        },
        {
            name: "SenderPostcode",
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
            name: "ReceiverSuburb",
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
            name: "ReceiverPostcode",
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
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDispatchDate,
                end: maxDispatchDate,
            },
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
            name: "EventCount",
            operator: "eq",
            type: "number",
            value: undefined,
            emptyValue: null,
        },
    ]);

    function getOldestDespatchDate(data) {
        // Filter out elements with invalid 'CreatedDate' values
        const validData = data.filter((item) => isValidDate(item.DespatchDate));

        // Sort the validData array based on the 'CreatedDate' property
        const sortedData = validData.sort(
            (a, b) => new Date(a.DespatchDate) - new Date(b.DespatchDate)
        );

        // Check if the sortedData array is empty
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }

        // Extract only the date part from the 'CreatedDate' of the first element (oldest date)
        const oldestDate = new Date(
            sortedData[0]?.DespatchDate
        ).toLocaleDateString("en-CA");
        // Return the oldest date in the 'YYYY-MM-DD' format
        return oldestDate;
    }
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date);
    }
    function getLatestDespatchDate(data) {
        const validData = data.filter((item) => isValidDate(item.DespatchDate));

        // Sort the data array based on the 'DespatchDate' property in descending order
        const sortedData = validData.sort(
            (a, b) => new Date(b.DespatchDate) - new Date(a.DespatchDate)
        );
        if (sortedData.length === 0) {
            return null; // No valid dates found
        }
        const latestDate = new Date(
            sortedData[0]?.DespatchDate
        ).toLocaleDateString("en-CA");

        // Return the 'DespatchDate' of the first element (latest date)
        return latestDate;
    }
    const handleDataFromChild = (data) => {
        setDataFromChild(data);
    };
    const [lastIndex, setLastIndex] = useState(0);
    function getMinMaxValue(data, fieldName, identifier) {
        // Check for null safety
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        // Sort the data based on the fieldName
        const sortedData = [...data].sort((a, b) => {
            if (a[fieldName] < b[fieldName]) return -1;
            if (a[fieldName] > b[fieldName]) return 1;
            return 0;
        });

        // Return the minimum or maximum value based on the identifier
        let resultDate;
        if (identifier === 1) {
            resultDate = new Date(sortedData[0][fieldName]);
        } else if (identifier === 2) {
            resultDate = new Date(sortedData[sortedData.length - 1][fieldName]);
        } else {
            return null;
        }

        // Convert the resultDate to the desired format "01-10-2023"
        const day = String(resultDate.getDate()).padStart(2, "0");
        const month = String(resultDate.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
        const year = resultDate.getFullYear();

        return `${day}-${month}-${year}`;
    }
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
        filtersKPI?.map((item) => {
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
        filtersKPI?.map((item) => {
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
        filtersKPI?.map((item) => {
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
        filtersKPI?.map((item) => {
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
        filtersKPI?.map((item) => {
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

    const [dailyReportData, setDailyReportData] = useState([]);
    const fetchDeliveryReport = async () => {
        try {
            const res = await axios
                .get(`${url}Delivery`, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`
                    }
                });
            setDailyReportData(res.data || []);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                    title: 'Session Expired!',
                    text: "Please login again",
                    type: 'success',
                    icon: "info",
                    confirmButtonText: 'OK'
                }).then(async function () {
                    await handleSessionExpiration();
                });
            } else {
                // Handle other errors
                console.log(err);
            }
        }
    }

    useEffect(() => {
        if(currentUser){
            fetchDeliveryReport();
        }
    },[currentUser])
    const [filtersDailyValue, setFiltersDailyReport] = useState([
        {
            name: "AccountNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ConsignmentNo",
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
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
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
            name: "ReceiverZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SpecialInstructions",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Comments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "CorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "Report",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "GTLSComments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastReasonCode",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PastCorrectiveAction",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "PODAvl",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsignmentStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
        {
            name: "DeliveredDateTime",
            operator: "inrange",
            type: "date",
            value: {
                start: minDate,
                end: maxDate,
            },
        },
    ]);

    // Update filters if the change is in kpi
    useEffect(() => {
        let val = {};
        filtersKPI?.map((item) => {
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
    }, [filtersKPI]);
    // Update filters if the change is in failed cons
    useEffect(() => {
        let val = {};
        filtersFailed?.map((item) => {
            if (item?.name == "DESPATCHDATE") {
                val = item?.value;
            }
        });
        // Update filtersKPI
        filtersKPI?.map((item) => {
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
        filtersKPI?.map((item) => {
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

    const components = [
        <MainCharts
            chartsData={chartsData}
            safetyData={safetyData}
            accData={dataFromChild}
            dashData={dashData}
            AToken={AToken}
            currentUser={currentUser}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            userPermission={userPermission}
        />,
        <GtrsCons
            oldestDate={oldestDate}
            latestDate={latestDate}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            consData={consData}
            AToken={AToken}
            filterValue={filtersCons}
            setFilterValue={setFiltersCons}
            minDate={minDate}
            maxDate={maxDate}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            userPermission={userPermission}
        />,
        <KPI
            kpireasonsData={kpireasonsData}
            oldestDate={oldestDate}
            latestDate={latestDate}
            KPIData={KPIData}
            filterValue={filtersKPI}
            setFilterValue={setFiltersKPI}
            setKPIData={setKPIData}
            currentUser={currentUser}
            userBody={userBody}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            url={url}
            AToken={AToken}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            userPermission={userPermission}
        />,
        <ConsignmentD
            url={url}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            activeCon={activeCon}
            AToken={AToken}
            lastIndex={lastIndex}
            currentUser={currentUser}
            userPermission={userPermission}
        />,
        <ConsPerf
            setSharedStartDate={setSharedStartDate}
            setSharedEndDate={setSharedEndDate}
            oldestDate={oldestDate}
            latestDate={latestDate}
            currentUser={currentUser}
            accData={dataFromChild}
            setActiveIndexGTRS={setActiveIndexGTRS}
            PerfData={PerfData}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            AToken={AToken}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            userPermission={userPermission}
        />,
        <FailedConsMain
            oldestDate={oldestDate}
            latestDate={latestDate}
            setIncidentId={setIncidentId}
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
            IDfilter={IDfilter}
            EDate={EDate}
            gtccrUrl={gtccrUrl}
            AToken={AToken}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            setPerfData={setPerfData}
            setFailedReasons={setFailedReasons}
            userPermission={userPermission}
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
            userPermission={userPermission}
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
            userPermission={userPermission}
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
            userPermission={userPermission}
        />,
        <RDDMain
            oldestDate={oldestDate}
            latestDate={latestDate}
            setIncidentId={setIncidentId}
            currentUser={currentUser}
            userBody={userBody}
            url={url}
            filterValue={filtersRDD}
            setFilterValue={setFiltersRDD}
            accData={dataFromChild}
            rddData={rddData}
            setrddData={setrddData}
            debtorsData={debtorsData}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setactiveCon={setactiveCon}
            setLastIndex={setLastIndex}
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            AToken={AToken}
            setSDate={setSDate}
            rddReasons={rddReasons}
            setrddReasons={setrddReasons}
            userPermission={userPermission}
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
            IDfilter={IDfilter}
            DefaultEDate={EDate}
            setEDate={setEDate}
            DefaultSDate={SDate}
            safetyDataState={safetyDataState}
            setsafetyDataState={setsafetyDataState}
            setSDate={setSDate}
            userPermission={userPermission}
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
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            setPerfData={setPerfData}
            setFailedReasons={setFailedReasons}
            userPermission={userPermission}
        />,
        <TransitDays
            setTransitDay={setTransitDay}
            transitDays={transitDays}
            filterValue={filtersTransit}
            setFilterValue={setFiltersTransit}
            currentUser={currentUser}
            AToken={AToken}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setTransitDays={setTransitDays}
            url={url}
            userPermission={userPermission}
        />,
        <Holidays
            holidays={holidays}
            filterValue={filtersHolidays}
            setFilterValue={setFiltersHolidays}
            currentUser={currentUser}
            setHolidays={setHolidays}
            url={url}
            AToken={AToken}
            userPermission={userPermission}
        />,
        <KPIReasons
            url={url}
            currentUser={currentUser}
            filterValue={filtersReasons}
            setFilterValue={setFiltersReasons}
            kpireasonsData={kpireasonsData}
            AToken={AToken}
            setkpireasonsData={setkpireasonsData}
            userPermission={userPermission}
        />,
        <AddTransit
            url={url}
            currentUser={currentUser}
            setTransitDay={setTransitDay}
            setTransitDays={setTransitDays}
            AToken={AToken}
            setActiveIndexGTRS={setActiveIndexGTRS}
            transitDay={transitDay}
            userPermission={userPermission}
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
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            userPermission={userPermission}
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
            IDfilter={IDfilter}
            EDate={EDate}
            setEDate={setEDate}
            SDate={SDate}
            setSDate={setSDate}
            userPermission={userPermission}
        />,
        <NewTransitDays
            setNewTransitDay={setNewTransitDay}
            newTransitDay={newtransitDay}
            setNewTransitDays={setNewTransitDays}
            setFilterValue={setFiltersNewTransit}
            setActiveIndexGTRS={setActiveIndexGTRS}
            newTransitDays={newTransitDays}
            filterValue={filtersNewTransit}
            currentUser={currentUser}
            accData={dataFromChild}
            AToken={AToken}
            url={url}
            userPermission={userPermission}
        />,
        <AddNewTransitDay
            url={url}
            currentUser={currentUser}
            setNewTransitDay={setNewTransitDay}
            setNewTransitDays={setNewTransitDays}
            AToken={AToken}
            setActiveIndexGTRS={setActiveIndexGTRS}
            newtransitDay={newtransitDay}
            userPermission={userPermission}
        />,
        <GraphPresentation
            url={url}
            currentUser={currentUser}
            user={user}
            AToken={AToken}
            userPermission={userPermission}
        />,
        <TrafficComp />,
        <Incident
            AToken={AToken}
            setActiveIndexGTRS={setActiveIndexGTRS}
            gtccrUrl={gtccrUrl}
            incidentId={incidentId}
            currentUser={currentUser}
            userPermission={userPermission}
        />,
        <ConsTrack
            setFilterValue={setFiltersConsTrack}
            filterValue={filtersConsTrack}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setConsignmentToTrack={setConsignmentToTrack}
        />,
        <DailyReportPage
            url={url}
            AToken={AToken}
            currentUser={currentUser}
            userPermission={userPermission}
            user={user}
            dailyReportData={dailyReportData}
            setLastIndex={setLastIndex}
            setactiveCon={setactiveCon}
            setActiveIndexGTRS={setActiveIndexGTRS}
            setFilterValue={setFiltersDailyReport}
            filterValue={filtersDailyValue}
            fetchDeliveryReport={fetchDeliveryReport}
        />,
        <ConsMap
            consignment={consignmentToTrack}
            setActiveIndexGTRS={setActiveIndexGTRS}
        />,
    ];

    return (
        <div className="h-full">
            <div className="h-full">
                {/* Left sidebar & main wrapper */}
                <div className="bg-gray-100 h-full flex">
                    {/* Start left column area with collapsing sidebar */}
                    <CollapseSidebar
                        activePage={activePage}
                        setActivePage={setActivePage}
                        activeModel={activeModel}
                        setActiveModel={setActiveModel}
                        broken={broken}
                        setBroken={setBroken}
                        rtl={rtl}
                        setRtl={setRtl}
                        toggled={toggled}
                        setToggled={setToggled}
                        setCusomterAccounts={setCusomterAccounts}
                        customerAccounts={customerAccounts}
                        activeIndexGTRS={activeIndexGTRS}
                        sessionData={sessionData}
                        user={user}
                        onData={handleDataFromChild}
                        setActiveIndexGTRS={setActiveIndexGTRS}
                        currentUser={currentUser}
                    />

                    <main className="w-full bg-gray-50 h-full overflow-y-auto">
                        <div
                            style={{ marginBottom: "16px" }}
                            className="fixed left-0 top-20 z-50"
                        >
                            {broken && (
                                <Button
                                    aria-label="chevron right icon"
                                    className="rounded-none rounded-r bg-dark"
                                    onClick={() => setToggled(!toggled)}
                                    isIconOnly
                                >
                                    <ChevronDoubleRightIcon className="w-5 text-white h-5" />
                                </Button>
                            )}
                        </div>

                        {/* Main content area, displaying dynamically selected components */}
                        <div
                            className="relative h-full"
                            style={{ minHeight: "36rem" }}
                        >
                            <div className="absolute inset-0 rounded-lg">
                                {components[activeIndexGTRS]}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
