import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useState, useEffect, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import { PencilIcon } from "@heroicons/react/20/solid";
import {
    canAddNewTransitDays,
    canEditTransitDays,
} from "@/permissions";
import { getApiRequest } from "@/CommonFunctions";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import ExportPopover from "@/Components/ExportPopover";
import GtamButton from "../GtamButton";

function NewTransitDays({
    setActiveIndexGTRS,
    setNewTransitDays,
    setNewTransitDay,
    newTransitDays,
    accData,
    currentUser,
    userPermission,
    filterValue,
    setFilterValue,
    AToken,
    url,
}) {
    const [isFetching, setIsFetching] = useState(true);
    const [selected, setSelected] = useState([]);
    const [filteredData, setFilteredData] = useState(newTransitDays);
    const gridRef = useRef(null);

    async function fetchData() {
        const data = await getApiRequest(`${url}TransitNew`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setNewTransitDays(data);
            setIsFetching(false);
        }
    }
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

    const receiverStateOptions = createNewLabelObjects(
        newTransitDays,
        "ReceiverState"
    );
    const senderStateOptions = createNewLabelObjects(
        newTransitDays,
        "SenderState"
    );
    const customers = getUniqueCustomers(newTransitDays);
    function getUniqueCustomers(data) {
        // Create a Set to store unique customer names
        const customerSet = new Set();

        // Loop through each object in the data array
        data?.forEach((item) => {
            // Add the CustomerName to the set
            customerSet.add(item.CustomerName);
        });

        // Convert the set to an array of objects with id and label
        const uniqueCustomers = Array.from(customerSet).map((customer) => ({
            id: customer,
            label: customer,
        }));

        return uniqueCustomers;
    }

    const types = getUniqueCustomerTypes(newTransitDays);

    function getUniqueCustomerTypes(data) {
        // Create a Map to store unique customer types with their corresponding IDs
        const typeMap = new Map();

        // Loop through each object in the data array
        data?.forEach((item) => {
            // Add the customer type to the map with the CustomerTypeId as the key
            // only if the CustomerType is not an empty string
            if (
                item.CustomerType &&
                item.CustomerType.trim() !== "" &&
                !typeMap.has(item.CustomerTypeId)
            ) {
                typeMap.set(item.CustomerTypeId, item.CustomerType);
            }
        });

        // Convert the map to an array of objects with id and label
        const uniqueCustomers = Array.from(typeMap).map(([id, label]) => ({
            id,
            label,
        }));

        return uniqueCustomers;
    }
    const columns = [
        {
            name: "CustomerName",
            header: "Customer Name",
            type: "string",
            headerAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: customers,
            },
        },
        {
            name: "CustomerTypeId",
            header: "Customer Type",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: types,
            },
            render: ({ value, data }) => {
                return <div>{data.CustomerType}</div>;
            },
        },
        {
            name: "SenderState",
            header: "Sender State",
            type: "string",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
        },
        {
            name: "SenderPostCode",
            header: "Sender PostCode",
            type: "number",
            headerAlign: "center",
            group: "senderDetails",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            type: "string",
            group: "receiverDetails",
            headerAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            group: "receiverDetails",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
        },
        {
            name: "ReceiverPostCode",
            header: "Receiver PostCode",
            type: "number",
            headerAlign: "center",
            group: "receiverDetails",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "TransitTime",
            header: "Transit Time",
            type: "number",
            headerAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            textAlign: "center",
            filterEditor: NumberFilter,
        },
        {
            name: "edit",
            header: "Edit",
            headerAlign: "center",
            textAlign: "center",
            minWidth: 170,
            defaultFlex: 1,
            render: ({ value, data }) => {
                return (
                    <div>
                        {canEditTransitDays(userPermission) ? (
                            <button
                                className={
                                    "rounded text-blue-500 justify-center items-center  "
                                }
                                onClick={() => {
                                    handleEditClick(data);
                                }}
                            >
                                <span className="flex gap-x-1">
                                    <PencilIcon className="h-4" />
                                    Edit
                                </span>
                            </button>
                        ) : null}
                    </div>
                );
            },
        },
    ];
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        setFilteredData(newTransitDays);
    }, [newTransitDays]);
    function handleEditClick(object) {
        setNewTransitDay(object);
        setActiveIndexGTRS(19);
    }

    function AddTransit() {
        setNewTransitDay(null);
        setActiveIndexGTRS(19);
    }

    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, filteredData);

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        const customCellHandlers = {
            TransitTime: (value) => (value ? `${value} days` : ""),
        };

        exportToExcel(
            jsonData,
            columnMapping,
            "TransitDays_Report.xlsx",
            customCellHandlers
        );
    };

    return (
        <div>
            {isFetching ? (
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
                    <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex w-full items-center justify-between mt-2 lg:mt-6">
                                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                                    Transit Days
                                </h1>
                                <div className="flex gap-5">
                                    {canAddNewTransitDays(userPermission) ? (
                                        <GtamButton
                                            name={"Add +"}
                                            onClick={AddTransit}
                                            className="w-[5.5rem] h-[36px]"
                                        />
                                    ) : null}
                                    <ExportPopover
                                        columns={columns}
                                        handleDownloadExcel={
                                            handleDownloadExcel
                                        }
                                        filteredData={filteredData}
                                    />
                                </div>
                            </div>
                        </div>
                        <TableStructure
                            id={"TransitId"}
                            setSelected={setSelected}
                            gridRef={gridRef}
                            selected={selected}
                            groupsElements={groups}
                            tableDataElements={newTransitDays}
                            filterValueElements={filterValue}
                            setFilterValueElements={setFilterValue}
                            columnsElements={columns}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
export default NewTransitDays;
