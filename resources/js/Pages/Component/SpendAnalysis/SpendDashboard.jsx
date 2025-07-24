import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import SpendAnalysis from "./Comp/SpendAnalysis";
import CostTable from "./Comp/CostTable";
import RateCard from "./Comp/RateCard";
import AdditionalCharts from "./Comp/AdditionalCharts";
import HeatMap from "./Comp/HeatMap";
export default function SpendDashboard() {
    const [tabs] = useState([
        {
            key: "spend",
            title: "Cost Overview",
            content: <SpendAnalysis />,
        },
        {
            key: "additional",
            title: "Operation Analysis",
            content: <AdditionalCharts />,
        },
        {
            key: "map",
            title: "Heat Map",
            content: <HeatMap />
        },
        {
            key: "table",
            title: "Table",
            content: <CostTable />,
        },

        {
            key: "card",
            title: "Rate Card",
            content: <RateCard />,
        },
    ]);

    return (
        <div className=" px-4 sm:px-6 py-4 bg-smooth ">
            <Tabs
                aria-label="Dynamic Tabs"
                className=" !py-0 "
                variant="underlined"
                classNames={{ tabList: " !py-0", panel: " -mt-10", tab: "px-1" }}
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
