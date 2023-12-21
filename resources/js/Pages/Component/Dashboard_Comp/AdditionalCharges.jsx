import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import notFound from "../../../assets/pictures/NotFound.png";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { Fragment } from "react";
import moment from "moment";
import ExcelJS from "exceljs";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import BoolFilter from "@inovua/reactdatagrid-community/BoolFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import Button from "@inovua/reactdatagrid-community/packages/Button";
import TableStructure from "@/Components/TableStructure";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import swal from 'sweetalert';
const report = [
    {
        ConsignmentId: 275576,
        ConsignmentNo: "FOR100312",
        SenderName: "INDUSTRIAL STEEL",
        ReceiverName: "R AND A CONCRETING",
        FromState: "QLD",
        ToState: "VIC",
        POD: true,
        MatchTransit: false,
        MatchRdd: false,
    },
    // More people...
];
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AdditionalCharges({
    AdditionalData,
    setAdditionalData,
    setActiveIndexGTRS,
    setLastIndex,
    filterValue,
    setFilterValue,
    setactiveCon,
    AToken,
    currentUser,
    url,
}) {
    window.moment = moment;

    const [isFetching, setIsFetching] = useState();
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(7);
        setactiveCon(coindex);
    };
    useEffect(() => {
        if (AdditionalData === null || AdditionalData === undefined) {
            setIsFetching(true);
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        axios
            .get(`${url}AddCharges`, {
                headers: {
                    UserId: currentUser?.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setAdditionalData(parsedData);
                    setIsFetching(false);
                });
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                  // Handle 401 error using SweetAlert
                  swal({
                    title: 'Session Expired!',
                    text: "Please login again",
                    type: 'success',
                    icon: "info",
                    confirmButtonText: 'OK'
                  }).then(function() {
                    axios
                        .post("/logoutAPI")
                        .then((response) => {
                          if (response.status == 200) {
                            window.location.href = "/";
                          }
                        })
                        .catch((error) => {
                            console.log(err);
                            setAdditionalData([]);
                            setIsFetching(false);
                        });
                  });
                } else {
                  // Handle other errors
                  console.log(err);
                  setAdditionalData([]);
                  setIsFetching(false);
                }
              });
    };
    const [filteredData, setFilteredData] = useState(AdditionalData);
    const tableRef = useRef(null);
    const headers = [
        "Consignment No",
        "Quantity",
        "Total Charge",
        "Code Ref",
        "Description Ref",
        "Fuel Levy Amount Ref",
        "Despatch DateTime",
        "Name",
        "Description",
        "Code",
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
        const data = AdditionalData.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (column.replace(/\s+/g, "") === "DespatchDateTime") {
                        acc[columnKey] =
                            moment(
                                person["DespatchDateTime"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DespatchDateTime"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else {
                        acc[columnKey] = person[columnKey];
                    }
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
        data?.forEach((rowData) => {
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
            saveAs(blob, "Additional-Charges.xlsx");
        });
    }
    const [selected, setSelected] = useState([]);

    function getMinMaxValue(data, fieldName, identifier) {
        // Check for null safety
        if (!data || !Array.isArray(data) || data?.length === 0) {
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
    // Usage example remains the same
    const minDate = getMinMaxValue(AdditionalData, "DespatchDateTime", 1);
    const maxDate = getMinMaxValue(AdditionalData, "DespatchDateTime", 2);
    
    const createNewLabelObjects = (data, fieldName) => {
        let id = 1; // Initialize the ID
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];
console.log('asfcvd',data)
        // Map through the data and create new objects
        if(data?.length>0){
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
        });}
        return newData;
    };
    const reference = createNewLabelObjects(AdditionalData, "CodeRef");
    const name = createNewLabelObjects(AdditionalData, "Name");
    const description = createNewLabelObjects(AdditionalData, "Description");
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
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
            name: "SenderReference",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Quantity",
            header: "Quantity",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "TotalCharge",
            header: "Total Charge",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "CodeRef",
            header: "Code Ref",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: reference,
            },
        },
        {
            name: "DescriptionRef",
            header: "Description Ref",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "FuelLevyAmountRef",
            header: "Fuel Levy Amount Ref",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "DespatchDateTime",
            header: "Despatch Date",
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
            name: "Name",
            header: "Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: name,
            },
        },
        {
            name: "Description",
            header: "Description",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: description,
            },
        },
        {
            name: "Code",
            header: "Code",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
    ];
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (AdditionalData.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };
    return (
        <div>
            {/* <Sidebar /> */}
            {isFetching && (
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
            )}
            {!isFetching && (
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex justify-between w-full items-center mt-6">
                            <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                Additional Charges
                            </h1>
                            <Popover className="relative object-right flex-item md:ml-auto">
                                <button onMouseEnter={handleMouseEnter}>
                                    <Popover.Button
                                        className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                            AdditionalData?.length === 0
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-gray-800"
                                        } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={AdditionalData?.length === 0}
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
                                                            value="Quantity"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Quantity
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Total Charge"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Total Charge
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Code Ref"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Code Ref
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Description Ref"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Description Ref
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Fuel Levy Amount Ref"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Fuel Levy Amount Ref
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Despatch DateTime"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Despatch DateTime
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Name"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Name
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Description"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Description
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Code"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Code
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
                        id={"ConsignmentID"}
                        setSelected={setSelected}
                        selected={selected}
                        tableDataElements={AdditionalData}
                        filterValueElements={filterValue}
                        setFilterValueElements={setFilterValue}
                        columnsElements={columns}
                    />
                </div>
            )}
        </div>
    );
}