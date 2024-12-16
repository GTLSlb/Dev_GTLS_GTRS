import Details from "./Details";
import General from "./General";
import { useState } from "react";
import Amount from "./Amount";
import Sender from "./Sender";
import Reciever from "./Reciever";

export default function Navbar({ id, item,currentUser }) {
    const current_user_role = currentUser.role_id;

    const tabs = [
        {
            id: 0,
            name: "General Information",
            href: "#",
            current: true,
            role: ["1", "2", "3", "4", "5"],
        },
        {
            id: 1,
            name: "Details",
            href: "#",
            current: false,
            role: ["1", "2", "3", "4", "5"],
        },
        {
            id: 2,
            name: "Amount",
            href: "#",
            current: false,
            role: ["1", "3", "4", "5"],
        },
        {
            id: 3,
            name: "Sender",
            href: "#",
            current: false,
            role: ["1", "2", "3", "4", "5"],
        },
        {
            id: 4,
            name: "Reciever",
            href: "#",
            current: false,
            role: ["1", "2", "3", "4", "5"],
        },
    ];
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    const [sidebarElements, setSidebarElements] = useState(tabs);
    const [activeIndex, setActiveIndex] = useState(0);
    const components = [
        <General item={item} />,
        <Details item={item} />,
        <Amount item={item} />,
        <Sender item={item} />,
        <Reciever item={item} />,
    ];
    const handleClick = (index, e) => {
        e.preventDefault();
        const updatedElements = sidebarElements.map((element) => {
            if (element.id === index) {
                return { ...element, current: true };
            } else {
                return { ...element, current: false };
            }
        });
        setSidebarElements(updatedElements);
        setActiveIndex(index);
    };

    return (
        <div>
            <div className="mt-4">
                <div className="sm:hidden">
                    <label htmlFor="current-tab" className="sr-only">
                        Select a tab
                    </label>
                    <select
                        id="current-tab"
                        name="current-tab"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        defaultValue={tabs.find((tab) => tab.current).name}
                        onChange={(e) => handleClick(e.target.value, e)}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name} value={tab.id}>
                                {tab.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <nav className="-mb-px flex space-x-8">
                        {sidebarElements
                            .map((tab) => (
                                <a
                                    key={tab.name}
                                    onClick={(e) => handleClick(tab.id, e)}
                                    href={tab.href}
                                    className={classNames(
                                        tab.current
                                            ? "border-goldd text-black font-bold"
                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                        "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                                    )}
                                    aria-current={
                                        tab.current ? "page" : undefined
                                    }
                                >
                                    {tab.name}
                                </a>
                            ))}
                    </nav>
                </div>
            </div>
            {components[activeIndex]}
        </div>
    );
}
