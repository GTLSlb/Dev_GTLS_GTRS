import React from "react";

function DashboardCard07(props) {
    const data = props.InfoData;
    const percentagePassed =
        (data.totalNoConsPassed / (data.totalConsFailed + data.totalNoConsPassed)) * 100;
    const percentageFailed =
        (data.totalConsFailed / data.totalNoConsShipped) * 100;
    const percentagePending =
        (data.totalConsPending / data.totalNoConsShipped) * 100;
    function formatCost(cost) {
        // Ensure the cost is a number and round it to two decimal places
        const roundedCost = cost.toFixed(2);

        // Split the rounded cost into integer and decimal parts
        const parts = roundedCost.split(".");

        // Format the integer part with commas
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Join the integer part and decimal part
        const formattedCost = parts.join(".");

        return formattedCost;
    }
    return (
        <div className="col-span-full h-full xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
            <header className="px-5 py-2 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800 ">Information</h2>
            </header>
            <div className="px-4">
                {/* Table */}
                <div className="overflow-x-auto pt-2">
                    <table className="table-auto w-full">
                        {/* Table header */}
                        {/* Table body */}
                        <tbody className="text-sm font-medium divide-y divide-slate-100">
                            {/* Row */}
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            # of Receivers
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.numUniqueReceivers}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total Weight
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalWeight?.toFixed(2)} T
                                    </div>
                                </td>
                            </tr>
                            {/* Row */}
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total Pallet Space
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalPalletSpace?.toFixed(2)}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total CHEP
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalChep}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total LOSCAM
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1 text-right">
                                    <div className="text-center text-sm text-right">
                                        {data.totalLoscam}
                                    </div>
                                </td>
                            </tr>
                            {/* Row */}
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total CUSTOMER OWN
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalCustomerOwn}
                                    </div>
                                </td>
                            </tr>
                            {/* Row */}
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Cost
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        ${formatCost(data.totalCost)}{" "}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Fuel Surcharge cost
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        ${formatCost(data.fuelLevy)}{" "}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignment Shipped
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalNoConsShipped}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignment Pending
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalConsPending} /{" "}
                                        {percentagePending?.toFixed(2)} %{" "}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignment Delivered on
                                            time
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalNoConsPassed} /{" "}
                                        {percentagePassed?.toFixed(2)} %{" "}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignment Not Delivered
                                            on time
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.totalConsFailed} /{" "}
                                        {percentageFailed?.toFixed(2)} %
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            # of True PODs
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {data.podCounter}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            % of True PODs
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {" "}
                                        {data.podPercentage?.toFixed(2)} %
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            # of safety issues
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className="text-center text-sm text-right">
                                        {" "}
                                        {data.safetyCounter}{" "}
                                    </div>
                                </td>
                            </tr>

                            {/* Row */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashboardCard07;
