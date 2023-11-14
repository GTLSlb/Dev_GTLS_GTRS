import React from "react";
import {
    useTable,
    useFilters,
    useGlobalFilter,
    useRowSelect,
} from "react-table";
import { TextFilter } from "./TextFilter";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState, useMemo } from "react";

export default function InvoicesTable({ header, body }) {
    const columns = useMemo(() => body, []);
    const data = useMemo(() => header, []);

    const defaultColumn = useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: "",
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
        selectedFlatRows,
    } = useTable(
        {
            columns: columns,
            data: data,
            defaultColumn, // Be sure to pass the defaultColumn option
        },
        useFilters,
        useGlobalFilter,
        useRowSelect, // Add the useRowSelect hook
        (hooks) => {
            // Enable row selection
            hooks.visibleColumns.push((columns) => [
                // Add a selection column as the second column
                ...columns.slice(0, 1),
                {
                    id: "selection",
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <input
                            className="rounded text-green-500"
                            type="checkbox"
                            {...getToggleAllRowsSelectedProps()}
                        />
                    ),
                    Cell: ({ row }) => (
                        <div className="flex justify-center">
                            <input
                                className="rounded text-gray-700"
                                type="checkbox"
                                {...row.getToggleRowSelectedProps()}
                            />
                        </div>
                    ),
                },
                ...columns.slice(1),
                {
                    id: "addedit",
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div className="flex justify-center w-full">
                            <p>Edit</p>
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <a
                                href="#"
                                className=" text-blue-500 hover:text-blue-900 flex justify-center"
                            >
                                <PencilIcon className="text-blue-400 w-5 h-5" />
                            </a>
                        </div>
                    ),
                },
            ]);
        }
    );

    return (
        <div className=" mt-5 border rounded-xl overflow-auto max-h-64 lg:max-h-full">
            <table
                className="w-full rounded-xl overflow-x-scroll"
                {...getTableProps()}
            >
                <thead className="bg-gray-100">
                    {headerGroups.map((headerGroup) => (
                        <tr className="" {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    className="border "
                                    {...column.getHeaderProps()}
                                >
                                    <div className=" flex px-1 items-center gap-x-2">
                                        <div>{column.render("Header")}</div>
                                        <div>
                                            {column.canFilter
                                                ? column.render("Filter")
                                                : null}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr className="bg-white " {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td
                                        className="p-1 border"
                                        {...cell.getCellProps()}
                                    >
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
