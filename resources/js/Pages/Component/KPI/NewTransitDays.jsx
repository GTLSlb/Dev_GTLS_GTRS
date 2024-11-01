import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useState, useEffect, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import { PencilIcon } from "@heroicons/react/20/solid";
import { canAddNewTransitDays, canEditTransitDays } from "@/permissions";
import { getApiRequest } from "@/CommonFunctions";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { useNavigate } from "react-router-dom";
import AnimatedLoading from "@/Components/AnimatedLoading";
import GtrsButton from "../GtrsButton";

function NewTransitDays({
    setNewTransitDays,
    newTransitDays,
    currentUser,
    userPermission,
    filterValue,
    setFilterValue,
    url,
}) {
    const [isFetching, setIsFetching] = useState(true);
    const [selected, setSelected] = useState([]);
    const [filteredData, setFilteredData] = useState(newTransitDays);
    const gridRef = useRef(null);
    const navigate = useNavigate();

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
    const [columns, setColumns] = useState([
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
        }
    ]);
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if(userPermission && canEditTransitDays(userPermission)){
            setColumns([
                ...columns,
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
                            </div>
                        );
                    },
                },
            ]);
        }
    },[userPermission])
    useEffect(() => {
        setFilteredData(newTransitDays);
    }, [newTransitDays]);
    function handleEditClick(object) {
        // setNewTransitDay(object);
        navigate("/gtrs/add-transit", { state: { newTransitDay: object } });
    }

    function AddTransit() {
        // setNewTransitDay(null);
        navigate("/gtrs/add-transit", { state: { newTransitDay: null } });
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

    const additionalButtons = canAddNewTransitDays(userPermission) ? (
        <GtrsButton
            name={"Add +"}
            onClick={AddTransit}
            className="w-[5.5rem] h-[36px]"
        />
    ) : null;

    return (
        <div>
            {isFetching ? (
                <AnimatedLoading />
            ) : (
                <div>
                    <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                        <TableStructure
                            id={"TransitId"}
                            setSelected={setSelected}
                            gridRef={gridRef}
                            handleDownloadExcel={handleDownloadExcel}
                            title={"Transit Days"}
                            selected={selected}
                            additionalButtons={additionalButtons}
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
