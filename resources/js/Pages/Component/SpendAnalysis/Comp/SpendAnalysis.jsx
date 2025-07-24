import {
    Select,
    SelectItem
} from "@heroui/react";
import "../assets/css/chart.css";
import TotalSpendChart from "../Charts/TotalSpendChart";
import { ServiceTypeChart } from "../Charts/ServiceType";
import AddCostTree from "../Charts/AddCostTree";
import { TrendCost } from "../Charts/TrendCost";
import { AmtVsType } from "../Charts/AmtVsType";
function SpendAnalysis() {
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
    return (
        <div>
            <div className="flex w-full justify-end gap-2">
                <Select
                    className="max-w-xs"
                    size="sm"
                    items={services}
                    label="Select Service"
                    variant="bordered"
                    classNames={{ trigger: "bg-white" }}
                    selectionMode="multiple"
                >
                    {(service) => <SelectItem>{service.label}</SelectItem>}
                </Select>
                <Select
                    className="max-w-xs"
                    size="sm"
                    items={receivers}
                    label="Select Receiver"
                    selectionMode="multiple"
                    variant="bordered"
                    classNames={{ trigger: "bg-white" }}
                >
                    {(receiver) => <SelectItem>{receiver.label}</SelectItem>}
                </Select>
            </div>
            <div className="flex gap-2 mt-2 h-[80vh]">
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 grid-rows-2 gap-2">
                    {/* <TotalSpendChart />
                    <CostByStateChart />
                    <TopReceiversCharts />
                    <DemurrageCost /> */}
                    <TotalSpendChart />
                    <AddCostTree />
                    <ServiceTypeChart />
                    <TrendCost />
                    <AmtVsType />
                </div>
            </div>
        </div>
    );
}
export default SpendAnalysis;
