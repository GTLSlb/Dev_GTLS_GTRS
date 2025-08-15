import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { PencilIcon } from "@heroicons/react/24/solid";
import swal from "sweetalert";
import notFound from "../../../../assets//pictures/NotFound.png";
import axios from "axios";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { canEditKpiReasons } from "@/permissions";
import { handleSessionExpiration } from '@/CommonFunctions';
import { CustomContext } from "@/CommonContext";

export default function SmallTableKPI({
    showAddRow,
    setShowAddRow,
    objects,
    editIndex,
    setEditIndex,
    dynamicHeaders,
    AlertToast,
    getfunction,
    addurl,
    currentPage,
    setCurrentPage,
}) {

    const { Token, user , userPermissions} = useContext(CustomContext);

    const [data, setData] = useState(objects);

    useEffect(() => {
        setData(objects);
    }, [objects]);

    const [error, setError] = useState(false);
    const [editError, setEditError] = useState(false);
    const [newObject, setNewObject] = useState({});
    const [editedObject, setEditObject] = useState(null);
    const checkbox = useRef();
    const selectedRecords= []
    useLayoutEffect(() => {
        const isIndeterminate =
            selectedRecords?.length > 0 &&
            selectedRecords?.length < data?.length;
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedRecords]);
    const PER_PAGE = 20;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    const pageCount = Math.ceil(data?.length / PER_PAGE);

    function Editarray() {
        if (editIndex !== null) {
            const updatedObjects = [...data];
            updatedObjects[editIndex + currentPage * PER_PAGE] = editedObject;
            setData(updatedObjects);
            axios
                .post(addurl, editedObject, {
                    headers: {
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then(() => {
                    getfunction();
                    setEditIndex(null);
                    setEditObject({});
                })
                .catch((err) => {

                    if (err.response && err.response.status === 401) {
                        // Handle 401 error using SweetAlert
                        swal({
                          title: 'Session Expired!',
                          text: "Please login again",
                          type: 'success',
                          icon: "info",
                          confirmButtonText: 'OK'
                        }).then(async function () {
                            await handleSessionExpiration();
                        });
                      } else {
                        // Handle other errors
                    setEditObject({});
                    console.error(err);
                      }
                });
        }
    }
  
    function addObject() {
        let dataToSend = newObject;
        dataToSend = { ...dataToSend, ReasonStatus: 1, ReasonId: null };
        if (newObject.ReasonName == null) {
            AlertToast("Please enter a name", 3);
        } else {
            axios
                .post(addurl, dataToSend, {
                    headers: {
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then((res) => {
                    setShowAddRow(false);
                    const x = JSON.stringify(res.data);
                    getfunction();
                    const parsedDataPromise = new Promise((resolve) => {
                        const parsedData = JSON.parse(x);
                        resolve(parsedData);
                    });
                    parsedDataPromise.then(() => {
                        setNewObject({});
                    });
                })
                .catch((err) => {
                    // AlertToast("Error please try again.", 2);
                    if (err.response && err.response.status === 401) {
                        // Handle 401 error using SweetAlert
                        swal({
                          title: 'Session Expired!',
                          text: "Please login again",
                          type: 'success',
                          icon: "info",
                          confirmButtonText: 'OK'
                        }).then(async function () {
                            await handleSessionExpiration();
                        });
                      } else {
                        // Handle other errors
                    setNewObject({});
                    console.error(err);
                      }

                });
        }
    }
    function isValueAlreadyPresent(value, fieldName) {
        // Convert the value to lowercase
        const lowerCaseValue = value.toLowerCase();
        // Iterate over each object in the array
        for (const obj of data) {
            // Check if the field name exists in the object and if its value is a string
            if (
                Object.prototype.hasOwnProperty.call(obj, fieldName) &&
                typeof obj[fieldName] === "string"
            ) {
                // Convert the object's field value to lowercase
                const lowerCaseFieldValue = obj[fieldName].toLowerCase();
                // Check if the lowercase value matches the lowercase field value in any object
                if (lowerCaseFieldValue === lowerCaseValue) {
                    return true; // Value already exists
                }
            }
        }
        return false; // Value doesn't exist
    }
    function handleChange(e, header) {
        const enteredValue = e.target.value;
        const fieldName = header.key;
        const isValuePresent = isValueAlreadyPresent(enteredValue, fieldName);

        // Function 1: Perform any desired action based on the result
        if (isValuePresent) {
            // Value is already present
            // Perform the desired action, e.g., show an error message
            setError("Name Already Exists !");
        } else if (enteredValue.length == 0) {
            setError("Please Enter A Value!");
        } else {
            // Value is not present
            setError(false);
        }
        // Function 2: Update the newObject state
        setNewObject({
            ...newObject,
            [fieldName]: enteredValue,
            ReasonStatus: 1,
        });
    }
    function isEditValueAlreadyPresent(value, fieldName, currentValue) {
        // Convert the value, currentValue, and field values to lowercase
        const lowerCaseValue = value.toLowerCase();
        const lowerCaseCurrentValue = currentValue.toLowerCase();
        for (const obj of data) {
            // Check if the field name exists in the object and if its value is a string
            if (
                Object.prototype.hasOwnProperty.call(obj, fieldName) &&
                typeof obj[fieldName] === "string"
            ) {
                // Convert the object's field value to lowercase
                const lowerCaseFieldValue = obj[fieldName].toLowerCase();
                // Check if the lowercase value matches the lowercase field value in any object
                if (
                    lowerCaseFieldValue === lowerCaseValue &&
                    lowerCaseCurrentValue !== lowerCaseValue
                ) {
                    return true; // Value already exists
                }
            }
        }
        return false; // Value doesn't exist
    }
    function handleEditChange(e, header, currentValue) {
        const enteredValue = e.target.value;
        const fieldName = header.key;
        // const currentValue = editedObject[fieldName];
        const isValuePresent = isEditValueAlreadyPresent(
            enteredValue,
            fieldName,
            currentValue
        );

        // Function 1: Perform any desired action based on the result
        if (isValuePresent) {
            // Value is already present
            // Perform the desired action, e.g., show an error message
            setEditError("Name Already Exists !");
        } else if (enteredValue.length == 0) {
            setEditError("Please Enter A Value!");
        } else {
            // Value is not present
            setEditError(false);
            // Function 2: Update the editObject state
            setEditObject({
                ...editedObject,
                [fieldName]: enteredValue,
            });
        }
    }
    // Usage within the onChange event:
    return (
        <div>
            <div className=" w-full  pb-20">
                <div className="mx-auto mt-4 rounded">
                    <div className="pt-2">
                        <div>
                            <div className="flow-root   ">
                                <div className="w-full border rounded-lg overflow-x-auto containerscroll ">
                                    <div className="inline-block min-w-full  align-middle ">
                                        <div className="relative">
                                            {selectedRecords?.length > 0 && (
                                                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12"></div>
                                            )}
                                            <table className="min-w-full table-fixed divide-y divide-gray-300">
                                                <thead className="h-9 bg-gray-100">
                                                    <tr className="py-2">
                                                        <th
                                                            scope="col"
                                                            className="w-8 text-left text-sm font-semibold text-gray-600 border"
                                                        >
                                                            <span className="sr-only">
                                                                ID
                                                            </span>
                                                        </th>
                                                        {dynamicHeaders.map(
                                                            (header) => (
                                                                <th
                                                                    key={
                                                                        header.key
                                                                    }
                                                                    scope="col"
                                                                    className="px-2 text-left text-sm font-semibold text-gray-400 border"
                                                                >
                                                                    {
                                                                        header.label
                                                                    }
                                                                </th>
                                                            )
                                                        )}
                                                        {canEditKpiReasons(userPermissions) ? (
                                                            <th
                                                                scope="col"
                                                                className="px-3 w-20 text-left text-sm font-semibold text-gray-400 border"
                                                            >
                                                                <span className="">
                                                                    Edit
                                                                </span>
                                                            </th>
                                                        ) : null}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-300 h-5">
                                                    {showAddRow && (
                                                        <tr>
                                                            <td className="whitespace-nowrap bg-gray-100 py-2 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-3 border-l"></td>{" "}
                                                            {/* Empty cell for ID */}
                                                            {/* <td></td>{" "} */}
                                                            {/* Empty cell for checkbox */}
                                                            {dynamicHeaders.map(
                                                                (header) => (
                                                                    <td
                                                                        key={
                                                                            header.key
                                                                        }
                                                                        className="whitespace-nowrap bg-white py-2 pl-4 pr-3 text-sm font-medium text-dark sm:pl-2 border border-t-2 border-b-2 border-gray-400"
                                                                    >
                                                                        {header.key ==
                                                                        "ReasonStatus" ? (
                                                                            <div className="block">
                                                                                <div className="flex items-center gap-x-3">
                                                                                    <input
                                                                                        id="active"
                                                                                        name="ReasonStatus"
                                                                                        type="radio"
                                                                                        value="active"
                                                                                        defaultChecked="true"
                                                                                        onChange={() => {
                                                                                            setNewObject(
                                                                                                {
                                                                                                    ...newObject,
                                                                                                    [header.key]: 1,
                                                                                                }
                                                                                            );
                                                                                        }}
                                                                                        className="h-4 w-4 border-gray-300 text-dark focus:ring-goldd"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="active"
                                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Active
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center gap-x-3">
                                                                                    <input
                                                                                        id="inactive"
                                                                                        name="ReasonStatus"
                                                                                        type="radio"
                                                                                        value="inactive"
                                                                                        onChange={( ) => {
                                                                                            setNewObject(
                                                                                                {
                                                                                                    ...newObject,
                                                                                                    [header.key]: 2,
                                                                                                }
                                                                                            );
                                                                                        }}
                                                                                        className="h-4 w-4 border-gray-300 text-dark focus:ring-goldd"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="inactive"
                                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                                    >
                                                                                        Inactive
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <input
                                                                                    type="text"
                                                                                    value={
                                                                                        newObject[
                                                                                            header
                                                                                                .key
                                                                                        ]
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        handleChange(
                                                                                            e,
                                                                                            header
                                                                                        );
                                                                                    }}
                                                                                    className="w-full px-2 py-1 border-gray-300 rounded focus:ring-goldt focus:border-goldd"
                                                                                />
                                                                                {error && (
                                                                                    <p className="text-red-600 pt-1 ">
                                                                                        {
                                                                                            error
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                )
                                                            )}
                                                            <td className="border-t-2 bg-white border-b-2 border-r-2 border-gray-400">
                                                                <button
                                                                    className={`text-blue-400 ml-2 pl-2 hover:text-blue-900 ${
                                                                        error
                                                                            ? "text-gray-600 cursor-not-allowed"
                                                                            : ""
                                                                    }`}
                                                                    // Add the disabled attribute based on the error state
                                                                    onClick={() => {
                                                                        if (
                                                                            Object.values(
                                                                                newObject
                                                                            ).every(
                                                                                (
                                                                                    value
                                                                                ) =>
                                                                                    value !==
                                                                                    ""
                                                                            )
                                                                        ) {
                                                                            addObject();
                                                                            setNewObject(
                                                                                {}
                                                                            );
                                                                        }
                                                                    }}
                                                                    disabled={
                                                                        error
                                                                    }
                                                                >
                                                                    <span className="font-bold text-lg">
                                                                        +
                                                                    </span>{" "}
                                                                    Add
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {data?.length > 0 ? (
                                                        data
                                                            ?.slice(
                                                                OFFSET,
                                                                OFFSET +
                                                                    PER_PAGE
                                                            )
                                                            .map(
                                                                (
                                                                    object,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td
                                                                            className={`whitespace-nowrap  bg-gray-100 py-2 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-3  ${
                                                                                editIndex ==
                                                                                index
                                                                                    ? " border-l-2 border-t-2 border-b-2 border-gray-400 "
                                                                                    : "border"
                                                                            }`}
                                                                        >
                                                                            {index +
                                                                                1 +
                                                                                currentPage *
                                                                                    PER_PAGE}
                                                                        </td>

                                                                        {dynamicHeaders.map(
                                                                            (
                                                                                header
                                                                            ) => (
                                                                                <td
                                                                                    key={
                                                                                        header.key
                                                                                    }
                                                                                    className={`whitespace-nowrap bg-white py-2 pl-4 pr-3 text-sm font-medium text-dark sm:pl-2 border  ${
                                                                                        editIndex ==
                                                                                        index
                                                                                            ? "  border-t-2 border-b-2 border-gray-400 "
                                                                                            : "border"
                                                                                    }`}
                                                                                >
                                                                                    {editIndex ==
                                                                                    index ? (
                                                                                        <div className="">
                                                                                            {header.key ==
                                                                                            "ReasonStatus" ? (
                                                                                                <div className="block">
                                                                                                    <div className="flex items-center gap-x-3">
                                                                                                        <input
                                                                                                            id="active"
                                                                                                            name="ReasonStatus"
                                                                                                            type="radio"
                                                                                                            value="active"
                                                                                                            defaultChecked={
                                                                                                                editedObject[
                                                                                                                    header
                                                                                                                        .key
                                                                                                                ] ==
                                                                                                                1
                                                                                                            }
                                                                                                            onChange={() => {
                                                                                                                setEditObject(
                                                                                                                    {
                                                                                                                        ...editedObject,
                                                                                                                        [header.key]: 1,
                                                                                                                    }
                                                                                                                );
                                                                                                            }}
                                                                                                            className="h-4 w-4 border-gray-300 text-dark focus:ring-goldd"
                                                                                                        />
                                                                                                        <label
                                                                                                            htmlFor="active"
                                                                                                            className="block text-sm font-medium leading-6 text-gray-900"
                                                                                                        >
                                                                                                            Active
                                                                                                        </label>
                                                                                                    </div>
                                                                                                    <div className="flex items-center gap-x-3">
                                                                                                        <input
                                                                                                            id="inactive"
                                                                                                            name="ReasonStatus"
                                                                                                            type="radio"
                                                                                                            value="inactive"
                                                                                                            defaultChecked={
                                                                                                                editedObject[
                                                                                                                    header
                                                                                                                        .key
                                                                                                                ] ==
                                                                                                                2
                                                                                                            }
                                                                                                            onChange={() => {
                                                                                                                setEditObject(
                                                                                                                    {
                                                                                                                        ...editedObject,
                                                                                                                        [header.key]: 2,
                                                                                                                    }
                                                                                                                );
                                                                                                            }}
                                                                                                            className="h-4 w-4 border-gray-300 text-dark focus:ring-goldd"
                                                                                                        />
                                                                                                        <label
                                                                                                            htmlFor="inactive"
                                                                                                            className="block text-sm font-medium leading-6 text-gray-900"
                                                                                                        >
                                                                                                            Inactive
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        defaultValue={
                                                                                                            object[
                                                                                                                header
                                                                                                                    .key
                                                                                                            ]
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e
                                                                                                        ) =>
                                                                                                            handleEditChange(
                                                                                                                e,
                                                                                                                header,
                                                                                                                object[
                                                                                                                    header
                                                                                                                        .key
                                                                                                                ]
                                                                                                            )
                                                                                                        }
                                                                                                        className="w-full px-2 py-1 border-gray-300 rounded focus:ring-goldt focus:border-goldd"
                                                                                                    />
                                                                                                    {editError && (
                                                                                                        <p className="text-red-600 pt-1 ">
                                                                                                            {
                                                                                                                editError
                                                                                                            }
                                                                                                        </p>
                                                                                                    )}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            {header.key ==
                                                                                            "ReasonStatus" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {object[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    1 ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                                                            Active
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                                                            Inactive
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : (
                                                                                                object[
                                                                                                    header
                                                                                                        .key
                                                                                                ]
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                            )
                                                                        )}
                                                                        {canEditKpiReasons(userPermissions) ? (
                                                                            <td
                                                                                className={`relative bg-white whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0  ${
                                                                                    editError
                                                                                        ? "cursor-not-allowed"
                                                                                        : ""
                                                                                } ${
                                                                                    editIndex ==
                                                                                    index
                                                                                        ? "border-t-2 border-r-2 border-b-2 border-gray-400"
                                                                                        : "border"
                                                                                }`}
                                                                            >
                                                                                <div className="ml-1">
                                                                                    {editIndex ==
                                                                                    index ? (
                                                                                        <a
                                                                                            id={`save${index}`}
                                                                                            href="#"
                                                                                            onClick={() => {
                                                                                                Editarray(
                                                                                                    editIndex
                                                                                                );
                                                                                            }}
                                                                                            className={`text-green-700 hover:text-blue-900 flex gap-x-1 ${
                                                                                                editError
                                                                                                    ? " text-red-500 pointer-events-none"
                                                                                                    : ""
                                                                                            }`}
                                                                                        >
                                                                                            <CheckIcon className="w-5 h-5 " />
                                                                                            <span>
                                                                                                Save
                                                                                            </span>
                                                                                        </a>
                                                                                    ) : (
                                                                                        <div>
                                                                                            {canEditKpiReasons(
                                                                                                userPermissions
                                                                                            ) ? (
                                                                                                <a
                                                                                                    id={`edit${index}`}
                                                                                                    href="#"
                                                                                                    onClick={() => {
                                                                                                        setShowAddRow(
                                                                                                            false
                                                                                                        );
                                                                                                        setEditIndex(
                                                                                                            index
                                                                                                        );
                                                                                                        setEditObject(
                                                                                                            object
                                                                                                        );
                                                                                                    }}
                                                                                                    className="text-blue-500 hover:text-blue-900 flex gap-x-1"
                                                                                                >
                                                                                                    <PencilIcon className="text-blue-400 w-5 h-5" />
                                                                                                    <span>
                                                                                                        Edit
                                                                                                    </span>
                                                                                                </a>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                        ) : null}
                                                                    </tr>
                                                                )
                                                            )
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="18">
                                                                <div className=" h-72 flex items-center justify-center mt-5">
                                                                    <div className="text-center flex justify-center flex-col">
                                                                        <img
                                                                            src={
                                                                                notFound
                                                                            }
                                                                            alt=""
                                                                            className="w-52 h-auto "
                                                                        />
                                                                        <h1 className="text-3xl font-bold text-gray-900">
                                                                            No
                                                                            Data
                                                                            Found
                                                                        </h1>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 pb-10 text-xs text-gray-400">
                                <ReactPaginate
                                    previousLabel={"← Previous"}
                                    nextLabel={"Next →"}
                                    pageCount={pageCount}
                                    onPageChange={handlePageClick}
                                    containerClassName={
                                        "flex justify-center items-center mt-4"
                                    }
                                    pageClassName={
                                        "mx-2 rounded-full hover:bg-gray-100"
                                    }
                                    previousLinkClassName={
                                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                                    }
                                    nextLinkClassName={
                                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                                    }
                                    disabledClassName={
                                        "opacity-50 cursor-not-allowed"
                                    }
                                    activeClassName={"text-blue-500 font-bold"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


SmallTableKPI.propTypes = {
    data: PropTypes.array,
    headers: PropTypes.array,
    canEditKpiReasons: PropTypes.func,
    notFound: PropTypes.string,
    onAddRow: PropTypes.func,
    onEditRow: PropTypes.func,
    currentTheme: PropTypes.string,
    showAddRow: PropTypes.bool,
    setShowAddRow: PropTypes.func,
    objects: PropTypes.array,
    Token: PropTypes.string,
    addurl: PropTypes.string,
    editIndex: PropTypes.number,
    setEditIndex: PropTypes.func,
    getfunction: PropTypes.func,
    AlertToast: PropTypes.func,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    dynamicHeaders: PropTypes.array,
};