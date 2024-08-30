import { canAddKpiReasons } from "@/permissions";
import React from "react";
import { useEffect, useState } from "react";
import GtamButton from "../GTAM/components/Buttons/GtamButton";
import SmallTableKPI from "./Components/KPISmallTable";
import swal from "sweetalert";
import axios from "axios";
export default function KPIReasons({
    url,
    currentUser,
    AToken,
    kpireasonsData,
    setkpireasonsData,
}) {
    function fromModel() {
        return 3;
    }
    const addurl = `${url}Add/KpiReason`;
    const [editIndex, setEditIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredData, setFilteredData] = useState(kpireasonsData);
    const [showAddRow, setShowAddRow] = useState(false);
    const [filterText, setFilterText] = useState("");

    const handleFilterChange = (e) => {
        const searchText = e.target.value;
        setFilterText(searchText);

        // Use the `filter` method to filter the array based on ReasonName
        const filteredResults = kpireasonsData.filter((reason) =>
            reason.ReasonName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filteredResults);
    };

    function getKPIReasons() {
        axios
            .get(`${url}KpiReasons`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    try {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData || []); // Use an empty array if parsedData is null
                    } catch (error) {
                        reject(error);
                    }
                });
                parsedDataPromise.then((parsedData) => {
                    setkpireasonsData(parsedData);
                    // setAppsApi(true);
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
            });
    }
    const dynamicHeaders = [
        { label: "Reason", key: "ReasonName" },
        { label: "Status", key: "ReasonStatus" },
    ];
    useEffect(() => {
        setFilteredData(kpireasonsData);
    }, [kpireasonsData]);
    return (
        <div className="">
            <div className="p-8">
                <div className="flex gap-x-1">
                    <h1 className="font-bold text-dark text-xl">Reasons</h1>{" "}
                    <p className="mt-auto text-gray-400">
                        ({kpireasonsData?.length})
                    </p>
                </div>
                <div className="flex justify-between flex-col sm:flex-row gap-y-3 my-5">
                    <div className="">
                        <div className="relative border rounded">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => {
                                    handleFilterChange(e);
                                }}
                                className="w-full py-0.5 h-[25px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                            />
                        </div>
                    </div>
                    {canAddKpiReasons(currentUser) ? (
                        <div className="flex flex-col sm:flex-row gap-x-5 gap-y-3">
                            {editIndex != null ? (
                                <div className="col-span-2">
                                    <GtamButton
                                        name={"Cancel"}
                                        onClick={() => setEditIndex(null)}
                                        className="w-full "
                                    />
                                </div>
                            ) : null}
                            {canAddKpiReasons(currentUser) ? (
                                <div className="col-span-2">
                                    <GtamButton
                                        name={
                                            showAddRow ? "Cancel" : "Add Reason"
                                        }
                                        onClick={() => {
                                            setEditIndex(null);
                                            setShowAddRow(!showAddRow);
                                        }}
                                        className="w-full "
                                    />
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <SmallTableKPI
                    fromModel={fromModel}
                    AToken={AToken}
                    showAddRow={showAddRow}
                    setShowAddRow={setShowAddRow}
                    objects={filteredData}
                    currentUser={currentUser}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    getfunction={getKPIReasons}
                    setObjects={setFilteredData}
                    dynamicHeaders={dynamicHeaders}
                    addurl={addurl}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}
