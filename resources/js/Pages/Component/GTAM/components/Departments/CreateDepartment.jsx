import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";
import GtamButton from "../Buttons/GtamButton";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function CreateDepartment({
    currentUser,
    setDepartment,
    department,
    getDepartments,
    branches,
    AlertToast,
    url,
    states,
    setActiveIndex,
}) {
    const [selectedState, setSelectedState] = useState(branches[0]);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState();
    useEffect(() => {
        setSelectedState(branches[0]);
    }, [branches]);
    useEffect(() => {
        if (department) {
            setSelectedState(
                states.find((item) => item.StateId === department.StateId)
            );
            setValue(department.PhoneNumber);
            setIsChecked(department.StatusId == 1 ? true : false);
        }
    }, []);

    function AddDepartment(e) {
        e.preventDefault();
        setIsLoading(true);
        const inputValues = {
            departmentId: department ? department.departmentId : null,
            departmentName: document.getElementById("name").value,
            StateId: selectedState.StateId,
            PostalAddress: document.getElementById("PostalAddress").value,
            PostalSuburb: document.getElementById("PostalSuburb").value,
            PostalPostCode: document.getElementById("PostalPostcode").value,
            StatusId: isChecked ? 1 : 2,
        };

        axios
            .post(`${url}api/GTAM/Add/department`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                setDepartment(null);
                getDepartments();
                setActiveIndex(5);
                setIsLoading(false);
                AlertToast("Saved successfully", 1);
            })
            .catch((err) => {
                AlertToast("Something went wrong", 2);
                setIsLoading(false);
                console.log(err);
            });
    }

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="p-8">
            <div className="p-7 bg-white shadow-md rounded-xl">
                <h1 className="font-bold text-dark text-xl">
                    Create New departments
                </h1>
                <div className="py-4">
                    <form onSubmit={AddDepartment}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-5 py-6">
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Name:
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        id="name"
                                        defaultValue={
                                            department
                                                ? department.departmentName
                                                : ""
                                        }
                                        className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PostalAddress"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Email:
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="Email"
                                        id="Email"
                                        defaultValue={
                                            department
                                                ? department.PostalAddress
                                                : ""
                                        }
                                        className="block  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="branch"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Branch:
                                </label>
                                <div className=" items-center w-full">
                                    <div>
                                        <Listbox
                                            value={selectedState}
                                            onChange={(e) => {
                                                setSelectedState(e);
                                            }}
                                        >
                                            {({ open }) => (
                                                <>
                                                    <div className="relative ">
                                                        <Listbox.Button className="relative  w-full cursor-default rounded-md bg-white py-[0.39rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">
                                                                {
                                                                    selectedState?.BranchName
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
                                                            show={open}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {branches?.map(
                                                                    (branch) => (
                                                                        <Listbox.Option
                                                                            key={
                                                                                branch.BranchId
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
                                                                                branch
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
                                                                                            branch.BranchName
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
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="manager"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Manager:
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="Manager"
                                        id="Manager"
                                        defaultValue={
                                            department
                                                ? department.PostalSuburb
                                                : ""
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-y-1 sm:justify-between sm:items-center">
                                <label
                                    htmlFor="PostalPostcode"
                                    className="block text-sm font-medium leading-6 text-gray-900 w-48"
                                >
                                    Description :
                                </label>
                                <div className="items-center w-full">
                                    <input
                                        required
                                        type="text"
                                        name="Description"
                                        defaultValue={
                                            department
                                                ? department.PostalPostcode
                                                : ""
                                        }
                                        id="Description"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <GtamButton
                                disabled={isLoading}
                                className={"px-8"}
                                name={department ? "Edit" : "Create"}
                                type={"submit"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
