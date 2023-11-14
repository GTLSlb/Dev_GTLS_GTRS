import React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { PencilIcon } from "@heroicons/react/24/solid";
import notFound from "../../../../assets//pictures/NotFound.png";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function SmallTable({
    fromModel,
    showAddRow,
    setShowAddRow,
    objects,
    editIndex,
    setEditIndex,
    dynamicHeaders,
    AlertToast,
    setObjects,
    getfunction,
    addurl,
    states,
    currentUser,
    currentPage,
    setCurrentPage,
}) {

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    const [selected, setSelected] = useState();
    const [data, setData] = useState(objects);

    useEffect(() => {
        if (states) {
            setSelected(states[0]);
        }
    }, [states]);
    useEffect(() => {
        setData(objects);
    }, [objects]);
    useEffect(() => {
        if (states) {
            if (showAddRow == true) {
                setSelected(states[0]);
            }
        }
    }, [showAddRow]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [error, setError] = useState(true);
    const [companyNameError, setCompanyNameError] = useState(true);
    const [companyAbvError, setCompanyAbvError] = useState(true);
    const [editError, setEditError] = useState(false);
    const [newObject, setNewObject] = useState({});
    const [editedObject, setEditObject] = useState(null);
    const checkbox = useRef();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedRecords, setselectedRecords] = useState([]);
    const [companyAbv, setCompanyAbv] = useState([]);
    const [companyName, setCompanyName] = useState([]);
    const [disabledAdd, setdisabledAdd] = useState(false);
    const [disabledEdit, setdisabledEdit] = useState(false);

    useEffect(()=>{
        setError(null)
        setEditError(null)
        setCompanyAbvError(null)
        setCompanyNameError(null)
    },[editIndex,showAddRow])

    function disableAddFunc() {
        if (fromModel() == 2) {
            if (
                companyAbv?.length > 0 &&
                companyName?.length > 0 &&
                companyAbvError == false &&
                companyNameError == false
            ) {
                return false;
            } else {
                return true;
            }
        } else {
            return error;
        }
    }
    function disableEditFunc() {
        if (fromModel() == 2) {
            if (
                companyAbv?.length > 0 &&
                companyName?.length > 0 &&
                companyAbvError == false &&
                companyNameError == false
            ) {
                return false;
            } else {
                return true;
            }
        } else {
            return editError;
        }
    }
    useEffect(() => {
        if (editedObject) {
            if (fromModel() == 2) {
                setCompanyName(editedObject.CompanyName);
                setCompanyAbv(editedObject.CompanyAbv);
            }
        }
    }, [editedObject]);
    useEffect(() => {
        setdisabledAdd(disableAddFunc());
        setdisabledEdit(disableEditFunc());
    }, [
        companyAbv,
        companyName,
        companyNameError,
        companyAbvError,
        editError,
        error,
    ]);
    useLayoutEffect(() => {
        const isIndeterminate =
            selectedRecords?.length > 0 &&
            selectedRecords?.length < data?.length;
        setChecked(selectedRecords?.length === data?.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedRecords]);
    function toggleAll() {
        setselectedRecords(checked || indeterminate ? [] : data);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }
    const PER_PAGE = 10;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    const pageCount = Math.ceil(data?.length / PER_PAGE);

    function Editarray(index) {
        if (editIndex !== null) {
            const updatedObjects = [...data];
            let objectToEdit = {
                ...editedObject,
                    CompanyName: companyName,
                    CompanyAbv: companyAbv,
            }
            updatedObjects[editIndex + currentPage * PER_PAGE] = editedObject;
            if (fromModel() == 2) {
                objectToEdit = {
                    ...editedObject,
                        CompanyName: companyName,
                        CompanyAbv: companyAbv,
                }
            }
            setData(updatedObjects);
            axios
                .post(addurl, objectToEdit, {
                    headers: {
                        UserId: currentUser.user_id,
                    },
                })
                .then((res) => {
                    getfunction();
                    setEditIndex(null);
                    AlertToast("Saved Successfully", 1);
                    setEditObject({});
                })
                .catch((err) => {
                    AlertToast("Error please try again.", 2);
                    setEditObject({});
                    console.log(err);
                });
        }
    }
    function handleEditCompany() {
        if (fromModel() == 3) {
        }
    }
    function ShowEditBasedOnRoleAndModel() {
        if (currentUser.role_id == 1) {
            return true;
        } else if (fromModel() == 3) {
            if (currentUser.role_id == 9 || currentUser.role_id == 8) {
                return true;
            } else {
                return false;
            }
        } else if (fromModel() == 1 || fromModel() == 4 || fromModel() == 3) {
            if (currentUser.role_id == 8) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }
    function addObject() {
        let dataToSend = newObject;
        if (!newObject.StatusId) {
            setNewObject({
                ...newObject,
                StatusId: 1,
            });
        }
        if (newObject.CompanyName) {
            if (!newObject.StateId) {
                setNewObject({
                    ...newObject,
                    StateId: selected.StateId,
                });
                dataToSend = {
                    ...newObject,
                    StateId: selected.StateId,
                };
            }
        }
        if (fromModel() == 2) {
            setNewObject({
                ...newObject,
                CompanyName: companyName,
                CompanyAbv: companyAbv,
                StateId: selected.StateId,
                StatusId: 1,
            });
            dataToSend = {
                ...newObject,
                CompanyName: companyName,
                CompanyAbv: companyAbv,
                StateId: selected.StateId,
                StatusId: 1,
            };
        }
        axios
            .post(addurl, dataToSend, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                getfunction();
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    // setObjects(parsedData);
                    AlertToast("Saved Successfully", 1);
                    setCompanyAbv();
                    setCompanyName();
                    setNewObject({});
                });
            })
            .catch((err) => {
                AlertToast("Error please try again.", 2);
                setNewObject({});
                console.log(err);
            });
    }
    function isValueAlreadyPresent(value, fieldName) {
        // Convert the value to lowercase
        const lowerCaseValue = value.toLowerCase();
        // Iterate over each object in the array
        for (const obj of data) {
            // Check if the field name exists in the object and if its value is a string
            if (
                obj.hasOwnProperty(fieldName) &&
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
            setError("Name already exists.");
        } else if (enteredValue.length == 0) {
            setError("Please enter a value.");
        } else {
            // Value is not present
            setError(false);
        }
        // Function 2: Update the newObject state
        setNewObject({
            ...newObject,
            [fieldName]: enteredValue,
            StatusId: 1,
        });
    }
    function handleCompChange(e, header) {
        const enteredValue = e.target.value;
        const fieldName = header.key;
        const isValuePresent = isValueAlreadyPresent(enteredValue, fieldName);

        if (isValuePresent && fieldName == "CompanyName") {
            setCompanyNameError("Name already exists.");
        } else if (isValuePresent && fieldName == "CompanyAbv") {
            setCompanyAbvError("ABV already exists.");
        } else if (enteredValue.length == 0 && fieldName == "CompanyName") {
            setCompanyNameError("Please enter a value.");
        } else if (enteredValue.length == 0 && fieldName == "CompanyAbv") {
            setCompanyAbvError("Please enter a value.");
        } else {
            if (header.key == "CompanyName") {
                setCompanyNameError(false);
                setCompanyName(enteredValue);
            }
            if (header.key == "CompanyAbv") {
                setCompanyAbvError(false);
                setCompanyAbv(enteredValue);
            }
        }
    }
    function isEditValueAlreadyPresent(value, fieldName, currentValue) {
        // Convert the value, currentValue, and field values to lowercase
        const lowerCaseValue = value.toLowerCase();
        const lowerCaseCurrentValue = currentValue.toLowerCase();
        for (const obj of data) {
            // Check if the field name exists in the object and if its value is a string
            if (
                obj.hasOwnProperty(fieldName) &&
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
            setEditError("Name already exists.");
        } else if (enteredValue.length == 0) {
            setEditError("Please enter a value.");
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
            <div className=" w-full bg-smooth pb-20">
                <div className="mx-auto mt-4 rounded">
                    <div className="pt-2">
                        <div>
                            <div className="flow-root  bg-white ">
                                <div className="w-full border rounded-lg overflow-x-auto containerscroll min-h-[15rem]">
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
                                                        {ShowEditBasedOnRoleAndModel() ? (
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
                                                            {dynamicHeaders.map(
                                                                (header) => (
                                                                    <td
                                                                        key={
                                                                            header.key
                                                                        }
                                                                        className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-dark sm:pl-2 border border-t-2 border-b-2 border-gray-400"
                                                                    >
                                                                        {header.key ==
                                                                        "StatusId" ? (
                                                                            <div className="block">
                                                                                <div className="flex items-center gap-x-3">
                                                                                    <input
                                                                                        id="active"
                                                                                        name="Status"
                                                                                        type="radio"
                                                                                        value="active"
                                                                                        defaultChecked="true"
                                                                                        onChange={(
                                                                                            event
                                                                                        ) => {
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
                                                                                        name="Status"
                                                                                        type="radio"
                                                                                        value="inactive"
                                                                                        onChange={(
                                                                                            event
                                                                                        ) => {
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
                                                                        ) : header.key ==
                                                                          "StateId" ? (
                                                                            <div>
                                                                                <Listbox
                                                                                    value={
                                                                                        selected
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setSelected(
                                                                                            e
                                                                                        );
                                                                                        setNewObject(
                                                                                            {
                                                                                                ...newObject,
                                                                                                [header.key]:
                                                                                                    e.StateId,
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {({
                                                                                        open,
                                                                                    }) => (
                                                                                        <>
                                                                                            <div className="relative ">
                                                                                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                                                    <span className="block truncate">
                                                                                                        {
                                                                                                            selected.StateName
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                                                        <ChevronUpDownIcon
                                                                                                            className="h-5 w-5 text-gray-400"
                                                                                                            aria-hidden="true"
                                                                                                        />
                                                                                                    </span>
                                                                                                </Listbox.Button>

                                                                                                <Transition
                                                                                                    show={
                                                                                                        open
                                                                                                    }
                                                                                                    as={
                                                                                                        Fragment
                                                                                                    }
                                                                                                    leave="transition ease-in duration-100"
                                                                                                    leaveFrom="opacity-100"
                                                                                                    leaveTo="opacity-0"
                                                                                                >
                                                                                                    <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                                        {states.map(
                                                                                                            (
                                                                                                                state
                                                                                                            ) => (
                                                                                                                <Listbox.Option
                                                                                                                    key={
                                                                                                                        state.StateId
                                                                                                                    }
                                                                                                                    className={({
                                                                                                                        active,
                                                                                                                    }) =>
                                                                                                                        classNames(
                                                                                                                            active
                                                                                                                                ? "bg-indigo-600 text-white"
                                                                                                                                : "text-gray-900",
                                                                                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                                                        )
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        state
                                                                                                                    }
                                                                                                                >
                                                                                                                    {({
                                                                                                                        selected,
                                                                                                                        active,
                                                                                                                    }) => (
                                                                                                                        <>
                                                                                                                            <span
                                                                                                                                className={classNames(
                                                                                                                                    selected
                                                                                                                                        ? "font-semibold"
                                                                                                                                        : "font-normal",
                                                                                                                                    "block truncate"
                                                                                                                                )}
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    state.StateName
                                                                                                                                }
                                                                                                                            </span>

                                                                                                                            {selected ? (
                                                                                                                                <span
                                                                                                                                    className={classNames(
                                                                                                                                        active
                                                                                                                                            ? "text-white"
                                                                                                                                            : "text-indigo-600",
                                                                                                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                                                    )}
                                                                                                                                >
                                                                                                                                    <CheckIcon
                                                                                                                                        className="h-5 w-5"
                                                                                                                                        aria-hidden="true"
                                                                                                                                    />
                                                                                                                                </span>
                                                                                                                            ) : null}
                                                                                                                        </>
                                                                                                                    )}
                                                                                                                </Listbox.Option>
                                                                                                            )
                                                                                                        )}
                                                                                                    </Listbox.Options>
                                                                                                </Transition>
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                </Listbox>
                                                                            </div>
                                                                        ) : header.key ==
                                                                          "CompanyAbv" ? (
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
                                                                                        handleCompChange(
                                                                                            e,
                                                                                            header
                                                                                        );
                                                                                    }}
                                                                                    className="w-full px-2 py-1 border-gray-300 rounded focus:ring-goldt focus:border-goldd"
                                                                                />
                                                                                {companyAbvError && (
                                                                                    <p className="text-red-600 pt-1 ">
                                                                                        {
                                                                                            companyAbvError
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        ) : header.key ==
                                                                          "CompanyName" ? (
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
                                                                                        handleCompChange(
                                                                                            e,
                                                                                            header
                                                                                        );
                                                                                    }}
                                                                                    className="w-full px-2 py-1 border-gray-300 rounded focus:ring-goldt focus:border-goldd"
                                                                                />
                                                                                {companyNameError && (
                                                                                    <p className="text-red-600 pt-1 ">
                                                                                        {
                                                                                            companyNameError
                                                                                        }
                                                                                    </p>
                                                                                )}
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
                                                            <td className="border-t-2 border-b-2 border-r-2 border-gray-400">
                                                                <button
                                                                    className={`text-blue-400 ml-2 pl-2 hover:text-blue-900 ${
                                                                        disabledAdd
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
                                                                            setShowAddRow(
                                                                                false
                                                                            );
                                                                        }
                                                                    }}
                                                                    disabled={
                                                                        disabledAdd
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
                                                                            className={`whitespace-nowrap bg-gray-100 py-2 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-3  ${
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
                                                                                    className={`whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-dark sm:pl-2 border  ${
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
                                                                                            "StatusId" ? (
                                                                                                <div className="block">
                                                                                                    <div className="flex items-center gap-x-3">
                                                                                                        <input
                                                                                                            id="active"
                                                                                                            name="Status"
                                                                                                            type="radio"
                                                                                                            value="active"
                                                                                                            defaultChecked={
                                                                                                                editedObject[
                                                                                                                    header
                                                                                                                        ?.key
                                                                                                                ] ==
                                                                                                                1
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                event
                                                                                                            ) => {
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
                                                                                                            name="Status"
                                                                                                            type="radio"
                                                                                                            value="inactive"
                                                                                                            defaultChecked={
                                                                                                                editedObject[
                                                                                                                    header
                                                                                                                        .key
                                                                                                                ] ==
                                                                                                                2
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                event
                                                                                                            ) => {
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
                                                                                            ) : header.key ==
                                                                                              "StateId" ? (
                                                                                                <div>
                                                                                                    <Listbox
                                                                                                        value={
                                                                                                            selected
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e
                                                                                                        ) => {
                                                                                                            setSelected(
                                                                                                                e
                                                                                                            );
                                                                                                            setEditObject(
                                                                                                                {
                                                                                                                    ...editedObject,
                                                                                                                    [header.key]:
                                                                                                                        e.StateId,
                                                                                                                }
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        {({
                                                                                                            open,
                                                                                                        }) => (
                                                                                                            <>
                                                                                                                <div className="relative ">
                                                                                                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                                                                        <span className="block truncate">
                                                                                                                            {
                                                                                                                                selected?.StateName
                                                                                                                            }
                                                                                                                        </span>
                                                                                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                                                                            <ChevronUpDownIcon
                                                                                                                                className="h-5 w-5 text-gray-400"
                                                                                                                                aria-hidden="true"
                                                                                                                            />
                                                                                                                        </span>
                                                                                                                    </Listbox.Button>

                                                                                                                    <Transition
                                                                                                                        show={
                                                                                                                            open
                                                                                                                        }
                                                                                                                        as={
                                                                                                                            Fragment
                                                                                                                        }
                                                                                                                        leave="transition ease-in duration-100"
                                                                                                                        leaveFrom="opacity-100"
                                                                                                                        leaveTo="opacity-0"
                                                                                                                    >
                                                                                                                        <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                                                            {states.map(
                                                                                                                                (
                                                                                                                                    state
                                                                                                                                ) => (
                                                                                                                                    <Listbox.Option
                                                                                                                                        key={
                                                                                                                                            state.StateId
                                                                                                                                        }
                                                                                                                                        className={({
                                                                                                                                            active,
                                                                                                                                        }) =>
                                                                                                                                            classNames(
                                                                                                                                                active
                                                                                                                                                    ? "bg-indigo-600 text-white"
                                                                                                                                                    : "text-gray-900",
                                                                                                                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                                                                            )
                                                                                                                                        }
                                                                                                                                        value={
                                                                                                                                            state
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        {({
                                                                                                                                            selected,
                                                                                                                                            active,
                                                                                                                                        }) => (
                                                                                                                                            <>
                                                                                                                                                <span
                                                                                                                                                    className={classNames(
                                                                                                                                                        selected
                                                                                                                                                            ? "font-semibold"
                                                                                                                                                            : "font-normal",
                                                                                                                                                        "block truncate"
                                                                                                                                                    )}
                                                                                                                                                >
                                                                                                                                                    {
                                                                                                                                                        state.StateName
                                                                                                                                                    }
                                                                                                                                                </span>

                                                                                                                                                {selected ? (
                                                                                                                                                    <span
                                                                                                                                                        className={classNames(
                                                                                                                                                            active
                                                                                                                                                                ? "text-white"
                                                                                                                                                                : "text-indigo-600",
                                                                                                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                                                                        )}
                                                                                                                                                    >
                                                                                                                                                        <CheckIcon
                                                                                                                                                            className="h-5 w-5"
                                                                                                                                                            aria-hidden="true"
                                                                                                                                                        />
                                                                                                                                                    </span>
                                                                                                                                                ) : null}
                                                                                                                                            </>
                                                                                                                                        )}
                                                                                                                                    </Listbox.Option>
                                                                                                                                )
                                                                                                                            )}
                                                                                                                        </Listbox.Options>
                                                                                                                    </Transition>
                                                                                                                </div>
                                                                                                            </>
                                                                                                        )}
                                                                                                    </Listbox>
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "CompanyAbv" ? (
                                                                                                <div>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        defaultValue={
                                                                                                            editedObject[
                                                                                                                header
                                                                                                                    ?.key
                                                                                                            ]
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e
                                                                                                        ) => {
                                                                                                            handleCompChange(
                                                                                                                e,
                                                                                                                header
                                                                                                            );
                                                                                                        }}
                                                                                                        className="w-full px-2 py-1 border-gray-300 rounded focus:ring-goldt focus:border-goldd"
                                                                                                    />
                                                                                                    {companyAbvError && (
                                                                                                        <p className="text-red-600 pt-1 ">
                                                                                                            {
                                                                                                                companyAbvError
                                                                                                            }
                                                                                                        </p>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "CompanyName" ? (
                                                                                                <div>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        defaultValue={
                                                                                                            editedObject[
                                                                                                                header
                                                                                                                    ?.key
                                                                                                            ]
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e
                                                                                                        ) => {
                                                                                                            handleCompChange(
                                                                                                                e,
                                                                                                                header
                                                                                                            );
                                                                                                        }}
                                                                                                        className="w-full px-2 py-1 border-gray-300 rounded focus:ring-goldt focus:border-goldd"
                                                                                                    />
                                                                                                    {companyNameError && (
                                                                                                        <p className="text-red-600 pt-1 ">
                                                                                                            {
                                                                                                                companyNameError
                                                                                                            }
                                                                                                        </p>
                                                                                                    )}
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
                                                                                            "StatusId" ? (
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
                                                                                            ) : header.key ==
                                                                                              "StateId" ? (
                                                                                                states?.find(
                                                                                                    (
                                                                                                        state
                                                                                                    ) =>
                                                                                                        state.StateId ===
                                                                                                        object[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                )
                                                                                                    ?.StateCode
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
                                                                        {ShowEditBasedOnRoleAndModel() ? (
                                                                            <td
                                                                                className={`relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0  ${
                                                                                    disabledEdit
                                                                                        ? "cursor-not-allowed"
                                                                                        : ""
                                                                                } ${
                                                                                    editIndex ==
                                                                                    index
                                                                                        ? "border-t-2 border-r-2 border-b-2 border-gray-400"
                                                                                        : "border"
                                                                                }`}
                                                                            >
                                                                                <div className="ml-1 cursor-not-allowed">
                                                                                    {editIndex ==
                                                                                    index ? (
                                                                                        <a
                                                                                            href="#"
                                                                                            onClick={() => {
                                                                                                Editarray(
                                                                                                    editIndex
                                                                                                );
                                                                                            }}
                                                                                            className={`text-green-700 hover:text-blue-900 flex gap-x-1 ${
                                                                                                disabledEdit
                                                                                                    ? "text-red-500  pointer-events-none"
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
                                                                                            <a
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
                                                                                                    setSelected(
                                                                                                        states?.find(
                                                                                                            (
                                                                                                                state
                                                                                                            ) =>
                                                                                                                state.StateId ===
                                                                                                                object.StateId
                                                                                                        )
                                                                                                    );
                                                                                                }}
                                                                                                className="text-blue-500 hover:text-blue-900 flex gap-x-1"
                                                                                            >
                                                                                                <PencilIcon className="text-blue-400 w-5 h-5" />
                                                                                                <span>
                                                                                                    Edit
                                                                                                </span>
                                                                                            </a>
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
                                    initialPage={currentPage}
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
