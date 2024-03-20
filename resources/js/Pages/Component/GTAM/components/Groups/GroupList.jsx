import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
    CheckBadgeIcon,
    PencilIcon,
    ShieldCheckIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import GtamButton from "../Buttons/GtamButton";
import { Switch } from "@headlessui/react";
import { useEffect } from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const colors = [
    "bg-pink-600",
    "bg-rose-600",
    "bg-fuchsia-600",
    "bg-purple-600",
    "bg-indigo-600",
    "bg-sky-600",
    "bg-teal-600",
    "bg-green-600",
    "bg-yellow-500",
    "bg-orange-600",
    "bg-red-600",
    "bg-slate-600",
];

export default function GroupList({
    currentUser,
    url,
    setActiveGroup,
    getGroups,
    AlertToast,
    groups,
    nextStep,
}) {
    const [groupsElements, setGroupElements] = useState(groups);
    const [adding, setAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editIndex, setEditIndex] = useState();
    const [groupName, setGroupName] = useState("");
    const [status, setStatus] = useState(1);
    const handleClick = (id, index) => {
        nextStep(2);
        setActiveGroup(index);
        setGroupElements(() =>
            groupsElements?.map((item) => ({
                ...item,
                active: item.GroupId === id ? true : false,
            }))
        );
    };

    useEffect(() => {
        setGroupElements(() =>
            groups?.map((item, index) => ({
                ...item,
                active: index == 0,
                color: colors[Math.floor(Math.random() * colors.length)],
            }))
        );
    }, [groups]);

    function ToggleStatus() {
        if (status == 1) {
            setStatus(2);
        } else {
            setStatus(1);
        }
    }

    function handleCreateGroup(id) {
        setIsLoading(true);
        let group = groupsElements?.find(
            (item) => item.GroupName === groupName
        );
        if (group && group.GroupId != id) {
            AlertToast("Can't use same name", 3);
            setIsLoading(false);
        } else if (groupName == null) {
            AlertToast("insert a role name please", 3);
            setIsLoading(false);
        } else {
            const inputValues = {
                GroupId: id ? id : null,
                GroupName: groupName,
                StatusId: status,
            };

            axios
                .post(`${url}api/GTAM/Add/Group`, inputValues, {
                    headers: {
                        UserId: currentUser.user_id,
                    },
                })
                .then((res) => {
                    setIsLoading(false);
                    AlertToast("Saved successfully", 1);
                    setAdding(false);
                    setEditIndex(null);
                    setGroupName(null);
                    getGroups();

                    // AlertToast("Saved Successfully", 1);
                    // SetIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    AlertToast("Something went wrong", 2);
                    // SetIsLoading(false);
                    // AlertToast("Error please try again.", 2);
                    console.log(err);
                });
        }
    }

    return (
        <div>
            <div className="flex gap-x-2  py-1 px-1 items-center justify-between border-b px-4">
                <p className="px-6 py-2 text-gray-500 text-lg font-bold">
                    Groups
                </p>
                <GtamButton
                    name={adding ? "Cancel" : "Add"}
                    className={"text-[15px] w-[1rem]"}
                    onClick={() => {
                        setAdding(!adding);
                        setStatus(1);
                    }}
                />
            </div>
            <ul role="list" className="">
                {adding ? (
                    <li
                        className={classNames(
                            "",
                            "relative py-4 hover:bg-gray-50"
                        )}
                    >
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto flex  justify-between gap-x-6">
                                <div className="flex min-w-0 gap-x-4 items-center">
                                    <div className="">
                                        <ShieldCheckIcon className="text-dark font-bold h-7" />
                                    </div>
                                    <div className="items-center">
                                        <input
                                            type="text"
                                            name="Group"
                                            id="Group"
                                            onChange={(e) => {
                                                setGroupName(e.target.value);
                                            }}
                                            className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-x-4">
                                    <button
                                        onClick={() => {
                                            handleCreateGroup();
                                        }}
                                    >
                                        <CheckBadgeIcon
                                            className="h-8 w-8  flex-none text-green-600"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ) : null}
                {groupsElements?.map((group, index) => (
                    <li
                        key={group.GroupId}
                        className={classNames(
                            group.active
                                ? "bg-gray-100 border-l-2 border-green-500"
                                : "text-indigo-600",
                            "relative py-4 hover:bg-gray-50"
                        )}
                        onClick={() => {
                            handleClick(group.GroupId, index);
                        }}
                    >
                        {editIndex == group.GroupId ? (
                            <div className="px-4 sm:px-6 lg:px-8">
                                <div className="mx-auto flex  justify-between gap-x-6">
                                    <div className="flex min-w-0 gap-x-4 items-center">
                                        <div className="">
                                            <ShieldCheckIcon className="text-dark font-bold h-7" />
                                        </div>
                                        <div className="items-center">
                                            <input
                                                type="text"
                                                name="editName"
                                                id="editName"
                                                onChange={(e) => {
                                                    setGroupName(
                                                        e.target.value
                                                    );
                                                }}
                                                defaultValue={groupName}
                                                className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-x-4">
                                        <div className="h-full items-center flex ">
                                            <Switch
                                                checked={
                                                    status == 1 ? true : false
                                                }
                                                onChange={() => {
                                                    ToggleStatus();
                                                }}
                                                className={classNames(
                                                    status == 1
                                                        ? "bg-green-600"
                                                        : "bg-gray-200",
                                                    "relative inline-flex h-4 w-10 items-center flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                                                )}
                                            >
                                                <span className="sr-only">
                                                    Use setting
                                                </span>
                                                <span
                                                    className={classNames(
                                                        status == 1
                                                            ? "translate-x-5"
                                                            : "translate-x-0",
                                                        "pointer-events-none relative inline-block h-5 w-5 transform rounded-full shadow-xl bg-gray-100 shadow ring-0 transition duration-200 ease-in-out"
                                                    )}
                                                >
                                                    <span
                                                        className={classNames(
                                                            status == 1
                                                                ? "opacity-0 duration-100 ease-out"
                                                                : "opacity-100 duration-200 ease-in",
                                                            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        <svg
                                                            className="h-3 w-3 text-gray-400"
                                                            fill="none"
                                                            viewBox="0 0 12 12"
                                                        >
                                                            <path
                                                                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        className={classNames(
                                                            status == 1
                                                                ? "opacity-100 duration-200 ease-in"
                                                                : "opacity-0 duration-100 ease-out",
                                                            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        <svg
                                                            className="h-3 w-3 text-green-600"
                                                            fill="currentColor"
                                                            viewBox="0 0 12 12"
                                                        >
                                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                                        </svg>
                                                    </span>
                                                </span>
                                            </Switch>
                                        </div>
                                        <button
                                            className="text-sm text-blue-400 font-semibold flex items-center gap-x-1"
                                            disabled={isLoading}
                                            onClick={() => {
                                                handleCreateGroup(
                                                    group.GroupId
                                                );
                                            }}
                                        >
                                            <CheckBadgeIcon className="h-6 text-green-500" />
                                            {/* <span>Edit</span> */}
                                        </button>
                                        <ChevronRightIcon
                                            className="h-8 w-8  flex-none text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-4 sm:px-6 lg:px-8">
                                <div className="mx-auto flex  justify-between gap-x-6">
                                    <div className="flex min-w-0 gap-x-4 items-center">
                                        <div
                                            className={`text-smooth ${group.color} rounded-full flex justify-center items-center w-10  h-10`}
                                        >
                                            <p>
                                                {" "}
                                                {group.GroupName.substring(
                                                    0,
                                                    2
                                                ).toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-y-0">
                                            {" "}
                                            <div className="items-center">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {group.GroupName}
                                                </p>
                                            </div>
                                            <div className="flex min-w-0 gap-x-4 items-center">
                                                <div className="">
                                                    {group.StatusId == 1 ? (
                                                        <div className="flex items-center gap-x-2">
                                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                            <p className="text-dark text-xs">
                                                                Active
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-x-2">
                                                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                            <p className="text-dark text-xs">
                                                                Inactive
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    className="flex items-center"
                                                    onClick={() => {
                                                        setEditIndex(
                                                            group.GroupId
                                                        );
                                                        setGroupName(
                                                            group.GroupName
                                                        );
                                                        setStatus(
                                                            group.StatusId
                                                        );
                                                    }}
                                                >
                                                    <p className="text-xs text-blue-500">
                                                        Edit
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-x-4">
                                        <ChevronRightIcon
                                            className="h-8 w-8  flex-none text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
