import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import FailedCons from "./FailedCons";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration } from "@/CommonFunctions";
import { CustomContext } from "@/CommonContext";
import { canViewFailedReasons } from "@/permissions";
import FailedReasonsTable from "./FailedReasonsTable";

export default function FailedConsMain({
    PerfData,
    filterValue,
    setFilterValue,
    accData,
    failedReasons,
    setFailedReasons,
}) {
    const { url, Token, user, userPermissions } = useContext(CustomContext);
    const [isFetching, setIsfetching] = useState();
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    
    useEffect(() => {
        if (!failedReasons) {
            setIsfetching(true);
            fetchReasonData();
        }
    }, []);
    
    const fetchReasonData = async () => {
        try {
            axios
                .get(`${url}FailureReasons`, {
                    headers: {
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then((res) => {
                    const x = JSON.stringify(res.data);
                    const parsedDataPromise = new Promise((resolve) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then((parsedData) => {
                        setFailedReasons(parsedData || []);
                        setIsfetching(false);
                    });
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
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Define tab configuration with unique IDs
    const tabs = [
        {
            id: 'failed-consignments',
            label: 'Failed Consignments',
            component: (
                <FailedCons
                    url={url}
                    failedReasons={failedReasons}
                    userPermissions={userPermissions}
                    accData={accData}
                    PerfData={PerfData}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    Token={Token}
                />
            )
        },
        {
            id: 'failed-reasons',
            label: 'Failed Reasons',
            component: <FailedReasonsTable />
        }
    ];

    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
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
                <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
                    {canViewFailedReasons(userPermissions) ? (
                        <ul className="flex space-x-0 mt-5">
                            {tabs.map((tab, index) => (
                                <li
                                    key={tab.id} // Use stable unique ID instead of index
                                    className={`cursor-pointer ${
                                        activeComponentIndex === index
                                            ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                            : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                                    }`}
                                    onClick={() => handleItemClick(index)}
                                >
                                    <div className="px-2">
                                        {tab.label}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div></div>
                    )}
                    <div className="mt-4">
                        {tabs[activeComponentIndex]?.component}
                    </div>
                </div>
            )}
        </div>
    );
}

FailedConsMain.propTypes = {
    PerfData: PropTypes.array,
    filterValue: PropTypes.array,
    setFilterValue: PropTypes.func,
    accData: PropTypes.array,
    failedReasons: PropTypes.array,
    setFailedReasons: PropTypes.func,
};