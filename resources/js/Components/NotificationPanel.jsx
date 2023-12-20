import { Popover, Transition } from "@headlessui/react";
import { InboxIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
    BellIcon,
    BellAlertIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Fragment } from "react";
import notFound from "../assets/pictures/NotFound.png";

const NotificationPanel = ({
    hubConnection,
    setActiveIndexInv,
    setInvoiceDetails,
    invoiceDetails,
    PODetails,
    setPODetails,
    AToken,
    currentUser,
    url
}) => {
    const [notifications, setNotifications] = useState([]);
    const [updatednotifications, setUpdatednotifications] = useState([]);
    const [filterednotifications, setFilterednotifications] = useState([]);
    useEffect(() => {
        const handleReceiveNotification = (message) => {
            const x = JSON.stringify(message);
            const parsedData = JSON.parse(x);
            // Check if the notification already exists in the array
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                parsedData,
            ]);
        };

        hubConnection.on("ReceiveNotification", handleReceiveNotification);
    }, []);
    const searchUserByName = async (userId) => {
        try {
            const response = await axios.get(`/findUserById/${userId}`);
            return response.data.user_name;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return "User not found";
        }
    };
    const updateAddedBy = async (json) => {
        const promises = json.map(async (innerArray) => {
            return await Promise.all(
                innerArray?.map(async (item) => {
                    if (!isNaN(item.AddedBy)) {
                        const userName = await searchUserByName(item.AddedBy);
                        item.AddedBy = userName;
                    }
                    return item;
                })
            );
        });

        return await Promise.all(promises);
    };
    // Example usage:
    useEffect(() => {
        updateAddedBy(notifications)
            .then((updatedData) => {
                // setUpdatednotifications(updatedData);
                setUpdatednotifications(filterNotifcations(updatedData));
            })
            .catch((error) => {
                console.error("Error updating AddedBy:", error);
            });
    }, [notifications]);

    function replacetitle(id) {
        if (id == 1) {
            return "Invoice";
        } else return "PO";
    }
    function replaceAction(id) {
        if (id == 1) return "Created By";
        else if (id == 2) return "Approved By";
        else if (id == 3) return "Rejected By";
    }
    function getInvoicesbyId(InvoiceId, index) {
        axios
            .get(`${url}Invoices`, {
                headers: {
                    UserId: currentUser.user_id,
                    InvoiceId: InvoiceId,
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
                    handleRemoveNotification(index);
                    setInvoiceDetails(parsedData[0]);
                    setActiveIndexInv(6);
                });
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error
                    alert('Session Expired, Please Login Again');
                    // axios
                    // .post("/logoutAPI")
                    // .then((response) => {
                    //     if (response.status == 200) {
                    //         window.location.href = "/";
                    //     }
                    // })
                    // .catch((error) => {
                    //     console.log(error);
                    // });
                } else {
                    // Handle other errors
                    console.log(err);
                }
            });
    }
    function getPObyId(POId, index) {
        axios
            .get(`${url}api/GTIS/POs`, {
                headers: {
                    UserId: currentUser.user_id,
                    PO_Id: POId,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    handleRemoveNotification(index);
                    setPODetails(parsedData[0]);
                    setActiveIndexInv(9);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const handleRemoveNotification = (index) => {
        // Create a copy of the current notifications array
        const updatedNotifications = [...updatednotifications];
        // Remove the notification at the specified index
        updatedNotifications.splice(index, 1);
        // Update the state with the updated array
        setNotifications(updatedNotifications);
        setUpdatednotifications(updatedNotifications);
    };
    function filterNotifcations(notifications) {
        const filtered = notifications?.filter((item) => {
            const notSameUser = item[0].AddedBy !== currentUser.name;
            let byState = true;
            if (currentUser.role_id == 7 || currentUser.role_id == 6) {
                //State manager or Assistant
                byState = item[0].StateId == currentUser.state;
            }
            return notSameUser && byState;
        });
        if (filtered) {
            // Sort the filtered notifications by AddedAt date in ascending order
            filtered.sort((a, b) => {
                const dateA = new Date(a[0].AddedAt);
                const dateB = new Date(b[0].AddedAt);
                return dateB - dateA;
            });
        }
        return filtered;
    }  
    function convertUtcToUserTimezone(utcDateString) {
        // Create a Date object from the UTC date string
        const utcDate = new Date(utcDateString);
        
        // Get the current user's timezone
        const targetTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
        const formatter = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: targetTimezone,
        });
    
        const convertedDate = formatter.format(utcDate);
        return convertedDate;
    }
    
    function handleClickNotifications(modelId, id, index) {
        if (modelId == 1) {
            getInvoicesbyId(id, index);
        } else if (modelId == 2) {
            getPObyId(id, index);
        }
    }
    return (
        <div className="text-sm font-bold leading-7 text-gray-700 sm:truncate sm:text-lg sm:tracking-tight mr-2">
            <div className="lg:flex lg:flex-1 lg:justify-end">
                {updatednotifications?.length > 0 ? (
                    <Popover className=" flex-item md:ml-auto">
                        {({ open }) => (
                            <>
                                <Popover.Button
                                    className={` inline-flex items-center  py-2 mr-6 focus:outline-none focus:border-none `}
                                >
                                    <div className="relative">
                                        <BellAlertIcon className="h-8 w-8" />
                                        {updatednotifications?.length > 0 && (
                                            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs" >
                                                {updatednotifications?.length}
                                            </div>
                                        )}
                                    </div>
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute flex md:-translate-x-1/2 right-5 md:right-0 shadow-xl ">
                                        <div className=" rounded-lg bg-gray-50 text-sm leading-6 ring-1 ring-gray-900/5 w-64 pb-2 ">
                                            <div className="p-2  rounded-t-lg bg-gray-200">
                                                <div className="flex-shrink-0 flex ">
                                                    <InboxIcon
                                                        className="h-6 w-6 text-gray-400 pr-1"
                                                        aria-hidden="true"
                                                    />
                                                    Notifications
                                                </div>{" "}
                                            </div>
                                            <div className="h-auto max-h-[20rem] containerscroll overflow-y-auto">
                                                {updatednotifications?.map(
                                                    (notification, index) => (
                                                        <div
                                                            className=" flex flex-row gap-y-0  hover:cursor-pointer border-gray-100 border-2 hover:border-goldt  hover:border-2"
                                                            key={index}
                                                        >
                                                            <div
                                                                className=" mr-4 w-full hover:bg-white hover:text-goldt text-dark bg-white text-sm leading-6  w-64 flex "
                                                                onClick={() =>
                                                                    handleClickNotifications(
                                                                        notification[0]
                                                                            .ModelId,
                                                                        notification[0]
                                                                            .Id,
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <div className=" w-full flex justify-center p-2 ">
                                                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                                                        <p className="text-md text-gray-900 font-bold">
                                                                            {replacetitle(
                                                                                notification[0]
                                                                                    ?.ModelId
                                                                            )}{" "}
                                                                            {
                                                                                notification[0]
                                                                                    .Nb
                                                                            }
                                                                        </p>
                                                                        <p className="mt-1 text-xs text-gray-500 w-62 max-w-xs truncate">
                                                                            {replaceAction(
                                                                                notification[0]
                                                                                    ?.ActionId
                                                                            )}{" "}
                                                                            {
                                                                                notification[0]
                                                                                    ?.AddedBy
                                                                            }
                                                                        </p>
                                                                        <p className="mt-1 text-xs text-gray-500 w-62 max-w-xs truncate">
                                                                            {moment(
                                                                                convertUtcToUserTimezone(
                                                                                    notification[0]
                                                                                        ?.AddedAt +
                                                                                        "Z"
                                                                                ),

                                                                                "MM/DD/YYYY, h:mm:ss A"
                                                                            ).format(
                                                                                "YYYY-MM-DD hh:mm A"
                                                                            ) ==
                                                                            "Invalid date"
                                                                                ? ""
                                                                                : moment(
                                                                                      convertUtcToUserTimezone(
                                                                                          notification[0]
                                                                                              ?.AddedAt +
                                                                                              "Z"
                                                                                      ),

                                                                                      "MM/DD/YYYY, h:mm:ss A"
                                                                                  ).format(
                                                                                      "YYYY-MM-DD hh:mm A"
                                                                                  )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <XMarkIcon
                                                                    className="h-5 w-5 m-1 hover:text-red-500"
                                                                    onClick={() =>
                                                                        handleRemoveNotification(
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            {/* <div className="bg-gray-600 h-[0.05rem]"></div> */}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                ) : (
                    <Popover className=" flex-item md:ml-auto">
                        {({ open }) => (
                            <>
                                <Popover.Button
                                    className={` inline-flex items-center  py-2 mr-6 focus:outline-none focus:border-none focus:ring-0`}
                                >
                                    <div className="relative">
                                        <BellIcon className="h-8 w-8" />
                                    </div>
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute flex md:-translate-x-1/2 right-5 md:right-0 shadow-xl ">
                                        <div className=" rounded-lg bg-gray-50 text-sm leading-6 ring-1 ring-gray-900/5 w-64 pb-2 ">
                                            <div className="p-2  rounded-t-lg bg-gray-200">
                                                <div className="flex-shrink-0 flex ">
                                                    <InboxIcon
                                                        className="h-6 w-6 text-gray-400 pr-1"
                                                        aria-hidden="true"
                                                    />
                                                    Notifications
                                                </div>{" "}
                                            </div>
                                            <div className=" min-h-[20rem] h-[20rem] bg-gray-50 flex flex-col justify-center items-center">
                                                <div>
                                                    {" "}
                                                    <img
                                                        src={notFound}
                                                        alt=""
                                                        className="w-32 "
                                                    />
                                                </div>
                                                Nothing to see here.
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;