import { Fragment, useEffect, useState, useRef } from "react";
import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import { forwardRef } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { handleFilterTable } from "@/Components/utils/filterUtils";

export default function DifotReport({
    difotData,
    filterValue,
    setFilterValue,
    fetchData,
}) {
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState(null);
    useEffect(() => {
        if (difotData) {
            setFilteredData(difotData);
            setData(difotData);
        }
    }, [difotData]);

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

    const minDatePickup = getMinMaxValue(difotData, "DespatchDate", 1);
    const maxDatePickup = getMinMaxValue(difotData, "DespatchDate", 2);
    const minDaterdd = getMinMaxValue(difotData, "OldRdd", 1);
    const maxDaterdd = getMinMaxValue(difotData, "OldRdd", 2);
    const minDateNewRdd = getMinMaxValue(difotData, "NewRdd", 1);
    const maxDateNewRdd = getMinMaxValue(difotData, "NewRdd", 2);
    const minDateActualDel = getMinMaxValue(difotData, "ActualDeliveyDate", 1);
    const maxDateActualDel = getMinMaxValue(difotData, "ActualDeliveyDate", 2);
    const minDateChangedAt = getMinMaxValue(difotData, "ChangedAt", 1);
    const maxDateChangedAt = getMinMaxValue(difotData, "ChangedAt", 2);
    const gridRef = useRef(null);

    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, difotData);
        const columnMapping = {
            DeliveryNo: "Delivery No",
            PickupDate: "Pickup Date",
            SenderName: "Sender Name",
            SenderSuburb: "Sender Suburb",
            SenderState: "Sender State",
            SenderReference: "Sender Reference",
            CustomerName: "Customer Name",
            Spaces: "Spaces",
            Pallets: "Pallets",
            Weight: "Weight",
            CustomerPO: "Customer PO",
            ReceiverPostCode: "Receiver Post Code",
            ReceiverState: "Receiver State",
            ReceiverReference: "Receiver Reference",
            Service: "Service",
            OldRdd: "Old RDD",
            NewRdd: "New RDD",
            Reason: "Reason",
            ReasonDesc: "Reason Description",
            ChangedAt: "ChangedAt",
            LTLFTL: "LTL/FTL",
            ActualDeliveyDate: "Actual Delivery Date",
            OnTime: "On Time",
            GtlsError: "GTLS Error",
            Status: "Status",
            POD: "POD",
            DelayReason: "Delay Reason",
            TransportComment: "Transport Comments",
        };

        const selectedColumns = jsonData?.selectedColumns.map(
            (column) => column.name
        );
        const newSelectedColumns = selectedColumns.map(
            (column) => columnMapping[column] || column // Replace with new name, or keep original if not found in mapping
        );

        const filterValue = jsonData?.filterValue;
        const data = filterValue.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (
                        [
                            "ActualDeliveyDate",
                            "PickupDate",
                            "ChangedAt",
                        ].includes(columnKey)
                    ) {
                        const date = new Date(person[columnKey]);
                        if (!isNaN(date)) {
                            acc[columnKey] =
                                moment(date).format("DD-MM-YYYY hh:mm A");
                        } else {
                            acc[columnKey] = "";
                        }
                    } else if (
                        ["RDD", "OldRdd", "NewRdd"].includes(columnKey)
                    ) {
                        acc[columnKey] = person[columnKey].replace(/\//g, "-");
                        //value.replace(/\//g, '-')
                    } else {
                        acc[columnKey] = person[columnKey];
                    }
                } else {
                    acc[columnKey] = person[columnKey];
                }
                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(newSelectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        // Add the data to the worksheet
        data.forEach((rowData) => {
            const row = worksheet.addRow(Object.values(rowData));

            // Apply date format to the DespatchDateTime column
            const despatchDateIndex =
                newSelectedColumns.indexOf("Despatch DateTime");
            if (despatchDateIndex !== -1) {
                const cell = row.getCell(despatchDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
            }

            // Apply date format to the DeliveryRequiredDateTime column
            const deliveryReqDateIndex = newSelectedColumns.indexOf(
                "Delivery Required DateTime"
            );
            if (deliveryReqDateIndex !== -1) {
                const cell = row.getCell(deliveryReqDateIndex + 1);
                cell.numFmt = "dd-mm-yyyy hh:mm AM/PM";
            }
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 20); // Set width of each column
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
            saveAs(blob, "DifotReport.xlsx");
        });
    };
    const [selected, setSelected] = useState([]);

    const groups = [
        {
            name: "senderInfo",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverInfo",
            header: "Receiver Details",
            headerAlign: "center",
        },
        {
            name: "customerInfo",
            header: "Customer Details",
            headerAlign: "center",
        },
    ];

    const createNewLabelObjects = (data, fieldName) => {
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
            // Check if the label is not already included
            if (!uniqueLabels.has(fieldValue)) {
                uniqueLabels.add(fieldValue);
                const newObject = {
                    id: fieldValue?.toString(),
                    label: fieldValue?.toString(),
                };
                newData.push(newObject);
            }
        });
        return newData;
    };

    const senderStates = createNewLabelObjects(difotData, "SenderState");
    const receiverStates = createNewLabelObjects(difotData, "ReceiverState");
    const services = createNewLabelObjects(difotData, "Service");
    const LTLFTLOptions = createNewLabelObjects(difotData, "LTLFTL");
    const StatusOptions = createNewLabelObjects(difotData, "OnTime");
    const GtlsErrorOptions = createNewLabelObjects(difotData, "GtlsError");
    const PODOptions = createNewLabelObjects(difotData, "POD");

    const columns = [
        {
            name: "DeliveryNo",
            header: "Delivery No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "PickupDate",
            header: "Pickup Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDatePickup,
                maxDate: maxDatePickup,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "SenderName",
            header: "Sender Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
            group: "senderInfo",
        },
        {
            name: "SenderSuburb",
            header: "Sender Suburb",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            group: "senderInfo",
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStates,
            },
            group: "senderInfo",
        },
        {
            name: "CustomerName",
            header: "Customer Name",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "State",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStates,
            },
        },
        {
            name: "ReceiverPostCode",
            header: "Post Code",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Spaces",
            header: "Spaces",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Pallets",
            header: "Pallets",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Weight",
            header: "Weight",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "CustomerPO",
            header: "Customer PO",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
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
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Service",
            header: "Service",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: services,
            },
        },
        {
            name: "OldRdd",
            header: "Old RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDaterdd,
                maxDate: maxDaterdd,
            },
            render: ({ value }) => {
                const dateValue = value ? value.replace(/\//g, "-") : "";
                return (
                    <span className="flex justify-start items-left text-left">
                        {dateValue}
                    </span>
                );
            },
        },
        {
            name: "NewRdd",
            header: "New RDD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateNewRdd,
                maxDate: maxDateNewRdd,
            },
            render: ({ value, cellProps }) => {
                const dateValue = value ? value.replace(/\//g, "-") : "";
                return (
                    <span className="flex justify-start items-left text-left">
                        {dateValue}
                    </span>
                );
            },
        },
        {
            name: "Reason",
            header: "Reason",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReasonDesc",
            header: "Reason Description",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ChangedAt",
            header: "Changed At",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateChangedAt,
                maxDate: maxDateChangedAt,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
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
            name: "Status",
            header: "Status",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ActualDeliveyDate",
            header: "Actual Delivery Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDateActualDel,
                maxDate: maxDateActualDel,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "OnTime",
            header: "OnTime",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: StatusOptions,
            },
            render: ({ value }) => {
                return value?.toLowerCase() == "yes" ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        {value}
                    </span>
                ) : value?.toLowerCase() == "no" ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        {value}
                    </span>
                ) : value?.toLowerCase() == "pending" ? (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                        {value}
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-0.5 text-sm">
                        {value ? value : ""}
                    </span>
                );
            },
        },
        {
            name: "GtlsError",
            header: "GTLS Error",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: GtlsErrorOptions,
            },
            render: ({ value }) => {
                return value?.toLowerCase() == "yes" ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        {value}
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        {value}
                    </span>
                );
            },
        },
        {
            name: "POD",
            header: "POD",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: PODOptions,
            },
            render: ({ value }) => {
                return value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        {value?.toString()}
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        {value?.toString()}
                    </span>
                );
            },
        },
        {
            name: "DelayReason",
            header: "Delay Reason",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "TransportComment",
            header: "Transport Comments",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
    ];

    return (
        <div>
            <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20 h-full">
                <div className="mt-4 h-full">
                    {data == null ? (
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
                        <div className=" w-full bg-smooth h-full">
                            <TableStructure
                                id={"ConsignmentID"}
                                handleDownloadExcel={handleDownloadExcel}
                                title={"DIFOT Report"}
                                setSelected={setSelected}
                                gridRef={gridRef}
                                selected={selected}
                                groupsElements={groups}
                                tableDataElements={filteredData}
                                filterValueElements={filterValue}
                                setFilteredData={setFilteredData}
                                setFilterValueElements={setFilterValue}
                                columnsElements={columns}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
