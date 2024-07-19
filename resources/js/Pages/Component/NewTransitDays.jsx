import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import { useState, useEffect, useRef } from "react";
import TableStructure from "@/Components/TableStructure";
import { PencilIcon } from "@heroicons/react/20/solid";
import { canAddNewTransitDays, canAddTransitDays, canEditTransitDays } from "@/permissions";
import swal from "sweetalert";
import axios from "axios";
import GtamButton from "./GTAM/components/Buttons/GtamButton";

function NewTransitDays({
    setActiveIndexGTRS,
    setNewTransitDays,
    setNewTransitDay,
    newTransitDays,
    newtransitDay,
    currentUser,
    filterValue,
    setFilterValue,
    AToken,
    url,
}) {
    const [isFetching, setIsFetching] = useState(true);
    const [selected, setSelected] = useState([]);
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
                }).then(function () {
                    axios
                        .post("/logoutAPI")
                        .then((response) => {
                            if (response.status == 200) {
                                window.location.href = "/";
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
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
    const senderStateOptions = createNewLabelObjects(
        newTransitDays,
        "SenderState"
    );

    const receiverStateOptions = createNewLabelObjects(
        newTransitDays,
        "ReceiverState"
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
        // Create a Set to store unique type
        const typeSet = new Set();

        // Loop through each object in the data array
        data?.forEach((item) => {
            // Add the type to the set
            typeSet.add(item.CustomerType);
        });

        // Convert the set to an array of objects with id and label
        const uniqueCustomers = Array.from(typeSet).map((type) => ({
            id: type,
            label: type,
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
            name: "CustomerType",
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
                        {canEditTransitDays(currentUser) ? (
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
    function handleEditClick(object) {
        setNewTransitDay(object);
        setActiveIndexGTRS(19);
    }

    function AddTransit() {
      setNewTransitDay(null);
      setActiveIndexGTRS(19);
  }

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
                                    New Transit Days
                                </h1>
                                {canAddNewTransitDays(currentUser) ? (
                                    <GtamButton
                                        name={"Add +"}
                                        onClick={AddTransit}
                                    />
                                ) : null}
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
