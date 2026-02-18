import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { formatNumberWithCommas, renderConsDetailsLink } from "@/CommonFunctions";

function DepartedConsignments({ departedMissingPodAnalytics, userPermissions }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-semibold text-gray-700">
                    Departed Consignments - POD Status
                </h3>
            </div>
            <div className="p-4">
                {!departedMissingPodAnalytics || departedMissingPodAnalytics.totalDeparted === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No departed consignments found
                    </p>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {formatNumberWithCommas(
                                        departedMissingPodAnalytics.totalConsignments,
                                    )}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Total Consignments
                                </div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatNumberWithCommas(
                                        departedMissingPodAnalytics.totalDeparted,
                                    )}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Total Departed Receiver
                                </div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatNumberWithCommas(
                                        departedMissingPodAnalytics.departedWithPod,
                                    )}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Departed Receiver With POD (
                                    {departedMissingPodAnalytics.podPercentage.toFixed(
                                        1,
                                    )}
                                    %)
                                </div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {
                                        departedMissingPodAnalytics.departedMissingPod
                                    }
                                </div>
                                <div className="text-xs text-gray-600">
                                    Departed Receiver With Missing POD (
                                    {departedMissingPodAnalytics.missingPodPercentage.toFixed(
                                        1,
                                    )}
                                    %)
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>POD Completion Rate</span>
                                <span>
                                    {departedMissingPodAnalytics.podPercentage.toFixed(
                                        1,
                                    )}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-green-500 h-3 transition-all duration-300"
                                    style={{
                                        width: `${departedMissingPodAnalytics.podPercentage}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Missing POD List (scrollable) */}
                        {departedMissingPodAnalytics.departedMissingPod > 0 && (
                            <div>
                                <div className="text-xs font-medium text-gray-700 mb-2">
                                    Consignments Missing POD:
                                </div>
                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                                    {departedMissingPodAnalytics.missingPodList.map(
                                        (item, index) => (
                                            <div
                                                key={item.consignmentId}
                                                className={`px-3 py-2 text-xs flex items-center justify-between ${
                                                    index % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-gray-50"
                                                }`}
                                            >
                                                <div>
                                                    <span className="font-medium text-blue-600">
                                                        {renderConsDetailsLink(
                                                            userPermissions,
                                                            item.consignmentNo,
                                                            item.consignmentId,
                                                        )}
                                                    </span>
                                                    <span className="text-gray-500 ml-2">
                                                        ({item.manifestNo}
                                                        ), ({item.driverName})
                                                    </span>
                                                </div>
                                                <span className="text-gray-500 truncate max-w-[150px]">
                                                    {item.receiverSuburb},{" "}
                                                    {item.receiverState}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default DepartedConsignments;
