import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import SupportModal from "@/Pages/Component/modals/SupportModal";
import { Dialog, Transition } from "@headlessui/react";
import {
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    QuestionMarkCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import tiger from "../assets/pictures/tiger.png";

export default function MainSidebar({
    allowedApplications,
    setMobileMenuOpen,
    mobileMenuOpen,
    setactivePage,
    currentUser,
    setActiveIndexGTRS,
    user,
}) {
    const navigation = [
        {
            id: 0,
            name: "Dashboard",
            href: "#",
            current: true,
            feature: "Dashboard_view",
        },
        {
            id: 1,
            name: "Consignments",
            href: "#",
            current: false,
            feature: "ConsignmetsReport_view",
        },
        {
            id: 2,
            name: "KPI Report",
            href: "#",
            current: false,
            options: [
                {
                    id: 17,
                    name: "KPI",
                    href: "#",
                    current: false,
                    feature: "KPI_view",
                },
                {
                    id: 18,
                    name: "Transit Days",
                    href: "#",
                    current: false,
                    feature: "View_TransitDays",
                },
                {
                    id: 13,
                    name: "Holidays",
                    href: "#",
                    current: false,
                    feature: "View_Holidays",
                },
                {
                    id: 14,
                    name: "KPI Reasons",
                    href: "#",
                    current: false,
                    feature: "View_kpiReasons",
                },
            ],
            feature: "KPI",
        },
        {
            id: 4,
            name: "Performance Report",
            href: "#",
            current: false,
            feature: "Performance_view",
        },
        {
            id: 5,
            name: "Failed Consignments",
            href: "#",
            current: false,
            feature: "View_failedConsignment",
        },
        {
            id: 16,
            name: "Transport Report",
            href: "#",
            current: false,
            feature: "View_Transport",
        },
        {
            id: 9,
            name: "RDD",
            href: "#",
            current: false,
            feature: "View_RDD",
        },
        {
            id: 11,
            name: "Missing POD",
            href: "#",
            current: false,
            feature: "MissingPOD_view",
        },
        {
            id: 10,
            name: "Safety",
            href: "#",
            current: false,
            feature: "View_safety",
        },
        {
            id: 6,
            name: "No Delivery info.",
            href: "#",
            current: false,
            feature: "NoDeliveryInfo_view",
        },
        {
            id: 7,
            name: "Additional Charges",
            href: "#",
            current: false,
            feature: "AdditionalCharges_view",
        },
        {
            id: 8,
            name: "Driver Login",
            href: "#",
            current: false,
            feature: "DriverLogin_view",
        },
        {
            id: 20,
            name: "Unilever KPI Pack",
            href: "#",
            current: false,
            feature: "UnileverReport_View",
        },
        {
            id: 22,
            name: "Real Food KPI Pack",
            href: "#",
            current: false,
            feature: "RealFoodReport_View",
        },
        {
            id: 21,
            name: "Delivery Report",
            href: "#",
            options: [
                {
                    id: 24,
                    name: "Delivery Report",
                    href: "#",
                    current: false,
                    feature: "DeliveryReport_View",
                },
                {
                    id: 25,
                    name: "Excel Delivery Report",
                    href: "#",
                    current: false,
                    feature: "ExcelTable_View",
                },
                {
                    id: 26,
                    name: "Comments",
                    href: "#",
                    current: false,
                    feature: "CommentsTable_View",
                },
            ],
            current: false,
            feature: "DeliveryReport_View",
        },
        {
            id: 23,
            name: "SOH Report",
            href: "#",
            current: false,
            feature: "StockReport_View",
        },
        {
            id: 27,
            name: "Contacts Report",
            href: "#",
            current: false,
            feature: "ContactsRep_View",
        },
    ];
    const currentAppId = window.Laravel.appId;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sidebarElements, setSidebarElements] = useState([]);

    const handleClick = (index) => {
        if (index == 5 || index == 6) {
            setMobileMenuOpen(false);
        } else {
            setactivePage(index);
            setMobileMenuOpen(false);
            const updatedElements = sidebarNavigation.map((element) => {
                if (element.id === index) {
                    return { ...element, current: true };
                } else {
                    return { ...element, current: false };
                }
            });
            setSidebarElements(updatedElements);
        }
    };

    const handleClickSide = (index, tabind) => {
        setActiveIndexGTRS(index);
        setMobileMenuOpen(false);
        const updatedElements = sidebarElements.map((element) => {
            if (element.id === index) {
                element?.options.map((option) => {
                    if (option.id == tabind) {
                        option.current = true;
                    }
                });
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setSidebarElements(updatedElements);
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    const handleEditClick = () => {
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        const isLoggingOut = true;
        axios
            .post("/logoutAPI", isLoggingOut)
            .then((response) => {
                if (response.status == 200) {
                    window.location.href = "/";
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    function moveToHead(array, id) {
        // Find the index of the object with the matching AppId
        const index = array.findIndex((item) => item.AppId == id);
        // If the item is found and it's not already the first item
        if (index > 0) {
            // Remove the item from the array
            const [item] = array.splice(index, 1);
            // Add the item to the beginning of the array
            array.unshift(item);
        }
        return array;
    }
    const handleMenuSide = (item) => {
        if (item?.options?.length == 0) {
            window.location.href = item?.href;
        }
    };
    moveToHead(allowedApplications, 3);

    const filterNavigation = (navigationitems, user) => {
        return navigationitems.filter((navItem) => {
            
            // Check if the navigation item has sub-options
            if (navItem.options) {
                // Filter options based on user permissions
                navItem.options = navItem.options.filter((option) =>
                    user?.Pages?.some(
                        (userPage) =>
                            userPage?.PageName === option.name &&
                            userPage?.Features?.some(
                                (feature) =>
                                    feature.FunctionName === option.feature
                            )
                    )
                );
                // Include the navigation item only if it has any permitted options
                return navItem.options.length > 0;
            } else {
                // For navigation items without options, check the feature directly
                return user?.Pages?.some(
                    (userPage) =>
                        userPage?.PageName === navItem.name &&
                        userPage?.Features?.some(
                            (feature) =>
                                feature?.FunctionName === navItem?.feature
                        )
                );
            }
        });
    };

    const filteredNavigation = filterNavigation(navigation, user[0]);

    return (
        <div>
            {/* Desktop Version  */}
            <div className="hidden md:flex md:flex-shrink-0 h-full fixed top-0 left-0 z-50 w-auto">
                <div className="flex w-20 flex-col">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-800 containerscroll">
                        <div className="flex-1">
                            <div className="flex items-center justify-center bg-gray-800 py-4">
                                <a href="/">
                                    <img src={tiger} alt="Image" />
                                </a>
                            </div>
                            <nav
                                aria-label="Sidebar"
                                className="flex flex-col items-center space-y-3 pt-6"
                            >
                                {allowedApplications?.map((item) => (
                                    //{sidebarElements.map((item) => (

                                    <a
                                        href={item.AppURL}
                                        key={item.AppId}
                                        target={
                                            item.id === 0 ? undefined : "_blank"
                                        }
                                    >
                                        {" "}
                                        <button
                                            key={item.AppAbv}
                                            className={classNames(
                                                item.AppId == currentAppId
                                                    ? "bg-gray-700 text-white"
                                                    : "text-gray-400 hover:bg-gray-900 hover:text-white",
                                                "group w-auto p-3 rounded-md flex flex-col items-center text-xs font-medium"
                                            )}
                                            // aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.icon ? (
                                                <item.icon
                                                    className={classNames(
                                                        item.current
                                                            ? "text-yellow-400"
                                                            : "text-gray-400 group-hover:text-white",
                                                        "h-6 w-6"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <img
                                                    src={`${item.AppIcon}`}
                                                    className={classNames(
                                                        item.AppId ==
                                                            currentAppId
                                                            ? "text-yellow-400"
                                                            : "text-gray-400 group-hover:text-white",
                                                        "h-8 w-8"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <span>{item.AppAbv}</span>
                                        </button>
                                    </a>
                                    // </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex flex-col flex-shrink-0 pb-5">
                            <a
                                href="https://support.gtls.com.au/help/2703577665"
                                target="_blank"
                                className="flex justify-center"
                            >
                                {" "}
                                <button
                                    className={classNames(
                                        "text-gray-400 hover:bg-gray-700 hover:text-white",
                                        "group w-auto p-3 rounded-md flex flex-col items-center text-xs font-medium"
                                    )}
                                >
                                    <QuestionMarkCircleIcon
                                        className={classNames(
                                            "text-gray-400 group-hover:text-white",
                                            "h-6 w-6"
                                        )}
                                        aria-hidden="true"
                                    />

                                    <span className="mt-2">Support</span>
                                </button>
                            </a>
                            <button onClick={handleLogout}>
                                <ResponsiveNavLink
                                    // href={route("logout")}
                                    as="button"
                                    className="flex flex-col hover:bg-gray-900 hover:text-white"
                                >
                                    <ArrowRightOnRectangleIcon className="w-7 ml-2 text-gray-400" />
                                    <span className="text-xs text-gray-400">
                                        LOGOUT
                                    </span>
                                </ResponsiveNavLink>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Version  */}
            <Transition.Root show={mobileMenuOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={setMobileMenuOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-1 right-0 -mr-14 p-1">
                                        <button
                                            type="button"
                                            className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none "
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex flex-shrink-0 items-center px-4">
                                    <img
                                        className="h-8 w-auto"
                                        src={tiger}
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                                    <nav className="flex h-full flex-col">
                                        <div className="space-y-1 ">
                                            {allowedApplications.map((item) => (
                                                // {sidebarElements.map((item) => (
                                                <Accordion
                                                    name={item.AppAbv}
                                                    key={item.AppId}
                                                    transition={{
                                                        duration: "300ms",
                                                        timingFunction:
                                                            "cubic-bezier(0, 0, 0.2, 1)",
                                                    }}
                                                >
                                                    {item.AppId ==
                                                    currentAppId ? (
                                                        <AccordionItem>
                                                            {({ open }) => (
                                                                <>
                                                                    <AccordionHeader
                                                                        onClick={() =>
                                                                            handleMenuSide(
                                                                                item
                                                                            )
                                                                        }
                                                                        className={classNames(
                                                                            item.AppId ==
                                                                                currentAppId
                                                                                ? "bg-gray-700 text-white"
                                                                                : "text-gray-400 hover:bg-gray-900 hover:text-white",
                                                                            "group py-2 px-3 rounded-md gap-x-2 text-sm font-medium w-full flex justify- items-center text-gray-600  p-4"
                                                                        )}
                                                                    >
                                                                        {item.icon ? (
                                                                            <item.icon
                                                                                className={classNames(
                                                                                    item.AppId ==
                                                                                        currentAppId
                                                                                        ? "text-yellow-400"
                                                                                        : "text-gray-400 group-hover:text-white",
                                                                                    "h-6 w-6"
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                src={
                                                                                    item.AppIcon
                                                                                }
                                                                                className={classNames(
                                                                                    item.AppId ==
                                                                                        currentAppId
                                                                                        ? "text-yellow-400"
                                                                                        : "text-gray-400 group-hover:text-white",
                                                                                    "h-6 w-6"
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                        )}
                                                                        <span
                                                                            id={
                                                                                item.AppId
                                                                            }
                                                                        >
                                                                            {
                                                                                item.AppAbv
                                                                            }
                                                                        </span>
                                                                        {navigation.length >
                                                                        0 ? (
                                                                            <ChevronDownIcon className="h-3" />
                                                                        ) : null}
                                                                    </AccordionHeader>
                                                                    {filteredNavigation ? (
                                                                        <AccordionBody className="pl-8 flex flex-col">
                                                                            {filteredNavigation
                                                                                // .filter(
                                                                                //     (
                                                                                //         item
                                                                                //     ) =>
                                                                                //         item.role.includes(
                                                                                //             current_user_role
                                                                                //         )
                                                                                // )
                                                                                .map(
                                                                                    (
                                                                                        option
                                                                                    ) => (
                                                                                        <button
                                                                                            id={
                                                                                                option.name
                                                                                            }
                                                                                            onClick={() => {
                                                                                                handleClickSide(
                                                                                                    option.id
                                                                                                );
                                                                                            }}
                                                                                            className="p-5 font-light text-left text-white"
                                                                                        >
                                                                                            {
                                                                                                option.name
                                                                                            }
                                                                                        </button>
                                                                                    )
                                                                                )}
                                                                        </AccordionBody>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </>
                                                            )}
                                                        </AccordionItem>
                                                    ) : (
                                                        <a
                                                            href={item.AppURL}
                                                            onClick={() =>
                                                                handleClick(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <AccordionItem
                                                                id={item.AppId}
                                                            >
                                                                {({ open }) => (
                                                                    <>
                                                                        <AccordionHeader
                                                                            // className=" "
                                                                            className={classNames(
                                                                                item.AppId ==
                                                                                    currentAppId
                                                                                    ? "bg-gray-700 text-white"
                                                                                    : "text-gray-400 hover:bg-gray-900 hover:text-white",
                                                                                "group py-2 px-3 rounded-md flex gap-x-2 items-center text-sm font-medium w-full text-gray-600  p-4"
                                                                            )}
                                                                        >
                                                                            {item.icon ? (
                                                                                <item.icon
                                                                                    className={classNames(
                                                                                        item.AppId ==
                                                                                            currentAppId
                                                                                            ? "text-yellow-400"
                                                                                            : "text-gray-400 group-hover:text-white",
                                                                                        "h-6 w-6"
                                                                                    )}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            ) : (
                                                                                <img
                                                                                    src={
                                                                                        item.AppIcon
                                                                                    }
                                                                                    className={classNames(
                                                                                        item.AppId ==
                                                                                            currentAppId
                                                                                            ? "text-yellow-400"
                                                                                            : "text-gray-400 group-hover:text-white",
                                                                                        "h-6 w-6"
                                                                                    )}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            )}
                                                                            <span>
                                                                                {
                                                                                    item.AppAbv
                                                                                }
                                                                            </span>
                                                                        </AccordionHeader>
                                                                    </>
                                                                )}
                                                            </AccordionItem>
                                                        </a>
                                                    )}
                                                </Accordion>
                                                // </Link>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                                <div className="flex flex-shrink-0 pb-5">
                                    <a
                                        href="https://support.gtls.com.au/help/2703577665"
                                        target="_blank"
                                        className="flex"
                                    >
                                        {" "}
                                        <button
                                            className={classNames(
                                                "text-gray-400 hover:bg-gray-700 hover:text-white",
                                                "group w-auto p-3 rounded-md flex flex-col items-center text-xs font-medium"
                                            )}
                                            // aria-current={item.current ? 'page' : undefined}
                                        >
                                            <QuestionMarkCircleIcon
                                                className={classNames(
                                                    "text-gray-400 group-hover:text-white",
                                                    "h-6 w-6"
                                                )}
                                                aria-hidden="true"
                                            />

                                            <span className="mt-2">
                                                Support
                                            </span>
                                        </button>
                                    </a>
                                    <button
                                        className={classNames(
                                            "text-gray-400 hover:bg-gray-700 hover:text-white",
                                            "group w-auto p-3 rounded-md flex flex-col items-center text-xs font-medium"
                                        )}
                                        onClick={() => handleLogout()}
                                        // aria-current={item.current ? 'page' : undefined}
                                    >
                                        <ArrowRightOnRectangleIcon
                                            className={classNames(
                                                "text-gray-400 group-hover:text-white",
                                                "h-6 w-6"
                                            )}
                                            aria-hidden="true"
                                        />

                                        <span className="mt-2">LOGOUT</span>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="w-14 flex-shrink-0" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <SupportModal isOpen={isModalOpen} handleClose={handleEditClick} />
        </div>
    );
}
