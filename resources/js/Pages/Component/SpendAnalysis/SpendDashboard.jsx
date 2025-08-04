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
    Select,
    SelectItem,
} from "@heroui/react";
import SpendAnalysis from "./Comp/SpendAnalysis";
import AdditionalCharts from "./Comp/AdditionalCharts";
import HeatMapContainer from "./Comp/HeatMap/HeatMapContainer";
export default function SpendDashboard() {
    const services = [
        { key: "general", label: "General" },
        { key: "express", label: "Express" },
        { key: "warehouse", label: "Warehouse" },
    ];
    const receivers = [
        { key: "1", label: "receiver 1" },
        { key: "2", label: "receiver 2" },
        { key: "3", label: "receiver 3" },
    ];
    const customers = [
        { key: "unilever", label: "Unilever", debtors: [123, 456] },
        { key: "gmi", label: "GMI", debtors: [123, 456] },
        { key: "aaa", label: "AAA", debtors: [123, 456] },
    ];
    const [tabs] = useState([
        {
            key: "spend",
            title: "Cost Overview",
            content: <SpendAnalysis />,
            serviceFilter: true,
            receiverFilter: true,
        },
        {
            key: "additional",
            title: "Operation Analysis",
            content: <AdditionalCharts />,
            serviceFilter: true,
            receiverFilter: true,
        },
        {
            key: "map",
            title: "Heat Map",
            content: <HeatMapContainer />,
            serviceFilter: true,
            receiverFilter: true,
        },
        {
            key: "table",
            title: "Table",
            content: <CostTable />,
            serviceFilter: false,
            receiverFilter: false,
        },

        {
            key: "card",
            title: "Rate Card",
            content: <RateCard />,
            serviceFilter: false,
            receiverFilter: false,
        },
    ]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selected, setSelected] = React.useState("spend");
    const [value, setValue] = React.useState(new Set(["unilever"]));
    // onOpenChange();
    return (
        <div className=" px-4 sm:px-6 py-4 h-full bg-smooth ">
            <div className="flex w-full items-center justify-between gap-2">
                <Tabs
                    aria-label="Dynamic Tabs"
                    className=""
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                    variant="underlined"
                    classNames={{
                        tab: "px-1",
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.key}
                            title={
                                <div className="flex items-center gap-2">
                                    <span>{tab.title}</span>
                                </div>
                            }
                            className=""
                        />
                    ))}
                </Tabs>

                <div className="flex w-full justify-end gap-2">
                    {tabs.find((tab) => tab.key === selected)
                        ?.serviceFilter && (
                        <Select
                            className="max-w-[250px]"
                            size="sm"
                            items={services}
                            label="Select Service"
                            variant="bordered"
                            classNames={{ trigger: "bg-white" }}
                            selectionMode="multiple"
                        >
                            {(service) => (
                                <SelectItem>{service.label}</SelectItem>
                            )}
                        </Select>
                    )}
                    {tabs.find((tab) => tab.key === selected)
                        ?.receiverFilter && (
                        <Select
                            className="max-w-[250px]"
                            size="sm"
                            items={receivers}
                            label="Select Receiver"
                            selectionMode="multiple"
                            variant="bordered"
                            classNames={{ trigger: "bg-white" }}
                        >
                            {(receiver) => (
                                <SelectItem>{receiver.label}</SelectItem>
                            )}
                        </Select>
                    )}
                    <Select
                        className="max-w-[250px]"
                        size="sm"
                        items={customers}
                        selectedKeys={value}
                        onSelectionChange={setValue}
                        label="Select Customer"
                        selectionMode="single"
                        variant="bordered"
                        classNames={{ trigger: "bg-white" }}
                    >
                        {(customer) => (
                            <SelectItem>{customer.label}</SelectItem>
                        )}
                    </Select>
                </div>
            </div>

            {value.size > 0 &&
                tabs.find((tab) => tab.key === selected)?.content}

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
