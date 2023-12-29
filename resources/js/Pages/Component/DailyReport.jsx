import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { PencilIcon } from "@heroicons/react/24/outline";
import ModalRDD from "@/Components/modalRDD";
import Select from "react-select";
import notFound from "../../assets/pictures/NotFound.png"
import React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from "@heroicons/react/24/outline";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function DailyReport({
    setActiveIndexGTRS,
    setactiveCon,
    consData,
    debtorsData,
    PerfData,
    setLastIndex,
    accData,
    EDate,
    setEDate,
    SDate,
    setSDate,
    currentUser,
}) {

const temp = [
    {
        "ChargeTo": 449,
        "CONSIGNMNENTID": 348116,
        "CONSIGNMENTNUMBER": "2500950728",
        "SENDERNAME": "UNILEVER - INGLEBURN",
        "SENDERZONE": "SYD",
        "ETA DATE": "2023-03-16T13:55:00",
        "POD": true,
        "SENDERSUBURB": "INGLEBURN",
        "SENDERPOSTCODE": "2565",
        "SENDERREFERENCE": "2500950728",
        "TOTALAMOUNT": 98.88,
        "FUELLEVY": 21.76,
        "GST": 8.99,
        "NETTAMOUNT": 68.13,
        "RATEDAMOUNT": 68.13,
        "DELIVERYARRIVEDDATETIME": "Mar 16 2023  1:41PM",
        "RECEIVERNAME": " MULTIPACK PTY LTD",
        "RECEIVERZONE": "SYD",
        "RECEIVERADDRESS 1": "22 HANSEN PLACE",
        "RECEIVERADDRESS 2": "",
        "RECEIVERADDRESS 3": "",
        "RECEIVERSUBURB": "EASTERN CREEK",
        "RECEIVERSTATE": "NSW",
        "RECEIVERPOSTCODE": "2766",
        "RECEIVER REFERENCE": "4514007865",
        "DESPATCHDATE": "2023-06-15",
        "TOTALQUANTITY": 2,
        "TOTALWEIGHT": 1.257,
        "TOTAL PALLET SPACE": 2,
        "TOTAL CHEP": 2,
        "TOTAL LOSCAM": 0,
        "TOTAL CUSTOMER OWN": 0,
        "SERVICE": "GENERAL FREIGHT",
        "STATUS": "PASS",
        "KPI DATETIME": "2023-03-16T13:55:00",
        "CONSIGNMENTSTATUS": "DELIVERED",
        "DELIVERYREQUIREDDATETIME": "Mar 16 2023  1:55PM",
        "DELIVEREDDATETIME": "Mar 16 2023  1:55PM",
        "PERFORMANCE": 0,
        "TRANSITTIME": 96,
        "SPECIAL INSTRUCTIONS": "",
        "ACCOUNTNUMBER": "UAPL - HPC",
        "MANIFESTNO": "",
        "PODDATETIME": "Mar 16 2023  1:55PM",
        "PODPOC": "ff",
        "POD_Image_Link": "https://jaixwebapps.gtls.com.au/Portal//Connotes/ShowConsignment.aspx?Number=2500950728",
        "FailedReason": 0,
        "FailedReasonDesc": ""
    },
    {
        "ChargeTo": 449,
        "CONSIGNMNENTID": 349335,
        "CONSIGNMENTNUMBER": "2500951469",
        "SENDERNAME": "UNILEVER - INGLEBURN",
        "SENDERZONE": "SYD",
        "ETA DATE": "2023-03-23T12:30:00",
        "POD": false,
        "SENDERSUBURB": "INGLEBURN",
        "SENDERPOSTCODE": "2565",
        "SENDERREFERENCE": "PRE509533",
        "TOTALAMOUNT": 0,
        "FUELLEVY": 0,
        "GST": 0,
        "NETTAMOUNT": 0,
        "RATEDAMOUNT": 0,
        "RECEIVERNAME": "ALDI PRESTONS",
        "RECEIVERZONE": "SYD",
        "RECEIVERADDRESS 1": "10 Burando Road",
        "RECEIVERADDRESS 2": "",
        "RECEIVERADDRESS 3": "",
        "RECEIVERSUBURB": "PRESTONS",
        "RECEIVERSTATE": "NSW",
        "RECEIVERPOSTCODE": "2170",
        "RECEIVER REFERENCE": "4514028871",
        "DESPATCHDATE": "2023-06-15",
        "TOTALQUANTITY": 0,
        "TOTALWEIGHT": 0,
        "TOTAL PALLET SPACE": 0,
        "TOTAL CHEP": 6,
        "TOTAL LOSCAM": 0,
        "TOTAL CUSTOMER OWN": 0,
        "SERVICE": "GENERAL FREIGHT",
        "STATUS": "PENDING",
        "KPI DATETIME": "2023-03-23T12:30:00",
        "CONSIGNMENTSTATUS": "LOADED",
        "DELIVERYREQUIREDDATETIME": "Mar 23 2023 12:30PM",
        "TRANSITTIME": 96,
        "SPECIAL INSTRUCTIONS": "DLVR:23/03/2023 12:30 PM Appt:26474635\r\n",
        "ACCOUNTNUMBER": "UAPL - HPC",
        "MANIFESTNO": "",
        "POD_Image_Link": "https://jaixwebapps.gtls.com.au/Portal//Connotes/ShowConsignment.aspx?Number=2500951469",
        "FailedReason": 0,
        "FailedReasonDesc": ""
    },
    {
        "ChargeTo": 449,
        "CONSIGNMNENTID": 349004,
        "CONSIGNMENTNUMBER": "2500951240",
        "SENDERNAME": "UNILEVER - INGLEBURN",
        "SENDERZONE": "SYD",
        "ETA DATE": "2023-03-22T06:00:00",
        "POD": false,
        "SENDERSUBURB": "INGLEBURN",
        "SENDERPOSTCODE": "2565",
        "SENDERREFERENCE": "1924143493",
        "TOTALAMOUNT": 0,
        "FUELLEVY": 0,
        "GST": 0,
        "NETTAMOUNT": 0,
        "RATEDAMOUNT": 0,
        "RECEIVERNAME": "COSTCO",
        "RECEIVERZONE": "SYD",
        "RECEIVERADDRESS 1": "15 OTTELIA ROAD",
        "RECEIVERADDRESS 2": "",
        "RECEIVERADDRESS 3": "",
        "RECEIVERSUBURB": "KEMPS CREEK",
        "RECEIVERSTATE": "NSW",
        "RECEIVERPOSTCODE": "2178",
        "RECEIVER REFERENCE": "4514021633",
        "DESPATCHDATE": "2023-06-22",
        "TOTALQUANTITY": 0,
        "TOTALWEIGHT": 0,
        "TOTAL PALLET SPACE": 0,
        "TOTAL CHEP": 30,
        "TOTAL LOSCAM": 0,
        "TOTAL CUSTOMER OWN": 0,
        "SERVICE": "GENERAL FREIGHT",
        "STATUS": "PENDING",
        "KPI DATETIME": "2023-03-22T06:00:00",
        "CONSIGNMENTSTATUS": "LOADED",
        "DELIVERYREQUIREDDATETIME": "Mar 22 2023  6:00AM",
        "TRANSITTIME": 96,
        "SPECIAL INSTRUCTIONS": "DLVR 22.03.2023 @ 6.00 AM DC\r\n",
        "ACCOUNTNUMBER": "UAPL - HPC",
        "MANIFESTNO": "",
        "POD_Image_Link": "https://jaixwebapps.gtls.com.au/Portal//Connotes/ShowConsignment.aspx?Number=2500951240",
        "FailedReason": 0,
        "FailedReasonDesc": ""
    },]

    const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
    const [rddDataState, setrddDataState] = useState(temp);
    const updateLocalData = (id, reason) => {
        // Find the item in the local data with the matching id
        const updatedData = rddDataState.map((item) => {
            if (item.AuditId === id) {
                // Update the reason of the matching item
                return { ...item, Reason: reason };
            }
            return item;
        });
        // Update the state with the modified local data
        setrddDataState(updatedData);
    };
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(11);
        setactiveCon(coindex);
    };
    const uniqueDebtors = debtorsData.filter((debtor, index, array) => {
        return (
            array.findIndex((d) => d.DebtorName === debtor.DebtorName) === index
        );
    });
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: "800px", // Adjust the width to 100% for responsiveness
            // Add more styles here as needed
        }),
        option: (provided, state) => ({
            ...provided,
            color: "black",
            // Add more styles here as needed
        }),
        multiValue: (provided) => ({
            ...provided,
            width: "30%",
            overflow: "hidden",
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "75px", // Set the maximum height for the value container
            overflow: "auto", // Enable scrolling if the content exceeds the maximum height
            // fontSize: '10px',
        }),
        inputContainer: (provided) => ({
            ...provided,
        }),
        // Add more style functions here as needed
    };
    const handleResize = () => {
        const width = window.innerWidth;
        const controlWidth = width <= 768 ? "100%" : "100%"; // Adjust the width based on the viewport width
        const valueContainerMaxHeight = width <= 768 ? "none" : "75px"; // Disable maxHeight for smaller screens

        const responsiveStyles = {
            ...customStyles,
            control: (provided, state) => ({
                ...provided,
                width: controlWidth,
            }),
            valueContainer: (provided) => ({
                ...provided,
                maxHeight: valueContainerMaxHeight,
            }),
        };

        // Set the new responsive styles
        setStyles(responsiveStyles);
    };
    const [styles, setStyles] = React.useState(customStyles);
    React.useEffect(() => {
        // Attach the window resize event listener
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [rddDataState]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(rddDataState);

    const [selectedConsignment, setSelectedConsignment] = useState("");
    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setSDate(value);
        filterData(value, EDate, selectedConsignment);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEDate(value);
        // filterData(SDate, value);
        filterData(SDate, value, selectedConsignment);
    };
    const handleConsignmentChange = (value) => {
        setSelectedConsignment(value);
        filterData(SDate, EDate, value);
    };

    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleAutocompleteChange = (event, value) => {
        setSelectedOptions(value);
    };
    const filterData = (startDate, endDate) => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters and account data
        const filtered = rddDataState.filter((item) => {
            const itemDate = new Date(item.DESPATCHDATE); // Convert item's date string to Date object
            const filterStartDate = new Date(formattedDate); // Convert start date string to Date object
            const filterEndDate = new Date(formattedDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            const ConsNbMatch = selectedConsignment
                ? item.CONSIGNMENTNUMBER.includes(selectedConsignment)
                : true;
            // const receiverMatch = receiverName
            //     ? item.RECEIVERNAME === receiverName
            //     : true; // Check if item's receiver name matches the selected receiver, or if no receiver is selected (return true to include all items)
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.DebtorId);
             // Check if the item's account number is included in the selected account data array
            return (
                // chargeToMatch
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                ConsNbMatch &&
                chargeToMatch
            );
            // Compare the item date to the filter dates, check if receiver matches and if account matches
        });
        const hasData = filtered.length > 0;
        setFilteredData(filtered);
    };
    useEffect(() => {
        filterData(SDate, EDate, selectedConsignment, selectedOptions);
    }, [
        accData,
        selectedOptions,
        rddDataState,
        selectedConsignment,
        SDate,
        EDate,
    ]);
    const checkbox = useRef();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState([]);

    useLayoutEffect(() => {
        const isIndeterminate =
            selectedPeople.length > 0 &&
            selectedPeople.length < filteredData.length;
        setChecked(selectedPeople.length === filteredData.length);
        setIndeterminate(isIndeterminate);
        checkbox.current.indeterminate = isIndeterminate;
    }, [selectedPeople]);

    function toggleAll() {
        setSelectedPeople(checked || indeterminate ? [] : filteredData);
        setChecked(checked && indeterminate);
        setIndeterminate(false);
    }

    const [currentPage, setCurrentPage] = useState(0);
    const [reasonAuditId, SetreasonAuditId] = useState();
    const [rddReason, SetrddReason] = useState();

    const Roles = ["1","3","4","5"];
    const PER_PAGE = 15;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const pageCount = Math.ceil(filteredData.length / PER_PAGE);
    const tableRef = useRef(null);
    const header = [
        "Account Number",
        "Consignment Number",
        "Service",
        "Sender Name",
        "Sender Postcode",
        "Sender Reference",
        "Sender Suburb",
        "Sender Zone",
        "Consignment Status",
        "Manifest No",
        "Despatch Date",
        "Delivery Arrived Datetime",
        "Delivered Datetime",
        "Delivery required Datetime",
        "Receiver Name",
        "Receiver Address 1",
        "Receiver Address 2",
        "Receiver Address 3",
        "Receiver Postcode",
        "Receiver State",
        "Receiver Suburb",
        "Receiver Zone",
        "Receiver Reference",
        "Special Instructions",
        "Total Quantity",
        "Total Weight",
        "POD",
        "POD Image",
        "POD Datetime",
        "POD POC",
    ];

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Consignments table",
        sheet: "Consignments",
    });

    function handleDownloadExcel() {
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            // If no columns are selected, export all columns
            selectedColumns = header;
        }
        downloadExcel({
            fileName: "Daily Report",
            sheet: "Daily Report",
            tablePayload: {
                header: selectedColumns.map((column) =>
                    header.find(
                        (h) =>
                            h.toLowerCase().replace(/\s+/g, "") ===
                            column.toLowerCase().replace(/\s+/g, "")
                    )
                ),
                body: selectedPeople.map((person) =>
                    selectedColumns.map((column) => {
                        if (person[column.replace(/\s+/g, "")] === true) {
                            // Apply custom logic based on the column name
                            return "true";
                        } else if (
                            person[column.replace(/\s+/g, "")] === false
                        ) {
                            // Apply custom logic based on the column name
                            return "false";
                        } else if (
                            column.replace(/\s+/g, "").toUpperCase() ===
                            "RECEIVERADDRESS1"
                        ) {
                            // Apply custom logic based on the column name
                            return person["RECEIVERADDRESS 1"];
                        } else if (
                            column.replace(/\s+/g, "").toUpperCase() ===
                            "RECEIVERADDRESS2"
                        ) {
                            // Apply custom logic based on the column name
                            return person["RECEIVERADDRESS 2"];
                        } else if (
                            column.replace(/\s+/g, "").toUpperCase() ===
                            "RECEIVERADDRESS3"
                        ) {
                            // Apply custom logic based on the column name
                            return person["RECEIVERADDRESS 3"];
                        } else if (
                            column.replace(/\s+/g, "").toUpperCase() ===
                            "RECEIVERREFERENCE"
                        ) {
                            // Apply custom logic based on the column name
                            return person["RECEIVER REFERENCE"];
                        } else if (
                            column.replace(/\s+/g, "").toUpperCase() ===
                            "SPECIALINSTRUCTIONS"
                        ) {
                            // Apply custom logic based on the column name
                            return person["SPECIAL INSTRUCTIONS"];
                        } else if (
                            column.replace(/\s+/g, "").toUpperCase() ===
                            "PODIMAGE"
                        ) {
                            // Apply custom logic based on the column name
                            return person["POD_Image_Link"];
                        } else {
                            // Default mapping logic
                            return person[
                                column.replace(/\s+/g, "").toUpperCase()
                            ];
                        }
                    })
                ),
            },
        });
    }

    const handleEditClick = (consignmentAuditId, reason) => {
        SetreasonAuditId(consignmentAuditId);
        SetrddReason(reason);
        setIsModalOpen(!isModalOpen);
    };

    function SendDailyEmail(){
        axios.post("/sendemail", 1)
            .then((response) => {
                // console.log(response);  
            })
            .catch((error) => {
                console.log(error.response);
                
            });
    };


    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Daily report
                    </h1>
                </div>
            </div>
            <div className="mt-3">
                <div className="w-full relative">
                    <div className=" sm:border-gray-200 text-gray-400 flex flex-col  gap-y-6 gap-x-2  w-full">
                        <div>
                            {/* Start Date Filter */}
                            <div className="flex flex-col lg:flex-row 2xl:justify-between lg:flex-row 2xl:gap-x-2 gap-y-4 gap-x-10 lg:items-center">
                               
                                <div className="w-72 flex-item w-full sm:max-w-xs max-w-lg">
                                    <div className="relative border rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Con. No."
                                            onChange={(e) =>
                                                handleConsignmentChange(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full py-0.5  pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                                        />
                                    </div>
                                    
                                </div>
                                <button
                                        type="button"
                                        onClick={SendDailyEmail}
                                        className="inline-flex items-center w-[5.5rem] h-7 rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Send email
                                    </button>
                                <Popover className="relative object-right flex-item lg:ml-auto">
                                    <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-white bg-dark rounded px-4 py-1">
                                        <span>Export</span>
                                        <ChevronDownIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute left-20 lg:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                            <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                <div className="p-4">
                                                    <div className="mt-2 flex flex-col">
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ACCOUNTNUMBER"
                                                                className="text-dark focus:ring-goldd rounded "
                                                            />{" "}
                                                            Account Number
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ConsignmentNumber"
                                                                className="text-dark focus:ring-goldd rounded "
                                                            />{" "}
                                                            Consignment Number
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Service"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Service
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Sender Name"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Name
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Sender Postcode"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Postcode
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Sender Reference"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Reference
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderSuburb"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Suburb
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Sender Zone"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Zone
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Consignment Status"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Consignment Status
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Manifest No"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Manifest No.
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Despatch Date"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Despatch Datetime
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="DELIVERYARRIVEDDATETIME"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Delivery Arrived
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Delivered Datetime"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Delivered Datetime
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Delivery required Datetime"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Delivery required
                                                            Datetime
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Name"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Name
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Address 1"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Address 1
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Address 2"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Address 2
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Address 3"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Address 3
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Postcode"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Postcode
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver State"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver State
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Suburb"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Suburb
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Zone"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Zone
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Reference"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Reference
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Special Instructions"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Special Instructions
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Total Quantity"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Total Quantity
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Total Weight"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Total Weight
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="POD"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            POD
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="POD Image"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            POD Image
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="POD Datetime"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            POD Datetime
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="POD POC"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            POD POC
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                    <button
                                                        onClick={
                                                            handleDownloadExcel
                                                        }
                                                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                    >
                                                        Export XLS
                                                    </button>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </Popover>
                            </div>

                            {/* End Date Filter */}
                            <div className="sm:border-gray-200 text-gray-400 hidden flex flex-col lg:flex-row md:flex-row md:items-center mt-5">
                                {/* <label
                                    htmlFor="last-name"
                                    className="inline-block text-sm font-medium w-auto flex-item items-center mr-10"
                                >
                                </label> */}
                                <div className="w-full">
                                    <Autocomplete
                                        multiple
                                        id="checkboxes-tags-demo"
                                        limitTags={2}
                                        options={uniqueDebtors}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) =>
                                            option.DebtorName
                                        }
                                        renderOption={(
                                            props,
                                            option,
                                            { selected }
                                        ) => (
                                            <li
                                                key={option.DebtorId}
                                                {...props}
                                            >
                                                <Checkbox
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.DebtorName}
                                            </li>
                                        )}
                                        // style={{ width: 400 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Debtors"
                                                placeholder="Debtors"
                                            />
                                        )}
                                        onChange={handleAutocompleteChange}
                                        value={selectedOptions}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root  bg-white ">
                <div className="w-full border rounded-lg overflow-x-auto">
                    <div className="inline-block min-w-full  align-middle ">
                        {filteredData ? (
                            <div className="relative">
                                {/* {selectedPeople.length > 0 && (
                                    <div className="absolute top-0 left-14 flex h-12 items-center space-x-3 bg-white sm:left-12">
                                        {/* <button
                                            type="button"
                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                                        >
                                            Bulk edit
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                                        >
                                            Delete all
                                        </button> 
                                    </div>
                                )} */}
                                <table
                                    id="details"
                                    className="min-w-full table-fixed divide-y divide-gray-300 "
                                    // ref={tableRef}
                                >
                                    <thead className="h-12">
                                        <tr className="py-2.5">
                                            <th
                                                scope="col"
                                                className="relative px-7 sm:w-12 sm:px-6"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                    ref={checkbox}
                                                    checked={checked}
                                                    onChange={toggleAll}
                                                />
                                            </th>
                                            <th
                                                scope="col"
                                                className="min-w-[8rem] pr-3 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Account Number
                                            </th>
                                            <th
                                                scope="col"
                                                className="min-w-[8rem] pr-3 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Consignment No.
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Service
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Postcode
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Reference
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Suburb
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender Zone
                                            </th>
                                            <th
                                                scope="col"
                                                className="min-w-[8rem] pr-3 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Consignment Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Manifest No.
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Despatch Datetime
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Delivery Arrived
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Delivered Datetime
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Delivery required Datetime
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Address 1
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Address 2
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Address 3
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Postcode
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Suburb
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Zone
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver Reference
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Special Instructions
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Total Quantity
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                Total Weight
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                POD
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                POD Image
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                POD Datetime
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-sm font-semibold text-gray-600"
                                            >
                                                POD POC
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300  max-h-80 overflow-y-scroll">
                                        {filteredData.length > 0 ? (
                                            filteredData
                                                .slice(
                                                    OFFSET,
                                                    OFFSET + PER_PAGE
                                                )
                                                .map((consignment, index) => (
                                                    <tr
                                                        key={
                                                            consignment.AuditId
                                                        }
                                                        className={[
                                                            selectedPeople.includes(
                                                                consignment
                                                            )
                                                                ? "bg-gray-50"
                                                                : "cursor-pointer",
                                                            index % 2 === 0
                                                                ? "bg-smooth"
                                                                : "bg-white",
                                                        ].join(" ")}
                                                    >
                                                        <td className="relative px-7 sm:w-12 sm:px-6">
                                                            {selectedPeople.includes(
                                                                consignment
                                                            ) && (
                                                                <div className="absolute inset-y-0 left-0 w-0.5 bg-goldd" />
                                                            )}
                                                            <input
                                                                type="checkbox"
                                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                                value={
                                                                    consignment.Service
                                                                }
                                                                checked={selectedPeople.includes(
                                                                    consignment
                                                                )}
                                                                onChange={(e) =>
                                                                    setSelectedPeople(
                                                                        e.target
                                                                            .checked
                                                                            ? [
                                                                                  ...selectedPeople,
                                                                                  consignment,
                                                                              ]
                                                                            : selectedPeople.filter(
                                                                                  (
                                                                                      p
                                                                                  ) =>
                                                                                      p !==
                                                                                      consignment
                                                                              )
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        {/* <div onClick={() => handleClick(5,person.id)} className=" hover:cursor-pointer "> */}
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.ACCOUNTNUMBER
                                                            }
                                                        </td>
                                                        <td
                                                            onClick={() =>
                                                                handleClick(
                                                                    consignment.CONSIGNMNENTID
                                                                )
                                                            }
                                                            className={classNames(
                                                                "whitespace-nowrap  pr-3 text-sm font-medium",
                                                                selectedPeople.includes(
                                                                    consignment
                                                                )
                                                                    ? "text-indigo-600"
                                                                    : "text-blue-600 underline hover:cursor-pointer"
                                                            )}
                                                        >
                                                            {
                                                                consignment.CONSIGNMENTNUMBER
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SERVICE
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SENDERNAME
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SENDERPOSTCODE
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SENDERREFERENCE
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SENDERSUBURB
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.SENDERZONE
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.CONSIGNMENTSTATUS
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.MANIFESTNO
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment[
                                                                "DESPATCHDATE"
                                                            ]?.replace(
                                                                "T",
                                                                " "
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.DELIVERYARRIVEDDATETIME
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment[
                                                                    "DELIVEREDDATETIME"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.DELIVERYREQUIREDDATETIME
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.RECEIVERNAME
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment[
                                                                    "RECEIVERADDRESS 1"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment[
                                                                    "RECEIVERADDRESS 2"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment[
                                                                    "RECEIVERADDRESS 3"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.RECEIVERPOSTCODE
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.RECEIVERSTATE
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.RECEIVERSUBURB
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.RECEIVERZONE
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment[
                                                                    "RECEIVER REFERENCE"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment[
                                                                    "SPECIAL INSTRUCTIONS"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.TOTALQUANTITY
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.TOTALWEIGHT
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment.POD ? (
                                                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                    true
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                    false
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment[
                                                                "POD_Image_Link"
                                                            ].substring(0, 20)}
                                                            ...
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                consignment.PODDATETIME
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {consignment.PODPOC}
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="17">
                                                    <div class=" h-64 flex items-center justify-center mt-10">
                                                    <div class="text-center flex justify-center flex-col">
                                                           <img
                                                           src={notFound}
                                                           alt=""
                                                           className="w-52 h-auto "
                                                           />
                                                            <h1 class="text-3xl font-bold text-gray-900">
                                                                No Data Found
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>This is true</p>
                        )}
                    </div>
                </div>
                <div className="pt-4 pb-10 text-xs text-gray-400">
                    <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={
                            "flex justify-center items-center mt-4"
                        }
                        pageClassName={"mx-2 rounded-full hover:bg-gray-100"}
                        previousLinkClassName={
                            "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                        }
                        nextLinkClassName={
                            "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                        }
                        disabledClassName={"opacity-50 cursor-not-allowed"}
                        activeClassName={"text-blue-500 font-bold"}
                    />
                </div>
            </div>
        </div>
    );
}
