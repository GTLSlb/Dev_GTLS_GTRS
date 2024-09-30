import React, { useState, useEffect } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import axios from "axios";
import { useDisclosure } from "@nextui-org/react";
import { useRef } from "react";
import EventModal from "../TrafficPage/EventModal";
import TableStructure from "@/Components/TableStructure";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { formatDateToExcel } from "@/CommonFunctions";
import { exportToExcel } from "@/Components/utils/excelUtils";
import ExportPopover from "@/Components/ExportPopover";
import { useNavigate } from "react-router-dom";

const gtrsWebUrl = window.Laravel.gtrsWeb;

function ConsTrack({
    setFilterValue,
    filterValue,
}) {
    const [selected, setSelected] = useState([]);

    // Todo: Replace this with the actual request
    const [filteredData, setFilteredData] = useState([
        {
            id: 1,
            ConsignmentId: 296980,
            ConsignmentNo: "2500918307",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "Amazon Dandenong South VIC",
            ReceiverState: "VIC",
            ReceiverSuburb: "DANDENONG SOUTH",
            ReceiverPostcode: "3175",
            ReceiverAddressName: "29 National Drive",
            DespatchDate: "2022-08-25 00:00:00",
            RDD: "2030-10-26 13:00:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -38.03,
                    ReceiverLongitude: 145.18,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 206,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15279",
                    description:
                        "West Gate Tunnel - No Right Turn onto Dynon Road from the Inbound exit ramp from CityLink - Dynon Road Roadworks",
                    start_date: "2024-09-09 20:00:00",
                    end_date: "2024-09-22 05:00:00",
                    latitude: "-37.800394518348",
                    longitude: "144.93669944287",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.9366994428707,-37.8003945183483]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Dynon Road - No Right Turn onto Dynon Road from the Inbound exit ramp from CityLink",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Lanes blocked",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "No right turn from the Dynon Road inbound exit ramp from CityLink onto Dynon Road westbound nightly between 8pm and 5am on the following dates:\r\n\r\n\r\n\tMonday 9 September to Thursday 12 September\r\n\tTuesday 17 September to Saturday 21 September\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 219,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15290",
                    description:
                        "West Gate Tunnel - (Bolte Bridge-bound) Inbound at Footscray Road - CityLink Roadworks",
                    start_date: "2024-09-13 22:00:00",
                    end_date: "2024-09-23 05:00:00",
                    latitude: "-37.810760198026",
                    longitude: "144.93401144323",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.9340114432335,-37.81076019802563]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "CityLink - (Bolte Bridge-bound) Inbound at Footscray Road",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Lanes blocked",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Double lane closure in place overnight on the following dates:\r\n\r\n\r\n\tFriday 13 September, between 10pm and 7am\r\n\tSaturday 14 September, between 8pm and 8am\r\n\tSunday 15 September, between 10pm and 5am\r\n\tSaturday 21 September, between 10pm and 8am\r\n\tSunday 22 September, between 10pm and 5am.\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 220,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15294",
                    description:
                        "West Gate Tunnel - Inbound exit ramp from CityLink - Footscray Road Roadworks",
                    start_date: "2024-09-20 20:00:00",
                    end_date: "2024-09-23 02:00:00",
                    latitude: "-37.803781147092",
                    longitude: "144.93517584646",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.935175846463,-37.80378114709207]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Footscray Road - Inbound exit ramp from CityLink",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Friday 20 September, between 8pm and 11:59pm.\r\n\r\nAdditional overnight closure on Sunday 22 September, between 10pm and 2am.",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 237,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15240",
                    description:
                        "West Gate Tunnel - (Bolte Bridge-bound) from Flemington Road to Footscray Road - CityLink Roadworks",
                    start_date: "2024-09-21 23:00:00",
                    end_date: "2024-10-06 07:00:00",
                    latitude: "-37.798264162814",
                    longitude: "144.93661050377",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.9366105037689,-37.79826416281434]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "CityLink - (Bolte Bridge-bound) from Flemington Road to Footscray Road",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Saturday 21 September and Saturday 5 October, between 11pm and 7am each night.",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 1127,
                    api_source: "VIC",
                    event_id:
                        "Unplanned:TowAllocation:010203040506070809101112131415167457285FBF0BFBFCB6839D437F356F23",
                    description:
                        "TowAllocation - Burnley Tunnel - Southbank - Proceed with Caution",
                    start_date: null,
                    end_date: null,
                    latitude: "-37.825561",
                    longitude: "144.9689477",
                    geometry_type: "Point",
                    geometry_coordinates: "[144.9689477,-37.825561]",
                    suburb: "Southbank",
                    traffic_direction: null,
                    road_name: "Burnley Tunnel",
                    status: "Active",
                    event_category_id: 4,
                    event_type: "Hazard",
                    impact: "No Blockage",
                    source_url: "TowAllocation",
                    advice: null,
                    information:
                        "TowAllocation - Burnley Tunnel - Southbank - Proceed with Caution",
                    created_at: "2024-09-18T11:43:28.000000Z",
                    updated_at: "2024-09-18T11:43:28.000000Z",
                    location: null,
                },
            ],
            EventCount: 5,
        },
        {
            id: 2,
            ConsignmentId: 411493,
            ConsignmentNo: "MP37936",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "METCASH - LAVERTON",
            SenderState: "VIC",
            SenderSuburb: "LAVERTON NORTH",
            SenderPostcode: "3026",
            SenderAddressName: "75-79 Fitzgerald Road",
            ReceiverName: "UNILEVER FOODS - MELB",
            ReceiverState: "VIC",
            ReceiverSuburb: "TULLAMARINE",
            ReceiverPostcode: "3043",
            ReceiverAddressName: "38-52 SKY ROAD",
            DespatchDate: "2023-10-30 07:00:00",
            RDD: "2024-10-03 00:00:00",
            Coordinates: [
                {
                    SenderLatitude: -37.84,
                    SenderLongitude: 144.8,
                    ReceiverLatitude: -37.69,
                    ReceiverLongitude: 144.88,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 859,
                    api_source: "VIC",
                    event_id: "Unplanned:RID:RUD-INC1005652_RUD-IMP1005653",
                    description:
                        "Road closed inbound between Western Ring Out-keilor Park Ramp Of, Keilor East and Western Ring Out-keilor Park Ramp Of due to flood. Restricted access (essential services). Emergency services are now attending.",
                    start_date: "2024-08-28 13:21:22",
                    end_date: null,
                    latitude: "-37.742986385069",
                    longitude: "144.84529809187",
                    geometry_type: "LineString",
                    geometry_coordinates:
                        "[[144.84529809187393,-37.742986385069244],[144.84595035708745,-37.74264629719855]]",
                    suburb: "KEILOR EAST",
                    traffic_direction: "Inbound",
                    road_name: "WESTERN RING ROAD",
                    status: "Active",
                    event_category_id: 3,
                    event_type: "Flooding",
                    impact: "Road closed",
                    source_url: "RID",
                    advice: "Western Ring Road (M80), Keilor East - Road closed inbound between Western Ring Out-keilor Park Ramp Of, Keilor East and Western Ring Out-keilor Park Ramp Of due to flood. Restricted access (essential services). Emergency services are now attending.",
                    information:
                        "Road closed inbound between Western Ring Out-keilor Park Ramp Of, Keilor East and Western Ring Out-keilor Park Ramp Of due to flood. Restricted access (essential services). Emergency services are now attending.",
                    created_at: "2024-09-18T11:43:27.000000Z",
                    updated_at: "2024-09-18T11:43:27.000000Z",
                    location: null,
                },
            ],
            EventCount: 1,
        },
        {
            id: 3,
            ConsignmentId: 486728,
            ConsignmentNo: "2501036683",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "ALDI BRENDALE.",
            ReceiverState: "QLD",
            ReceiverSuburb: "BRENDALE",
            ReceiverPostcode: "4500",
            ReceiverAddressName: "68 KREMZOW RD",
            DespatchDate: "2024-08-29 00:00:00",
            RDD: "2024-09-27 23:59:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -27.29,
                    ReceiverLongitude: 152.96,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [],
            EventCount: 0,
        },
        {
            id: 4,
            ConsignmentId: 486729,
            ConsignmentNo: "2501036683",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "ALDI BRENDALE.",
            ReceiverState: "QLD",
            ReceiverSuburb: "BRENDALE",
            ReceiverPostcode: "4500",
            ReceiverAddressName: "68 KREMZOW RD",
            DespatchDate: "2024-09-06 00:00:00",
            RDD: "2024-09-27 23:59:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -27.29,
                    ReceiverLongitude: 152.96,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [],
            EventCount: 0,
        },
        {
            id: 5,
            ConsignmentId: 418791,
            ConsignmentNo: "MP38964",
            DebtorId: 219,
            DebtorName: "GTLS NO CHARGE ACCOUNT",
            SenderName: "30MINS LUNCH BREAK",
            SenderState: "VIC",
            SenderSuburb: "DANDENONG SOUTH",
            SenderPostcode: "3175",
            SenderAddressName: "",
            ReceiverName: "30MINS LUNCH BREAK",
            ReceiverState: "VIC",
            ReceiverSuburb: "DANDENONG SOUTH",
            ReceiverPostcode: "3175",
            ReceiverAddressName: "",
            DespatchDate: "2023-11-16 00:00:00",
            RDD: "2025-01-01 00:00:00",
            Coordinates: [
                {
                    SenderLatitude: -38.03,
                    SenderLongitude: 145.18,
                    ReceiverLatitude: -38.03,
                    ReceiverLongitude: 145.18,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [],
            EventCount: 0,
        },
        {
            id: 6,
            ConsignmentId: 405960,
            ConsignmentNo: "TMSODV000003",
            DebtorId: 286,
            DebtorName: "TMS- MAIN",
            SenderName: "TMS Melbourne",
            SenderState: "VIC",
            SenderSuburb: "TRUGANINA",
            SenderPostcode: "3029",
            SenderAddressName: "10 Dunmore Drive",
            ReceiverName: "GTL TST3",
            ReceiverState: "VIC",
            ReceiverSuburb: "MELBOURNE",
            ReceiverPostcode: "3000",
            ReceiverAddressName: "13 Queen Street",
            DespatchDate: "2023-10-06 00:00:00",
            RDD: "2024-10-10 15:00:00",
            Coordinates: [
                {
                    SenderLatitude: -37.88,
                    SenderLongitude: 144.7,
                    ReceiverLatitude: -37.81,
                    ReceiverLongitude: 144.97,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 44,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:13672",
                    description:
                        "West Gate Tunnel - Inbound from Kororoit Creek Road and the M80 interchange - Princes Freeway Roadworks",
                    start_date: "2024-04-09 22:00:00",
                    end_date: "2024-04-11 05:00:00",
                    latitude: "-37.840562198711",
                    longitude: "144.79324510365",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.7932451036542,-37.84056219871055]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound from Kororoit Creek Road and the M80 interchange",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Tuesday 9 April and Wednesday 10 April, between 10pm and 5am each night.\r\n\r\nPlease note, the Princes Freeway inbound ramps to Geelong Road and the West Gate Freeway will also be closed during this time.",
                    created_at: "2024-09-18T11:43:21.000000Z",
                    updated_at: "2024-09-18T11:43:21.000000Z",
                    location: null,
                },
                {
                    id: 202,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15259",
                    description:
                        "West Gate Tunnel - Inbound exit ramp to Geelong Road - Princes Freeway Roadworks",
                    start_date: "2024-09-13 21:00:00",
                    end_date: "2024-09-20 05:00:00",
                    latitude: "-37.827565455917",
                    longitude: "144.81714448537",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8171444853735,-37.82756545591655]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound exit ramp to Geelong Road",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on the following nights:\r\n\r\n\r\n\tFriday 13 September, between 9pm and 5am\r\n\tTuesday 17 September to Thursday 19 September 2024, between 9pm and 5am each night\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 231,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15277",
                    description:
                        "West Gate Tunnel - Inbound entry ramp to the West Gate Freeway (Outer Lanes) - Princes Freeway Roadworks",
                    start_date: "2024-09-13 23:00:00",
                    end_date: "2024-09-20 05:00:00",
                    latitude: "-37.825086369331",
                    longitude: "144.82143336872",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8214333687238,-37.82508636933091]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound entry ramp to the West Gate Freeway (Outer Lanes)",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on the following nights:\r\n\r\n\r\n\tFriday 13 September, between 11pm and 7am.\r\n\tTuesday 17 September to Thursday 19 September, between 10pm and 5am each night.\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 232,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15311",
                    description:
                        "West Gate Tunnel - Inbound entry ramp to the West Gate Freeway (Outer Lanes) - Princes Freeway Roadworks",
                    start_date: "2024-09-20 23:00:00",
                    end_date: "2024-09-21 07:00:00",
                    latitude: "-37.825086369331",
                    longitude: "144.82143336872",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8214333687238,-37.82508636933091]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound entry ramp to the West Gate Freeway (Outer Lanes)",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Friday 20 September 2024, between 11pm and 7am.",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 922,
                    api_source: "VIC",
                    event_id: "Unplanned:RID:RUD-INC1005764_RUD-IMP1005765",
                    description:
                        "1 lane closed eastbound between Wlliamstown road and Todd road In Ramp due to debris. Please avoid the area and seek an alternate route.",
                    start_date: "2024-09-04 13:44:27",
                    end_date: null,
                    latitude: "-37.82505869501",
                    longitude: "144.87784525951",
                    geometry_type: "LineString",
                    geometry_coordinates:
                        "[[144.8778452595054,-37.82505869501018],[144.8781861,-37.825107],[144.8791926,-37.8252291],[144.8799992,-37.8252906],[144.880303788,-37.825296965],[144.8806931,-37.8253051],[144.880910124,-37.825311236],[144.881031652,-37.825314672],[144.881142893,-37.825317817],[144.8813828,-37.8253246],[144.881963644,-37.825315932],[144.8823008,-37.8253109],[144.883326,-37.8252654],[144.8843605,-37.8252004],[144.8850116,-37.8251716],[144.885430762,-37.825165825],[144.885556,-37.8251641],[144.8858305,-37.8251686],[144.8865357,-37.8251957],[144.8867939,-37.8252101],[144.8870077,-37.8252256],[144.887076907,-37.825230479],[144.887208193,-37.825239735],[144.8874006,-37.8252533],[144.8881377,-37.8253242],[144.8888792,-37.8254389],[144.8894181,-37.8255354],[144.8896256,-37.8255767],[144.8903614,-37.8257444],[144.8910876,-37.8259437],[144.891745,-37.8261435],[144.892511,-37.8264147],[144.8933378,-37.8267394],[144.893781,-37.8269438],[144.8945204,-37.8273175],[144.894863492,-37.827505483],[144.8950871,-37.827628],[144.895219887,-37.827702519],[144.8955226,-37.8278724],[144.8963876,-37.8283579],[144.896946688,-37.828687964],[144.8975413,-37.829039],[144.898465164,-37.829591053],[144.89861,-37.8296776],[144.899241706,-37.83005116],[144.899935895,-37.830461669],[144.9005963,-37.8308522],[144.9018298,-37.8315689],[144.9024272,-37.8319254],[144.9029311,-37.8322287],[144.9035036,-37.8325398],[144.9041647,-37.8328389],[144.904415746,-37.832937012],[144.9048287,-37.8330984],[144.905438,-37.8332833],[144.9062971,-37.8335008],[144.9070335,-37.8336208],[144.9073691,-37.833662],[144.9077035,-37.8336962],[144.9081083,-37.8337284],[144.9085041,-37.8337455],[144.9088692,-37.8337481],[144.9092265,-37.8337396],[144.9095916,-37.8337239],[144.9099822,-37.8336921],[144.9103486,-37.8336542],[144.9107227,-37.8335985],[144.910931969,-37.833560417],[144.911082044,-37.833533106],[144.9114497,-37.8334662],[144.91161692900437,-37.83342679212158]]",
                    suburb: "YARRAVILLE",
                    traffic_direction: "Eastbound",
                    road_name: "WEST GATE FREEWAY",
                    status: "Active",
                    event_category_id: 4,
                    event_type: "Hazard",
                    impact: "Lanes closed",
                    source_url: "RID",
                    advice: "West Gate Freeway (M1), Yarraville - 1 lane closed eastbound between West Gate In-williamstown Ramp Of, Yarraville and West Gate In-west Gate In Ramp due to debris. Please avoid the area and seek an alternate route.",
                    information:
                        "1 lane closed eastbound between Wlliamstown road and Todd road In Ramp due to debris. Please avoid the area and seek an alternate route.",
                    created_at: "2024-09-18T11:43:27.000000Z",
                    updated_at: "2024-09-18T11:43:27.000000Z",
                    location: null,
                },
            ],
            EventCount: 5,
        },
        {
            id: 7,
            ConsignmentId: 405961,
            ConsignmentNo: "TMSODV000003",
            DebtorId: 286,
            DebtorName: "TMS- MAIN",
            SenderName: "TMS Melbourne",
            SenderState: "VIC",
            SenderSuburb: "TRUGANINA",
            SenderPostcode: "3029",
            SenderAddressName: "10 Dunmore Drive",
            ReceiverName: "GTL TST3",
            ReceiverState: "VIC",
            ReceiverSuburb: "MELBOURNE",
            ReceiverPostcode: "3000",
            ReceiverAddressName: "13 Queen Street",
            DespatchDate: "2023-10-06 00:00:00",
            RDD: "2024-10-10 15:00:00",
            Coordinates: [
                {
                    SenderLatitude: -37.88,
                    SenderLongitude: 144.7,
                    ReceiverLatitude: -37.81,
                    ReceiverLongitude: 144.97,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 44,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:13672",
                    description:
                        "West Gate Tunnel - Inbound from Kororoit Creek Road and the M80 interchange - Princes Freeway Roadworks",
                    start_date: "2024-04-09 22:00:00",
                    end_date: "2024-04-11 05:00:00",
                    latitude: "-37.840562198711",
                    longitude: "144.79324510365",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.7932451036542,-37.84056219871055]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound from Kororoit Creek Road and the M80 interchange",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Tuesday 9 April and Wednesday 10 April, between 10pm and 5am each night.\r\n\r\nPlease note, the Princes Freeway inbound ramps to Geelong Road and the West Gate Freeway will also be closed during this time.",
                    created_at: "2024-09-18T11:43:21.000000Z",
                    updated_at: "2024-09-18T11:43:21.000000Z",
                    location: null,
                },
                {
                    id: 202,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15259",
                    description:
                        "West Gate Tunnel - Inbound exit ramp to Geelong Road - Princes Freeway Roadworks",
                    start_date: "2024-09-13 21:00:00",
                    end_date: "2024-09-20 05:00:00",
                    latitude: "-37.827565455917",
                    longitude: "144.81714448537",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8171444853735,-37.82756545591655]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound exit ramp to Geelong Road",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on the following nights:\r\n\r\n\r\n\tFriday 13 September, between 9pm and 5am\r\n\tTuesday 17 September to Thursday 19 September 2024, between 9pm and 5am each night\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 231,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15277",
                    description:
                        "West Gate Tunnel - Inbound entry ramp to the West Gate Freeway (Outer Lanes) - Princes Freeway Roadworks",
                    start_date: "2024-09-13 23:00:00",
                    end_date: "2024-09-20 05:00:00",
                    latitude: "-37.825086369331",
                    longitude: "144.82143336872",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8214333687238,-37.82508636933091]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound entry ramp to the West Gate Freeway (Outer Lanes)",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on the following nights:\r\n\r\n\r\n\tFriday 13 September, between 11pm and 7am.\r\n\tTuesday 17 September to Thursday 19 September, between 10pm and 5am each night.\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 232,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15311",
                    description:
                        "West Gate Tunnel - Inbound entry ramp to the West Gate Freeway (Outer Lanes) - Princes Freeway Roadworks",
                    start_date: "2024-09-20 23:00:00",
                    end_date: "2024-09-21 07:00:00",
                    latitude: "-37.825086369331",
                    longitude: "144.82143336872",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8214333687238,-37.82508636933091]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound entry ramp to the West Gate Freeway (Outer Lanes)",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Friday 20 September 2024, between 11pm and 7am.",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 922,
                    api_source: "VIC",
                    event_id: "Unplanned:RID:RUD-INC1005764_RUD-IMP1005765",
                    description:
                        "1 lane closed eastbound between Wlliamstown road and Todd road In Ramp due to debris. Please avoid the area and seek an alternate route.",
                    start_date: "2024-09-04 13:44:27",
                    end_date: null,
                    latitude: "-37.82505869501",
                    longitude: "144.87784525951",
                    geometry_type: "LineString",
                    geometry_coordinates:
                        "[[144.8778452595054,-37.82505869501018],[144.8781861,-37.825107],[144.8791926,-37.8252291],[144.8799992,-37.8252906],[144.880303788,-37.825296965],[144.8806931,-37.8253051],[144.880910124,-37.825311236],[144.881031652,-37.825314672],[144.881142893,-37.825317817],[144.8813828,-37.8253246],[144.881963644,-37.825315932],[144.8823008,-37.8253109],[144.883326,-37.8252654],[144.8843605,-37.8252004],[144.8850116,-37.8251716],[144.885430762,-37.825165825],[144.885556,-37.8251641],[144.8858305,-37.8251686],[144.8865357,-37.8251957],[144.8867939,-37.8252101],[144.8870077,-37.8252256],[144.887076907,-37.825230479],[144.887208193,-37.825239735],[144.8874006,-37.8252533],[144.8881377,-37.8253242],[144.8888792,-37.8254389],[144.8894181,-37.8255354],[144.8896256,-37.8255767],[144.8903614,-37.8257444],[144.8910876,-37.8259437],[144.891745,-37.8261435],[144.892511,-37.8264147],[144.8933378,-37.8267394],[144.893781,-37.8269438],[144.8945204,-37.8273175],[144.894863492,-37.827505483],[144.8950871,-37.827628],[144.895219887,-37.827702519],[144.8955226,-37.8278724],[144.8963876,-37.8283579],[144.896946688,-37.828687964],[144.8975413,-37.829039],[144.898465164,-37.829591053],[144.89861,-37.8296776],[144.899241706,-37.83005116],[144.899935895,-37.830461669],[144.9005963,-37.8308522],[144.9018298,-37.8315689],[144.9024272,-37.8319254],[144.9029311,-37.8322287],[144.9035036,-37.8325398],[144.9041647,-37.8328389],[144.904415746,-37.832937012],[144.9048287,-37.8330984],[144.905438,-37.8332833],[144.9062971,-37.8335008],[144.9070335,-37.8336208],[144.9073691,-37.833662],[144.9077035,-37.8336962],[144.9081083,-37.8337284],[144.9085041,-37.8337455],[144.9088692,-37.8337481],[144.9092265,-37.8337396],[144.9095916,-37.8337239],[144.9099822,-37.8336921],[144.9103486,-37.8336542],[144.9107227,-37.8335985],[144.910931969,-37.833560417],[144.911082044,-37.833533106],[144.9114497,-37.8334662],[144.91161692900437,-37.83342679212158]]",
                    suburb: "YARRAVILLE",
                    traffic_direction: "Eastbound",
                    road_name: "WEST GATE FREEWAY",
                    status: "Active",
                    event_category_id: 4,
                    event_type: "Hazard",
                    impact: "Lanes closed",
                    source_url: "RID",
                    advice: "West Gate Freeway (M1), Yarraville - 1 lane closed eastbound between West Gate In-williamstown Ramp Of, Yarraville and West Gate In-west Gate In Ramp due to debris. Please avoid the area and seek an alternate route.",
                    information:
                        "1 lane closed eastbound between Wlliamstown road and Todd road In Ramp due to debris. Please avoid the area and seek an alternate route.",
                    created_at: "2024-09-18T11:43:27.000000Z",
                    updated_at: "2024-09-18T11:43:27.000000Z",
                    location: null,
                },
            ],
            EventCount: 5,
        },
        {
            id: 8,
            ConsignmentId: 486726,
            ConsignmentNo: "2501036684",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "ALDI RETAIL STAPYLTON",
            ReceiverState: "QLD",
            ReceiverSuburb: "STAPYLTON",
            ReceiverPostcode: "4207",
            ReceiverAddressName: "55 BURNSIDE RD",
            DespatchDate: "2024-08-29 00:00:00",
            RDD: "2024-09-25 23:59:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -27.72,
                    ReceiverLongitude: 153.27,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [],
            EventCount: 0,
        },
        {
            id: 9,
            ConsignmentId: 486727,
            ConsignmentNo: "2501036684",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "ALDI RETAIL STAPYLTON",
            ReceiverState: "QLD",
            ReceiverSuburb: "STAPYLTON",
            ReceiverPostcode: "4207",
            ReceiverAddressName: "55 BURNSIDE RD",
            DespatchDate: "2024-09-06 00:00:00",
            RDD: "2024-09-25 23:59:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -27.72,
                    ReceiverLongitude: 153.27,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [],
            EventCount: 0,
        },
        {
            id: 10,
            ConsignmentId: 483995,
            ConsignmentNo: "HEAD016763TA",
            DebtorId: 1820,
            DebtorName: "OFLOAD - HEADSTART",
            SenderName: "HEADSTART INTERNATIONAL VIC",
            SenderState: "VIC",
            SenderSuburb: "DANDENONG SOUTH",
            SenderPostcode: "3175",
            SenderAddressName: "26 - 44 MONASH DRIVE",
            ReceiverName: "KMART QLD DC",
            ReceiverState: "QLD",
            ReceiverSuburb: "LYTTON",
            ReceiverPostcode: "4178",
            ReceiverAddressName: "51-81 FREIGHT STREET",
            DespatchDate: "2024-08-22 00:00:00",
            RDD: "2024-09-28 06:30:00",
            Coordinates: [
                {
                    SenderLatitude: -38.03,
                    SenderLongitude: 145.18,
                    ReceiverLatitude: -27.42,
                    ReceiverLongitude: 153.16,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 54,
                    api_source: "NSW",
                    event_id: "206182",
                    description: "ROADWORKS - CHANGED TRAFFIC CONDITIONS",
                    start_date: "2024-08-28 04:17:52",
                    end_date: "2024-12-31 03:14:00",
                    latitude: "-32.7804517",
                    longitude: "151.7423482",
                    geometry_type: "Point",
                    geometry_coordinates: "[151.7423482,-32.7804517]",
                    suburb: "Heatherbrae",
                    traffic_direction: "",
                    road_name: "Pacific Highway",
                    status: null,
                    event_category_id: 2,
                    event_type: "Incident",
                    impact: "",
                    source_url: "",
                    advice: "Exercise caution / Check signage / Reduced speed limit",
                    information: null,
                    created_at: "2024-09-18T11:43:05.000000Z",
                    updated_at: "2024-09-18T11:43:05.000000Z",
                    location: null,
                },
                {
                    id: 175,
                    api_source: "NSW",
                    event_id: "159979",
                    description: "SCHEDULED ROADWORK",
                    start_date: "2023-06-01 06:50:11",
                    end_date: "2024-12-30 17:00:00",
                    latitude: "-32.8379928",
                    longitude: "151.6347063",
                    geometry_type: "Point",
                    geometry_coordinates: "[151.6347063,-32.8379928]",
                    suburb: "Black Hill to Tomago",
                    traffic_direction: "",
                    road_name: "M1 Pacific Motorway/Pacific Highway",
                    status: null,
                    event_category_id: 1,
                    event_type: "Roadwork",
                    impact: "",
                    source_url: "",
                    advice: "Reduced speed limit / Check signage / Allow extra travel time",
                    information: null,
                    created_at: "2024-09-18T11:43:11.000000Z",
                    updated_at: "2024-09-18T11:43:11.000000Z",
                    location: null,
                },
                {
                    id: 194,
                    api_source: "NSW",
                    event_id: "203650",
                    description: "SCHEDULED ROADWORK",
                    start_date: "2024-08-04 05:31:40",
                    end_date: "2024-09-19 18:00:00",
                    latitude: "-33.4322064",
                    longitude: "151.2230356",
                    geometry_type: "Point",
                    geometry_coordinates: "[151.2230356,-33.4322064]",
                    suburb: "Calga",
                    traffic_direction: "",
                    road_name: "Pacific Motorway",
                    status: null,
                    event_category_id: 1,
                    event_type: "Roadwork",
                    impact: "",
                    source_url: "",
                    advice: "Check signage / Exercise caution / Reduced speed limit",
                    information: null,
                    created_at: "2024-09-18T11:43:11.000000Z",
                    updated_at: "2024-09-18T11:43:11.000000Z",
                    location: null,
                },
                {
                    id: 236,
                    api_source: "NSW",
                    event_id: "202724",
                    description: "SCHEDULED ROADWORK",
                    start_date: "2024-07-24 20:37:23",
                    end_date: "2024-10-01 19:15:00",
                    latitude: "-32.7962756",
                    longitude: "151.720563",
                    geometry_type: "Point",
                    geometry_coordinates: "[151.720563,-32.7962756]",
                    suburb: "Heatherbrae",
                    traffic_direction: "",
                    road_name: "Pacific Highway",
                    status: null,
                    event_category_id: 1,
                    event_type: "Roadwork",
                    impact: "",
                    source_url: "",
                    advice: "Check signage / Exercise caution / Reduced speed limit",
                    information: null,
                    created_at: "2024-09-18T11:43:12.000000Z",
                    updated_at: "2024-09-18T11:43:12.000000Z",
                    location: null,
                },
                {
                    id: 134,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:14801",
                    description:
                        "West Gate Tunnel - Outbound from Footscray Road to Dynon Road - CityLink Roadworks",
                    start_date: "2024-10-05 06:00:00",
                    end_date: "2024-10-06 22:00:00",
                    latitude: "-37.807595571694",
                    longitude: "144.93327614584",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.9332761458405,-37.80759557169426]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "CityLink - Outbound from Footscray Road to Dynon Road",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Lanes blocked",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Double lane closures in place on the following days:\r\n\r\n\r\n\tSaturday 5 October, 6am to 11.59pm\r\n\tSunday 6 October, 7am to 10pm\r\n",
                    created_at: "2024-09-18T11:43:22.000000Z",
                    updated_at: "2024-09-18T11:43:22.000000Z",
                    location: null,
                },
                {
                    id: 135,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:14800",
                    description:
                        "West Gate Tunnel - Outbound from Footscray Road to Dynon Road - CityLink Roadworks",
                    start_date: "2024-10-04 22:00:00",
                    end_date: "2024-10-06 05:00:00",
                    latitude: "-37.806510065854",
                    longitude: "144.93333247223",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.9333324722298,-37.80651006585425]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "CityLink - Outbound from Footscray Road to Dynon Road",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Lanes blocked",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Triple lane closures in place overnight on the following nights:\r\n\r\n\r\n\tFriday 4 October, 10pm to 6am\r\n\tSaturday 5 October, 11.59pm to 7am\r\n\tSunday 6 October, 10pm to 5am.\r\n",
                    created_at: "2024-09-18T11:43:22.000000Z",
                    updated_at: "2024-09-18T11:43:22.000000Z",
                    location: null,
                },
            ],
            EventCount: 6,
        },
        {
            id: 11,
            ConsignmentId: 406135,
            ConsignmentNo: "TMSODV000007",
            DebtorId: 286,
            DebtorName: "TMS- MAIN",
            SenderName: "TMS Melbourne",
            SenderState: "VIC",
            SenderSuburb: "TRUGANINA",
            SenderPostcode: "3029",
            SenderAddressName: "10 Dunmore Drive",
            ReceiverName: "GTL tst9",
            ReceiverState: "VIC",
            ReceiverSuburb: "ALTONA NORTH",
            ReceiverPostcode: "3025",
            ReceiverAddressName: "1 Taras Avenue",
            DespatchDate: "2023-10-09 12:30:00",
            RDD: "2026-10-12 13:00:00",
            Coordinates: [
                {
                    SenderLatitude: -37.88,
                    SenderLongitude: 144.7,
                    ReceiverLatitude: -37.84,
                    ReceiverLongitude: 144.86,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 44,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:13672",
                    description:
                        "West Gate Tunnel - Inbound from Kororoit Creek Road and the M80 interchange - Princes Freeway Roadworks",
                    start_date: "2024-04-09 22:00:00",
                    end_date: "2024-04-11 05:00:00",
                    latitude: "-37.840562198711",
                    longitude: "144.79324510365",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.7932451036542,-37.84056219871055]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound from Kororoit Creek Road and the M80 interchange",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Tuesday 9 April and Wednesday 10 April, between 10pm and 5am each night.\r\n\r\nPlease note, the Princes Freeway inbound ramps to Geelong Road and the West Gate Freeway will also be closed during this time.",
                    created_at: "2024-09-18T11:43:21.000000Z",
                    updated_at: "2024-09-18T11:43:21.000000Z",
                    location: null,
                },
                {
                    id: 202,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15259",
                    description:
                        "West Gate Tunnel - Inbound exit ramp to Geelong Road - Princes Freeway Roadworks",
                    start_date: "2024-09-13 21:00:00",
                    end_date: "2024-09-20 05:00:00",
                    latitude: "-37.827565455917",
                    longitude: "144.81714448537",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8171444853735,-37.82756545591655]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound exit ramp to Geelong Road",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on the following nights:\r\n\r\n\r\n\tFriday 13 September, between 9pm and 5am\r\n\tTuesday 17 September to Thursday 19 September 2024, between 9pm and 5am each night\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 231,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15277",
                    description:
                        "West Gate Tunnel - Inbound entry ramp to the West Gate Freeway (Outer Lanes) - Princes Freeway Roadworks",
                    start_date: "2024-09-13 23:00:00",
                    end_date: "2024-09-20 05:00:00",
                    latitude: "-37.825086369331",
                    longitude: "144.82143336872",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8214333687238,-37.82508636933091]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound entry ramp to the West Gate Freeway (Outer Lanes)",
                    status: "Active",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on the following nights:\r\n\r\n\r\n\tFriday 13 September, between 11pm and 7am.\r\n\tTuesday 17 September to Thursday 19 September, between 10pm and 5am each night.\r\n",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
                {
                    id: 232,
                    api_source: "VIC",
                    event_id: "Planned:MTIA:15311",
                    description:
                        "West Gate Tunnel - Inbound entry ramp to the West Gate Freeway (Outer Lanes) - Princes Freeway Roadworks",
                    start_date: "2024-09-20 23:00:00",
                    end_date: "2024-09-21 07:00:00",
                    latitude: "-37.825086369331",
                    longitude: "144.82143336872",
                    geometry_type: "Point",
                    geometry_coordinates:
                        "[144.8214333687238,-37.82508636933091]",
                    suburb: "",
                    traffic_direction: "Unknown",
                    road_name:
                        "Princes Freeway - Inbound entry ramp to the West Gate Freeway (Outer Lanes)",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Closures",
                    source_url: "MTIA",
                    advice: "Allow extra travel time",
                    information:
                        "Closed overnight on Friday 20 September 2024, between 11pm and 7am.",
                    created_at: "2024-09-18T11:43:23.000000Z",
                    updated_at: "2024-09-18T11:43:23.000000Z",
                    location: null,
                },
            ],
            EventCount: 4,
        },
        {
            id: 12,
            ConsignmentId: 428474,
            ConsignmentNo: "GMI1962",
            DebtorId: 1511,
            DebtorName: "GENERAL  MILLS AUSTRALIA PTY LTD",
            SenderName: "QUBE LOGISTICS",
            SenderState: "NSW",
            SenderSuburb: "MOOREBANK",
            SenderPostcode: "1875",
            SenderAddressName: "Warehouse 5",
            ReceiverName: "METCASH - CRESTMEAD",
            ReceiverState: "QLD",
            ReceiverSuburb: "CRESTMEAD",
            ReceiverPostcode: "4132",
            ReceiverAddressName: "111-137 Magnesium drive",
            DespatchDate: "2023-12-29 10:28:33",
            RDD: "2024-12-03 00:00:00",
            Coordinates: [
                {
                    SenderLatitude: -33.95,
                    SenderLongitude: 150.92,
                    ReceiverLatitude: -27.69,
                    ReceiverLongitude: 153.09,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [],
            EventCount: 0,
        },
        {
            id: 13,
            ConsignmentId: 445750,
            ConsignmentNo: "2501006828",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "CITY FINE FOOD SERVICES",
            ReceiverState: "NSW",
            ReceiverSuburb: "LIDCOMBE",
            ReceiverPostcode: "2141",
            ReceiverAddressName: "32 BIRNIE AVENUE",
            DespatchDate: "2024-02-20 00:00:00",
            RDD: "2024-11-14 07:00:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -33.87,
                    ReceiverLongitude: 151.03,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [],
            EventCount: 0,
        },
        {
            id: 14,
            ConsignmentId: 486730,
            ConsignmentNo: "2501036686",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "ALDI REGENCY PARK",
            ReceiverState: "SA",
            ReceiverSuburb: "REGENCY PARK",
            ReceiverPostcode: "5010",
            ReceiverAddressName: "84 GALLIPOLI DRIVE",
            DespatchDate: "2024-08-29 00:00:00",
            RDD: "2024-09-27 23:59:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -34.86,
                    ReceiverLongitude: 138.56,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 107,
                    api_source: "VIC",
                    event_id: "Planned:OneView:IMP-0007922",
                    description:
                        "Melbourne Airport Rail Project activities occurring between 11/07/2024 and 02/11/2024 during the following times: Weekdays 5:30 AM to 11:00 PM. Impact to traffic will be lanes closed northbound. Altered speed limit during operation will be 30 and the traffic delay is expected to be Nil.",
                    start_date: "2024-07-11 00:00:00",
                    end_date: "2024-11-02 00:00:00",
                    latitude: "-37.749821",
                    longitude: "144.718108",
                    geometry_type: "Point",
                    geometry_coordinates: "[144.718108,-37.749821]",
                    suburb: "",
                    traffic_direction: "Northbound",
                    road_name: "WESTERN FREEWAY ",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Lanes blocked",
                    source_url: "OneView",
                    advice: "",
                    information: "",
                    created_at: "2024-09-18T11:43:22.000000Z",
                    updated_at: "2024-09-18T11:43:22.000000Z",
                    location: null,
                },
            ],
            EventCount: 1,
        },
        {
            id: 15,
            ConsignmentId: 486731,
            ConsignmentNo: "2501036686",
            DebtorId: 1507,
            DebtorName: "UAL - NUTRITION (FOODS INCL WW)",
            SenderName: "UNILEVER FOODS - MELB",
            SenderState: "VIC",
            SenderSuburb: "TULLAMARINE",
            SenderPostcode: "3043",
            SenderAddressName: "38-52 SKY ROAD",
            ReceiverName: "ALDI REGENCY PARK",
            ReceiverState: "SA",
            ReceiverSuburb: "REGENCY PARK",
            ReceiverPostcode: "5010",
            ReceiverAddressName: "84 GALLIPOLI DRIVE",
            DespatchDate: "2024-09-06 00:00:00",
            RDD: "2024-09-27 23:59:00",
            Coordinates: [
                {
                    SenderLatitude: -37.69,
                    SenderLongitude: 144.88,
                    ReceiverLatitude: -34.86,
                    ReceiverLongitude: 138.56,
                },
            ],
            created_at: "2024-09-19T10:31:07.000000Z",
            updated_at: "2024-09-19T10:31:07.000000Z",
            events: [
                {
                    id: 107,
                    api_source: "VIC",
                    event_id: "Planned:OneView:IMP-0007922",
                    description:
                        "Melbourne Airport Rail Project activities occurring between 11/07/2024 and 02/11/2024 during the following times: Weekdays 5:30 AM to 11:00 PM. Impact to traffic will be lanes closed northbound. Altered speed limit during operation will be 30 and the traffic delay is expected to be Nil.",
                    start_date: "2024-07-11 00:00:00",
                    end_date: "2024-11-02 00:00:00",
                    latitude: "-37.749821",
                    longitude: "144.718108",
                    geometry_type: "Point",
                    geometry_coordinates: "[144.718108,-37.749821]",
                    suburb: "",
                    traffic_direction: "Northbound",
                    road_name: "WESTERN FREEWAY ",
                    status: "Pending",
                    event_category_id: 1,
                    event_type: "Roadworks",
                    impact: "Lanes blocked",
                    source_url: "OneView",
                    advice: "",
                    information: "",
                    created_at: "2024-09-18T11:43:22.000000Z",
                    updated_at: "2024-09-18T11:43:22.000000Z",
                    location: null,
                },
            ],
            EventCount: 1,
        },
    ]);

    const groups = [
        {
            name: "senderDetails",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverDetails",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];
    const gridRef = useRef(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [eventDetails, setEventDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const createNewLabelObjects = (data, fieldName) => {
        let id = 1; // Initialize the ID
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
            // Check if the label is not already included
            if (!uniqueLabels.has(fieldValue)) {
                uniqueLabels.add(fieldValue);
                const newObject = {
                    id: fieldValue,
                    label: fieldValue,
                };
                newData.push(newObject);
            }
        });
        return newData;
    };
    const [receiverStateOptions, setReceiverStateOptions] = useState(
        createNewLabelObjects(filteredData, "SenderState") || []
    );
    const [senderStateOptions, setSenderStateOptions] = useState(
        createNewLabelObjects(filteredData, "ReceiverState") || []
    );
    const minDispatchDate = getMinMaxValue(filteredData, "DispatchDate", 1);
    const maxDispatchDate = getMinMaxValue(filteredData, "DispatchDate", 2);
    const minRDDDate = getMinMaxValue(filteredData, "RDD", 1);
    const maxRDDDate = getMinMaxValue(filteredData, "RDD", 2);

    function getAllEvents() {
        axios
            .get(`${gtrsWebUrl}get-eventsCategories`)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getAllEvents();
    }, []);

    function getEventCategoryById(id) {
        const category = categories.find((event) => event.id === id);
        return category ? category.event_category : "";
    }

    const handleClick = (coindex) => {
        navigate("/gtrs/consignment-details", { state: { activeCons: coindex } });
    }
    const columns = [
        {
            name: "ConsignmentNo",
            headerAlign: "center",
            textAlign: "center",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => handleClick(data.ConsignmentId)}
                    >
                        {" "}
                        {value}
                    </span>
                );
            },
        },
        {
            name: "DebtorName",
            headerAlign: "center",
            textAlign: "center",
            header: "Account Name",
            group: "personalInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SenderName",
            header: "Name",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderState",
            header: "Sender State",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb ",
            group: "senderDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderPostcode",
            group: "senderDetails",
            header: "Sender Postcode ",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverName",
            group: "receiverDetails",
            header: "Receiver Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverState",
            group: "receiverDetails",
            header: "Receiver State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
            defaultWidth: 200,
        },
        {
            name: "ReceiverSuburb",
            group: "receiverDetails",
            header: "Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverPostcode",
            group: "receiverDetails",
            header: "Post Code",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "DespatchDate",
            header: "Despatch Date",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDispatchDate,
                maxDate: maxDispatchDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
            defaultWidth: 200,
        },
        {
            name: "RDD",
            header: "RDD",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minRDDDate,
                maxDate: maxRDDDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
            defaultWidth: 200,
        },
        {
            name: "EventCount",
            header: "Events Count",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
            render: ({ value, data }) => {
                return (
                    <>
                        {value > 0 && (
                            <span
                                className="underline text-blue-500 hover:cursor-pointer"
                                onClick={() => {
                                    onOpen();
                                    setEventDetails(data.events);
                                }}
                            >
                                {" "}
                                {value}
                            </span>
                        )}
                    </>
                );
            },
            defaultWidth: 200,
        },
        {
            name: "Map",
            header: "Map",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            render: ({ value, data }) => {
                return (
                    <span
                        className="underline text-blue-500 flex justify-center hover:cursor-pointer"
                        onClick={() => {
                            navigate("/gtrs/consignment-map", { state: { consignmentToTrack: data } });
                        }}
                    >
                        <MapPinIcon className="h-5 w-5" />
                    </span>
                );
            },
            defaultWidth: 200,
        },
    ];

    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, filteredData);

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers
        const customCellHandlers = {
            DispatchDate: (value) => formatDateToExcel(value),
            DeliveryDate: (value) => formatDateToExcel(value),
            RDD: (value) => formatDateToExcel(value),
            CalculatedDelDate: (value) => formatDateToExcel(value),
            MatchRdd: (value) => {
                if (value === 3) return "Pending";
                if (value === 1) return "True";
                if (value === 2) return "False";
                return "";
            },
            MatchDel: (value) => {
                if (value == 0) return "";
                if (value == 1) return "PASS";
                if (value == 2) return "FAIL";
                return "";
            },
            ReasonId: (value, item) => {
                const Reason = kpireasonsData?.find(
                    (reason) => reason.ReasonId === item.ReasonId
                );
                return Reason?.ReasonName || "";
            },
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Traffic-report.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["DispatchDate", "DeliveryDate", "RDD", "CalculatedDelDate"]
        );
    }

    const customFilterTypes = Object.assign(
        {},
        ReactDataGrid.defaultProps.filterTypes,
        {
            number: {
                name: "number",
                operators: [
                    {
                        name: "empty",
                        fn: ({ value }) => value == null || value === "",
                    },
                    {
                        name: "notEmpty",
                        fn: ({ value }) => value != null && value !== "",
                    },
                    {
                        name: "eq",
                        fn: ({ value, filterValue }) =>
                            value == null || filterValue == null
                                ? true
                                : // Check if both values are NaN
                                Number.isNaN(value) && Number.isNaN(filterValue)
                                ? true
                                : // Check if both values are numbers and are equal
                                typeof value === "number" &&
                                  typeof filterValue === "number" &&
                                  value === filterValue
                                ? true
                                : // Return false for all other cases
                                  false,
                    },
                    {
                        name: "neq",
                        fn: ({ value, filterValue }) =>
                            value == null || filterValue == null
                                ? true
                                : value != filterValue,
                    },
                    {
                        name: "gt",
                        fn: ({ value, filterValue }) => value > filterValue,
                    },
                    {
                        name: "gte",
                        fn: ({ value, filterValue }) => value >= filterValue,
                    },
                    {
                        name: "lt",
                        fn: ({ value, filterValue }) => value < filterValue,
                    },
                    {
                        name: "lte",
                        fn: ({ value, filterValue }) => value <= filterValue,
                    },
                    {
                        name: "inRange",
                        fn: ({ value, filterValue }) => {
                            const [min, max] = filterValue
                                .split(":")
                                .map(Number);
                            return value >= min && value <= max;
                        },
                    },
                ],
            },
        }
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Consignment Tracking
                    </h1>
                </div>
                <ExportPopover
                    columns={columns}
                    handleDownloadExcel={handleDownloadExcel}
                    filteredData={filteredData}
                />
            </div>
            <TableStructure
                gridRef={gridRef}
                id={"ConsignmentId"}
                setSelected={setSelected}
                selected={selected}
                filterTypesElements={customFilterTypes}
                groupsElements={groups}
                tableDataElements={filteredData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                columnsElements={columns}
            />
            <EventModal
                getEventCategoryById={getEventCategoryById}
                eventDetails={eventDetails}
                loading={loading}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </div>
    );
}

export default ConsTrack;
