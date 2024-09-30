import { useState,useEffect } from "react";
const tabs = [
    { id: 0, name: "Dashboard", href: "#", current: true },
    { id: 1, name: "Consignments", href: "#", current: false },
    { id: 2, name: "KPI Report", href: "#", current: false },
    { id: 4, name: "Performance Report", href: "#", current: false },
    { id: 5, name: "Failed Consignments", href: "#", current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function GtrsTabs({ }) {

    const [sidebarElements, setSidebarElements] = useState(tabs);
    return (
        <div>

            <div className="hidden md:block px-5 py-5">
                <nav className="flex space-x-4" aria-label="Tabs">
                    {sidebarElements.map((tab) => (
                        <div className="px-3">
                        <a
                            onClick={() => handleClick(tab.id)}
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                                tab.current
                                    ? " border-b-2 border-goldd text-gray-800"
                                    : "text-gray-400 ",
                                "  py-2 text-sm font-medium"
                            )}
                        >
                            {tab.name}
                        </a>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}
