import { useLayoutEffect, useRef, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect } from "react";
import AddFailedModal from "../../../modals/AddFailedModal";
import notFound from "../../../../../assets/pictures/NotFound.png";
import AddSafetyCausesModal from "./AddSafetyCausesModel";
import swal from "sweetalert";
import { getApiRequest, handleSessionExpiration } from "@/CommonFunctions";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function AddSafetyCauses({
    AToken,
    safetyCauses,
    setSafetyCauses,
    currentUser,
    url,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Data, setData] = useState(safetyCauses);
    const [cause, setCause] = useState();
    const handleEditClick = (cause) => {
        setCause(cause);
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
    };
    const [currentPage, setCurrentPage] = useState(0);

    async function fetchData() {
        const data = await getApiRequest(`${url}SafetyCauses`, {
            UserId: currentUser?.UserId,
        });

        if (data) {
            setSafetyCauses(data);
            setData(data);
        }
    }

    const updateLocalData = () => {
        fetchData();
    };
    return (
        <div className=" w-full bg-smooth ">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Safety Causes
                    </h1>
                </div>
                <div className="inline-block  left-auto right-10 top-9">
                    <button
                        type="button"
                        onClick={() => handleEditClick(cause)}
                        className="whitespace-nowrap w-[5.5rem] h-[36px] rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add Cause
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root  bg-white ">
                <div className="w-full border rounded-lg overflow-x-auto">
                    <div className="inline-block min-w-full  align-middle ">
                        {safetyCauses ? (
                            <div className="relative">
                                <table
                                    id="details"
                                    className="min-w-full table-fixed divide-y divide-gray-300 "
                                >
                                    <thead className="h-12">
                                        <tr className="py-2.5">
                                            <th
                                                scope="col"
                                                className="min-w-[18rem] pr-3 text-left text-sm font-semibold text-gray-600 px-7"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600 "
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className=" px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                <span className="sr-only">
                                                    Edit
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300  max-h-80 overflow-y-scroll">
                                        {Data.length > 0 ? (
                                            Data.map((cause, index) => (
                                                <tr
                                                    key={index}
                                                    className={[
                                                        index % 2 === 0
                                                            ? "bg-smooth"
                                                            : "bg-white",
                                                    ].join(" ")}
                                                >
                                                    {/* <div onClick={() => handleClick(5,person.id)} className=" hover:cursor-pointer "> */}
                                                    <td className="whitespace-nowrap py-4 px-5 text-sm font-medium text-gray-900 ">
                                                        {cause.CauseName}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                        {cause[
                                                            "CauseStatus"
                                                        ] ? (
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 sm:pr-4 pr-6 text-left text-sm font-medium">
                                                        <a
                                                            href="#"
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    cause
                                                                )
                                                            }
                                                            className=" text-blue-500 hover:text-blue-900 flex"
                                                        >
                                                            <PencilIcon className="w-5 h-5" />
                                                            <span className="ml-2">
                                                                Edit
                                                            </span>
                                                            <span className="sr-only">
                                                                ,{" "}
                                                                {
                                                                    cause.CauseName
                                                                }
                                                            </span>
                                                        </a>
                                                    </td>
                                                    {/* </div> */}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7">
                                                    <div className=" h-64 flex items-center justify-center mt-10">
                                                        <div className="text-center flex justify-center flex-col">
                                                            <img
                                                                src={notFound}
                                                                alt=""
                                                                className="w-52 h-auto "
                                                            />
                                                            <h1 className="text-3xl font-bold text-gray-900">
                                                                No Data Found
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className=" h-64 flex items-center justify-center mt-10">
                                <div className="text-center flex justify-center flex-col">
                                    <img
                                        src={notFound}
                                        alt=""
                                        className="w-52 h-auto "
                                    />
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        No Data Found
                                    </h1>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AddSafetyCausesModal
                url={url}
                AToken={AToken}
                currentUser={currentUser}
                ariaHideApp={false}
                isOpen={isModalOpen}
                cause={cause}
                setCause={setCause}
                safetyCauses={safetyCauses}
                handleClose={handleEditClick}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}
