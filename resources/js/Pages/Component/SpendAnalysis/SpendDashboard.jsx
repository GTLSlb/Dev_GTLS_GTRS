import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import SpendAnalysis from "./Comp/SpendAnalysis";
import CostTable from "./Comp/CostTable";
import RateCard from "./Comp/RateCard";

export default function SpendDashboard() {
    const [tabs] = useState([
        {
            key: "spend",
            title: "Charts",
            content: <SpendAnalysis />,
            closable: false,
        },
        {
            key: "table",
            title: "Table",
            content: <CostTable />,
            closable: false,
        },
        {
            key: "first",
            title: "Rate Card",
            content: <RateCard />,
            closable: false,
        },
    ]);

    return (
        <div className=" px-4 sm:px-6 py-4 bg-smooth ">
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
