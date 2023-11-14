import React from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import notFound from "../../../../assets//pictures/NotFound.png";

export default function SupplierTable({
    objects,
    states,
    services,
    setSupplier,
    currentUser,
    setActiveIndexInv,
    cities,
    currentPage,
    setCurrentPage,
}) {
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [selectAll, setSelectAll] = React.useState(false);
    const handleRowSelect = (row) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.includes(row.id)) {
                return prevSelectedRows.filter(
                    (selectedRow) => selectedRow !== row.id
                );
            } else {
                return [...prevSelectedRows, row.id];
            }
        });
    };
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            const allIds = objects.map((row) => row.id);
            setSelectedRows(allIds);
        }
        setSelectAll((prevSelectAll) => !prevSelectAll);
    };
    function editSupplier(object) {
        setSupplier(object);
        setActiveIndexInv(10);
    }
    
    const PER_PAGE = 5;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    const pageCount = Math.ceil(objects?.length / PER_PAGE);
    return (
        <div>
            <div className=" mt-2 border rounded-xl overflow-auto  lg:max-h-full">
                <table className="w-full rounded-xl py-2 overflow-x-scroll">
                    <thead className="bg-gray-100 border h-10">
                        <tr className="items-center">
                            {/* <th className="border-r">
                                <input
                                    type="checkbox"
                                    className="rounded text-green-500"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th> */}
                            <th className=" px-2  text-left text-sm font-semibold text-gray-400 ">
                                Supplier
                            </th>
                            <th className="text-gray-400 text-sm font-semibold">
                               <span className="sr-only">Edit</span> 
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {objects?.length > 0 ? (
                            objects
                                ?.slice(OFFSET, OFFSET + PER_PAGE)
                                .map((row) => (
                                    <tr
                                        className="border-r border-b "
                                        key={row.id}
                                    >
                                        {/* <td className="w-10  px-3 border">
                                            <input
                                                type="checkbox"
                                                className="rounded text-green-500"
                                                checked={selectedRows.includes(
                                                    row.id
                                                )}
                                                onChange={() =>
                                                    handleRowSelect(row)
                                                }
                                            />
                                        </td> */}
                                        <td className="p-2">
                                            <div className="grid grid-cols-1 md:grid-cols-3">
                                                <div>
                                                    <h1 className="text-dark font-bold">
                                                        {row.SupplierName}
                                                    </h1>
                                                    <p className="text-gray-500 text-sm">
                                                        Email:{" "}
                                                        <span className="text-dark font-bold">
                                                            {row.SupplierEmail}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        Mobile:{" "}
                                                        <span className="text-dark font-bold">
                                                            {row.SupplierNb}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        Land Line:{" "}
                                                        <span className="text-dark font-bold">
                                                            {row.SupplierLand}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">
                                                        ABN:{" "}
                                                        <span className="text-dark font-bold">
                                                            {row.SupplierABN}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        Street Number:{" "}
                                                        <span className="text-dark font-bold">
                                                            {row.StreetNb}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">
                                                        Service:{" "}
                                                        <span className="text-dark font-bold">
                                                            {
                                                                services?.find(
                                                                    (service) =>
                                                                        service.ServiceId ===
                                                                        row.ServiceId
                                                                )?.ServiceName
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        City:{" "}
                                                        <span className="text-dark font-bold">
                                                            {
                                                                cities.find(
                                                                    (city) =>
                                                                        city.CityId ===
                                                                        row.CityId
                                                                )?.CityName
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        State:{" "}
                                                        <span className="text-dark font-bold">
                                                            {
                                                                states?.find(
                                                                    (state) =>
                                                                        state.StateId ===
                                                                        row.StateId
                                                                )?.StateCode
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        Zip Code:{" "}
                                                        <span className="text-dark font-bold">
                                                            {row.ZipCode}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="flex justify-center h-full ">
                                            <div>
                                                <a
                                                    href="#"
                                                    onClick={() => {
                                                        editSupplier(row);
                                                    }}
                                                    className=" text-blue-500 hover:text-blue-900 flex gap-x-2 justify-center mt-2 mr-2"
                                                >
                                                    <PencilIcon className="text-blue-400 w-5 h-5" />
                                                    <span className="underline" > Edit</span>
                                            </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="18">
                                    <div class=" h-72 flex items-center justify-center mt-5">
                                        <div class="text-center flex justify-center flex-col">
                                            <img
                                                src={notFound}
                                                alt=""
                                                className="w-52 h-auto "
                                            />
                                            <h1 class="text-3xl font-bold text-gray-900">
                                                No Data Found
                                            </h1>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>{" "}
            <div className="pt-4 pb-10 text-xs text-gray-400">
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    initialPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"flex justify-center items-center mt-4"}
                    pageClassName={"mx-2 rounded-full hover:bg-gray-100"}
                    previousLinkClassName={
                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                    }
                    nextLinkClassName={
                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                    }
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    activeClassName={"text-blue-500 font-bold"}
                />
            </div>
        </div>
    );
}
