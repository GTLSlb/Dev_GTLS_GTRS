import RateCard from "./Comp/RateCard";
import React, { useState } from "react";
import CostTable from "./Comp/CostTable";
import {
    Tabs,
    Tab,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import SpendAnalysis from "./Comp/SpendAnalysis";
import AdditionalCharts from "./Comp/AdditionalCharts";
import HeatMapContainer from "./Comp/HeatMap/HeatMapContainer";
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
            content: <HeatMapContainer />,
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

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // onOpenChange();
    return (
        <div className=" px-4 sm:px-6 py-4 bg-smooth ">
            <Tabs
                aria-label="Dynamic Tabs"
                className=" !py-0 "
                variant="underlined"
                classNames={{
                    tabList: " !py-0",
                    panel: " -mt-10",
                    tab: "px-1",
                }}
                children={<div>Hello</div>}
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalHeader>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Choose Customer
                    </h2>
                </ModalHeader>
                <ModalBody>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Please select a customer to view the spend analysis.
                    </p>
                    {/* Add your customer selection component here */}
                </ModalBody>
                <ModalFooter>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => setOpen(false)}
                    >
                        Confirm
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 ml-2"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
