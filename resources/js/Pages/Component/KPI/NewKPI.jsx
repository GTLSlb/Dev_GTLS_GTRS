import { useState } from "react";
import { useEffect, useRef } from "react";
import moment from "moment";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import LottieComponent from "@/Components/lottie/LottieComponent";
import Truck from "@/Components/lottie/Data/Truck.json";
import Success from "@/Components/lottie/Data/Success.json";
import { canCalculateKPI, canEditKPI } from "@/permissions";
import axios from "axios";
import swal from "sweetalert";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import NewKPIModalAddReason from "./NEWKPIModal";
import { formatDateToExcel, getApiRequest, handleSessionExpiration } from "@/CommonFunctions";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import ExportPopover from "@/Components/ExportPopover";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { useNavigate } from "react-router-dom";
import AnimatedLoading from "@/Components/AnimatedLoading";

function NewKPI({
    url,
    currentUser,
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

    async function fetchData() {
        const data = await getApiRequest(`${url}/KPINew`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            const modifiedData =
                data != ""
                    ? data?.map((item) => ({
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
        }
    }

    const navigate = useNavigate();
    const handleClick = (coindex) => {
        navigate("/gtrs/consignment-details", { state: { activeCons: coindex } });
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

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers
        const customCellHandlers = {
            MatchRdd: (value) => {
                if (value === 3) return "Pending";
                if (value === 1) return "True";
                if (value === 2) return "False";
                return "";
            },
            MatchDel: (value) => {
                if (value == 3) return "";
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

        exportToExcel(
            jsonData,
            columnMapping,
            "KPI_Report.xlsx",
            customCellHandlers,
            ["DispatchDate", "DeliveryDate", "RDD", "CalculatedDelDate"]
        );
    };


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
            id: 3,
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
            {isFetching && newColumns && columns ? (
                <AnimatedLoading />
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
                                <ExportPopover
                                    columns={columns}
                                    handleDownloadExcel={handleDownloadExcel}
                                    filteredData={filteredData}
                                />
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
