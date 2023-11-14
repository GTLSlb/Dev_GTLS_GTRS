import { useLayoutEffect, useRef, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect } from "react";
import notFound from "../../assets/pictures/NotFound.png";
import AddFailedModal from "@/Pages/Component/modals/AddFailedModal";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function AddFailedReason({
    failedReasons,
    setFailedReasons,
    currentUser,
    url,
}) {
    const [Data, setData] = useState(failedReasons);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState();
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
    };
    const [selectedPeople, setSelectedPeople] = useState([]);
    function fetchData() {
        axios
            .get(`${url}api/FailureReasons`, {
                headers: {
                    RoleId: currentUser.role_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setFailedReasons(parsedData);
                    setData(parsedData);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const updateLocalData = () => {
        fetchData();
    };

    return (
        <div className=" w-full bg-smooth ">
            <div className="sm:flex sm:items-center relative">
                <div className="inline-block sm:absolute left-auto right-0 -top10">
                    <button
                        type="button"
                        onClick={() => handleEditClick(reason)}
                        className="whitespace-nowrap inline-flex items-center w-[5.5rem] h-7 rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add Reason
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root  bg-white ">
                <div className="w-full border rounded-lg overflow-x-auto">
                    <div className="inline-block min-w-full  align-middle ">
                        <div className="relative">
                            {Data ? (
                                <table
                                    id="details"
                                    className="min-w-full table-fixed divide-y divide-gray-300 "
                                    // ref={tableRef}
                                >
                                    <thead className="h-12">
                                        <tr className="py-2.5">
                                            <th
                                                scope="col"
                                                className="min-w-[8rem] pr-3 text-left text-sm font-semibold text-gray-600 px-7 sm:w-12 sm:px-6"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                <span className="sr-only">
                                                    Edit
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300  max-h-80 overflow-y-scroll">
                                        {Data?.map((reason, index) => (
                                            <tr
                                                key={index}
                                                className={[
                                                    selectedPeople.includes(
                                                        reason
                                                    )
                                                        ? "bg-gray-50"
                                                        : "cursor-pointer",
                                                    index % 2 === 0
                                                        ? "bg-smooth"
                                                        : "bg-white",
                                                ].join(" ")}
                                            >
                                                {/* <div onClick={() => handleClick(5,person.id)} className=" hover:cursor-pointer "> */}
                                                <td className="whitespace-nowrap py-4 px-5 text-sm font-medium text-gray-900 ">
                                                    {reason.ReasonName}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {reason.ReasonDesc}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                    {reason["ReasonStatus"] ? (
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
                                                                reason
                                                            )
                                                        }
                                                        className=" text-blue-500 hover:text-blue-900 flex"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                        <span className="ml-2">
                                                            Edit
                                                        </span>
                                                        <span className="sr-only">
                                                            , {reason.name}
                                                        </span>
                                                    </a>
                                                </td>
                                                {/* </div> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className=" h-64 flex items-center justify-center mt-10">
                                    <div class="text-center flex justify-center flex-col">
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
            </div>
            <AddFailedModal
                isOpen={isModalOpen}
                url={url}
                reason={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                updateLocalData={updateLocalData}
                currentUser={currentUser}
                failedReasons={failedReasons}
                // reasonAuditId={reasonAuditId}
                // rddReason={rddReason}
                // currentUser={currentUser}
            />
        </div>
    );
}
