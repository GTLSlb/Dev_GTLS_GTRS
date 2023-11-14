import { useState } from "react";
import BranchesTable from "../components/Branches/BranchesTable";
import GtamButton from "../components/Buttons/GtamButton";
import { useEffect } from "react";

export default function Branches({
    activeIndex,
    setActiveIndex,
    getBranches,
    branches,
    currentUser,
    states,
    setBranch,
    url,
}) {
    function createBranch() {
        setBranch(null)
        setActiveIndex(7);
    }

    return (
        <div className="px-6 lg:px-8 p-2">
            <div className="mt-6 sm:flex sm:items-center">
                <div className="flex gap-x-1">
                    <h1 className="font-bold text-dark text-xl">Branches</h1>{" "}
                    <p className="mt-auto text-gray-400">({branches?.length})</p>
                </div>
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
                    <GtamButton
                        onClick={createBranch}
                        className={"text-xs"}
                        name={"New Branch"}
                    />
                </div>
            </div>
            <BranchesTable setActiveIndex={setActiveIndex} setBranch={setBranch} branches={branches} />
        </div>
    );
}
