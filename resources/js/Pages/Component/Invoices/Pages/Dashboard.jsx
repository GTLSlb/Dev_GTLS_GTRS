import MultiChartLine from "../components/charts/MultiChartsLine";
import BasicColumnCharts from "../components/charts/BarColumnCharts";
export default function Dashboard() {
    return (
        <div className="bg-smooth pb-20">
            <div className="grid gridcols-1 sm:grid-cols-2 lg:grid-cols-4  gap-x-5 gap-y-5 m-5">
                <div className="bg-white shadow-md rounded-lg p-3">
                    <h1 className="text-dark text-sm font-bold">Total PO</h1>
                    <div className="py-5 text-2xl">168</div>
                </div>
                <div className="bg-white shadow-md rounded rounded-lg p-3">
                    <h1 className="text-dark text-sm font-bold">
                        Total Invoices
                    </h1>
                    <div className="py-5 text-2xl">168</div>
                </div>
                <div className="bg-white shadow-md rounded rounded-lg p-3">
                    <h1 className="text-dark text-sm font-bold">Billing</h1>
                    <div className="py-5 text-2xl">168</div>
                </div>
                <div className="bg-white shadow-md rounded rounded-lg p-3">
                    <h1 className="text-dark text-sm font-bold">
                        Invoice Amount
                    </h1>
                    <div className="py-5 text-2xl">168</div>
                </div>
            </div>
            <div className="rounded-xl bg-white mx-5 shadow-md h-auto p-5 ">
                <div className="p-3">Charts</div>
                <div className="grid grid-cols grid-cols-2">
                    <div className="m-1 col-span-2 h-[20rem] ">
                        {" "}
                        <MultiChartLine
                            chartTitle={"Invoices Amount Per Month"}
                        />
                    </div>
                    <div className="m-1 col-span-2 xl:col-span-1 h-[20rem]">
                        {" "}
                        <BasicColumnCharts
                            chartTitle={"Invoices Per Month"}
                        />
                    </div>
                    <div className="m-1 col-span-2 xl:col-span-1 h-[20rem]">
                        {" "}
                        <BasicColumnCharts
                            chartTitle={"Invoices Per Month"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
