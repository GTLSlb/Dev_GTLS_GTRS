import { useState } from "react";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import axios from "axios";
import {
    CheckIcon,
    ChevronDoubleDownIcon,
    ChevronDownIcon,
} from "@heroicons/react/20/solid";
import GtamButton from "../GTAM/components/Buttons/GtamButton";
import { useEffect } from "react";
import swal from "sweetalert";
import { AlertToast } from "@/permissions";

function AddNewTransitDay({
    url,
    currentUser,
    setNewTransitDay,
    setNewTransitDays,
    AToken,
    setActiveIndexGTRS,
    newtransitDay,
}) {
    const states = [
        {
            id: "ACT",
            label: "ACT",
        },
        {
            id: "NSW",
            label: "NSW",
        },
        {
            id: "QLD",
            label: "QLD",
        },
        {
            id: "SA",
            label: "SA",
        },
        {
            id: "VIC",
            label: "VIC",
        },

        {
            id: "TAS",
            label: "TAS",
        },
        {
            id: "WA",
            label: "WA",
        },
    ];

    const customers = [
        { id: 1, label: "UNILEVER" },
        { id: 2, label: "GMI" },
        { id: 3, label: "FREIGHT PEOPLE" },
        { id: 4, label: "KIMBERLY CLARK" },
        { id: 5, label: "PET BRANDS" },
        { id: 6, label: "KERRY INGREDIENTS" },
    ];

    const types = [
        { id: 1, label: "FOOD" },
        { id: 2, label: "HPC" },
        { id: 3, label: "Food Solutions - QLD" },
        { id: 4, label: "METCASH" },
    ];

    const freighPeople = [
        { id: 5, label: "KERRY" },
        { id: 99, label: "None" },
    ];
    const [object, setObject] = useState(newtransitDay);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRstate, setSelectedRstate] = useState(
        newtransitDay?.ReceiverState || null
    );
    const [selectedRZone, setSelectedRZone] = useState(
        newtransitDay?.ReceiverZoneId || null
    );
    const [receiverFtlLtl , setReceiverFtlLtl ] = useState(
        newtransitDay?.FtlLtl || null
    );
    const [selectedSstate, setSelectedSstate] = useState(
        newtransitDay?.SenderState || null
    );
    const [selectedCustomer, setSelectedCustomer] = useState(
        newtransitDay?.CustomerId || null
    );
    const [selectedType, setSelectedType] = useState(
        newtransitDay?.CustomerTypeId || null
    );
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

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

    function AddTransit(e) {
        e.preventDefault();
        setIsLoading(true);
        const inputValues = {
            TransitId: object ? object.TransitId : null,
            CustomerId: selectedCustomer,
            CustomerTypeId:
                selectedCustomer == 1 || selectedCustomer == 3
                    ? selectedType
                    : 0,
            SenderState: selectedSstate,
            SenderPostCode:
                document.getElementById("SenderPostCode").value == ""
                    ? null
                    : document.getElementById("SenderPostCode").value,
            ReceiverName: document.getElementById("ReceiverName").value,
            ReceiverState: selectedRstate,
            ReceiverPostCode:
                document.getElementById("ReceiverPostCode").value == ""
                    ? null
                    : document.getElementById("ReceiverPostCode").value,
            TransitTime: document.getElementById("TransitTime").value,
            ReceiverZoneId: selectedRZone,
            FtlLtl: receiverFtlLtl,
        };
        axios
            .post(`${url}Add/TransitNew`, inputValues, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                fetchData();
                setNewTransitDay(null);
                setActiveIndexGTRS(18);
                setIsLoading(false);
                AlertToast("Saved successfully", 1);
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
                    setIsLoading(false);
                }
            });
    }

    function CancelHandle() {
        setNewTransitDay(null);
        setActiveIndexGTRS(18);
    }
    const receiverZoneOptions=[
        {
            id: 111,
            label: 'Melbourne Metro',
        },
        {
            id: 102,
            label: 'Sydney Metro',
        },
    ]
    const ltlFtlOptions=[
        {
            id: 'FTL',
            label: 'FTL',
        },
        {
            id: 'LTL',
            label: 'LTL',
        },
    ]
    return (
        <div className="p-8">
            <div className="shadow bg-white p-6 rounded-lg ">
                <form onSubmit={AddTransit}>
                    <p className="font-bold text-lg">Add Transit</p>
                    <div className="border-b mt-2" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-5 items-center py-4">
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="CustomerId" className="block w-48">
                                Customer Name:
                            </label>
                            <select
                                id="CustomerId"
                                name="CustomerId"
                                className="w-full border border-gray-300 rounded px-3 py-2 sm:w-96"
                                // defaultValue={modalSafetyType}
                                // value={formValues.SafetyType || ""}
                                value={selectedCustomer}
                                onChange={(e) => {
                                    setSelectedCustomer(e.target.value);
                                }}
                                required
                            >
                                <option value="">--Select a Customer--</option>
                                {customers?.map((customer) => {
                                    return (
                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {object?.CustomerId == 1 || selectedCustomer == 1 ? (
                            <div className="col-span-2 flex items-center gap-x-2">
                                <label
                                    htmlFor="SafetyType"
                                    className="block w-48"
                                >
                                    Customer Type:
                                </label>
                                <select
                                    id="SafetyType"
                                    name="SafetyType"
                                    className="w-full border border-gray-300 rounded px-3 py-2 sm:w-96"
                                    // defaultValue={modalSafetyType}
                                    // value={formValues.SafetyType || ""}
                                    value={selectedType}
                                    onChange={(e) => {
                                        setSelectedType(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="">
                                        --Select a Customer Type--
                                    </option>

                                    {types?.map((type) => {
                                        return (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        ) : object?.CustomerId == 3 || selectedCustomer == 3 ? (
                            <div className="col-span-2 flex items-center gap-x-2">
                                <label
                                    htmlFor="SafetyType"
                                    className="block w-48"
                                >
                                    Customer Type:
                                </label>
                                <select
                                    id="SafetyType"
                                    name="SafetyType"
                                    className="w-full border border-gray-300 rounded px-3 py-2 sm:w-96"
                                    // defaultValue={modalSafetyType}
                                    // value={formValues.SafetyType || ""}
                                    value={selectedType}
                                    onChange={(e) => {
                                        setSelectedType(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="">
                                        --Select a Customer Type--
                                    </option>
                                    {freighPeople?.map((type) => {
                                        return (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        ) : (
                            <div className="col-span-2"></div>
                        )}

                        {/* Sender Title Border  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <div className="flex flex-col">
                                <p className="font-bold text-lg">Sender</p>
                            </div>
                        </div>

                        {/* Receiver Title Border  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <div className="flex flex-col">
                                <p className="font-bold text-lg">Receiver</p>
                            </div>
                        </div>

                        {/* Sender State  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="SenderState" className="block w-48">
                                Sender State:
                            </label>
                            <select
                                id="SenderState"
                                name="SenderState"
                                className="w-full border border-gray-300 rounded px-3 py-2 sm:w-96"
                                // defaultValue={modalSafetyType}
                                // value={formValues.SafetyType || ""}
                                value={selectedSstate}
                                onChange={(e) => {
                                    setSelectedSstate(e.target.value);
                                }}
                                required
                            >
                                <option value="">--Select a State--</option>

                                {states?.map((state) => {
                                    return (
                                        <option key={state.id} value={state.id}>
                                            {state.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Receiver State  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label
                                htmlFor="ReceiverState"
                                className="block w-48"
                            >
                                Receiver State:
                            </label>
                            <select
                                id="ReceiverState"
                                name="ReceiverState"
                                className="w-full border border-gray-300 rounded px-3 py-2 sm:w-96"
                                // defaultValue={modalSafetyType}
                                // value={formValues.SafetyType || ""}
                                value={selectedRstate}
                                onChange={(e) => {
                                    setSelectedRstate(e.target.value);
                                }}
                                required
                            >
                                <option value="">--Select a State--</option>

                                {states?.map((state) => {
                                    return (
                                        <option key={state.id} value={state.id}>
                                            {state.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        
                        {/* Sender PostCode  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Sender PostCode:{" "}
                            </label>
                            <input
                                type="number"
                                name="name"
                                id="SenderPostCode"
                                defaultValue={
                                    object ? object.SenderPostCode : null
                                }
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>

                        {/* Receiver PostCode  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48">
                                Receiver PostCode:{" "}
                            </label>
                            <input
                                type="number"
                                name="name"
                                defaultValue={
                                    object ? object.ReceiverPostCode : ""
                                }
                                id="ReceiverPostCode"
                                className="rounded sm:w-96 bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>

                        <div className="col-span-2 flex items-center gap-x-2"></div>

                        {/* Receiver Name  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block w-48 ">
                                Receiver Name:{" "}
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={object ? object.ReceiverName : ""}
                                id="ReceiverName"
                                className="rounded sm:w-96 max-w-lg bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-x-2">
                        </div>
                        {/* Receiver Zone  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label
                                htmlFor="ReceiverZone"
                                className="block w-48"
                            >
                                Receiver Zone:
                            </label>
                            <select
                                id="ReceiverZone"
                                name="ReceiverZone"
                                className="w-full border border-gray-300 rounded px-3 py-2 sm:w-96"
                                // defaultValue={modalSafetyType}
                                // value={formValues.SafetyType || ""}
                                value={selectedRZone}
                                onChange={(e) => {
                                    setSelectedRZone(e.target.value);
                                }}
                            >
                                <option value="">--Select a Zone--</option>

                                {receiverZoneOptions?.map((op) => {
                                    return (
                                        <option key={op.id} value={op.id}>
                                            {op.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="col-span-2 flex items-center gap-x-2">
                        </div>
                        {/* FTL/LTL  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label
                                htmlFor="FTLLTL"
                                className="block w-48"
                            >
                                FTL/LTL:
                            </label>
                            <select
                                id="FTLLTL"
                                name="FTLLTL"
                                className="w-full border border-gray-300 rounded px-3 py-2 sm:w-96"
                                // defaultValue={modalSafetyType}
                                // value={formValues.SafetyType || ""}
                                value={receiverFtlLtl}
                                onChange={(e) => {
                                    setReceiverFtlLtl(e.target.value);
                                }}
                            >
                                <option value="">--Select Ftl/Ltl--</option>

                                {ltlFtlOptions?.map((op) => {
                                    return (
                                        <option key={op.id} value={op.id}>
                                            {op.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Sender Title Border  */}
                        <div className="col-span-4 flex items-center gap-x-2">
                            <div className="flex flex-col">
                                <p className="font-bold text-lg">Transit</p>
                            </div>
                        </div>
                        
                        {/* Transit Time  */}
                        <div className="col-span-2 flex items-center gap-x-2">
                            <label htmlFor="name" className="block  w-48">
                                Transit Time:{" "}
                            </label>
                            <input
                                type="number"
                                defaultValue={object ? object.TransitTime : ""}
                                name="TransitTime"
                                id="TransitTime"
                                required
                                className="rounded sm:w-96 max-w-lg bg-gray-50 border border-gray-300 h-7"
                            />
                        </div>
                    </div>
                    
                    <div className="flex w-full gap-x-2 justify-end">
                        <GtamButton
                            // disabled={isLoading}
                            name={"Cancel"}
                            onClick={CancelHandle}
                            type={"submit"}
                        />{" "}
                        <GtamButton
                            // disabled={isLoading}
                            name={object ? "Edit" : "Create"}
                            type={"submit"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNewTransitDay;
