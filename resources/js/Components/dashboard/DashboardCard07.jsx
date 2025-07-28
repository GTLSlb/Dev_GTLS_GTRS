import { formatNumberWithCommas } from "@/CommonFunctions";
import React from "react";
import PropTypes from "prop-types";

function DashboardCard07(props) {
    const data = props.InfoData;

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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(
                                            data.numUniqueReceivers
                                        )}
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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(
                                            data.totalWeight
                                        )}{" "}
                                        T
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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(
                                            data.totalPalletSpace
                                        )}
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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(data.totalChep)}
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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(
                                            data.totalLoscam
                                        )}
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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(
                                            data.totalCustomerOwn
                                        )}
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
                                    <div className=" text-sm text-right">
                                        $
                                        {formatNumberWithCommas(data.totalCost)}{" "}
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
                                    <div className=" text-sm text-right">
                                        ${formatNumberWithCommas(data.fuelLevy)}{" "}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignments Shipped
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className=" text-sm text-right">
                                        {data.totalNoConsShipped
                                            ? formatNumberWithCommas(
                                                  data.totalNoConsShipped
                                              )
                                            : 0}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignments Pending
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className=" text-sm text-right">
                                        {data.totalConsPending
                                            ? formatNumberWithCommas(
                                                  data.totalConsPending
                                              )
                                            : 0}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignments Delivered on
                                            time
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className=" text-sm text-right">
                                        {data.totalNoConsPassed
                                            ? formatNumberWithCommas(
                                                  data.totalNoConsPassed
                                              )
                                            : 0}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            Total No. Consignments Not Delivered
                                            on time
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className=" text-sm text-right">
                                        {data.totalConsFailed
                                            ? formatNumberWithCommas(
                                                  data.totalConsFailed
                                              )
                                            : 0}
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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(
                                            data.podCounter
                                        )}
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
                                    <div className=" text-sm text-right">
                                        {formatNumberWithCommas(
                                            data.podPercentage
                                        )}{" "}
                                        %
                                    </div>
                                </td>
                            </tr>
                            {/* <tr>
                                <td className="px-1">
                                    <div className="flex items-center py-1 font-extrabold">
                                        <div className="text-slate-800 text-sm">
                                            # of safety issues
                                        </div>
                                    </div>
                                </td>
                                <td className="px-1">
                                    <div className=" text-sm text-right">
                                        {" "}
                                        {data.safetyCounter}{" "}
                                    </div>
                                </td>
                            </tr> */}

                            {/* Row */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

DashboardCard07.propTypes = {
    InfoData: PropTypes.shape({
        numUniqueReceivers: PropTypes.number,
        totalWeight: PropTypes.number,
        totalPalletSpace: PropTypes.number,
        totalChep: PropTypes.number,
        totalLoscam: PropTypes.number,
        totalCustomerOwn: PropTypes.number,
        totalCost: PropTypes.number,
        fuelLevy: PropTypes.number,
        totalNoConsShipped: PropTypes.number,
        totalConsPending: PropTypes.number,
        totalNoConsPassed: PropTypes.number,
        totalConsFailed: PropTypes.number,
        podCounter: PropTypes.number,
        podPercentage: PropTypes.number,
    }),
};

export default DashboardCard07;
