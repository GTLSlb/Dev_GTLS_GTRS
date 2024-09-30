import React from "react";

function SenderReceiverDetails({ details, Consignment }) {


    const generateOptions = (Consignment) => {
        return [
            {
                label: "Sender",
                value: Consignment[0].SenderReciever[0].SenderName,
            },
            {
                label: "Receiver",
                value: Consignment[0].SenderReciever[0].ReceiverName,
            },
            {
                label: "Address",
                value: Consignment[0].SenderReciever[0].SenderAddress,
            },
            {
                label: "Address",
                value: Consignment[0].SenderReciever[0].ReceiverAddress,
            },
            {
                label: "Suburb",
                value: Consignment[0].SenderReciever[0].SenderSuburb,
            },
            {
                label: "Suburb",
                value: Consignment[0].SenderReciever[0].ReceiverSuburb,
            },
            {
                label: "State",
                value: Consignment[0].SenderReciever[0].SenderState,
            },
            {
                label: "State",
                value: Consignment[0].SenderReciever[0].ReceiverState,
            },
            {
                label: "Zone",
                value: Consignment[0].SenderReciever[0].SenderZone,
            },
            {
                label: "Zone",
                value: Consignment[0].SenderReciever[0].ReceiverZone,
            },
            {
                label: "Contact",
                value: Consignment[0].SenderReciever[0].SenderContactName,
            },
            {
                label: "Contact",
                value: Consignment[0].SenderReciever[0].ReceiverContactName,
            },
            {
                label: "Job Instructions",
                value: Consignment[0].SenderReciever[0].SenderContactNumber,
            },
            {
                label: "Job Instructions",
                value: Consignment[0].SenderReciever[0].ReceiverContactNumber,
            },
            {
                label: "Site Information",
                value: Consignment[0].SenderReciever[0].SenderSiteInfo,
            },
            {
                label: "Site Information",
                value: Consignment[0].SenderReciever[0].ReceiverSiteInfo,
            },
            {
                label: "Pickup Instructions",
                value: Consignment[0].SenderReciever[0].PickupInstructions,
            },
            {
                label: "Delivery Instructions",
                value: Consignment[0].SenderReciever[0].DeliveryInstructions,
            },
            {
                label: "Sender Ref",
                value: Consignment[0].SenderReciever[0].SenderReference,
            },
            {
                label: "Receiver Ref",
                value: Consignment[0].SenderReciever[0].ReceiverReference,
            },
            // Add more options as needed
        ];
    };

    const sender = Consignment ? generateOptions(Consignment) : [];

    
    return (
        <div className="overflow-hidden mt-8 bg-white sm:rounded-xl shadow-lg  mx-auto">
            <div className="px-4 py-5 sm:px-6">
                <div className="px-4 pb-3 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Sender & Receiver
                    </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div>
                            {sender
                                .reduce((chunks, item, index) => {
                                    if (index % 2 === 0) chunks.push([]);
                                    chunks[chunks.length - 1].push(item);
                                    return chunks;
                                }, [])
                                .map((chunk, index) => (
                                    <div
                                        key={index}
                                        className="py-4 border-t  sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6"
                                    >
                                        {chunk.map((item) => (
                                            <>
                                                <dt className="text-sm font-medium text-gray-900">
                                                    {item.label}
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500 sm:mt-0 col-span-2">
                                                    {item.value}
                                                </dd>
                                            </>
                                        ))}
                                    </div>
                                ))}
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default SenderReceiverDetails;
