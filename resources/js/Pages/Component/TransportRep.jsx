import { useState } from "react";
import "../../../css/reactdatagrid.css";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import TableStructure from "@/Components/TableStructure";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { useEffect, useRef } from "react";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
function TransportRep({
    setActiveIndexGTRS,
    setactiveCon,
    transportData,
    minDate,
    maxDate,
    filterValue,
    setFilterValue,
    setLastIndex,
    accData,
}) {
    const RDDTimeFilter = ({ filterValue, onChange }) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "RddTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "RddTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        return (
            <div className="flex gap-2 mx-1">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabindex="0"
                        class="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    };
    const PickTimeFilter = ({ filterValue, onChange }) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "PickupTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "PickupTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        return (
            <div className="flex gap-2 mx-1">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabindex="0"
                        class="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    };
    const DeliveryTimeFilter = ({ filterValue, onChange }) => {
        const [value, setValue] = useState(
            filterValue ? filterValue.value : ""
        );

        const handleChange = (event) => {
            const newValue = event.target.value + ":00";
            setValue(newValue);
            onChange({
                name: "ActualDeliveryTime",
                value: newValue,
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        const handleClear = () => {
            setValue("");
            onChange({
                name: "ActualDeliveryTime",
                value: "",
                operator: "eq",
                emptyValue: "",
                type: "string",
            });
        };

        useEffect(() => {
            setValue(filterValue ? filterValue.value : "");
        }, [filterValue]);

        return (
            <div className="flex gap-2 mx-1">
                <input
                    type="time"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring-gray-400 sm:text-sm"
                    value={value.slice(0, 5)}
                    onChange={handleChange}
                />
                <button onClick={handleClear}>
                    <svg
                        tabindex="0"
                        class="InovuaReactDataGrid__column-header__filter-settings-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M13.222 2H.778C.348 2 0 1.552 0 1s.348-1 .778-1h12.444c.43 0 .778.448.778 1s-.348 1-.778 1zM1.556 3.111l3.888 4.667v5.444c0 .43.349.778.778.778h1.556c.43 0 .778-.348.778-.778V7.778l3.888-4.667H1.556z"
                        ></path>
                    </svg>
                </button>
            </div>
        );
    };
    window.moment = moment;
    const [filteredData, setFilteredData] = useState(transportData);
    const [selected, setSelected] = useState({});
    const gridRef = useRef(null);

   
    function extractFormattedDate(datetime) {
        if (!datetime) return null;

        // Split the datetime string to get the date part
        const datePart = datetime.split(" ")[0];

        if (!datePart) return null;

        // Split the date part into year, month, and day
        const [year, month, day] = datePart.split("-");

        if (!year || !month || !day) return null;

        // Rearrange into DD-MM-YYYY format
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }
    function extractUTCFormattedDate(datetime) {
        if (!datetime) return null;

        // Split the datetime string to get the date part
        const datePart = datetime.split("T")[0];

        if (!datePart) return null;

        // Split the date part into year, month, and day
        const [year, month, day] = datePart.split("-");

        if (!year || !month || !day) return null;

        // Rearrange into DD-MM-YYYY format
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }
    function formatDate(date) {
        // Check if the date is null, undefined, or invalid
        if (!date || !moment(date, "YYYY-MM-DD", true).isValid()) {
            return " ";
        }

        // Format the date to "DD-MM-YYYY"
        return moment(date).format("DD-MM-YYYY");
    }
    const handleDownloadExcel = () => {
        // Fetch the filtered data
        const jsonData = handleFilterTable(gridRef, filteredData);
    
        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});
    
        // Define custom cell handlers (e.g., for formatting dates)
        const customCellHandlers = {
            RddDate: (value) => value ? new Date(value) : null,
            PickupDate: (value) => value ? new Date(value) : null,
            ActualDeliveryDate: (value) => value ? new Date(value) : null,
        };
    
        // Call the exportToExcel function with the column mapping and custom cell handlers
        exportToExcel(
            jsonData,
            columnMapping,
            "Transport-Report.xlsx",
            customCellHandlers,
            ["RddDate", "PickupDate", "ActualDeliveryDate"]
        );
    };
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
    
    const minRDDDate = getMinMaxValue(transportData, "RDD", 1);
    const maxRDDDate = getMinMaxValue(transportData, "RDD", 2);
    const minArrivedDate = getMinMaxValue(
        transportData,
        "ActualDeliveryDate",
        1
    );
    const maxArrivedDate = getMinMaxValue(
        transportData,
        "ActualDeliveryDate",
        2
    );
    const statusOptions = createNewLabelObjects(transportData, "Status");
    const LTLFTLOptions = createNewLabelObjects(transportData, "LTLFTL");
    const stateOptions = createNewLabelObjects(transportData, "State");
    const SenderstateOptions = createNewLabelObjects(
        transportData,
        "SenderState"
    );
    const onTimeOptions = createNewLabelObjects(transportData, "OnTime");
    const columns = [
        {
            name: "SenderName",
            header: "Sender Name",
            group: "personalInfo",
            defaultWidth: 200,
            filterEditor: StringFilter,
            headerAlign: "center",
            textAlign: "center",
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: SenderstateOptions,
            },
        },
        {
            name: "CustomerName",
            header: "Customer Name",
            group: "personalInfo",
            defaultWidth: 200,
            filterEditor: StringFilter,
            headerAlign: "center",
            textAlign: "center",
        },
        {
            name: "CustomerPO",
            header: "Customer PO",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "DeliveryNo",
            header: "Delivery #",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "RddDate",
            header: "Required Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minRDDDate,
                maxDate: maxRDDDate,
            },
            render: ({ value }) => {
                return extractFormattedDate(value);
            },
        },
        {
            name: "RddTime",
            header: "Required Delivery Time",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: RDDTimeFilter,
            // render: ({ value, data }) => {
            //     return extractTime(data.RDD);
            // },
        },
        {
            name: "LTLFTL",
            header: "LTL/FTL",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: LTLFTLOptions,
            },
        },
        {
            name: "State",
            header: "State",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: stateOptions,
            },
        },
        {
            name: "PostalCode",
            header: "Postal Code",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "Carrier",
            header: "Carrier",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "PickupDate",
            header: "Pickup Date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return extractUTCFormattedDate(value);
            },
        },
        {
            name: "PickupTime",
            header: "Pickup Time",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: PickTimeFilter,
        },
        {
            name: "Status",
            header: "Status",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: statusOptions,
            },
        },
        {
            name: "ActualDeliveryDate",
            header: "Actual Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minArrivedDate,
                maxDate: maxArrivedDate,
            },
            render: ({ value, cellProps }) => {
                return extractFormattedDate(value);
            },
        },
        {
            name: "ActualDeliveryTime",
            header: "Actual Delivery Time",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: DeliveryTimeFilter,
        },
        {
            name: "OnTime",
            header: "ONTIME(YES/NO)",
            type: "string",
            defaultWidth: 200,
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: onTimeOptions,
            },
            render: ({ value }) => {
                return value == "YES" ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        YES
                    </span>
                ) : value == "NO" ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        NO
                    </span>
                ) : value == "PENDING" ? (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                        PENDING
                    </span>
                ) : null;
            },
        },
        {
            name: "DelayReason",
            header: "Delay Reason",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "TransportComments",
            header: "Transport Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
    ];
    const excludedDebtorIds = [1514, 364, 247, 246, 245, 244];

    const filterData = () => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters, selected receiver names, and chargeTo values
        const filtered = transportData.filter((item) => {
            const chargeToMatch =
                (intArray?.length === 0 || intArray?.includes(item.ChargeToID)) &&
                !excludedDebtorIds.includes(item.ChargeToID); // Exclude specified ChargeToIDs
    
            return chargeToMatch;
        });
    
        return filtered;
    };
    
    useEffect(() => {
        setFilteredData(filterData());
    }, [accData]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Transport Report
                    </h1>
                </div>
                <Popover className="relative object-right flex-item md:ml-auto">
                    <div onMouseEnter={handleMouseEnter}>
                        <Popover.Button
                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                filteredData?.length === 0
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-gray-800"
                            } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                            disabled={filteredData?.length === 0}
                        >
                            Export
                            <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </Popover.Button>
                    </div>
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
                                                value="SenderName"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Sender Name
                                        </label>
                                        <label className="">
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="SenderState"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Sender State
                                        </label>
                                        <label className="">
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="CustomerName"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Customer Name
                                        </label>

                                        <label className="">
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Customer PO"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Customer PO
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="DeliveryNo"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Delivery No
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="RDDDate"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            RDD Date
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="RDDTime"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            RDD Time
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="LTLFTL"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            LTL/FTL
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="State"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            State
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Postal Code"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Postal Code
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Carrier"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Carrier
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="PickupDate"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Pickup Date
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="PickupTime"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Pickup Time
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="Status"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Status
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="ActualDeliveryDate"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Actual Delivery Date
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="ActualDeliveryTime"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Actual Delivery Time
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="OnTime"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            On Time
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="DelayReason"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Delay Reason
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value="TransportComments"
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            Transport Comments
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                    <button
                                        onClick={handleDownloadExcel}
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
            <TableStructure
                id={"ConsignmentId"}
                setSelected={setSelected}
                gridRef={gridRef}
                selected={selected}
                tableDataElements={filteredData}
                settableDataElements={setFilteredData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                columnsElements={columns}
            />
        </div>
    );
}
export default TransportRep;
