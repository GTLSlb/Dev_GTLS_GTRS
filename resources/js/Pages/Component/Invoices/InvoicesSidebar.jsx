import React, { useState } from "react";
import {
    ExclamationCircleIcon,
    DocumentChartBarIcon,
    ShoppingCartIcon,
    UsersIcon,
    Cog8ToothIcon,
    BuildingOffice2Icon,
    TagIcon,
} from "@heroicons/react/24/outline";
import "../../../../css/scroll.css";
import { useEffect } from "react";

const navigation = [
    // {
    //     id: 0,
    //     name: "Dashboard",
    //     href: "#",
    //     icon: ChartPieIcon,
    //     current: true,
    //     role: ["1", "2", "3", "4", "5"],
    // },
    {
        id: 1,
        name: "Invoices",
        href: "#",
        icon: DocumentChartBarIcon,
        current: true,
        role: ["1", "6", "7", "8", "9", "10"],
    },
    {
        id: 2,
        name: "Purchase Order",
        href: "#",
        icon: ShoppingCartIcon,
        current: false,
        role: ["1", "6", "7", "8", "9", "10"],
    },
    {
        id: 3,
        name: "Suppliers ",
        href: "#",
        icon: UsersIcon,
        current: false,
        role: ["1", "6", "7", "8", "9", "10"],
    },
    {
        id: 4,
        name: "Services",
        href: "#",
        icon: Cog8ToothIcon,
        current: false,
        role: ["1", "6", "7", "8", "9", "10"],
    },
    {
        id: 5,
        name: "Companies",
        href: "#",
        icon: BuildingOffice2Icon,
        current: false,
        role: ["1", "6", "7", "8", "9", "10"],
    },
    {
        id: 11,
        name: "Categories",
        href: "#",
        icon: TagIcon,
        current: false,
        role: ["1", "6", "7", "8", "9", "10"],
    },
    {
        id: 12,
        name: "Close Reasons",
        href: "#",
        icon: ExclamationCircleIcon,
        current: false,
        role: ["1", "6", "7", "8", "9", "10"],
    },
    // { name: 'Reports', href: '#', icon: ChartBarIcon, current: false },
];
const myArray = [];
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function InvoicesSidebar({
    setPO,
    setInvoice,
    currentUser,
    activeIndexInv,
    setActiveIndexInv,
}) {
    function showhideCreateButtons() {
        if (currentUser.role_id == 10) {
            return false;
        } else {
            return true;
        }
    }
    function showhideOnlyPOCreateButtons() {
        if (currentUser.role_id == 8) {
            return false;
        } else {
            return true;
        }
    }
    const [sidebarElements, setSidebarElements] = useState(navigation);
    useEffect(() => {
        const updatedElements = sidebarElements.map((element) => {
            if (element.id === activeIndexInv) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setSidebarElements(updatedElements);
    }, [activeIndexInv]);

    // const [optionSelected, setoptionSelected] = useState([]);

    const handleClick = (index) => {
        setPO(null);
        setInvoice(null);
        setActiveIndexInv(index);
        const updatedElements = sidebarElements.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setSidebarElements(updatedElements);
    };

    function setActive(index) {
        setActiveIndexInv(index);
    }
    return (
        <div className="h-full xl:fixed xl:w-64 md:h-full xl:fixed bg-gray-200 w-full ">
            {/* Static sidebar for desktop */}
            <div className=" h-[90%] md:inset-y-0 flex md:w-full md:flex-row ">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className=" h-full w-full overflow-y-scroll containerscroll">
                    <div className="flex flex-shrink-0  p-4 ">
                        <div className="group block w-full flex-shrink-0">
                            <div className="flex items-center">
                                <div>
                                    {!currentUser.icon ? (
                                        <img
                                            className="inline-block h-14 w-14"
                                            src={`/app/icons/blank-profile.jpg`}
                                            alt=""
                                        />
                                    ) : (
                                        <img
                                            className="inline-block h-14 w-14 object-contain"
                                            src={`/app/icons/${currentUser.icon}`}
                                            alt=""
                                        />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">
                                        {currentUser.name}
                                    </p>
                                    <p className=" text-[0.7rem] text-gray-500 ">
                                        {currentUser.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showhideCreateButtons() ? (
                        <div className="flex flex-row gap-x-2 xl:flex-col p-4 gap-y-2">
                            <button
                                className="bg-gray-800 text-smooth p-1 rounded hover:bg-gray-500 flex xl:w-full font-bold text-sm px-2 items-center"
                                onClick={() => handleClick(7)}
                            >
                                <span className="text-goldd px-2 xl:px-8 ">
                                    +
                                </span>{" "}
                                Create Invoice
                            </button>
                            {showhideOnlyPOCreateButtons() ? (
                                <button
                                    className="bg-gray-800 text-smooth p-1 px-2 rounded hover:bg-gray-500 flex xl:w-full font-bold px-2 text-sm items-center"
                                    onClick={() => handleClick(8)}
                                >
                                    <span className="text-goldd px-2 xl:px-8">
                                        +
                                    </span>
                                    Create PO
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-x-2 xl:flex-col p-4 gap-y-2 h-[2.5rem]"></div>
                    )}

                    <div className=" md:pt-2 md:pb-4 w-full">
                        <nav className="mt-5 flex-1 hidden xl:flex-col space-y-1 px-2 w-full md:flex-row md:flex md:mt-0 px-4">
                            {sidebarElements.map((item) => (
                                // {sidebarElements.map((item) => (
                                <a
                                    onClick={() => handleClick(item.id)}
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? "bg-gray-300 text-gray-900"
                                            : "text-gray-700 hover:bg-gray-500 hover:text-white",
                                        "group flex flex-row items-center px-2 py-2 text-sm font-medium rounded-md lg:w-1/2 xl:w-full"
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            item.current
                                                ? "text-gray-800"
                                                : "text-gray-700 group-hover:text-gray-300",
                                            "mr-3 flex-shrink-0 h-6 w-6"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
