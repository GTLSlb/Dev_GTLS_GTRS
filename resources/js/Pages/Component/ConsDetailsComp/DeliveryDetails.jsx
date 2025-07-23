import React from "react";
import moment from "moment";
import PropTypes from "prop-types";

function DeliveryDetails({
    deliveryDetails
}) {
    return (
        <div className="overflow-hidden mx-3 mt-8 bg-white shadow sm:rounded-xl shadow-lg  mx-auto">
            <div className="px-4 pb-3 sm:px-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Delivery Details
                    </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                Delivery required date
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                {deliveryDetails.DelReqDate
                                    ? moment(
                                          deliveryDetails.DelReqDate.replace(
                                              "T",
                                              " "
                                          ),
                                          "YYYY-MM-DD HH:mm:ss"
                                      ).format("DD-MM-YYYY h:mm A")
                                    : null}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Time slot
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                {deliveryDetails.TimeSlot.toString()}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

DeliveryDetails.propTypes = {
    deliveryDetails: PropTypes.shape({
        DelReqDate: PropTypes.string,
        TimeSlot: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default DeliveryDetails;
