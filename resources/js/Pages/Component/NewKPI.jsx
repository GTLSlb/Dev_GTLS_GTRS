import { useState } from "react";
import { useEffect, useRef } from "react";
import moment from "moment";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import TableStructure from "@/Components/TableStructure";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import KPIModalAddReason from "./KPI/KPImodal";
import LottieComponent from "@/Components/lottie/LottieComponent";
import Truck from "../../Components/lottie/Data/Truck.json";
import Success from "../../Components/lottie/Data/Success.json";
import { canCalculateKPI, canEditKPI } from "@/permissions";
import axios from "axios";
import swal from "sweetalert";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import NewKPIModalAddReason from "./KPI/NEWKPIModal";
import { handleSessionExpiration } from '@/CommonFunctions';
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function NewKPI({
    url,
    userBody,
    currentUser,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    filterValue,
    AToken,
    setFilterValue,
    KPIData,
    setKPIData,
    userPermission,
    accData,
    kpireasonsData,
}) {
    window.moment = moment;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState();
    const [reason, setReason] = useState();
    useEffect(() => {
        if (KPIData.length == 0) {
            setIsFetching(true);
            fetchData();
        }
    }, []); // Empty dependency array ensures the effect runs only once

    const [reasonOptions, setReasonOptions] = useState([]);
    const [receiverStateOptions, setReceiverStateOptions] = useState([]);
    const [senderStateOptions, setSenderStateOptions] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${url}/KPINew`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            });

            // Convert TransitDays to string
            const modifiedData =
            response?.data != ""
            ? response?.data?.map((item) => ({
                ...item,
                TransitDays: item.TransitDays.toString(),
            }))
            : [];

            setKPIData(modifiedData);
            setSenderStateOptions(
                createNewLabelObjects(modifiedData, "SenderState")
            );
            setReceiverStateOptions(
                createNewLabelObjects(modifiedData, "ReceiverState")
            );
            setReasonOptions(
                kpireasonsData.map((reason) => ({
                    id: reason.ReasonId,
                    label: reason.ReasonName,
                }))
            );
            setIsFetching(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "error",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
                    await handleSessionExpiration();
                });
            } else {
                console.error(error);
            }
        }
    };

    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(17);
        setactiveCon(coindex);
    };
    const [filteredData, setFilteredData] = useState(
        KPIData.map((item) => {
            if (item?.TransitDays) {
                item.TransitDays = parseInt(item.TransitDays);
            }
            return item;
        })
    );

    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = KPIData?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeToId);

            return chargeToMatch;
        });
        const filteredKPI = filtered.map((item) => {
            if (item?.TransitDays) {
                item.TransitDays = parseInt(item.TransitDays);
            }
            return item;
        });

        return filteredKPI;
    };
    useEffect(() => {
        setFilteredData(filterData());
        setReceiverStateOptions(
            createNewLabelObjects(filterData(), "ReceiverState")
        );
        setSenderStateOptions(
            createNewLabelObjects(filterData(), "SenderState")
        );
    }, [accData, KPIData]);
    const [selected, setSelected] = useState([]);
    const gridRef = useRef(null);
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, filteredData);
        console.log(jsonData )
    
        const columnMapping = {
            ConsignmentNo: "Consignment No",
            SenderName: "Sender Name",
            SenderReference: "Sender Reference",
            SenderState: "Sender State",
            ReceiverName: "Receiver Name",
            ReceiverReference: "Receiver Reference",
            ReceiverState: "Receiver State",
            ReceiverSuburb: "Receiver Suburb",
            ReceiverPostCode: "Receiver Postal Code",
            DispatchDate: "Dispatch Date",
            DeliveryDate: "Delivery Date",
            TransitDays: "Transit Days",
            CalculatedDelDate: "Calculated Delivery Date",
            MatchDel: "Pass/Fail",
        };
    
        // Define custom cell handlers
        const customCellHandlers = {
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
            DispatchDate: (value) => formatDateToExcel(value),
            DeliveryDate: (value) => formatDateToExcel(value),
            RDD: (value) => formatDateToExcel(value),
            CalculatedDelDate: (value) => formatDateToExcel(value),
        };
    
        exportToExcel(jsonData, columnMapping, "KPI_Report.xlsx", customCellHandlers);
    };
    
    // Helper function to format dates for Excel
    const formatDateToExcel = (dateValue) => {
        const date = new Date(dateValue);
        if (!isNaN(date)) {
            return (date.getTime() - date.getTimezoneOffset() * 60000) / 86400000 + 25569;
        }
        return "";
    };

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

    function getMinMaxValue(data, fieldName, identifier) {
        // Check for null safety
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        // Filter out entries with empty or invalid dates
        const validData = data.filter(
            (item) => item[fieldName] && !isNaN(new Date(item[fieldName]))
        );

        // If no valid dates are found, return null
        if (validData.length === 0) {
            return null;
        }

        // Sort the valid data based on the fieldName
        const sortedData = [...validData].sort((a, b) => {
            return new Date(a[fieldName]) - new Date(b[fieldName]);
        });

        // Determine the result date based on the identifier
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
    // Usage example remains the same
    const minDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 1);
    const maxDispatchDate = getMinMaxValue(KPIData, "DispatchDate", 2);
    const minRDDDate = getMinMaxValue(KPIData, "RDD", 1);
    const maxRDDDate = getMinMaxValue(KPIData, "RDD", 2);
    const minDeliveryDate = getMinMaxValue(KPIData, "DeliveryDate", 1);
    const maxDeliveryDate = getMinMaxValue(KPIData, "DeliveryDate", 2);
    const minCalcDate = getMinMaxValue(KPIData, "CalculatedDelDate", 1);
    const maxCalcDate = getMinMaxValue(KPIData, "CalculatedDelDate", 2);
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
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
    };
    const updateLocalData = (id, reason) => {
        // Find the item in the local data with the matching id
        const updatedData = KPIData.map((item) => {
            if (item.ConsignmentId === id) {
                // Update the reason of the matching item
                return { ...item, ReasonId: reason };
            }
            return item;
        });
        setKPIData(updatedData);

        setSenderStateOptions(
            createNewLabelObjects(updatedData, "SenderState")
        );
        setReceiverStateOptions(
            createNewLabelObjects(updatedData, "ReceiverState")
        );
        setReasonOptions(
            kpireasonsData.map((reason) => ({
                id: reason.ReasonId,
                label: reason.ReasonName,
            }))
        );
    };

    const kpiStatusOptions = [
        {
            id: 0,
            label: "N/A",
        },
        {
            id: 1,
            label: "Pass",
        },
        {
            id: 2,
            label: "Fail",
        },
    ];
    const columns = [
        {
            name: "ConsignmentNo",
            headerAlign: "center",
            textAlign: "center",
            header: "Cons No",
            group: "personalInfo",
            filterEditor: StringFilter,
            // filterEditorProps: {
            //     placeholder: "Name",
            //     renderSettings: ({ className }) => filterIcon(className),
            // },
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
            name: "SenderReference",
            group: "senderDetails",
            header: "Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "SenderState",
            group: "senderDetails",
            header: "State",
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
            name: "ReceiverName",
            group: "receiverDetails",
            header: "Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverReference",
            group: "receiverDetails",
            header: "Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "ReceiverState",
            group: "receiverDetails",
            header: "State",
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
            name: "ReceiverPostCode",
            group: "receiverDetails",
            header: "Post Code",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
        },
        {
            name: "DispatchDate",
            header: "Despatch Date",
            defaultFlex: 1,
            minWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
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
        },
        {
            name: "RDD",
            header: "Required Date",
            defaultFlex: 1,
            minWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
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
        },
        {
            name: "DeliveryDate",
            header: "Delivery Date",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDeliveryDate,
                maxDate: maxDeliveryDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "TransitDays",
            header: "Transit Days",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: NumberFilter,
            defaultWidth: 200,
        },
        {
            name: "CalculatedDelDate",
            header: "Calculated Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            dateFormat: "DD-MM-YYYY",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minCalcDate,
                maxDate: maxCalcDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY") == "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY");
            },
        },
        {
            name: "MatchDel",
            header: "Pass/Fail",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: kpiStatusOptions,
            },

            render: ({ value }) => {
                return value == 1 ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        Pass
                    </span>
                ) : value == 2 ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        Fail
                    </span>
                ) : null;
            },
        },
        // {
        //     name: "ReasonId",
        //     header: "Reason",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     defaultWidth: 170,
        //     filterEditor: SelectFilter,
        //     filterEditorProps: {
        //         multiple: false,
        //         wrapMultiple: false,
        //         dataSource: reasonOptions,
        //     },
        //     render: ({ value }) => {
        //         return (
        //             <div>
        //                 {/* {value} */}
        //                 {
        //                     kpireasonsData?.find(
        //                         (reason) => reason.ReasonId === value
        //                     )?.ReasonName
        //                 }
        //             </div>
        //         );
        //     },
        // },
        // {
        //     name: "Edit",
        //     header: "Edit",
        //     headerAlign: "center",
        //     textAlign: "center",
        //     defaultWidth: 100,
        //     render: ({ value, data }) => {
        //         return (
        //             <div>
        //                 {canEditKPI(currentUser) ? (
        //                     <button
        //                         className={
        //                             "rounded text-blue-500 justify-center items-center  "
        //                         }
        //                         onClick={() => {
        //                             handleEditClick(data);
        //                         }}
        //                     >
        //                         <span className="flex gap-x-1">
        //                             <PencilIcon className="h-4" />
        //                             Edit
        //                         </span>
        //                     </button>
        //                 ) : (
        //                     <div></div>
        //                 )}
        //             </div>
        //         );
        //     },
        // },
    ];
    const newArray = columns.slice(0, -1);
    const [newColumns, setNewColumns] = useState([]);

    useEffect(() => {
        if (canEditKPI(userPermission)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);

    useEffect(() => {
        let arr = newColumns.map((item) => {
            if (item?.name === "ReasonId") {
                item.filterEditorProps = {
                    ...item.filterEditorProps,
                    dataSource: reasonOptions,
                };
            }
            if (item?.name == "SenderState") {
                item.filterEditorProps = {
                    ...item.filterEditorProps,
                    dataSource: senderStateOptions,
                };
            }
            if (item?.name == "ReceiverState") {
                item.filterEditorProps = {
                    ...item.filterEditorProps,
                    dataSource: receiverStateOptions,
                };
            }
            return item;
        });
    }, [reasonOptions, receiverStateOptions, senderStateOptions]);

    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (filteredData.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };
    const [statusMessage, setStatusMessage] = useState("");
    const messageDisplayTime = 3000; // Time in milliseconds (3000ms = 3 seconds)
    const clearStatusMessage = () => {
        setStatusMessage("");
    };
    function CalculateKPI() {
        setLoading(true);
        axios
            .get(`${url}KPIReportNew`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                setStatusMessage("Success!");
                setTimeout(clearStatusMessage, messageDisplayTime);
                setLoading(false);
                fetchData();
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
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    // Handle other errors
                    setLoading(false);
                    setTimeout(clearStatusMessage, messageDisplayTime);
                    console.log(err);
                }
            });
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
        <div>
            {/* <Sidebar /> */}
            {isFetching && newColumns && columns ? (
                <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
                    </div>
                </div>
            ) : (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex w-full items-center justify-between mt-2 lg:mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                KPI Report
                            </h1>
                            <div className="object-right flex gap-x-2 md:ml-auto">
                                {statusMessage && (
                                    <LottieComponent
                                        animationData={Success}
                                        loop={false}
                                        autoplay={true}
                                        height={35}
                                        width={35}
                                    />
                                )}
                                {loading && (
                                    <LottieComponent
                                        animationData={Truck}
                                        autoplay={true}
                                        height={35}
                                        width={35}
                                    />
                                )}
                                {canCalculateKPI(userPermission) ? (
                                    <button
                                        className={`inline-flex items-center justify-center w-[10rem] h-[36px] rounded-md border bg-gray-800 px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={
                                            filteredData?.length === 0 ||
                                            loading
                                        }
                                        onClick={() => CalculateKPI()}
                                    >
                                        Calculate KPI Report
                                    </button>
                                ) : null}
                                <Popover className="relative ">
                                    <button onMouseEnter={handleMouseEnter}>
                                        <Popover.Button
                                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                filteredData?.length === 0
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-gray-800"
                                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                            disabled={
                                                filteredData?.length === 0
                                            }
                                        >
                                            Export
                                            <ChevronDownIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>
                                    </button>
                                    {isMessageVisible && (
                                        <div className="absolute top-9.5 text-center left-0 md:-left-14 w-[9rem] right-0 bg-red-200 text-dark z-10 text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
                                            {hoverMessage}
                                        </div>
                                    )}

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
                                                                value="ConsignmentNo"
                                                                className="text-dark focus:ring-goldd rounded "
                                                            />{" "}
                                                            Consignment Number
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderReference"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender Reference
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="SenderState"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Sender State
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverName"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="ReceiverReference"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Reference
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver State"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver State
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Receiver Suburb"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Receiver Suburb
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="DispatchDate"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Despatch Date
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="RDD"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            RDD
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="DeliveryDate"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Delivery Date
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="MatchDel"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Pass / Fail
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
                        </div>
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
                        columnsElements={newColumns}
                    />
                </div>
            )}
            <NewKPIModalAddReason
                AToken={AToken}
                url={url}
                isOpen={isModalOpen}
                kpi={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                updateLocalData={updateLocalData}
                kpiReasons={kpireasonsData}
                currentUser={currentUser}
                userPermission={userPermission}
            />
        </div>
    );
}

export default NewKPI;
