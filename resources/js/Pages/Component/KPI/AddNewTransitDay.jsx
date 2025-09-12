import { handleSessionExpiration, useApiRequests } from "@/CommonFunctions";
import { AlertToast } from "@/permissions";
import React, { useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import GtrsButton from "../GtrsButton";
import { ToastContainer } from "react-toastify";
import { CustomContext } from "@/CommonContext";

function AddNewTransitDay({ setNewTransitDays }) {
    const { Token, user, url } = useContext(CustomContext);

    const [loading, setLoading] = useState(false);

    const { getApiRequest } = useApiRequests();
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
    const object = location?.state?.newTransitDay;
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
        const data = await getApiRequest(`${url}Transits`, {
            UserId: user?.UserId,
        });

        if (data) {
            setNewTransitDays(data);
        }
    }

    function AddTransit(e) {
        e.preventDefault();
        setLoading(true);
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
            .post(`${url}Add/Transit`, inputValues, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(() => {
                AlertToast("Saved successfully", 1);
                fetchData();
                setLoading(false);
                setNewTransitDays(null);
                navigate(-1);
            })
            .catch((err) => {
                setLoading(false);
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
        setNewTransitDays(null);
        navigate(-1);
    }
    return (
        <div className="p-8">
            <ToastContainer />
            <div className="shadow bg-white p-4 lg:p-6 rounded-lg">
                <form onSubmit={AddTransit}>
                    <p className="font-bold text-lg mb-4">
                        {object ? "Edit " : "Add "} Transit
                    </p>
                    <div className="border-b mb-6" />

                    <div className="space-y-6">
                        {/* Customer Information Section */}
                        <div className="space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                <label
                                    htmlFor="CustomerId"
                                    className="block w-full lg:w-48 text-sm font-medium text-gray-700"
                                >
                                    Customer Name:
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    id="CustomerId"
                                    name="CustomerId"
                                    className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedCustomer}
                                    onChange={(e) =>
                                        setSelectedCustomer(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        --Select a Customer--
                                    </option>
                                    {customers?.map((customer) => (
                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Customer Type - Conditional Rendering */}
                            {(object?.CustomerId == 1 ||
                                selectedCustomer == 1) && (
                                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                    <label
                                        htmlFor="SafetyType"
                                        className="block w-full lg:w-48 text-sm font-medium text-gray-700"
                                    >
                                        Customer Type:
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <select
                                        id="SafetyType"
                                        name="SafetyType"
                                        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={selectedType}
                                        onChange={(e) =>
                                            setSelectedType(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            --Select a Customer Type--
                                        </option>
                                        {types?.map((type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(object?.CustomerId == 3 ||
                                selectedCustomer == 3) && (
                                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                    <label
                                        htmlFor="SafetyType"
                                        className="block w-full lg:w-48 text-sm font-medium text-gray-700"
                                    >
                                        Customer Type:
                                    </label>
                                    <select
                                        id="SafetyType"
                                        name="SafetyType"
                                        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={selectedType}
                                        onChange={(e) =>
                                            setSelectedType(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            --Select a Customer Type--
                                        </option>
                                        {freighPeople?.map((type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Sender and Receiver Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Sender Section */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                                    Sender
                                </h3>

                                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                    <label
                                        htmlFor="SenderState"
                                        className="block w-full lg:w-32 text-sm font-medium text-gray-700"
                                    >
                                        State:
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <select
                                        id="SenderState"
                                        name="SenderState"
                                        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={selectedSstate}
                                        onChange={(e) =>
                                            setSelectedSstate(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            --Select a State--
                                        </option>
                                        {states?.map((state) => (
                                            <option
                                                key={state.id}
                                                value={state.id}
                                            >
                                                {state.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                    <label
                                        htmlFor="SenderPostCode"
                                        className="block w-full lg:w-32 text-sm font-medium text-gray-700"
                                    >
                                        PostCode:
                                    </label>
                                    <input
                                        type="number"
                                        name="SenderPostCode"
                                        id="SenderPostCode"
                                        defaultValue={
                                            object ? object.SenderPostCode : ""
                                        }
                                        min="0"
                                        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value < 0) {
                                                e.target.value = 0;
                                            }
                                        }}
                                        onKeyDown={(e) => {
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

                            {/* Receiver Section */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                                    Receiver
                                </h3>

                                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                    <label
                                        htmlFor="ReceiverState"
                                        className="block w-full lg:w-32 text-sm font-medium text-gray-700"
                                    >
                                        State:
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <select
                                        id="ReceiverState"
                                        name="ReceiverState"
                                        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={selectedRstate}
                                        onChange={(e) =>
                                            setSelectedRstate(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            --Select a State--
                                        </option>
                                        {states?.map((state) => (
                                            <option
                                                key={state.id}
                                                value={state.id}
                                            >
                                                {state.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                    <label
                                        htmlFor="ReceiverPostCode"
                                        className="block w-full lg:w-32 text-sm font-medium text-gray-700"
                                    >
                                        PostCode:
                                    </label>
                                    <input
                                        type="number"
                                        name="ReceiverPostCode"
                                        id="ReceiverPostCode"
                                        defaultValue={
                                            object
                                                ? object.ReceiverPostCode
                                                : ""
                                        }
                                        min="0"
                                        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value < 0) {
                                                e.target.value = 0;
                                            }
                                        }}
                                        onKeyDown={(e) => {
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

                                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                    <label
                                        htmlFor="ReceiverName"
                                        className="block w-full lg:w-32 text-sm font-medium text-gray-700"
                                    >
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="ReceiverName"
                                        id="ReceiverName"
                                        defaultValue={
                                            object ? object.ReceiverName : ""
                                        }
                                        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Transit Section */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-gray-800 pb-2">
                                Transit
                            </h3>

                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:max-w-2xl">
                                <label
                                    htmlFor="TransitTime"
                                    className="block w-full lg:w-32 text-sm font-medium text-gray-700"
                                >
                                    Transit Time:
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="TransitTime"
                                    id="TransitTime"
                                    defaultValue={
                                        object ? object.TransitTime : ""
                                    }
                                    min="0"
                                    required
                                    className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onInput={(e) => {
                                        const value = e.target.value;
                                        if (value < 0) {
                                            e.target.value = 0;
                                        }
                                    }}
                                    onKeyDown={(e) => {
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

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                        <GtrsButton
                            name="Cancel"
                            onClick={CancelHandle}
                            className="px-6 py-2"
                            type="button"
                        />
                        <GtrsButton
                            name={object ? "Edit" : "Add"}
                            className="px-6 py-2"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
AddNewTransitDay.propTypes = {
    url: PropTypes.string,
    setNewTransitDay: PropTypes.func,
    setNewTransitDays: PropTypes.func,
    Token: PropTypes.string,
};

export default AddNewTransitDay;
