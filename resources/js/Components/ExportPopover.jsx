import React from "react";
import PropTypes from "prop-types";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useState } from "react";

const ExportPopover = ({ columns, handleDownloadExcel, filteredData }) => {
    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const handleMouseEnter = () => {
        if (filteredData?.length === 0) {
            setHoverMessage("No Data Found");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 1000);
        }
    };

    return (
        <Popover className="relative">
            <div onMouseEnter={handleMouseEnter}>
                <Popover.Button
                    className={`inline-flex items-center text-xs justify-center gap-1 w-[5.5rem] h-[36px] font-bold ${
                        filteredData?.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "font-medium rounded-lg bg-gray-800 hover:bg-gray-400"
                    } px-2 py-2 text-white shadow-sm focus:outline-none rounded-lg`}
                    disabled={filteredData?.length === 0}
                >
                    Export
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                </Popover.Button>
            </div>

            {isMessageVisible && (
                <div className="absolute top-9.5 text-center left-0 md:-left-14 w-[9rem] right-0 bg-red-200 text-dark z-10 text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
                    {hoverMessage}
                </div>
            )}

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute left-20 sm:left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2">
                    <div className="max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        <div className="p-4">
                            <div className="mt-2 flex flex-col">
                                {columns
                                    .filter(
                                        (column) =>
                                            column.name?.toLowerCase() !==
                                                "actions" &&
                                            column.name?.toLowerCase() !==
                                                "edit" &&
                                            column.header?.toLowerCase() !==
                                                "edit"
                                    )
                                    .map(({ name, header }) => (
                                        <label key={name}>
                                            <input
                                                type="checkbox"
                                                name="column"
                                                value={name}
                                                className="text-dark rounded focus:ring-goldd"
                                            />{" "}
                                            {header}
                                        </label>
                                    ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                            <button
                                onClick={handleDownloadExcel}
                                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                            >
                                Export XLS
                            </button>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

ExportPopover.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            header: PropTypes.string,
        })
    ),
    handleDownloadExcel: PropTypes.func,
    filteredData: PropTypes.array,
};

export default ExportPopover;
