import {
    HomeIcon,
    GlobeAltIcon,
    DocumentMagnifyingGlassIcon,
    PencilIcon,
    UsersIcon,
    ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";
import { Switch, Listbox, Transition } from "@headlessui/react";

import { Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// const Apps = [
//     {
//         id: 0,
//         appName: "GTWA",
//         logo: {
//             bgColor: "bg-gtw1",
//             prColor: "from-gtw1",
//             secColor: "to-gtw2",
//             img: GlobeAltIcon,
//         },
//         status: false,
//         appRole: 1,
//     },
//     {
//         id: 1,
//         appName: "GTRS",
//         logo: {
//             bgColor: "bg-gtrs1",
//             prColor: "from-gtrs1",
//             secColor: "to-gtrs2",
//             img: DocumentMagnifyingGlassIcon,
//         },
//         status: true,
//         appRole: 1,
//     },
//     {
//         id: 2,
//         appName: "GTMS",
//         logo: {
//             bgColor: "bg-gtms1",
//             prColor: "from-gtms1",
//             secColor: "to-gtms2",
//             img: HomeIcon,
//         },
//         status: false,
//         appRole: 1,
//     },
//     {
//         id: 3,
//         appName: "GTAM",
//         logo: {
//             bgColor: "bg-gtam1",
//             prColor: "from-gtam1",
//             secColor: "to-gtam2",
//             img: UsersIcon,
//         },
//         status: true,
//         appRole: 1,
//     },
//     // More people...
// ];

// const Pages = [
//     {
//         id: 0,
//         pages: [
//             {
//                 id: 0,
//                 name: "test1",
//                 imageUrl: DocumentIcon,
//                 active: true,
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,

//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//         ],
//     },
//     {
//         id: 1,
//         pages: [
//             {
//                 id: 0,
//                 name: "test2",
//                 imageUrl: DocumentIcon,
//                 active: true,
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//         ],
//     },
//     {
//         id: 2,
//         pages: [
//             {
//                 id: 0,
//                 name: "test3",
//                 imageUrl: DocumentIcon,
//                 active: true,
//             },
//             {
//                 id: 1,
//                 name: "SEO",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//             {
//                 id: 2,
//                 name: "Blog",
//                 imageUrl: DocumentIcon,
//                 active: false,
//             },
//         ],
//     },
// ];

export default function GroupDetails({
    activeGroup,
    setActiveGroup,
    AlertToast,
    allApps,
    url,
    currentUser,
    appRoles,
    groups,
    getGroups,
    Apps,
    nextStep,
}) {
    const [PagesElements, setPagesElements] = useState();
    const [appElements, setAppElements] = useState(Apps);
    const [editIndex, setEditIndex] = useState(null);
    const [selected, setSelected] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState();
    const [switchStatus, setSwitchStatus] = useState(false);

    // function ToggleStatus(id) {
    //     setAppElements((prevData) =>
    //         prevData.map((item) => ({
    //             ...item,
    //             status: item.id === id ? !item.status : item.status,
    //         }))
    //     );
    // }

    const handleClick = (id) => {
        nextStep(3);
        setActivePage(id);
        setAppElements(() =>
            appElements?.map((item) => ({
                ...item,
                active: item.id === id ? true : false,
            }))
        );
    };
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    useEffect(() => {
        setAppElements(Apps);
    }, [Apps]);
    useEffect(() => {
        setEditIndex(null);
    }, [activeGroup]);
    useEffect(() => {
        setSelectedApp(
            appRoles?.find((item) => editIndex === item.AppId)?.Roles
        );
        setSelected( appRoles?.find((item) => editIndex === item.AppId)?.Roles[0])
    }, [editIndex]);

    function handleEdit(item) {
        setIsLoading(true)
        // console.log(item);
        setEditIndex(item.AppId);

        if (item.Roles) {
            setSelected(
                selectedApp?.find((item) => item.RoleId === item.RoleId)
            );
        } else {
            setSelected(selectedApp[0]);
        }

        if (item.Roles) {
            if (item.Roles[0].StatusId == 1) {
                setSwitchStatus(true);
            } else {
                setSwitchStatus(false);
            }
        } else {
            setSwitchStatus(false);
        }
    }

    const handleCreateGroupRole = (item) => {
        const inputValues = {
            GrpRoleId: item.Roles ? item.Roles[0].GrpRoleId : null,
            GroupId: groups[activeGroup]?.GroupId,
            AppId: item.AppId,
            RoleId: selected.RoleId,
            StatusId: switchStatus ? 1 : 2,
        };
        // console.log(inputValues);
        axios
            .post(`${url}api/GTAM/Add/GroupRoles`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                console.log("done");
                AlertToast("Saved successfully",1)
                setEditIndex(null);
                getGroups();

                // AlertToast("Saved Successfully", 1);
                setIsLoading(false);
            })
            .catch((err) => {
                AlertToast("Something went wrong",2)
                setIsLoading(false);
                // AlertToast("Error please try again.", 2);
                console.log(err);
            });
    };
    // console.log(editIndex);
    return (
        <div>
            <div
                className="bg-gray-100 bg-gray-200 bg-gray-300 bg-gray-400 bg-gray-500 bg-gray-600 bg-gray-700 bg-gray-800 bg-gray-900
                                bg-red-100 bg-red-200 bg-red-300 bg-red-400 bg-red-500 bg-red-600 bg-red-700 bg-red-800 bg-red-900
                                bg-yellow-100 bg-yellow-200 bg-yellow-300 bg-yellow-400 bg-yellow-500 bg-yellow-600 bg-yellow-700 bg-yellow-800 bg-yellow-900
                                bg-green-100 bg-green-200 bg-green-300 bg-green-400 bg-green-500 bg-green-600 bg-green-700 bg-green-800 bg-green-900
                                bg-teal-100 bg-teal-200 bg-teal-300 bg-teal-400 bg-teal-500 bg-teal-600 bg-teal-700 bg-teal-800 bg-teal-900
                                bg-sky-100 bg-sky-200 bg-sky-300 bg-sky-400 bg-sky-500 bg-sky-600 bg-sky-700 bg-sky-800 bg-sky-900
                                bg-amber-100 bg-amber-200 bg-amber-300 bg-amber-400 bg-amber-500 bg-amber-600 bg-amber-700 bg-amber-800 bg-amber-900
                                bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900
                                bg-indigo-100 bg-indigo-200 bg-indigo-300 bg-indigo-400 bg-indigo-500 bg-indigo-600 bg-indigo-700 bg-indigo-800 bg-indigo-900
                                bg-purple-100 bg-purple-200 bg-purple-300 bg-purple-400 bg-purple-500 bg-purple-600 bg-purple-700 bg-purple-800 bg-purple-900
                                bg-pink-100 bg-pink-200 bg-pink-300 bg-pink-400 bg-pink-500 bg-pink-600 bg-pink-700 bg-pink-800 bg-pink-900 hidden"
            ></div>
            <div
                className="from-gray-100 from-gray-200 from-gray-300 from-gray-400 from-gray-500 from-gray-600 from-gray-700 from-gray-800 from-gray-900
                            from-red-100 from-red-200 from-red-300 from-red-400 from-red-500 from-red-600 from-red-700 from-red-800 from-red-900
                            from-yellow-100 from-yellow-200 from-yellow-300 from-yellow-400 from-yellow-500 from-yellow-600 from-yellow-700 from-yellow-800 from-yellow-900
                            from-green-100 from-green-200 from-green-300 from-green-400 from-green-500 from-green-600 from-green-700 from-green-800 from-green-900
                            from-teal-100 from-teal-200 from-teal-300 from-teal-400 from-teal-500 from-teal-600 from-teal-700 from-teal-800 from-teal-900
                            from-sky-100 from-sky-200 from-sky-300 from-sky-400 from-sky-500 from-sky-600 from-sky-700 from-sky-800 from-sky-900
                            from-amber-100 from-amber-200 from-amber-300 from-amber-400 from-amber-500 from-amber-600 from-amber-700 from-amber-800 from-amber-900
                            from-blue-100 from-blue-200 from-blue-300 from-blue-400 from-blue-500 from-blue-600 from-blue-700 from-blue-800 from-blue-900
                            from-indigo-100 from-indigo-200 from-indigo-300 from-indigo-400 from-indigo-500 from-indigo-600 from-indigo-700 from-indigo-800 from-indigo-900
                            from-purple-100 from-purple-200 from-purple-300 from-purple-400 from-purple-500 from-purple-600 from-purple-700 from-purple-800 from-purple-900
                            from-pink-100 from-pink-200 from-pink-300 from-pink-400 from-pink-500 from-pink-600 from-pink-700 from-pink-800 from-pink-900 hidden"
            ></div>
            <div
                className="to-gray-100 to-gray-200 to-gray-300 to-gray-400 to-gray-500 to-gray-600 to-gray-700 to-gray-800 to-gray-900
                            to-red-100 to-red-200 to-red-300 to-red-400 to-red-500 to-red-600 to-red-700 to-red-800 to-red-900
                            to-yellow-100 to-yellow-200 to-yellow-300 to-yellow-400 to-yellow-500 to-yellow-600 to-yellow-700 to-yellow-800 to-yellow-900
                            to-green-100 to-green-200 to-green-300 to-green-400 to-green-500 to-green-600 to-green-700 to-green-800 to-green-900
                            to-teal-100 to-teal-200 to-teal-300 to-teal-400 to-teal-500 to-teal-600 to-teal-700 to-teal-800 to-teal-900
                            to-sky-100 to-sky-200 to-sky-300 to-sky-400 to-sky-500 to-sky-600 to-sky-700 to-sky-800 to-sky-900
                            to-amber-100 to-amber-200 to-amber-300 to-amber-400 to-amber-500 to-amber-600 to-amber-700 to-amber-800 to-amber-900
                            to-blue-100 to-blue-200 to-blue-300 to-blue-400 to-blue-500 to-blue-600 to-blue-700 to-blue-800 to-blue-900
                            to-indigo-100 to-indigo-200 to-indigo-300 to-indigo-400 to-indigo-500 to-indigo-600 to-indigo-700 to-indigo-800 to-indigo-900
                            to-purple-100 to-purple-200 to-purple-300 to-purple-400 to-purple-500 to-purple-600 to-purple-700 to-purple-800 to-purple-900
                            to-pink-100 to-pink-200 to-pink-300 to-pink-400 to-pink-500 to-pink-600 to-pink-700 to-pink-800 to-pink-900 hidden"
            ></div>
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="">
                    <tr className="">
                        <th
                            scope="col"
                            className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 "
                        >
                            Apps
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                            App role
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                        >
                            Status
                        </th>

                        <th
                            scope="col"
                            className="relative py-4 pl-3 pr-4 sm:pr-0"
                        >
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {appElements?.map((app) => (
                        <tr key={app.AppId}>
                            <td className="whitespace-nowrap w-60 py-3 pl-4 pr-3 text-sm">
                                <div className="flex items-center">
                                    <div
                                        className={`bg-gradient-to-b from-${
                                            allApps?.find(
                                                (item) =>
                                                    item.AppId === app.AppId
                                            )?.Colors[0].ColorName
                                        } to-${
                                            allApps?.find(
                                                (item) =>
                                                    item.AppId === app.AppId
                                            )?.Colors[1].ColorName
                                        } rounded-full w-auto p-2`}
                                    >
                                        <HomeIcon className="h-5 text-smooth" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-gray-900">
                                            {
                                                allApps?.find(
                                                    (item) =>
                                                        item.AppId === app.AppId
                                                )?.AppAbv
                                            }
                                        </div>
                                    </div>
                                </div>
                            </td>{" "}
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                {editIndex == app.AppId ? (
                                    <div className="flex min-w-0 gap-x-4 items-center">
                                        <div className="">
                                            <ShieldCheckIcon className="text-sky-400 font-bold h-7" />
                                        </div>
                                        <div className="items-center w-full">
                                            <Listbox
                                                value={selected}
                                                onChange={setSelected}
                                            >
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative w-full">
                                                            <Listbox.Button className="relative w-full h-full cursor-default rounded-md bg-white py-[0.1rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                <span className="block truncate h-full">
                                                                    {
                                                                        selected?.RoleName
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
                                                                <Listbox.Options className="absolute z-10 mt-0 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    {selectedApp?.map(
                                                                        (
                                                                            role
                                                                        ) => (
                                                                            <Listbox.Option
                                                                                key={
                                                                                    role.RoleId
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
                                                                                    role
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
                                                                                                role.RoleName
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
                                ) : (
                                    <>
                                        <div className="flex min-w-0 gap-x-4 items-center">
                                            <div className="">
                                                <ShieldCheckIcon className="text-sky-400 font-bold h-7" />
                                            </div>
                                            {app.Roles ? (
                                                <div className="items-center">
                                                    <p className="text-sm w-full font-semibold leading-6 text-gray-900">
                                                        {app.Roles[0].RoleName}
                                                    </p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                {editIndex == app.AppId ? (
                                    <div className="">
                                        <div className="h-full items-center flex ">
                                            <Switch
                                                checked={switchStatus}
                                                onChange={() => {
                                                    setSwitchStatus(
                                                        !switchStatus
                                                    );
                                                }}
                                                className={classNames(
                                                    switchStatus
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
                                                        switchStatus
                                                            ? "translate-x-5"
                                                            : "translate-x-0",
                                                        "pointer-events-none relative inline-block h-5 w-5 transform rounded-full shadow-xl bg-gray-100 shadow ring-0 transition duration-200 ease-in-out"
                                                    )}
                                                >
                                                    <span
                                                        className={classNames(
                                                            switchStatus
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
                                                            switchStatus
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
                                    </div>
                                ) : (
                                    <div className="h-full items-center flex ">
                                        {app.Roles ? (
                                            app.Roles[0]?.StatusId == 1 ? (
                                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-700">
                                                    Inactive
                                                </span>
                                            )
                                        ) : (
                                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td className="relative whitespace-nowrap py-3 pl-3 pr-8 text-right text-sm font-medium ">
                                {editIndex == app.AppId ? (
                                    <div className="">
                                        <button
                                            disabled={!isLoading}
                                            onClick={() => {
                                                handleCreateGroupRole(app);
                                            }}
                                            className="text-green-600 px-2 hover:text-blue-900"
                                        >
                                            Save
                                        </button>
                                        <a
                                            href="#"
                                            onClick={() => {
                                                setEditIndex(null);
                                            }}
                                            className="text-gray-600 hover:text-blue-900"
                                        >
                                            Cancel
                                        </a>
                                    </div>
                                ) : (
                                    <a
                                        href="#"
                                        onClick={() => {
                                            handleEdit(app);
                                        }}
                                        className="text-gray-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <ul role="list" className="">
                {PagesElements.map((page) => (
                    <li
                        key={page.id}
                        className={classNames(
                            page.active
                                ? ""
                                : "",
                            "relative py-3 "
                        )}
                        onClick={() => {
                            handleClick(page.id);
                        }}
                    >
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto flex  justify-between gap-x-6">
                                <div className="flex min-w-0 gap-x-4 items-center">
                                    <page.imageUrl className="h-7 w-7 flex-none rounded-full text-teal-500" />
                                    <div className="items-center">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                            {page.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul> */}
        </div>
    );
}
