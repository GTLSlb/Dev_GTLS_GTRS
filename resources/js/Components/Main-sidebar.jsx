import {
    DocumentChartBarIcon,
    CogIcon,
    HomeIcon,
    PhotoIcon,
    GlobeAltIcon,
    ArrowDownIcon,
    Squares2X2Icon,
    UserGroupIcon,
    XMarkIcon,
    Bars3Icon,
    BookmarkSquareIcon,
    UserMinusIcon,
    DocumentMagnifyingGlassIcon,
    PencilIcon,
    UsersIcon,
    ArrowRightOnRectangleIcon,
    PencilSquareIcon,
    QuestionMarkCircleIcon,
    ArrowLeftOnRectangleIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import tiger from "../assets/pictures/tiger.png";
import JAIX from "../assets/partners/JAIX.webp";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import SupportModal from "@/Pages/Component/modals/SupportModal";

export default function MainSidebar({
    allowedApplications,
    setMobileMenuOpen,
    mobileMenuOpen,
    setActiveIndexGtam,
    setactivePage,
    setActiveIndexInv,
    currentUser,
    setActiveIndexGTRS,
    activePage,
}) {
    const invoicesRoles = [6, 7, 8, 9, 10];
    const [gtrsCurrent, setGtrsCurrent] = useState();
    // useEffect(() => {
    //     handleSetActivePage(0);
    // }, []);

    const current_user_role = currentUser?.role_id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const sidebarNavigation = [
        {
            id: 0,
            name: "GTRS",
            // href: "#",
            icon: DocumentMagnifyingGlassIcon,
            current: false,
            options: [
                {
                    id: 0,
                    name: "Dashboard",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 1,
                    name: "Consignments",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 2,
                    name: "Kpi Report",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 4,
                    name: "Performance report",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 5,
                    name: "Failed Consignments",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 6,
                    name: "No Delivery info",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 7,
                    name: "Additional Charges",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 8,
                    name: "Driver Login",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 9,
                    name: "RDD",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 10,
                    name: "Safety",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 11,
                    name: "Missing POD",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 12,
                    name: "Transit Days",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 13,
                    name: "Holidays",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 14,
                    name: "KPI Reasons",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 21,
                    name: "Delivery Report",
                    current: false,
                    role: ["1", "4"],
                },
            ],
            func: setActiveIndexGTRS,
            role: ["1", "2", "3", "4", "5"],
        },
        {
            id: 2,
            name: "Invoices",
            href: "https://gtis.gtls.au",
            icon: DocumentChartBarIcon,
            current: gtrsCurrent,
            options: [
                // {
                //     id: 0,
                //     name: "Dashboard",
                //     current: false,
                //     role: ["1"],
                // },
                // {
                //     id: 1,
                //     name: "Invoices",
                //     current: false,
                //     role: ["1", "6", "7", "8", "9", "10"],
                // },
                // {
                //     id: 2,
                //     name: "Purchase order",
                //     current: false,
                //     role: ["1", "6", "7", "8", "9", "10"],
                // },
                // {
                //     id: 3,
                //     name: "Suppliers",
                //     current: false,
                //     role: ["1", "6", "7", "8", "9", "10"],
                // },
                // {
                //     id: 4,
                //     name: "Services",
                //     current: false,
                //     role: ["1", "6", "7", "8", "9", "10"],
                // },
                // {
                //     id: 5,
                //     name: "Companies",
                //     current: false,
                //     role: ["1", "6", "7", "8", "9", "10"],
                // },
                // {
                //     id: 11,
                //     name: "Categories",
                //     current: false,
                //     role: ["1", "6", "7", "8", "9", "10"],
                // },
                // {
                //     id: 12,
                //     name: "Close reasons",
                //     current: false,
                //     role: ["1", "6", "7", "8", "9", "10"],
                // },
            ],
            role: ["1", "6", "7", "8", "9", "10"],
        },
        {
            id: 1,
            name: "GTAM",
            href: "https://gtam.gtls.au",
            icon: UsersIcon,
            current: false,
            options: [
                // {
                //     id: 0,
                //     name: "Dashboard",
                //     current: false,
                //     role: ["1", "2", "3", "4", "5"],
                // },
                // {
                //     id: 1,
                //     name: "Employees",
                //     current: false,
                //     role: ["1", "2", "3", "4", "5"],
                // },
                // {
                //     id: 2,
                //     name: "Roles",
                //     current: false,
                //     role: ["1", "2", "3", "4", "5"],
                // },
                // {
                //     id: 3,
                //     name: "Apps",
                //     current: false,
                //     role: ["1", "2", "3", "4", "5"],
                // },
                // {
                //     id: 4,
                //     name: "Groups",
                //     current: false,
                //     role: ["1", "2", "3", "4", "5"],
                // },
                // {
                //     id: 5,
                //     name: "Branches",
                //     current: false,
                //     role: ["1", "4"],
                // },
            ],
            role: ["1"],
        },
        {
            id: 3,
            name: "GTRS",
            href: "https://gtrs.gtls.au",
            icon: DocumentMagnifyingGlassIcon,
            current: false,
            options: [
                {
                    id: 0,
                    name: "Dashboard",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 1,
                    name: "Consignments",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 2,
                    name: "Kpi Report",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 4,
                    name: "Performance report",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 5,
                    name: "Failed Consignments",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 6,
                    name: "No Delivery info",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 7,
                    name: "Additional Charges",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 8,
                    name: "Driver Login",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 9,
                    name: "RDD",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 10,
                    name: "Safety",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 11,
                    name: "Missing POD",
                    current: false,
                    role: ["1", "2", "3", "4", "5"],
                },
                {
                    id: 12,
                    name: "Transit Days",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 13,
                    name: "Holidays",
                    current: false,
                    role: ["1", "4"],
                },
                {
                    id: 14,
                    name: "KPI Reasons",
                    current: false,
                    role: ["1", "4"],
                },
            ],
            func: setActiveIndexGTRS,
            role: ["1", "2", "3", "4", "5"],
        },
        {
            id: 4,
            name: "GTMS",
            href: "https://gtms.gtls.au",
            icon: HomeIcon,
            current: false,
            role: ["1"],
        },
        {
            id: 5,
            name: "Admin",
            href: "/nova",
            icon: PencilSquareIcon,
            current: false,

            role: ["1"],
        },
        {
            id: 6,
            name: "Jaix",
            href: "https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx",
            img: JAIX,
            current: false,
            role: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },

        // { name: 'Settings', href: '#', icon: CogIcon, current: false },
    ];
    const [sidebarElements, setSidebarElements] = useState([]);
    useEffect(() => {
        let elements = [];
       sidebarNavigation?.map((item)=>{
           allowedApplications?.map((element)=>{
               if(item.id == element.AppId){
                    item.href=element?.AppURL
                    elements.push(item)
               }
           })
       })
       setSidebarElements(elements.reverse())
    },[allowedApplications])
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
    const handleClickSupport = (index) => {};

    const handleClickSide = (index, tabind) => {
        setactivePage(0);
        if (index == 3) {
            setActiveIndexGTRS(tabind);
        } else if (index == 2) {
            setActiveIndexInv(tabind);
        } else if (index == 1) {
            setActiveIndexGtam(tabind);
        }

        setMobileMenuOpen(false);
        const updatedElements = sidebarElements.map((element) => {
            if (element.id === index) {
                element?.options.map((option)=>{
                    if(option.id == tabind){
                        option.current = true;
                    }
                })
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
    const handleLinkClick = (event) => {
        event.preventDefault();
        // Call the `visit` method to navigate to the new page
        Inertia.visit(event.target.href);
    };

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
    const currentAppId = window.Laravel.appId;
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
        if(item?.options?.length == 0){
            window.location.href = item?.href;
        }
    }
    moveToHead(allowedApplications, 3);

    return (
        <div>
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
            <Transition.Root show={mobileMenuOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-20 lg:hidden"
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
                                            {sidebarElements
                                                // .filter((item) =>
                                                //     item.role.includes(
                                                //         current_user_role
                                                //     )
                                                // )
                                                .map((item) => (
                                                    // {sidebarElements.map((item) => (
                                                    <Accordion
                                                        name={item.name}
                                                        key={item.id}
                                                        transition={{
                                                            duration: "300ms",
                                                            timingFunction:
                                                                "cubic-bezier(0, 0, 0.2, 1)",
                                                        }}
                                                    >
                                                        {false ? (
                                                            <AccordionItem>
                                                                {({ open }) => (
                                                                    <>
                                                                        <AccordionHeader
                                                                            onClick={() => handleMenuSide(item)}
                                                                            className={classNames(
                                                                                item.current
                                                                                    ? "bg-gray-700 text-white"
                                                                                    : "text-gray-400 hover:bg-gray-900 hover:text-white",
                                                                                "group py-2 px-3 rounded-md gap-x-2 text-sm font-medium w-full flex justify- items-center text-gray-600  p-4"
                                                                            )}
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
                                                                                    src={
                                                                                        item.img
                                                                                    }
                                                                                    className={classNames(
                                                                                        item.current
                                                                                            ? "text-yellow-400"
                                                                                            : "text-gray-400 group-hover:text-white",
                                                                                        "h-6 w-6"
                                                                                    )}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            )}
                                                                            <span
                                                                                id={
                                                                                    item.name
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </span>
                                                                            {item?.options.length > 0 ?<ChevronDownIcon className="h-3" /> : null}
                                                                        </AccordionHeader>
                                                                        {/* {sidebarElements.filter(item => item.role.includes(current_user_role)).map((item) => ( */}
                                                                        {/* Mobile view  */}
                                                                    </>
                                                                )}
                                                            </AccordionItem>
                                                        ) : (
                                                            <a
                                                                href={item.href}
                                                                onClick={() =>
                                                                    handleClick(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <AccordionItem
                                                                    id={
                                                                        item.name
                                                                    }
                                                                >
                                                                    {({
                                                                        open,
                                                                    }) => (
                                                                        <>
                                                                            <AccordionHeader
                                                                                // className=" "
                                                                                className={classNames(
                                                                                    item.current
                                                                                        ? "bg-gray-700 text-white"
                                                                                        : "text-gray-400 hover:bg-gray-900 hover:text-white",
                                                                                    "group py-2 px-3 rounded-md flex gap-x-2 items-center text-sm font-medium w-full text-gray-600  p-4"
                                                                                )}
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
                                                                                        src={
                                                                                            item.img
                                                                                        }
                                                                                        className={classNames(
                                                                                            item.current
                                                                                                ? "text-yellow-400"
                                                                                                : "text-gray-400 group-hover:text-white",
                                                                                            "h-6 w-6"
                                                                                        )}
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                )}
                                                                                <span>
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </span>
                                                                            </AccordionHeader>
                                                                            {item.options ? (
                                                                                <AccordionBody className="pl-8 flex flex-col">
                                                                                    {item.options.map(
                                                                                        (
                                                                                            option
                                                                                        ) => (
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    handleClickSide(
                                                                                                        item.id,
                                                                                                        option.id
                                                                                                    )
                                                                                                }
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
                                                            </a>
                                                        )}
                                                    </Accordion>
                                                    // </Link>
                                                ))}
                                        </div>
                                    </nav>
                                </div>
                                <div className="flex flex-col flex-shrink-0 pb-5">
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

                                        <span className="mt-2">Support</span>
                                    </button>
                                </a>
                                <button  onClick={() => handleLogout()}>
                                    <ResponsiveNavLink
                                        // href={route("logout")}
                                        as="button"
                                        className="flex flex-col hover:bg-gray-900 hover:text-white w-8 h-14"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-7 ml-2 text-gray-400" />
                                        <span className="text-xs text-gray-400">
                                            LOGOUT
                                        </span>
                                    </ResponsiveNavLink>
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
