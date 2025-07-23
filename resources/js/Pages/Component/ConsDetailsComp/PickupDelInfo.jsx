import React from "react";
import PropTypes from "prop-types";

function PickupDelInfo({
    deliveryInfo,
}) {
    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-8 bg-white shadow sm:rounded-xl shadow-lg">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-6 lg:px-8">
                        <h1 className="text-base font-semibold leading-6 text-gray-900 py-4">
                            Pickup and Delivery Information
                        </h1>
                        <table className="min-w-full divide-y divide-gray-300 border-t mb-5">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        POD Date Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        POD Image
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-100 rounded-xl">
                                {deliveryInfo?.map((item) => (
                                    <tr key={item} className=" ">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                            {item.PODdateTime.replace("T", " ")}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                            <a
                                                href={item.PODimage}
                                                target="_blank"
                                                className="text-indigo-600 hover:text-goldds" rel="noreferrer"
                                            >
                                                {item.PODimage}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

PickupDelInfo.propTypes = {
    deliveryInfo: PropTypes.arrayOf(
        PropTypes.shape({
            PODdateTime: PropTypes.string.isRequired,
            PODimage: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default PickupDelInfo;
