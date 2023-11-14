import { useState } from "react";
import {
    DocumentIcon,
    ChevronDownIcon,
    TrashIcon,
    PencilIcon,
    InboxArrowDownIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import { useEffect } from "react";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import GtamButton from "./Buttons/GtamButton";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const sidebarNavigation = [
    {
        PageId: 0,
        PageName: "dashboard",
        StatusId: 1,
        adding: false,
        role: [""],
    },
    {
        PageId: 1,
        PageName: "Employees",
        StatusId: 1,
        adding: true,
        role: ["1"],
    },
    {
        PageId: 3,
        PageName: "Roles",
        StatusId: 1,
        adding: false,
        Features: [
            {
                FeatureId: 0,
                FeatureName: "Get",
                StatusId: false,
            },
            {
                FeatureId: 1,
                FeatureName: "Edit",
                StatusId: false,
            },
        ],
        // func: setActiveIndexGTRS,
    },
    {
        PageId: 4,
        PageName: "Apps",
        StatusId: 1,
        adding: false,
        Features: [
            {
                FeatureId: 0,
                FeatureName: "Get",
                StatusId: 1,
            },
            {
                FeatureId: 1,
                FeatureName: "Edit",
                StatusId: 2,
            },
        ],
    },

    // { name: 'Settings', href: '#', icon: CogIcon, current: false },
];
export default function GtamAccordion({
    handleAddPage,
    addPage,
    AlertToast,
    pages,
    application,
    currentUser,
    getFeatures,
    getRoles,
    url,
}) {
    const [pageElements, setPageElements] = useState(pages);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setPageElements(pages);
        setPageElements((prevData) =>
            prevData?.map((item) => ({
                ...item,
                adding: false,
            }))
        );
    }, [pages]);
    const handleSetActivePage = (id) => {
        // setactivePage(id);
        setPageElements((prevData) =>
            prevData.map((item) => ({
                ...item,
                current: item.id === id ? true : false,
            }))
        );
    };

    function SetAdd(id) {
        setPageElements((prevData) =>
            prevData.map((item) => ({
                ...item,
                adding: item.PageId === id ? true : false,
            }))
        );
    }
    function CancelAdd() {
        setPageElements((prevData) =>
            prevData.map((item) => ({
                ...item,
                adding: false,
            }))
        );
    }

    function handleEdit(optionId, itemId) {
        setEditIndex(optionId);
        setEditPageIndex(itemId);
    }

    function handleCancelEdit() {
        setEditIndex(null);
        setEditPageIndex(null);
    }

    function handleCancelEditPage() {
        setPageEditIndex(null);
    }

    function EditPage(PageId, status) {
        setIsLoading(true);
        let name = document.getElementById("EditPage").value;

        if (pageElements?.find((item) => item.PageName === name)) {
            console.log("no");
            AlertToast("Can't use same name", 3);
        } else {
            const inputValues = {
                AppId: application.AppId,
                PageId: PageId,
                PageName: name,
                StatusId: status,
            };
            console.log(inputValues);
            axios
                .post(`${url}api/GTAM/Add/AppPage`, inputValues, {
                    headers: {
                        UserId: currentUser.user_id,
                    },
                })
                .then((res) => {
                    console.log("done");
                    AlertToast("Saved successfully", 1);
                    getFeatures();
                    getRoles();
                    setIsLoading(false);
                    setPageEditIndex(null);
                    // AlertToast("Saved Successfully", 1);
                })
                .catch((err) => {
                    setIsLoading(false);
                    AlertToast("Something went wrong", 2);
                    // AlertToast("Error please try again.", 2);
                    console.log(err);
                });
        }
    }

    function EditPageStatus(PageId, status) {
        setIsLoading(true);
        let name = document.getElementById("EditPage").value;

        const inputValues = {
            AppId: application.AppId,
            PageId: PageId,
            PageName: name,
            StatusId: status,
        };
        console.log(inputValues);
        axios
            .post(`${url}api/GTAM/Add/AppPage`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                console.log("done");
                setIsLoading(false);
                AlertToast("Saved successfully", 1);
                getFeatures();
                getRoles();
                setPageEditIndex(null);
            })
            .catch((err) => {
                setIsLoading(false);
                AlertToast("Something went wrong", 2);
                console.log(err);
            });
    }

    function CreatePage() {
        setIsLoading(true);
        let name = document.getElementById("PageName").value;

        if (pageElements?.find((item) => item.PageName === name)) {
            AlertToast("Can't use same name", 3);
            setIsLoading(false);
        } else {
            const inputValues = {
                AppId: application.AppId,
                PageId: null,
                PageName: name,
                StatusId: 1,
            };
            console.log(inputValues);
            axios
                .post(`${url}api/GTAM/Add/AppPage`, inputValues, {
                    headers: {
                        UserId: currentUser.user_id,
                    },
                })
                .then((res) => {
                    setIsLoading(false);
                    console.log("done");
                    AlertToast("Saved successfully", 1);
                    getFeatures();
                    getRoles();
                    handleAddPage();
                })
                .catch((err) => {
                    setIsLoading(false);
                    AlertToast("Something went wrong", 2);
                    console.log(err);
                });
        }
    }

    function AddFeature(pageId) {
        setIsLoading(true);
        const inputValues = {
            AppId: application.AppId,
            PageId: pageId,
            FeatureName: document.getElementById(pageId).value,
            StatusId: 1,
            FeatureId: null,
        };
        console.log(inputValues);
        axios
            .post(`${url}api/GTAM/Add/AppFeatures`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                setIsLoading(false);
                console.log("done");
                AlertToast("Saved successfully", 1);
                getFeatures();
                getRoles();
                // AlertToast("Saved Successfully", 1);
                // SetIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                AlertToast("Something went wrong", 2);
                console.log(err);
            });
    }

    function EditFeature(pageId, FeatureId, status) {
        setIsLoading(true);
        const inputValues = {
            AppId: application.AppId,
            PageId: pageId,
            FeatureName: document.getElementById("EditFeature").value,
            StatusId: status,
            FeatureId: FeatureId,
        };
        console.log(inputValues);
        axios
            .post(`${url}api/GTAM/Add/AppFeatures`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                setIsLoading(false);
                console.log("done");
                AlertToast("Saved successfully", 1);
                getFeatures();
                getRoles();
                handleCancelEdit();
            })
            .catch((err) => {
                setIsLoading(false);
                handleCancelEdit();
                AlertToast("Something went wrong", 2);
                console.log(err);
            });
    }

    function AddSecFeature(pageId, features) {
        setIsLoading(true);
        let name = document.getElementById("AddFeature").value;

        if (features?.find((item) => item.FeatureName === name)) {
            AlertToast("Can't use same name", 3);
            setIsLoading(false);
        } else {
            const inputValues = {
                AppId: application.AppId,
                PageId: pageId,
                FeatureName: name,
                StatusId: 1,
                FeatureId: null,
            };
            console.log(inputValues);
            axios
                .post(`${url}api/GTAM/Add/AppFeatures`, inputValues, {
                    headers: {
                        UserId: currentUser.user_id,
                    },
                })
                .then((res) => {
                    console.log("done");
                    AlertToast("Saved successfully", 1);
                    CancelAdd();
                    getFeatures();
                    getRoles();
                    setIsLoading(false);
                })
                .catch((err) => {
                    AlertToast("Something went wrong", 2);
                    setIsLoading(false);
                    console.log(err);
                });
        }
    }

    const current_user_role = 1;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState();
    const [editPageIndex, setEditPageIndex] = useState();
    const [pageEditIndex, setPageEditIndex] = useState();

    return (
        <div>
            <div className=" flex gap-x-3 items-center">
                <div className="w-full flex justify-between items-center" >
                    <div className="py-1 gap-x-2 flex justify-between items-center">
                        <div
                            className={`bg-gradient-to-b from-${application.Colors[0].ColorName} to-${application.Colors[1].ColorName} rounded-xl w-auto p-3`}
                        >
                            <img
                                src={`AppLogo/${application.AppPic}`}
                                alt=""
                                className="h-5 w-5"
                            />
                        </div>
                        <h1 className="font-bold text-xl ">
                            {application.AppAbv}
                        </h1>
                    </div>
                    <div>
                        <GtamButton
                            name={addPage ? "Cancel" : "New Page"}
                            className={""}
                            onClick={handleAddPage}
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-1 relative ml-5">
                <div className="h-full border border-dashed absolute"></div>
                {addPage ? (
                    <Accordion
                        transition={{
                            duration: "300ms",
                            timingFunction: "cubic-bezier(0, 0, 0.2, 1)",
                        }}
                    >
                        <AccordionItem>
                            {({ open }) => (
                                <div className="flex items-center">
                                    <div className="w-4 h-0 border border-dashed "></div>
                                    <div className="bg-gray-50 w-full rounded-md px-1">
                                        <div className="flex">
                                            <AccordionHeader
                                                className={classNames(
                                                    "group py-2 px-0 rounded-md flex gap-x-2 items-center text-sm font-medium w-full flex justify-between items-center text-gray-600  p-4"
                                                )}
                                            >
                                                <div className="flex gap-x-1 items-center">
                                                    <ChevronDownIcon className="h-3" />

                                                    <DocumentIcon
                                                        className={classNames(
                                                            "text-teal-600 ",
                                                            "h-5 w-5"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    <input
                                                        type="text"
                                                        name=""
                                                        id="PageName"
                                                        className="block w-full rounded-md border-0 py-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </AccordionHeader>
                                            <button
                                                className="z-10 text-xs font-semibold text-gray-900 w-auto mr-2"
                                                disabled={isLoading}
                                                onClick={() => {
                                                    CreatePage();
                                                }}
                                            >
                                                +Add
                                            </button>
                                        </div>
                                        <AccordionBody className="pl-7 relative">
                                            <div className="h-full border border-dashed absolute"></div>
                                        </AccordionBody>
                                    </div>
                                </div>
                            )}
                        </AccordionItem>
                    </Accordion>
                ) : null}
                {pageElements?.map((item, index) => (
                    <Accordion
                        key={item.PageId}
                        transition={{
                            duration: "300ms",
                            timingFunction: "cubic-bezier(0, 0, 0.2, 1)",
                        }}
                    >
                        <AccordionItem>
                            {({ open }) => (
                                <div className="flex items-center">
                                    <div
                                        className={classNames(
                                            item.StatusId == 1
                                                ? ""
                                                : "border-red-400",
                                            "w-4 h-0 border border-dashed "
                                        )}
                                    ></div>
                                    <div className="bg-gray-50 w-full rounded-md px-1">
                                        {item.PageId == pageEditIndex ? (
                                            <div className="flex">
                                                <AccordionHeader
                                                    className={classNames(
                                                        "text-gray-400 ",
                                                        "group py-2 px-0 rounded-md flex gap-x-2 items-center text-sm font-medium w-full flex justify-between items-center text-gray-600  p-4"
                                                    )}
                                                >
                                                    <div className="flex gap-x-1 items-center">
                                                        <ChevronDownIcon className="h-3" />

                                                        <DocumentIcon
                                                            className={classNames(
                                                                item.StatusId ==
                                                                    1
                                                                    ? "text-teal-600 "
                                                                    : "text-red-500 ",
                                                                "h-5 w-5"
                                                            )}
                                                            aria-hidden="true"
                                                        />

                                                        <input
                                                            type="text"
                                                            name="EditPage"
                                                            id="EditPage"
                                                            defaultValue={
                                                                item.PageName
                                                            }
                                                            className="block w-full rounded-md border-0 py-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </AccordionHeader>
                                                <div className="flex gap-x-2 mr-10">
                                                    <button
                                                        className="text-sm text-green-500 flex items-center gap-x-1  font-semibold "
                                                        disabled={isLoading}
                                                        onClick={() => {
                                                            EditPage(
                                                                item.PageId,
                                                                1
                                                            );
                                                        }}
                                                    >
                                                        <InboxArrowDownIcon className="h-4" />
                                                        <span>Save</span>
                                                    </button>
                                                    {item.StatusId == 1 ? (
                                                        <button
                                                            className="text-sm text-red-400 font-semibold flex items-center gap-x-1"
                                                            disabled={isLoading}
                                                            onClick={() => {
                                                                EditPageStatus(
                                                                    item.PageId,
                                                                    2
                                                                );
                                                            }}
                                                        >
                                                            <TrashIcon className="h-4" />
                                                            <span>
                                                                Deactivate
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="text-sm text-green-500 font-semibold flex items-center gap-x-1"
                                                            disabled={isLoading}
                                                            onClick={() => {
                                                                EditPageStatus(
                                                                    item.PageId,
                                                                    1
                                                                );
                                                            }}
                                                        >
                                                            <CheckBadgeIcon className="h-4" />
                                                            <span>
                                                                activate
                                                            </span>
                                                        </button>
                                                    )}

                                                    <button
                                                        className="text-sm text-red-400 font-semibold  flex items-center gap-x-1  font-semibold "
                                                        onClick={
                                                            handleCancelEditPage
                                                        }
                                                    >
                                                        <XCircleIcon className="h-4" />
                                                        <span>Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex">
                                                <AccordionHeader
                                                    className={classNames(
                                                        "text-gray-400 ",
                                                        "group py-2 px-0 rounded-md flex gap-x-2 items-center text-sm font-medium w-full flex justify-between items-center text-gray-600  p-4"
                                                    )}
                                                >
                                                    <div className="flex gap-x-1 items-center">
                                                        <ChevronDownIcon className="h-3" />

                                                        <DocumentIcon
                                                            className={classNames(
                                                                item.StatusId ==
                                                                    1
                                                                    ? "text-teal-600 "
                                                                    : "text-red-500 ",
                                                                "h-5 w-5"
                                                            )}
                                                            aria-hidden="true"
                                                        />

                                                        <span
                                                            className={classNames(
                                                                item.StatusId ==
                                                                    1
                                                                    ? " "
                                                                    : "text-red-500 ",
                                                                ""
                                                            )}
                                                        >
                                                            {item.PageName}
                                                        </span>
                                                    </div>
                                                </AccordionHeader>
                                                <div className="flex gap-x-2">
                                                    <button
                                                        className="text-sm text-blue-400 font-semibold mr-2 flex items-center gap-x-1"
                                                        onClick={() => {
                                                            setPageEditIndex(
                                                                item.PageId
                                                            );
                                                        }}
                                                    >
                                                        <PencilIcon className="h-4" />
                                                        <span>Edit</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {item.Features ? (
                                            <AccordionBody className="pl-7 relative">
                                                <div className="h-full border border-dashed absolute"></div>
                                                <div className="w-full flex justify-start py-1 px-3">
                                                    <button
                                                        className="z-10 text-xs text-gray-400 w-24 mr-8"
                                                        onClick={() => {
                                                            SetAdd(item.PageId);
                                                        }}
                                                    >
                                                        +New Feature
                                                    </button>
                                                </div>
                                                {item.adding ? (
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-0 border border-dashed"></div>
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center">
                                                                <StarIcon className="h-4 w-4 text-yellow-400" />
                                                                <button className="p-2 font-light text-left text-xs text-dark">
                                                                    <input
                                                                        type="text"
                                                                        name="AddFeature"
                                                                        id="AddFeature"
                                                                        className="block w-full rounded-md border-0 py-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    />
                                                                </button>
                                                            </div>
                                                            <div className="flex gap-x-2 mr-10">
                                                                <button
                                                                    className="text-sm text-green-500 flex items-center gap-x-1  font-semibold "
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                    onClick={() => {
                                                                        AddSecFeature(
                                                                            item.PageId,
                                                                            item.Features
                                                                        );
                                                                    }}
                                                                >
                                                                    <InboxArrowDownIcon className="h-4" />
                                                                    <span>
                                                                        Save
                                                                    </span>
                                                                </button>
                                                                <button
                                                                    className="text-sm text-red-400 font-semibold  flex items-center gap-x-1  font-semibold "
                                                                    onClick={
                                                                        CancelAdd
                                                                    }
                                                                >
                                                                    <XCircleIcon className="h-4" />
                                                                    <span>
                                                                        Cancel
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {item.Features?.map(
                                                    (option) => (
                                                        <div>
                                                            {editIndex ==
                                                                option.FeatureId &&
                                                            editPageIndex ==
                                                                item.PageId ? (
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className={classNames(
                                                                            option.StatusId ==
                                                                                1
                                                                                ? ""
                                                                                : "border-red-400",
                                                                            "w-4 h-0 border border-dashed "
                                                                        )}
                                                                    ></div>
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <div className="flex items-center">
                                                                            <StarIcon
                                                                                className={classNames(
                                                                                    option.StatusId ==
                                                                                        1
                                                                                        ? "text-yellow-400"
                                                                                        : "text-red-500",
                                                                                    "h-4 w-4 "
                                                                                )}
                                                                            />
                                                                            <button
                                                                                className={classNames(
                                                                                    option.StatusId ==
                                                                                        1
                                                                                        ? "text-dark"
                                                                                        : "text-gray-500",
                                                                                    " p-2 font-light text-left text-xs "
                                                                                )}
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    name="EditFeature"
                                                                                    id="EditFeature"
                                                                                    defaultValue={
                                                                                        option.FeatureName
                                                                                    }
                                                                                    className="block w-full rounded-md border-0 py-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <div className="flex gap-x-2 mr-10">
                                                                            <button
                                                                                className="text-sm text-green-500 flex items-center gap-x-1  font-semibold "
                                                                                disabled={
                                                                                    isLoading
                                                                                }
                                                                                onClick={() => {
                                                                                    EditFeature(
                                                                                        item.PageId,
                                                                                        option.FeatureId,
                                                                                        1
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <InboxArrowDownIcon className="h-4" />
                                                                                <span>
                                                                                    Save
                                                                                </span>
                                                                            </button>
                                                                            {option.StatusId ==
                                                                            1 ? (
                                                                                <button
                                                                                    className="text-sm text-red-400 font-semibold flex items-center gap-x-1"
                                                                                    disabled={
                                                                                        isLoading
                                                                                    }
                                                                                    onClick={() => {
                                                                                        EditFeature(
                                                                                            item.PageId,
                                                                                            option.FeatureId,
                                                                                            2
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <TrashIcon className="h-4" />
                                                                                    <span>
                                                                                        Deactivate
                                                                                    </span>
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    className="text-sm text-green-500 font-semibold flex items-center gap-x-1"
                                                                                    disabled={
                                                                                        isLoading
                                                                                    }
                                                                                    onClick={() => {
                                                                                        EditFeature(
                                                                                            item.PageId,
                                                                                            option.FeatureId,
                                                                                            1
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <CheckBadgeIcon className="h-4" />
                                                                                    <span>
                                                                                        activate
                                                                                    </span>
                                                                                </button>
                                                                            )}

                                                                            <button
                                                                                className="text-sm text-red-400 font-semibold  flex items-center gap-x-1  font-semibold "
                                                                                onClick={
                                                                                    handleCancelEdit
                                                                                }
                                                                            >
                                                                                <XCircleIcon className="h-4" />
                                                                                <span>
                                                                                    Cancel
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className={classNames(
                                                                            option.StatusId ==
                                                                                1
                                                                                ? ""
                                                                                : "border-red-400",
                                                                            "w-4 h-0 border border-dashed "
                                                                        )}
                                                                    ></div>
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <div className="flex items-center">
                                                                            <StarIcon
                                                                                className={classNames(
                                                                                    option.StatusId ==
                                                                                        1
                                                                                        ? "text-yellow-400"
                                                                                        : "text-red-500",
                                                                                    "h-4 w-4 "
                                                                                )}
                                                                            />
                                                                            <button
                                                                                className={classNames(
                                                                                    option.StatusId ==
                                                                                        1
                                                                                        ? "text-dark"
                                                                                        : "text-gray-500",
                                                                                    " p-2 font-light text-left text-xs "
                                                                                )}
                                                                            >
                                                                                {
                                                                                    option.FeatureName
                                                                                }
                                                                            </button>
                                                                        </div>
                                                                        <div className="flex gap-x-2 mr-10">
                                                                            <button
                                                                                className="text-sm text-blue-400 font-semibold flex items-center gap-x-1"
                                                                                onClick={() => {
                                                                                    handleEdit(
                                                                                        option.FeatureId,
                                                                                        item.PageId
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <PencilIcon className="h-4" />
                                                                                <span>
                                                                                    Edit
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </AccordionBody>
                                        ) : (
                                            <AccordionBody className="pl-7 relative">
                                                <div className="h-full border border-dashed absolute"></div>

                                                <div className="flex items-center">
                                                    <div className="w-4 h-0 border border-dashed"></div>
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center">
                                                            <StarIcon className="h-4 w-4 text-yellow-400" />
                                                            <button className="p-2 font-light text-left text-xs text-dark">
                                                                <input
                                                                    type="text"
                                                                    name="FeatureName"
                                                                    id={
                                                                        item.PageId
                                                                    }
                                                                    className="block w-full rounded-md border-0 py-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="flex gap-x-2 mr-10">
                                                            <button
                                                                className="text-sm text-green-500 flex items-center gap-x-1  font-semibold "
                                                                disabled={
                                                                    isLoading
                                                                }
                                                                onClick={() => {
                                                                    AddFeature(
                                                                        item.PageId
                                                                    );
                                                                }}
                                                            >
                                                                <InboxArrowDownIcon className="h-4" />
                                                                <span>
                                                                    Save
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionBody>
                                        )}
                                    </div>
                                </div>
                            )}
                        </AccordionItem>
                    </Accordion>
                    // </Link>
                ))}
            </div>
        </div>
    );
}
