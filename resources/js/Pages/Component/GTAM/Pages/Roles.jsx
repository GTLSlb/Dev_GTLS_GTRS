import React from "react";
import { useEffect, useState } from "react";
import SmallTableGtam from "../components/SmallTableGtam";
import GtamButton from "../components/Buttons/GtamButton";

export default function Roles({
    url,
    currentUser,
    AlertToast,
    setCategories,
    getCategories,
    roles,
    getRoles,
}) {

    // const roles = [
    //     {
    //         RoleId: 1,
    //         RoleName: "Admin",
    //         StatusId: 1,
    //     },
    // ];

    function fromModel() {
        return 3;
    }
    const addurl = `${url}api/GTAM/Add/UserRole`;
    const [filterValue, setFilterValue] = useState();
    const [editIndex, setEditIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFetching, setIsFetching] = useState();
    const [filteredData, setFilteredData] = useState(roles);
    const [showAddRow, setShowAddRow] = useState(false);
    function handleShowHideAddButton() {
        if (
            currentUser.role_id == 8 ||
            currentUser.role_id == 10 ||
            currentUser.role_id == 1
        ) {
            return true;
        } else {
            return false;
        }
    }
    useEffect(() => {
        setFilteredData(roles);
    }, [roles]);
    const dynamicHeaders = [
        { label: "Role name", key: "RoleName" },
        { label: "Status", key: "StatusId" },
        // Add more headers as needed...
    ];
    function onChangeFilter(name) {
        setFilterValue(name);
        filterData(name);
    }
    const filterData = (name) => {
        setCurrentPage(0);
        // Filter the data based on the start and end date filters

        const filtered = roles.filter((item) => {
            const ConsNbMatch =
                name.length > 0 ? item.RoleName.toLowerCase().includes(name.toLowerCase()) : true;
            // Convert end date string to Date object

            return ConsNbMatch; // Compare the item date to the filter dates
        });
        setFilteredData(filtered);
    };
    return (
        <div className="">
            {/* {isFetching && (
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
            )} */}
            <div className="p-8">
                <div className="flex gap-x-1">
                    <h1 className="font-bold text-dark text-xl">Roles</h1>{" "}
                    <p className="mt-auto text-gray-400">({roles?.length})</p>
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
                                    onChangeFilter(e.target.value);
                                }}
                                className="w-full py-0.5 h-[25px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                            />
                        </div>
                    </div>
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
                        {handleShowHideAddButton() ? (
                            <div className="col-span-2">
                                <GtamButton
                                    name={showAddRow ? "Cancel" : "Add Role"}
                                    onClick={() => {
                                        setEditIndex(null);
                                        setShowAddRow(!showAddRow);
                                    }}
                                    className="w-full "
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
                <SmallTableGtam
                    fromModel={fromModel}
                    showAddRow={showAddRow}
                    setShowAddRow={setShowAddRow}
                    objects={filteredData}
                    currentUser={currentUser}
                    editIndex={editIndex}
                    setEditIndex={setEditIndex}
                    AlertToast={AlertToast}
                    getfunction={getRoles}
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
