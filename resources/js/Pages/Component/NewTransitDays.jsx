import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useState, useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import TableStructure from "@/Components/TableStructure";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    canAddNewTransitDays,
    canAddTransitDays,
    canEditTransitDays,
} from "@/permissions";
import swal from "sweetalert";
import axios from "axios";
import GtamButton from "./GTAM/components/Buttons/GtamButton";
import { handleSessionExpiration } from '@/CommonFunctions';
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";

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
    const fetchData = async () => {
        try {
            axios
                .get(`${url}TransitNew`, {
                    headers: {
                        UserId: currentUser.UserId,
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
                        setNewTransitDays(parsedData);
                        setIsFetching(false);
                    });
                });
        } catch (error) {
            if (error.response && error.response.status === 401) {
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
                console.log(err);
            }
        }
    };
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
    const createNewLabelObjects = (data, fieldName) => {
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];
        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];
            if (
                fieldValue &&
                fieldValue.trim() !== "" &&
                !uniqueLabels.has(fieldValue)
            ) {
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
    // const [receiverStateOptions, setReceiverStateOptions] = useState([]);
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
    const [isMessageVisible, setMessageVisible] = useState(false);

    function getUniqueCustomerTypes(data) {
        // Create a Map to store unique customer types with their corresponding IDs
        const typeMap = new Map();

        // Loop through each object in the data array
        data?.forEach((item) => {
            // Add the customer type to the map with the CustomerTypeId as the key
            // only if the CustomerType is not an empty string
            if (item.CustomerType && item.CustomerType.trim() !== "" && !typeMap.has(item.CustomerTypeId)) {
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
                return (
                    <div>
                        {data.CustomerType}
                    </div>
                );
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
    
        const columnMapping = {
            CustomerName: "Customer Name",
            CustomerType: "Customer Type",
            SenderState: "Sender State",
            SenderPostCode: "Sender PostCode",
            ReceiverName: "Receiver Name",
            ReceiverState: "Receiver State",
            ReceiverPostCode: "Receiver Postal Code",
            TransitTime: "Transit Time",
        };
    
        const customCellHandlers = {
            TransitTime: (value) => (value ? `${value} days` : ""),
        };
    
        exportToExcel(jsonData, columnMapping, "TransitDays_Report.xlsx", customCellHandlers);
    };
    const handleMouseEnter = () => {
        if (filteredData.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
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
                                    <Popover className="relative ">
                                        <button onMouseEnter={handleMouseEnter}>
                                            <Popover.Button
                                                className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                                    filteredData?.length === 0
                                                        ? "bg-gray-300 cursor-not-allowed"
                                                        : "bg-gray-800"
                                                } px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
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
                                                                    value="CustomerName"
                                                                    className="text-dark focus:ring-goldd rounded "
                                                                />{" "}
                                                                Customer Name
                                                            </label>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="CustomerType"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Customer Type
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
                                                                    value="SenderPostCode"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Sender PostCode
                                                            </label>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="ReceiverName"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Receiver Name
                                                            </label>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="ReceiverState"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Receiver State
                                                            </label>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="ReceiverPostCode"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Receiver
                                                                PostCode
                                                            </label>
                                                            <label className="">
                                                                <input
                                                                    type="checkbox"
                                                                    name="column"
                                                                    value="TransitTime"
                                                                    className="text-dark rounded focus:ring-goldd"
                                                                />{" "}
                                                                Transit Time
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
