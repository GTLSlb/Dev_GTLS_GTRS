import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import React from "react";

function OutstandingPOD({
    data,
    title = "Drivers with outstanding PODs for Departed Receiver Consignments",
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    <h3 className="text-sm font-semibold text-gray-700">
                        {title}
                    </h3>
                </div>
            </div>
            <div className="p-4">
                {!data || data.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No driver data available
                    </p>
                ) : (
                    <div className="max-h-[280px] overflow-y-auto pr-2">
                        <div className="space-y-3">
                            {data.map((driver, index) => (
                                <div
                                    key={driver.name}
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold bg-gray-100 text-gray-500`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                {driver.name}
                                            </span>
                                            <span
                                                className={`text-sm font-semibold ${
                                                    driver.missingPercentage >=
                                                    50
                                                        ? "text-red-600"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {driver.missingPercentage.toFixed(
                                                    1,
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    driver.missingPercentage >=
                                                    50
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                }`}
                                                style={{
                                                    width: `${driver.missingPercentage}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {driver.missingPod} / {driver.total}{" "}
                                            consignments with missing POD
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OutstandingPOD;
