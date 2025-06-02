import React, { useState } from "react";
import { Tabs, Tab, Button } from "@heroui/react";
import { IoClose } from "react-icons/io5"; // Close (X) icon from react-icons
import FinancialDashboard from "./Comp/FinancialDashboard";
import FirstSection from "./Comp/firstSection";
import SecondSection from "./Comp/SecondSection";

export default function DifotDashboard() {
    const [tabs, setTabs] = useState([
        {
            key: "first",
            title: "First",
            content: <FirstSection />,
            closable: false,
        },
        {
            key: "second",
            title: "Second",
            content: <SecondSection />,
            closable: false,
        },
        {
            key: "financial",
            title: "Financial",
            content: <FinancialDashboard />,
            closable: false,
        },
    ]);

    const [tabCount, setTabCount] = useState(1);

    const addNewTab = () => {
        const newKey = `custom-${tabCount}`;
        setTabs([
            ...tabs,
            {
                key: newKey,
                title: `Custom ${tabCount}`,
                content: (
                    <div className="p-4">This is Custom Tab {tabCount}</div>
                ),
                closable: true,
            },
        ]);
        setTabCount(tabCount + 1);
    };

    const removeTab = (key) => {
        setTabs((prev) => prev.filter((tab) => tab.key !== key));
    };

    return (
        <div className="py-2">
            <div className="mt-4 flex justify-end">
                <Button onClick={addNewTab} color="primary" variant="flat">
                    Add New Tab
                </Button>
            </div>
            <Tabs
                aria-label="Dynamic Tabs"
                className="!py-0"
                classNames={{ tabList: "!py-0" }}
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.key}
                        title={
                            <div className="flex items-center gap-2">
                                <span>{tab.title}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent tab switch
                                        removeTab(tab.key);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <IoClose size={16} />
                                </button>
                            </div>
                        }
                        className="!py-0"
                    >
                        {tab.content}
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
