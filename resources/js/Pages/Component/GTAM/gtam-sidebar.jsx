import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    CalendarIcon,
    ChartBarIcon,
    ArrowsPointingInIcon,
    ShieldCheckIcon,
    SquaresPlusIcon,
    UsersIcon,
    UserIcon,
    TruckIcon,
    BriefcaseIcon,
    UserGroupIcon,
    ComputerDesktopIcon,
} from "@heroicons/react/24/solid";
import { CubeIcon } from "@heroicons/react/24/outline";
// import { HiUser } from "react-icons/hi";

// import Gtam from '../pages/GTAM'

const navigation = [
    // { id: 0, name: "Dashboard", href: "#", icon: ComputerDesktopIcon, current: true },
    { id: 1, name: "Employees", href: "#", icon: UsersIcon, current: true },
    { id: 13, name: 'Customers', href: '#', icon: BriefcaseIcon, current: false },
    { id: 14, name: 'Drivers', href: '#', icon: TruckIcon, current: false },
    { id: 2, name: "Roles ", href: "#", icon: ShieldCheckIcon, current: false },
    { id: 3, name: "Apps", href: "#", icon: SquaresPlusIcon, current: false },
    { id: 4, name: "Groups", href: "#", icon: UserGroupIcon, current: false },
    { id: 5, name: "Branches", href: "#", icon: ArrowsPointingInIcon, current: false },
    { id: 10, name: "Departments", href: "#", icon: CubeIcon, current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function GtamSidebar({ setActiveIndex }) {
    const [sidebarElements, setSidebarElements] = useState(navigation);
    const handleClick = (index) => {
        setActiveIndex(index);
        const updatedElements = sidebarElements.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setSidebarElements(updatedElements);
        
    };

    return (
        <div className="h-full ">
            {/* Static sidebar for desktop */}
            <div className=" h-full md:inset-y-0 flex md:w-full md:flex-col ">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex min-h-0 flex-1 flex-col bg-gray-200">
                    
                    <div className="flex flex-1 flex-col overflow-y-auto pt-2 pb-4">
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            {sidebarElements.map((item) => (
                                <a
                                    onClick={() => handleClick(item.id)}
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? "bg-gray-300 text-gray-900"
                                            : "text-gray-700 hover:bg-gray-500 hover:text-white",
                                        "group flex items-center px-2 py-2 text-sm font-bold rounded-md"
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
