import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

function ConsignmentComments({ consignmentComments }) {
    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-8 bg-white sm:rounded-xl shadow-lg">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-6 lg:px-8">
                        {/* <h1 className="text-base font-semibold leading-6 text-gray-900 py-4">
                            Comments
                        </h1> */}
                        <table className="min-w-full divide-y divide-gray-300 border-t mb-5">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="text-base text-left font-semibold leading-6 text-gray-900 py-4"
                                    >
                                        Comments
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-base text-left font-semibold leading-6 text-gray-900 py-4"
                                    >
                                        Added By
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-base text-left font-semibold leading-6 text-gray-900 py-4"
                                    >
                                        Added At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-100 rounded-xl">
                                {consignmentComments?.map((item) => (
                                    <tr key={item.FloorCommentId}>
                                        <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                            {item.Comment}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                            {item.AddedBy}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                            {item.AddedAt
                                                ? moment(
                                                      item.AddedAt.replace(
                                                          "T",
                                                          " "
                                                      ),
                                                      "YYYY-MM-DD HH:mm:ss"
                                                  ).format("DD-MM-YYYY h:mm A")
                                                : null}
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

ConsignmentComments.propTypes = {
    consignmentComments: PropTypes.arrayOf(
        PropTypes.shape({
            FloorCommentId: PropTypes.number,
            ConsId: PropTypes.number,
            Comment: PropTypes.string,
            AddedBy: PropTypes.string,
            AddedAt: PropTypes.string,
        })
    ),
};

export default ConsignmentComments;
