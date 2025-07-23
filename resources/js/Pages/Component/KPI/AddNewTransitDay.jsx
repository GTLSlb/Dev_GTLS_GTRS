import { getApiRequest, handleSessionExpiration } from "@/CommonFunctions";
import { AlertToast } from "@/permissions";
import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import GtrsButton from "../GtrsButton";
import { ToastContainer } from "react-toastify";
function AddNewTransitDay({
    url,
    currentUser,
    setNewTransitDay,
    setNewTransitDays,
    Token,
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

    const navigate = useNavigate();
    const customers = [
        { id: 1, label: "UNILEVER" },
        { id: 2, label: "GMI" },
        { id: 3, label: "FREIGHT PEOPLE" },
        { id: 4, label: "KIMBERLY CLARK" },
        { id: 5, label: "PET BRANDS" },
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
    const location = useLocation();
    const object=location?.state?.newTransitDay
    const [selectedRstate, setSelectedRstate] = useState(
        location?.state?.newTransitDay?.ReceiverState || null
    );
    const [selectedSstate, setSelectedSstate] = useState(
        location?.state?.newTransitDay?.SenderState || null
    );
    const [selectedCustomer, setSelectedCustomer] = useState(
        location?.state?.newTransitDay?.CustomerId || null
    );
    const [selectedType, setSelectedType] = useState(
        location?.state?.newTransitDay?.CustomerTypeId || null
    );

    async function fetchData() {
        const data = await getApiRequest(`${url}TransitNew`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setNewTransitDays(data);
        }
    }

    function AddTransit(e) {
        e.preventDefault();
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
        };
        axios
            .post(`${url}Add/TransitNew`, inputValues, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                AlertToast("Saved successfully", 1);
                fetchData();
                setNewTransitDay(null);
                navigate(-1);
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
                    }).then(async function () {
                        await handleSessionExpiration();
                    });
                } else {
                    // Handle other errors
                    console.error(err);
                }
            });
    }

    function CancelHandle() {
        setNewTransitDay(null);
        navigate(-1);
    }
    return (
        <div className="p-8">
            {/* Added this for toast container to show */}
            <ToastContainer />
            <div className="shadow bg-white p-4 lg:p-6 rounded-lg">
                <form onSubmit={AddTransit}>
                    <p className="font-bold text-lg">
                        {object ? "Edit " : "Add "} Transit
                    </p>
                    <div className="border-b my-2" />
                    <div className="flex flex-col gap-5">
                        <div className="col-span-2 flex flex-col lg:flex-row items-center gap-x-2 w-full">
                            <label
                                htmlFor="CustomerId"
                                className="block w-full lg:w-48"
                            >
                                Customer Name:
                                <span className="text-red-500 text-sm">*</span>
                            </label>
                            <select
                                id="CustomerId"
                                name="CustomerId"
                                className="w-full border border-gray-300 rounded px-3 py-2"
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
                                    className="block w-full lg:w-48"
                                >
                                    Customer Type:
                                    <span className="text-red-500 text-sm">
                                        *
                                    </span>
                                </label>
                                <select
                                    id="SafetyType"
                                    name="SafetyType"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                                    className="block w-full lg:w-48"
                                >
                                    Customer Type:
                                </label>
                                <select
                                    id="SafetyType"
                                    name="SafetyType"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                        ) : null}

                        <div className="grid grid-cols-2 gap-5 w-full">
                            {/* Sender Title Border  */}
                            <div className="flex flex-col col-span-2 lg:col-span-1">
                                <div className="flex flex-col">
                                    <p className="font-bold text-lg">Sender</p>
                                </div>

                                <div className="flex flex-col gap-2 lg:gap-5">
                                    {/* Sender State  */}
                                    <div className="flex flex-col lg:flex-row items-center gap-x-2">
                                        <label
                                            htmlFor="SenderState"
                                            className="block w-full lg:w-48"
                                        >
                                            Sender State:
                                            <span className="text-red-500 text-sm">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="SenderState"
                                            name="SenderState"
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            value={selectedSstate}
                                            onChange={(e) => {
                                                setSelectedSstate(
                                                    e.target.value
                                                );
                                            }}
                                            required
                                        >
                                            <option value="">
                                                --Select a State--
                                            </option>

                                            {states?.map((state) => {
                                                return (
                                                    <option
                                                        key={state.id}
                                                        value={state.id}
                                                    >
                                                        {state.label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    {/* Sender PostCode  */}
                                    <div className="flex flex-col lg:flex-row items-center">
                                        <label
                                            htmlFor="name"
                                            className="block w-full lg:w-48"
                                        >
                                            Sender PostCode:{" "}
                                        </label>
                                        <input
                                            type="number"
                                            name="name"
                                            id="SenderPostCode"
                                            defaultValue={
                                                object
                                                    ? object.SenderPostCode
                                                    : ""
                                            }
                                            min="0"
                                            className="rounded w-full bg-gray-50 border border-gray-300 h-7"
                                            onInput={(e) => {
                                                const value = e.target.value;
                                                if (value < 0) {
                                                    e.target.value = 0; // Reset to 0 if a negative value is entered
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                // Prevent negative symbol and exponential input
                                                if (
                                                    e.key === "-" ||
                                                    e.key === "e" ||
                                                    e.key === "E"
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Receiver Title Border  */}
                            <div className="flex flex-col col-span-2 lg:col-span-1">
                                <p className="font-bold text-lg">Receiver</p>

                                <div className="flex flex-col gap-2 lg:gap-5">
                                    {/* Receiver State  */}
                                    <div className="flex flex-col lg:flex-row items-center gap-x-2">
                                        <label
                                            htmlFor="ReceiverState"
                                            className="block w-full lg:w-48"
                                        >
                                            Receiver State:
                                            <span className="text-red-500 text-sm">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="ReceiverState"
                                            name="ReceiverState"
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            value={selectedRstate}
                                            onChange={(e) => {
                                                setSelectedRstate(
                                                    e.target.value
                                                );
                                            }}
                                            required
                                        >
                                            <option value="">
                                                --Select a State--
                                            </option>

                                            {states?.map((state) => {
                                                return (
                                                    <option
                                                        key={state.id}
                                                        value={state.id}
                                                    >
                                                        {state.label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    {/* Receiver PostCode  */}
                                    <div className="flex flex-col lg:flex-row items-center gap-x-2">
                                        <label
                                            htmlFor="name"
                                            className="block w-full lg:w-48"
                                        >
                                            Receiver PostCode:{" "}
                                        </label>
                                        <input
                                            type="number"
                                            name="name"
                                            defaultValue={
                                                object
                                                    ? object.ReceiverPostCode
                                                    : ""
                                            }
                                            id="ReceiverPostCode"
                                            className="rounded w-full bg-gray-50 border border-gray-300 h-7"
                                            min={0}
                                            onInput={(e) => {
                                                const value = e.target.value;
                                                if (value < 0) {
                                                    e.target.value = 0; // Reset to 0 if a negative value is entered
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                // Prevent negative symbol and exponential input
                                                if (
                                                    e.key === "-" ||
                                                    e.key === "e" ||
                                                    e.key === "E"
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Receiver Name  */}
                                    <div className="flex flex-col lg:flex-row items-center gap-x-2">
                                        <label
                                            htmlFor="name"
                                            className="block w-full lg:w-48 "
                                        >
                                            Receiver Name:{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={
                                                object
                                                    ? object.ReceiverName
                                                    : ""
                                            }
                                            id="ReceiverName"
                                            className="rounded w-full max-w-lg bg-gray-50 border border-gray-300 h-7"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Transit Time  */}
                        <div className="flex flex-col gap-2 lg:gap-5">
                            <div className="flex flex-col">
                                <p className="font-bold text-lg">Transit</p>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center gap-x-2">
                                <label
                                    htmlFor="name"
                                    className="block w-full lg:w-48"
                                >
                                    Transit Time:{" "}
                                    <span className="text-red-500 text-sm">
                                        *
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    defaultValue={
                                        object ? object.TransitTime : ""
                                    }
                                    name="TransitTime"
                                    id="TransitTime"
                                    required
                                    className="rounded w-full max-w-lg bg-gray-50 border border-gray-300 h-7"
                                    min={0}
                                    onInput={(e) => {
                                        const value = e.target.value;
                                        if (value < 0) {
                                            e.target.value = 0; // Reset to 0 if a negative value is entered
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent negative symbol and exponential input
                                        if (
                                            e.key === "-" ||
                                            e.key === "e" ||
                                            e.key === "E"
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full gap-x-2 mt-4 justify-end">
                        <GtrsButton
                            name={"Cancel"}
                            onClick={CancelHandle}
                            className={"py-4"}
                            type={"button"}
                        />{" "}
                        <GtrsButton
                            name={object ? "Edit" : "Add"}
                            className={"py-4"}
                            type={"submit"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

AddNewTransitDay.propTypes = {
    url: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    setNewTransitDay: PropTypes.func.isRequired,
    setNewTransitDays: PropTypes.func.isRequired,
    AToken: PropTypes.string.isRequired,
};

export default AddNewTransitDay;
