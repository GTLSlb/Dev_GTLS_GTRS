import "../assets/css/chart.css";
import TotalSpendChart from "../Charts/TotalSpendChart";
import { ServiceTypeChart } from "../Charts/ServiceType";
import AddCostTree from "../Charts/AddCostTree";
import { TrendCost } from "../Charts/TrendCost";
import { AmtVsType } from "../Charts/AmtVsType";
function SpendAnalysis({filters, setFilters, setSelected}) {
    return (
        <div>
            <div className="flex gap-2 mt-2 h-[80vh]">
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 grid-rows-2 gap-2">
                    <TotalSpendChart filters={filters} setFilters={setFilters} setSelected={setSelected}/>
                    <AddCostTree filters={filters} setFilters={setFilters} setSelected={setSelected}/>
                    <ServiceTypeChart filters={filters} setFilters={setFilters} setSelected={setSelected}/>
                    <TrendCost filters={filters} setFilters={setFilters} setSelected={setSelected}/>
                    <AmtVsType filters={filters} setFilters={setFilters} setSelected={setSelected}/>
                </div>
            </div>
        </div>
    );
}
export default SpendAnalysis;
