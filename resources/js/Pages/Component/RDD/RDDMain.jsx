import React, { useState, useEffect, useContext } from "react";
import swal from "sweetalert";
import axios from "axios";
import { handleSessionExpiration, useApiRequests } from "@/CommonFunctions";
import AnimatedLoading from "@/Components/AnimatedLoading";
import RDDTable from "./RDDTable";
import PropTypes from "prop-types";
import { CustomContext } from "@/CommonContext";
import RDDReasons from "./RDDReasons";
import { canViewRDDReasons } from "@/permissions";

export default function RDDMain({
    setActiveIndexGTRS,
    rddData,
    filterValue,
    setFilterValue,
    setrddData,
    setIncidentId,
    accData,
    rddReasons,
    setrddReasons,
}) {
    const { getApiRequest } = useApiRequests();
    const [isFetching, setIsFetching] = useState();
    const [isFetchingReasons, setIsFetchingReasons] = useState();
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const { Token, user, userPermissions, url } = useContext(CustomContext);

    const parseDateString = (dateString) => {
        // Check if dateString is undefined, null, or empty
        if (!dateString || !dateString.trim()) {
            return null; // or return any other default value as needed
        }
        const parts = dateString.split(/[\s/:]/);
        let dateObject;
        if (parts.length === 7) {
            // If there is a time component
            dateObject = new Date(
                Date.UTC(
                    parts[2],
                    parts[1] - 1,
                    parts[0],
                    parts[3],
                    parts[4],
                    parts[5]
                )
            );
        } else {
            // If there is no time component
            dateObject = new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]));
        }
        return dateObject;
    };

    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return ""; // or return any other default value as needed
        }

        return date.toISOString().slice(0, 19); // UTC time
    };

    const updateFieldWithData = (data, fieldName) => {
        if (!data || data.length === 0) {
            return []; // or return any other default value as needed
        }

        const updatedData = data.map((item) => {
            const fieldValue = item[fieldName];
            const parsedDate = parseDateString(fieldValue);
            const formattedDate = formatDate(parsedDate);
            // Return a new object with the updated field
            return { ...item, [fieldName]: formattedDate };
        });
        setrddData(updatedData);
        return updatedData;
    };

    useEffect(() => {
        if (!rddData) {
            setIsFetching(true);
            setIsFetchingReasons(true);
            fetchData();
            fetchReasonData();
        }
    }, []); // Empty dependency array ensures the effect runs only once

    async function fetchData() {
        const data = await getApiRequest(`${url}RDD`, {
            UserId: user?.UserId,
        });

        if (data) {
            const updatedOldRddData = updateFieldWithData(data, "OldRdd");
            const updatedNewRddData = updateFieldWithData(
                updatedOldRddData,
                "NewRdd"
            );
            setrddData(updatedNewRddData || []);
            setIsFetching(false);
        }
    }

    const fetchReasonData = async () => {
        try {
            axios
                .get(`${url}RddChangeReason`, {
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
                        setrddReasons(parsedData || []);
                        setIsFetchingReasons(false);
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

    const tabs = [
        {
            id: "rdd-report",
            label: "RDD Report",
            component: (
                <RDDTable
                    accData={accData}
                    rddData={rddData}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    setrddData={setrddData}
                    setActiveIndexGTRS={setActiveIndexGTRS}
                    setIncidentId={setIncidentId}
                    rddReasons={rddReasons}
                />
            ),
        },
        {
            id: "rdd-reasons",
            label: "RDD Reasons",
            component: <RDDReasons />,
        },
    ];

    const handleItemClick = (index) => {
        setActiveComponentIndex(index);
    };

    if (isFetching || isFetchingReasons) {
        return <AnimatedLoading />;
    }
    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20 h-full">
            <div className="mt-0 h-full">
                {canViewRDDReasons(userPermissions) ? (
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
                                <div className="px-2">{tab.label}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div></div>
                )}
                <div className="mt-4 h-full">
                    {tabs[activeComponentIndex]?.component}
                </div>
            </div>
        </div>
    );
}

RDDMain.propTypes = {
    setActiveIndexGTRS: PropTypes.func,
    setactiveCon: PropTypes.func,
    debtorsData: PropTypes.array,
    rddData: PropTypes.array,
    filterValue: PropTypes.array,
    setFilterValue: PropTypes.func,
    setrddData: PropTypes.func,
    setIncidentId: PropTypes.func,
    setLastIndex: PropTypes.func,
    accData: PropTypes.array,
    EDate: PropTypes.string,
    setEDate: PropTypes.func,
    SDate: PropTypes.string,
    setSDate: PropTypes.func,
    rddReasons: PropTypes.array,
    setrddReasons: PropTypes.func,
    oldestDate: PropTypes.string,
    latestDate: PropTypes.string,
};
