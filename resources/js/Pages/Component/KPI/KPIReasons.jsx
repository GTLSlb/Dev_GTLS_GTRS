import axios from "axios";
import PropTypes from "prop-types";
import swal from "sweetalert";
import GtrsButton from "@/Pages/Component/GtrsButton";
import { PencilIcon } from "@heroicons/react/20/solid";
import TableStructure from "@/Components/TableStructure";
import { canAddKpiReasons, canEditKpiReasons } from "@/permissions";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import React, { useState, useEffect, useRef, useCallback } from "react";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import AddKPIReason from "./Components/AddKPIReason";
import { ToastContainer } from "react-toastify";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";

export default function KPIReasons({
    url,
    currentUser,
    AToken,
    userPermission,
    kpireasonsData,
    setkpireasonsData,
    filterValue,
    setFilterValue,
}) {


    const gridRef = useRef(null);
    const [filteredData, setFilteredData] = useState(kpireasonsData);
    const [showAddRow, setShowAddRow] = useState(false);
    const [selectedReason, setSelectedReason] = useState(false);
    const reasonNameOptions = createNewLabelObjects(
        kpireasonsData,
        "ReasonName"
    );

    const [selected, setSelected] = useState([]);
    const handleEditClick = (object) => {
        setSelectedReason(object);
        if (!showAddRow) {
            setShowAddRow(true);
        }
    };
    function ToggleShow() {
        setShowAddRow(!showAddRow);
        setSelectedReason(null);
    }
    const [columns, setColumns] = useState([
        {
            name: "ReasonName",
            minWidth: 170,
            defaultFlex: 1,
            header: "Reason Name",
            type: "string",
            headerAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: reasonNameOptions,
            },
        },
        {
            name: "ReasonStatus",
            minWidth: 170,
            header: "Status",
            defaultFlex: 1,
            headerAlign: "center",
            textAlign: "center",
            render: ({ value }) => {
                return value == 1 ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                        Inactive
                    </span>
                );
            },
        },
    ]);

    const additionalButtons = (
        <div className="flex justify-between w-full gap-x-4">
            <div className="relative">
                <MagnifyingGlassIcon className="absolute h-[0.88rem] w-[0.88rem] text-gray-500 top-[0.77rem] left-2"/>
                <input placeholder="Search" onChange={(e)=>handleFilterChange(e)} className="border px-7 py-1.5 rounded-lg placeholder:text-gray-500"/>
            </div>
            {canAddKpiReasons(userPermission) ? (
                <div className="flex flex-col sm:flex-row gap-x-5 gap-y-3">
                    <div className="col-span-2">
                        {!showAddRow && (
                            <GtrsButton
                                name="Add Reason"
                                onClick={() => {
                                    setShowAddRow(!showAddRow);
                                }}
                                disabled={showAddRow}
                                className="w-full py-4"
                            />
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );

    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, kpireasonsData);

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        const customCellHandlers = {
            HolidayStatus: (value) => (value === 1 ? true : false),
        };

        exportToExcel(
            jsonData,
            columnMapping,
            "KPIReasons.xlsx",
            customCellHandlers
        );
    };

    const handleFilterChange = (e) => {
        const searchText = e.target.value;

        // Use the `filter` method to filter the array based on ReasonName
        const filteredResults = kpireasonsData.filter((reason) =>
            reason.ReasonName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filteredResults);
    };

    useEffect(() => {
        if(kpireasonsData?.length > 0) setFilteredData(kpireasonsData);
    },[kpireasonsData])
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


    useEffect(() => {
        if (kpireasonsData?.length > 0 && reasonNameOptions) {
            if (userPermission && canEditKpiReasons(userPermission)) {
                setColumns([
                    {
                        name: "ReasonName",
                        minWidth: 170,
                        defaultFlex: 1,
                        header: "Reason Name",
                        type: "string",
                        headerAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: reasonNameOptions,
                        },
                    },
                    {
                        name: "ReasonStatus",
                        minWidth: 170,
                        header: "Status",
                        defaultFlex: 1,
                        headerAlign: "center",
                        textAlign: "center",
                        render: ({ value }) => {
                            return value == 1 ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                    Inactive
                                </span>
                            );
                        },
                    },
                    {
                        name: "edit",
                        header: "Edit",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultWidth: 100,
                        render: ({ data }) => {
                            return (
                                <div>
                                    {canEditKpiReasons(userPermission) ? (
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
                ]);
            } else {
                setColumns([
                    {
                        name: "ReasonName",
                        minWidth: 170,
                        defaultFlex: 1,
                        header: "Reason Name",
                        type: "string",
                        headerAlign: "center",
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: reasonNameOptions,
                        },
                    },
                    {
                        name: "ReasonStatus",
                        minWidth: 170,
                        header: "Status",
                        defaultFlex: 1,
                        headerAlign: "center",
                        textAlign: "center",
                        render: ({ value }) => {
                            return value == 1 ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                    Inactive
                                </span>
                            );
                        },
                    },
                ]);
            }
        }
    }, [userPermission, reasonNameOptions, kpireasonsData]);

    const renderTable = useCallback(() => {
        return (
            <TableStructure
                id={"ReasonId"}
                setSelected={setSelected}
                gridRef={gridRef}
                additionalButtons={additionalButtons}
                handleDownloadExcel={handleDownloadExcel}
                selected={selected}
                tableDataElements={filteredData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                columnsElements={columns}

            />
        );
    }, [columns, kpireasonsData]);
    return (
        <div className="">
            {/* Added this for toast container to show */}
            <ToastContainer />
            <div className="p-8">
                <div className="flex gap-x-1">
                    <h1 className="font-bold text-dark text-xl">Reasons</h1>{" "}
                    <p className="mt-auto text-gray-400">
                        ({kpireasonsData?.length})
                    </p>
                </div>
                {/*<div className="flex justify-between flex-col sm:flex-row gap-y-3 my-5">
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
                    {canAddKpiReasons(userPermission) ? (
                        <div className="flex flex-col sm:flex-row gap-x-5 gap-y-3">
                            {editIndex != null ? (
                                <div className="col-span-2">
                                    <GtrsButton
                                        name={"Cancel"}
                                        onClick={() => setEditIndex(null)}
                                        className="w-full "
                                    />
                                </div>
                            ) : null}
                            {canAddKpiReasons(userPermission) ? (
                                <div className="col-span-2">
                                    <GtrsButton
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
                /> */}
                {showAddRow ? (
                    <AddKPIReason
                        selectedReason={selectedReason}
                        url={url}
                        AToken={AToken}
                        currentUser={currentUser}
                        userPermission={userPermission}
                        setSelectedReason={setSelectedReason}
                        setShowAdd={setShowAddRow}
                        fetchData={getKPIReasons}
                        closeModal={ToggleShow}
                    />
                ) : null}
                {renderTable()}
            </div>
        </div>
    );
}
KPIReasons.propTypes = {
    url: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    AToken: PropTypes.string.isRequired,
    userPermission: PropTypes.object.isRequired,
    kpireasonsData: PropTypes.array.isRequired,
    setkpireasonsData: PropTypes.func.isRequired,
    filterValue: PropTypes.string,
    setFilterValue: PropTypes.func.isRequired,
};
