import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useState } from "react"; 

export default function BranchesTable({ setActiveIndex, branches, setBranch }) {
    const [data, setData] = useState(branches);

    useEffect(() => {
        setData(branches);
    }, [branches]);

    function HandleEdit(item) {
        setBranch(item);
        setActiveIndex(7);
    }

    return (
        <div className=" flow-root">
            <div className=" -mx-6 overflow-x-auto  p-5">
                <div className="inline-block min-w-full py-2 align-middle sm:px-3 lg:px-5 border rounded-xl shadow bg-white">
                    <table className=" min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="py-2.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-0"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-2.5 text-left text-sm font-semibold text-gray-500"
                                >
                                    State
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-2.5 text-left text-sm font-semibold text-gray-500"
                                >
                                    Phone Number
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-2.5 text-left text-sm font-semibold text-gray-500"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-2.5 pl-3 pr-6 sm:pr-0"
                                >
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data?.map((branch) => (
                                <tr key={branch.BranchId}>
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                            <div className="font-bold text-gray-900">
                                                {branch.BranchName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div className="text-gray-900">
                                            {branch.StateName}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {branch.PhoneNumber}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {branch.StatusId == 1 ? (
                                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-500">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-left text-sm font-medium sm:pr-0">
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                HandleEdit(branch);
                                            }}
                                            className=" text-blue-500 hover:text-blue-900 flex gap-x-1"
                                        >
                                            <PencilIcon className="w-5 h-5 ml-1" />
                                            Edit
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
