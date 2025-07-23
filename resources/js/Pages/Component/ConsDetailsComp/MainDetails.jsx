import React from "react";
import moment from "moment";
import PropTypes from "prop-types";

function MainDetails({ mainDetail }) {
    return (
        <div className="overflow-hidden mx-3 mt-8 bg-white shadow sm:rounded-xl shadow-lg  mx-auto">
            <div className="px-4 pb-3 sm:px-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Main Details
                    </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                Consignment No.
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:mt-0">
                                {mainDetail.ConsignmentNo}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Charge To
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                {mainDetail.ChargeTo}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                Despatch Date
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                {mainDetail.DespatchDate
                                    ? moment(
                                          mainDetail.DespatchDate.replace(
                                              "T",
                                              " "
                                          ),
                                          "YYYY-MM-DD HH:mm:ss"
                                      ).format("DD-MM-YYYY h:mm A")
                                    : null}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Service
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                {mainDetail.Service}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Date Time
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                {mainDetail.DateTime
                                    ? moment(
                                          mainDetail.DateTime.replace("T", " "),
                                          "YYYY-MM-DD HH:mm:ss"
                                      ).format("DD-MM-YYYY h:mm A")
                                    : null}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                General Instruction
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                {mainDetail.GeneralInstructions}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Dangerous Goods
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                {mainDetail.DangerousGoods}
                            </dd>
                        </div>
                        {mainDetail.Status === "FAIL" && (
                            <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Failed Reason
                                </dt>
                                <dd className="mt-1 text-sm text-gray-500 sm:mt-0">
                                    {mainDetail.FailedReason}
                                </dd>
                                <dt className="text-sm font-medium text-gray-900">
                                    Failed Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-500 sm:mt-0 ">
                                    {mainDetail.Faileddesc}
                                </dd>
                                <dt className="text-sm font-medium text-gray-900">
                                    Failed Notes
                                </dt>
                                <dd className="mt-1 text-sm text-gray-500 sm:mt-0 ">
                                    {mainDetail.FailedNote}
                                </dd>
                            </div>
                        )}
                        {mainDetail.Status === "FAIL" && (
                            <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Resolution
                                </dt>
                                <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                    {mainDetail.Resolution}
                                </dd>
                                <dt className="text-sm font-medium text-gray-900">
                                    Reference
                                </dt>
                                <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                    {mainDetail.Reference === 1
                                        ? "Internal"
                                        : mainDetail.Reference === 2
                                        ? "External"
                                        : ""}
                                </dd>
                                <dt className="text-sm font-medium text-gray-900">
                                    Department
                                </dt>
                                <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                    {mainDetail.Department}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
}

MainDetails.propTypes = {
    mainDetail: PropTypes.shape({
        ConsignmentNo: PropTypes.string,
        Status: PropTypes.string,
        Service: PropTypes.string,
        DateTime: PropTypes.string,
        DespatchDate: PropTypes.string,
        GeneralInstructions: PropTypes.string,
        DangerousGoods: PropTypes.string,
        FailedReason: PropTypes.string,  
        Faileddesc: PropTypes.string,
        FailedNote: PropTypes.string,
        Resolution: PropTypes.string,
        Reference: PropTypes.number, 
        Department: PropTypes.string,
        ChargeTo: PropTypes.string,
    }),
};

export default MainDetails;
