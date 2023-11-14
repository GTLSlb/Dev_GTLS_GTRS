import InvoicesButton from "../components/InvoicesButton";
import SmallTable from "../components/SmallTable";
import React from "react";
import { useEffect, useState } from "react";

export default function Categories({
    url,
    currentUser,
    AlertToast,
    categories,
    currentPage, 
    setCurrentPage,
    setCategories,
    getCategories,
}) {
    function fromModel() {
        return 3;
    }
    const addurl = `${url}api/GTIS/Add/Category`;
    const [filterValue, setFilterValue] = useState();
    const [editIndex, setEditIndex] = useState(null);
    // const [currentPage, setCurrentPage] = useState(0);
    const [isFetching, setIsFetching] = useState();
    const [filteredData, setFilteredData] = useState(categories);
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
        setFilteredData(categories);
    }, [categories]);
    const dynamicHeaders = [
        { label: "Category name", key: "CategoryName" },
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

        const filtered = categories.filter((item) => {
            const ConsNbMatch =
                name.length > 0
                    ? item.CategoryName.toLowerCase().includes(
                          name.toLowerCase()
                      )
                    : true;
            // Convert end date string to Date object

            return ConsNbMatch; // Compare the item date to the filter dates
        });
        setFilteredData(filtered);
    };
    return (
        <div className="bg-smooth">
            {isFetching && (
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
            )}
            {!isFetching && (
                <div className="p-5">
                    <div className="flex gap-x-1">
                        <h1 className="font-bold text-dark text-3xl">
                            Categories
                        </h1>{" "}
                        <p className="mt-auto text-gray-400">
                            ({categories?.length})
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
                                        onChangeFilter(e.target.value);
                                    }}
                                    className="w-full py-0.5 h-[25px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-x-5 gap-y-3">
                            {editIndex != null ? (
                                <div className="col-span-2">
                                    <InvoicesButton
                                        name={"Cancel"}
                                        onClick={() => setEditIndex(null)}
                                        className="w-full "
                                    />
                                </div>
                            ) : null}
                            {handleShowHideAddButton() ? (
                                <div className="col-span-2">
                                    <InvoicesButton
                                        name={
                                            showAddRow
                                                ? "Cancel"
                                                : "Add Category"
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
                    </div>
                    <SmallTable
                        fromModel={fromModel}
                        showAddRow={showAddRow}
                        setShowAddRow={setShowAddRow}
                        objects={filteredData}
                        currentUser={currentUser}
                        editIndex={editIndex}
                        setEditIndex={setEditIndex}
                        AlertToast={AlertToast}
                        getfunction={getCategories}
                        setObjects={setFilteredData}
                        dynamicHeaders={dynamicHeaders}
                        addurl={addurl}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
