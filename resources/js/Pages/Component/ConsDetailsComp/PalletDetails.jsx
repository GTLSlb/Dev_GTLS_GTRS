import React from "react";

function PalletDetails({
    palletDetails,
}) {
    return (
        <div className="overflow-hidden mx-3 mt-8 bg-white shadow sm:rounded-xl shadow-lg  mx-auto">
            <div className="px-4 pb-3 sm:px-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Pallet Details
                    </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-10 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                Pallet/Cubic Spaces
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                {palletDetails.PalletSpaces}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Chep
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                {palletDetails.Chep}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Loscam
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                {palletDetails.Loscam}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Customer Own
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                {palletDetails.CustomerOwn}
                            </dd>
                            <dt className="text-sm font-medium text-gray-900">
                                Docket No
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                {palletDetails.DocketNo}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default PalletDetails;
