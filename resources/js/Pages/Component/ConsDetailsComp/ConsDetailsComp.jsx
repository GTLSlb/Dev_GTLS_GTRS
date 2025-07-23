import React from "react";
import PropTypes from "prop-types";

function ConsDetailsComp({consDetails}) {
    return (
        <div className="px-4 sm:px-6 lg:px-8  mt-8 bg-white shadow sm:rounded-xl shadow-lg">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 containerscroll">
                    <div className="inline-block min-w-full py-2 align-middle px-6 lg:px-8">
                        <h1 className="text-base font-semibold leading-6 text-gray-900 py-4">
                            Consignment Details
                        </h1>
                        <table className="min-w-full divide-y divide-gray-300 border-t mb-5">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                    >
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Quantity
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Weight
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Length
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Height
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Width
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Cubic
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Pallet Space
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Rate Unit
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-100 rounded-xl">
                                {consDetails?.map(
                                    (item) => (
                                        <tr key={item} className=" ">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.Description}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.Quantity}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.Weight}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.Length}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.Height}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.Width}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.Cubic}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.PalletSpace}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                {item.RateUnit}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

ConsDetailsComp.propTypes = {
    consDetails: PropTypes.arrayOf(
        PropTypes.shape({
            Description: PropTypes.string,
            Quantity: PropTypes.number,
            Weight: PropTypes.number,
            Length: PropTypes.number,
            Height: PropTypes.number,
            Width: PropTypes.number,
            Cubic: PropTypes.number,
            PalletSpace: PropTypes.number,
            RateUnit: PropTypes.string,
        })
    ),
};

export default ConsDetailsComp;
