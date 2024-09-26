import MainCharts from "./Dashboard_Comp/MainCharts";
import React, { useState } from "react";
import GtrsCons from "./GtrsCons";
import ConsignmentD from "../Consignment";
import ConsPerf from "./ConsPerf";
import NoDelivery from "./NoDelivery";
import AdditionalCharges from "./AdditionalCharges";
import DriverLogin from "./DriverLogin";
import SafetyRep from "./safetyRep";
import RDDMain from "./RDD/RDDMain";
import FailedConsMain from "./FailedConsignments/FailedConsMain";
import MissingPOD from "./MissingPOD";
import { useEffect } from "react";
import TransitDays from "./KPI/TransitDays";
import Holidays from "./KPI/Holidays";
import KPIReasons from "./KPI/KPIReasons";
import AddTransit from "./KPI/AddTransit";
import TransportRep from "./TransportRep";
import NewKPI from "./KPI/NewKPI";
import NewTransitDays from "./KPI/NewTransitDays";
import AddNewTransitDay from "./KPI/AddNewTransitDay";
import GraphPresentation from "./Presentation/GraphPresentation";
import DailyReportPage from "./ReportsPage/DeliveryReportPage";
import Incident from "./Incident/Incident";
import { getApiRequest } from "@/CommonFunctions";
import {
    getLatestDespatchDate,
    getMinMaxValue,
    getOldestDespatchDate,
} from "@/Components/utils/dateUtils";
import TrafficComp from "./TrafficPage/TrafficComp";
import ConsTrack from "./ConsignmentTracking/ConsTrack";
import CollapseSidebar from "./CollapseSidebar";
import { Button } from "@nextui-org/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import ConsMap from "./TrafficPage/ConsMap";
import { Routes, Route } from "react-router-dom";
import NoAccess from "@/Components/NoAccess";
import NotFoundPage from "../NotFoundPage";

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
    setactiveCon,
    consData,
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
    const [KPIData, setKPIData] = useState([]);
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
        { name: "SenderName", operator: "contains", type: "string", value: "" },
        {
            name: "SenderReference",
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
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "receiverReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Service",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "KpiDatetime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
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
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "ArrivedDatetime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: "",
        },
        {
            name: "DeliveredDate",
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
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
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
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "Service",
            operator: "inlist",
            type: "select",
            value: "",
        },
        {
            name: "DespatchDate",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            value: {
                start: minDateDespatchMissing,
                end: maxDateDespatchMissing,
            },
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDaterdd,
            //     end: maxDaterdd,
            // },
        },

        {
            name: "ArrivedDatetime",
            operator: "inrange",
            type: "date",
            emptyValue: "",
            // value: {
            //     start: minDateArrive,
            //     end: maxDateArrive,
            // },
        },
        {
            name: "DeliveredDate",
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

    const [dailyReportData, setDailyReportData] = useState([]);

    async function fetchDeliveryReport() {
        const data = await getApiRequest(`${url}Delivery`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setDailyReportData(data || []);
        }
    }

    useEffect(() => {
        if (currentUser) {
            fetchDeliveryReport();
        }
    }, [currentUser]);
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
        <div></div>,
        <ConsignmentD
            url={url}
            accData={dataFromChild}
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
            filterValue={filtersNewTransit}
            setFilterValue={setFiltersNewTransit}
            currentUser={currentUser}
            AToken={AToken}
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
            transitDay={transitDay}
            userPermission={userPermission}
        />,
        <TransportRep
            oldestDate={oldestDate}
            latestDate={latestDate}
            accData={dataFromChild}
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
            gtccrUrl={gtccrUrl}
            incidentId={incidentId}
            currentUser={currentUser}
            userPermission={userPermission}
        />,
        <ConsTrack
            setFilterValue={setFiltersConsTrack}
            filterValue={filtersConsTrack}
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
            setFilterValue={setFiltersDailyReport}
            filterValue={filtersDailyValue}
            fetchDeliveryReport={fetchDeliveryReport}
        />,
        <ConsMap />,
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
                        sessionData={sessionData}
                        user={user}
                        onData={handleDataFromChild}
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
                                <Routes>
                                    <Route
                                        path="/dashboard"
                                        element={<MainCharts
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
                                        />}
                                    />
                                    <Route
                                        path="/consignments"
                                        element={ <GtrsCons
                                            oldestDate={oldestDate}
                                            latestDate={latestDate}
                                            accData={dataFromChild}
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
                                        />}
                                    />
                                    <Route
                                        path="/consignment-details"
                                        element={<ConsignmentD
                                            url={url}
                                            accData={dataFromChild}
                                            activeCon={activeCon}
                                            AToken={AToken}
                                            lastIndex={lastIndex}
                                            currentUser={currentUser}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/performance"
                                        element={<ConsPerf
                                            setSharedStartDate={setSharedStartDate}
                                            setSharedEndDate={setSharedEndDate}
                                            oldestDate={oldestDate}
                                            latestDate={latestDate}
                                            currentUser={currentUser}
                                            accData={dataFromChild}
                                            PerfData={PerfData}
                                            setLastIndex={setLastIndex}
                                            IDfilter={IDfilter}
                                            EDate={EDate}
                                            AToken={AToken}
                                            setEDate={setEDate}
                                            SDate={SDate}
                                            setSDate={setSDate}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/failed-consignments"
                                        element={<FailedConsMain
                                            oldestDate={oldestDate}
                                            latestDate={latestDate}
                                            setIncidentId={setIncidentId}
                                            url={url}
                                            filterValue={filtersFailed}
                                            setFilterValue={setFiltersFailed}
                                            failedReasons={failedReasons}
                                            currentUser={currentUser}
                                            accData={dataFromChild}
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
                                        />}
                                    />
                                    <Route
                                        path="/no-delivery"
                                        element={<NoDelivery
                                            oldestDate={oldestDate}
                                            latestDate={latestDate}
                                            url={url}
                                            filterValue={filtersNoDelInfo}
                                            setFilterValue={setFiltersNoDelInfo}
                                            currentUser={currentUser}
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
                                        />}
                                    />
                                    <Route
                                        path="/additional-charges"
                                        element={ <AdditionalCharges
                                            oldestDate={oldestDate}
                                            latestDate={latestDate}
                                            url={url}
                                            filterValue={filtersAddCharges}
                                            setFilterValue={setFiltersAddCharges}
                                            currentUser={currentUser}
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
                                        />}
                                    />
                                    <Route
                                        path="/driver-login"
                                        element={<DriverLogin
                                            url={url}
                                            currentUser={currentUser}
                                            DriverData={DriverData}
                                            setDriverData={setDriverData}
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
                                        />}
                                    />
                                    <Route
                                        path="/rdd"
                                        element={<RDDMain
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
                                        />}
                                    />
                                    <Route
                                        path="/safety"
                                        element={<SafetyRep
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
                                        />}
                                    /><Route
                                        path="/missing-pod"
                                        element={<MissingPOD
                                            oldestDate={oldestDate}
                                            latestDate={latestDate}
                                            url={url}
                                            AToken={AToken}
                                            filterValue={filtersMissingPOD}
                                            setFilterValue={setFiltersMissingPOD}
                                            failedReasons={failedReasons}
                                            currentUser={currentUser}
                                            accData={dataFromChild}
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
                                        />}
                                    />
                                    <Route
                                        path="/kpi/holidays"
                                        element={<Holidays
                                            holidays={holidays}
                                            filterValue={filtersHolidays}
                                            setFilterValue={setFiltersHolidays}
                                            currentUser={currentUser}
                                            setHolidays={setHolidays}
                                            url={url}
                                            AToken={AToken}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/kpi-reasons"
                                        element={<KPIReasons
                                            url={url}
                                            currentUser={currentUser}
                                            filterValue={filtersReasons}
                                            setFilterValue={setFiltersReasons}
                                            kpireasonsData={kpireasonsData}
                                            AToken={AToken}
                                            setkpireasonsData={setkpireasonsData}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/transport"
                                        element={<TransportRep
                                            oldestDate={oldestDate}
                                            latestDate={latestDate}
                                            accData={dataFromChild}
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
                                        />}
                                    />
                                    <Route
                                        path="/kpi"
                                        element={<NewKPI
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
                                        />}
                                    />
                                    <Route
                                        path="/kpi/transit-days"
                                        element={<NewTransitDays
                                            setNewTransitDay={setNewTransitDay}
                                            newTransitDay={newtransitDay}
                                            setNewTransitDays={setNewTransitDays}
                                            setFilterValue={setFiltersNewTransit}
                                            newTransitDays={newTransitDays}
                                            filterValue={filtersNewTransit}
                                            currentUser={currentUser}
                                            accData={dataFromChild}
                                            AToken={AToken}
                                            url={url}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/add-transit"
                                        element={<AddNewTransitDay
                                            url={url}
                                            currentUser={currentUser}
                                            setNewTransitDay={setNewTransitDay}
                                            setNewTransitDays={setNewTransitDays}
                                            AToken={AToken}
                                            newtransitDay={newtransitDay}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/pack-report"
                                        element={<GraphPresentation
                                            url={url}
                                            currentUser={currentUser}
                                            user={user}
                                            AToken={AToken}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/traffic-report"
                                        element={<TrafficComp />}
                                    />
                                    <Route
                                        path="/incident"
                                        element={<Incident
                                            AToken={AToken}
                                            gtccrUrl={gtccrUrl}
                                            incidentId={incidentId}
                                            currentUser={currentUser}
                                            userPermission={userPermission}
                                        />}
                                    />
                                    <Route
                                        path="/consignment-tracking"
                                        element={<ConsTrack
                                            setFilterValue={setFiltersConsTrack}
                                            filterValue={filtersConsTrack}
                                        />}
                                    />
                                    <Route
                                        path="/delivery-report"
                                        element={<DailyReportPage
                                            url={url}
                                            AToken={AToken}
                                            currentUser={currentUser}
                                            userPermission={userPermission}
                                            user={user}
                                            dailyReportData={dailyReportData}
                                            setLastIndex={setLastIndex}
                                            setactiveCon={setactiveCon}
                                            setFilterValue={setFiltersDailyReport}
                                            filterValue={filtersDailyValue}
                                            fetchDeliveryReport={fetchDeliveryReport}
                                        />}
                                    />
                                    <Route
                                        path="/consignment-map"
                                        element={<ConsMap />}
                                    />


                                    <Route
                                        path="/*"
                                        element={<NotFoundPage />}
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
