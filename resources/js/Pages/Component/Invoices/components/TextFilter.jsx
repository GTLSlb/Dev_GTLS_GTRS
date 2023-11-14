import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export function TextFilter({
    setSortedData,
    sortedData,
    header,
    originalData,
}) {
    const [sortDirection, setSortDirection] = useState("none");

    const handleSort = () => {
        if (sortDirection === "asc") {
            sortData("desc");
        } else if (sortDirection === "desc") {
            resetSorting();
        } else {
            sortData("asc");
        }
    };
    const sortData = (direction) => {
        const sortedArray = [...sortedData].sort((a, b) => {
            const aValue = a[header];
            const bValue = b[header];
            if (typeof aValue === "string" && typeof bValue === "string") {
                return direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else if (
                typeof aValue === "number" &&
                typeof bValue === "number"
            ) {
                return direction === "asc" ? aValue - bValue : bValue - aValue;
            } else {
                // Handle other cases as needed
                return 0; // Default behavior: no change in order
            }
        });
        setSortedData(sortedArray);
        setSortDirection(direction);
    };

    const resetSorting = () => {
        setSortedData(originalData);
        setSortDirection("none");
    };
    return (
        <div className="p-1 mt-1">
            <button onClick={handleSort}>
                {sortDirection === "asc" ? (
                    <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                                opacity="0.5"
                                d="M16 18L16 6M16 6L20 10.125M16 6L12 10.125"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>{" "}
                            <path
                                d="M8 6L8 18M8 18L12 13.875M8 18L4 13.875"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>{" "}
                        </g>
                    </svg>
                ) : sortDirection === "desc" ? (
                    <svg
                        width="15px"
                        height="15px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M17.1306 16.5049L15.1855 14.5597L16.2461 13.4991L20.002 17.2549L16.2461 21.0108L15.1855 19.9502L17.1307 18.0049H4.99761V12.0005L6.49761 12.0005V16.5049H17.1306Z"
                                fill="#1F2328"
                            ></path>{" "}
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.87883 5.99617L8.83128 4.05205L7.7729 2.98912L3.99973 6.74618L7.7729 10.5032L8.83128 9.44021L6.87885 7.49617L17.4976 7.49617V11.9916H18.9976V5.99617L6.87883 5.99617Z"
                                fill="#1F2328"
                            ></path>{" "}
                        </g>
                    </svg>
                ) : (
                    <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="matrix(-1, 0, 0, 1, 0, 0)"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                                opacity="0.5"
                                d="M16 18L16 6M16 6L20 10.125M16 6L12 10.125"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>{" "}
                            <path
                                d="M8 6L8 18M8 18L12 13.875M8 18L4 13.875"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>{" "}
                        </g>
                    </svg>
                )}
            </button>
        </div>
    );
}
