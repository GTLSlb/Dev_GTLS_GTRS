import React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { PencilIcon } from "@heroicons/react/24/outline";
import notFound from "../../../assets/pictures/NotFound.png";
import ExcelJS from "exceljs";
import moment from "moment";
import { Fragment } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/20/solid";

import SafetyModal from "@/Components/AddsafetyModal";
import { useEffect } from "react";
import DescriptionModal from "@/Components/DescriptionModal";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import ReactDataGrid from "@inovua/reactdatagrid-community";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SafetyRepTable({
    currentPageRep,
    safetyData,
    url,
    filterValue,
    setFilterValue,
    currentUser,
    setFilteredData,
    setDataEdited,
    safetyTypes,
    safetyCauses,
}) {
    window.moment = moment;

    const minDate = getMinMaxValue(safetyData, "OccuredAt", 1);
    const maxDate = getMinMaxValue(safetyData, "OccuredAt", 2);
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpendesc, setIsModalOpendesc] = useState(false);
    const [safetyDesc, setSafetyDesc] = useState();
    const checkbox = useRef();
    const [currentPage, setCurrentPage] = useState(currentPageRep);
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedRecords, setselectedRecords] = useState([]);
    useLayoutEffect(() => {
        const isIndeterminate =
            selectedRecords?.length > 0 &&
            selectedRecords?.length < safetyData?.length;
        setChecked(selectedRecords?.length === safetyData?.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedRecords]);
    function toggleAll() {
        setselectedRecords(checked || indeterminate ? [] : safetyData);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }
    const Roles = ["1", "3", "4", "5"];
    const tableRef = useRef(null);
    const headers = [
        "Safety Type",
        "Cons No",
        "Main Cause",
        "State",
        "Explanation",
        "Resolution",
        "Reference",
        "Occured At",
        "Added By",
    ];
    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            selectedColumns = headers; // Use all columns
        }

        // Extract the data for the selected columns
        const data = safetyData.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (columnKey === "SafetyType") {
                        const Reason = safetyTypes?.find(
                            (reason) =>
                                reason.SafetyTypeId === person.SafetyType
                        );
                        acc[columnKey] = Reason?.SafetyTypeName;
                    } else if (columnKey === "OccuredAt") {
                        acc[columnKey] =
                            moment(
                                person["OccuredAt"],
                                "YYYY/MM/DD h:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["OccuredAt"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (columnKey === "MainCause") {
                        acc[columnKey] = person?.CAUSE;
                    } else if (columnKey === "Reference") {
                        if (person[column] == 1) {
                            acc[columnKey] = "Internal";
                        } else if (person[column] == 2) {
                            acc[columnKey] = "External";
                        } else if (person[column] == 3) {
                            acc[columnKey] = "Type 3";
                        }
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            person[column.replace(/\s+/g, "")];
                    }
                } else {
                    acc[columnKey] = person[columnKey.toUpperCase()];
                }
                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        // Add the data to the worksheet
        data.forEach((rowData) => {
            worksheet.addRow(Object.values(rowData));
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 15); // Set width of each column
        worksheet.columns = columnWidths.map((width, index) => ({
            width,
            key: selectedColumns[index],
        }));

        // Generate the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            // Convert the buffer to a Blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js or alternative method
            saveAs(blob, "Safety-Report.xlsx");
        });
    }
    const [selected, setSelected] = useState([]);
    const [buttonAction, setbuttonAction] = useState();
    const [modalRepId, setmodalRepId] = useState();
    const [modalSafetyType, setmodalSafetyType] = useState();
    const [modalMainCause, setmodalMainCause] = useState();
    const [modalState, setmodalState] = useState();
    const [modalDebtorId, setmodalDebtorId] = useState();
    const [modalDepar, setmodalDepar] = useState();
    const [modalExpl, setmodalExpl] = useState();
    const [modalResol, setmodalResol] = useState();
    const [modalRefer, setmodalRefer] = useState();
    const [modalOccuredAt, setmodalOccuredAt] = useState();
    const [modaladdedBy, setmodaladdedBy] = useState();
    const [modalConsNo, setmodalConsNo] = useState();
    const handleAddClick = () => {
        setbuttonAction(1); //To define it's a Add Action
        setmodalRepId("");
        setIsModalOpen(!isModalOpen);
    };
    const handleEditClick = (
        reportId,
        safetyType,
        mainCause,
        state,
        expl,
        resol,
        refer,
        occuredAt,
        consNo,
        addedBy
    ) => {
        setbuttonAction(2); //To define it's a Edit Action
        setmodalRepId(reportId);
        setmodalSafetyType(safetyType);
        setmodalMainCause(mainCause);
        setmodalState(state);
        setmodalExpl(expl);
        setmodalResol(resol);
        setmodalRefer(refer);
        setmodalOccuredAt(occuredAt);
        setmodalConsNo(consNo);
        setmodaladdedBy(addedBy);
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
    };
    const handleEditClickdesc = (report) => {
        setSafetyDesc(report);
        const isModalCurrentlyOpen = !isModalOpendesc;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpendesc(isModalCurrentlyOpen);
    };
    const generateUniqueId = () => {
        const timestamp = new Date().getTime();
        const uniqueId = `id_${timestamp}`;
        return uniqueId;
    };
    const updateLocalData = (id, updates) => {
        let itemFound = false;

        const updatedData = safetyData?.map((item) => {
            if (item.ReportId === id) {
                itemFound = true;
                // Update the fields of the matching item
                return { ...item, ...updates };
            }
            return item;
        });

        if (!itemFound) {
            // Create a new item if the provided id was not found
            updatedData?.push({ id: generateUniqueId(), ...updates });
        }
        setFilteredData(updatedData);
        setDataEdited(true);
    };
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (safetyData.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
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
    const stateOptions = createNewLabelObjects(safetyData, "State");
    
    const safetyTypeOptions = safetyTypes.map((reason) => ({
        id: reason.SafetyTypeId,
        label: reason.SafetyTypeName,
    }));
    const referenceOptions = [
        {
            id: 1,
            label: "Internal",
        },
        {
            id: 2,
            label: "External",
        },
    ];
    const columns = [
        {
            name: "SafetyType",
            header: "Safety Type",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: safetyTypeOptions,
            },
            defaultWidth: 200,
            render: ({ value }) => {
                return (
                    <div>
                        {/* {value} */}
                        {
                            safetyTypes?.find(
                                (type) => type.SafetyTypeId === value
                            )?.SafetyTypeName
                        }
                    </div>
                );
            },
        },
        {
            name: "ConsNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "CAUSE",
            header: "Main Cause",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "State",
            header: "State",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: stateOptions,
            },
        },
        {
            name: "Explanation",
            header: "Explanation",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Resolution",
            header: "Resolution",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Reference",
            header: "Reference",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: referenceOptions,
            },
            render: ({ value }) => {
                return value == 1 ? (
                    <span>Internal</span>
                ) : value == 2 ? (
                    <span>External</span>
                ) : (
                    <span></span>
                );
            },
        },
        {
            name: "OccuredAt",
            header: "Occured at",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "AddedBy",
            header: "Added By",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "edit",
            header: "edit",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
                    <button
                        className={
                            "rounded text-blue-500 justify-center items-center  "
                        }
                        onClick={() => {
                            handleEditClick(
                                data.ReportId,
                                data.SafetyType,
                                data.CAUSE,
                                data.State,
                                data.Explanation,
                                data.Resolution,
                                data.Reference,
                                data.OccuredAt,
                                data.ConsNo,
                                data.AddedBy
                            );
                        }}
                    >
                        <span className="flex gap-x-1">
                            <PencilIcon className="h-4" />
                            Edit
                        </span>
                    </button>
                );
            },
        },
    ];
    const newArray = columns?.slice(0, -1);
    const [newColumns, setNewColumns] = useState();
    useEffect(() => {
        if (Roles.includes(currentUser.role_id)) {
            setNewColumns(columns);
        } else {
            setNewColumns(newArray);
        }
    }, []);
    return (
        <div>
            <div className=" w-full bg-smooth pb-20">
                {!newColumns ? (
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
                    <div>
                        <div className="mt-3 ">
                            <div className=" object-right flex md:justify-end gap-x-5 flex-item ">
                                <div className="h-full">
                                    {Roles.includes(currentUser.role_id) ? (
                                        <button
                                            type="button"
                                            onClick={handleAddClick}
                                            className="inline-flex items-center w-[5.5rem] h-[36px] rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Add safety
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                                <Popover className="relative object-right flex-item ">
                                    <button onMouseEnter={handleMouseEnter}>
                                        <Popover.Button
                                            className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                safetyData.length === 0
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-gray-800"
                                            } px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                            disabled={safetyData.length === 0}
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
                                                                value="Safety Type"
                                                                className="text-dark focus:ring-goldd rounded "
                                                            />{" "}
                                                            Safety Type
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Con No"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Con No
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Main Cause"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Main Cause
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
                                                                value="Explanation"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Explanation
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Resolution"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Resolution
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Reference"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Reference
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Occured At"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Occured At
                                                        </label>
                                                        <label className="">
                                                            <input
                                                                type="checkbox"
                                                                name="column"
                                                                value="Added By"
                                                                className="text-dark rounded focus:ring-goldd"
                                                            />{" "}
                                                            Added By
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
                        <TableStructure
                            id={"ReportId"}
                            setSelected={setSelected}
                            selected={selected}
                            setFilterValueElements={setFilterValue}
                            tableDataElements={safetyData}
                            filterValueElements={filterValue}
                            columnsElements={newColumns}
                        />
                    </div>
                )}
            </div>
            <DescriptionModal
                isOpen={isModalOpendesc}
                handleClose={handleEditClickdesc}
                safetyDesc={safetyDesc}
                setSafetyDesc={setSafetyDesc}
                safetyTypes={safetyTypes}
            />
            <SafetyModal
                url={url}
                safetyTypes={safetyTypes}
                safetyCauses={safetyCauses}
                isOpen={isModalOpen}
                handleClose={handleEditClick}
                modalConsNo={modalConsNo}
                modaladdedBy={modaladdedBy}
                modalRepId={modalRepId}
                modalSafetyType={modalSafetyType}
                modalMainCause={modalMainCause}
                modalState={modalState}
                modalDepar={modalDepar}
                modalDebtorId={modalDebtorId}
                modalExpl={modalExpl}
                modalResol={modalResol}
                modalRefer={modalRefer}
                modalOccuredAt={modalOccuredAt}
                currentUser={currentUser}
                buttonAction={buttonAction}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}