import { useRef, useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import {
    formatDateToExcel,
    getApiRequest,
} from "@/CommonFunctions";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import ExportPopover from "@/Components/ExportPopover";


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

    async function fetchData() {
        const data = await getApiRequest(`${url}AddCharges`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setAdditionalData(data);
            setIsFetching(false);
        }
    }
    const gridRef = useRef(null);
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, AdditionalData); // Fetch the filtered data

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers for specific columns
        const customCellHandlers = {
            DespatchDateTime: (value) =>
                value ? formatDateToExcel(value) : "",
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Additional-Charges.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["DespatchDateTime"]
        );
    };

    const [selected, setSelected] = useState([]);

    // Usage example remains the same
    const minDate = getMinMaxValue(AdditionalData, "DespatchDateTime", 1);
    const maxDate = getMinMaxValue(AdditionalData, "DespatchDateTime", 2);

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
                        onClick={() => handleClick(data.ConsignmentID)}
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
                            <ExportPopover
                                columns={columns}
                                handleDownloadExcel={handleDownloadExcel}
                                filteredData={AdditionalData}
                            />
                        </div>
                    </div>

                    <TableStructure
                        id={"ConsignmentID"}
                        gridRef={gridRef}
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
