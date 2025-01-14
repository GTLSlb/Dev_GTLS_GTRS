import { useState } from "react";
import { useEffect } from "react";
import "../../css/scroll.css";
import moment from "moment";
import { getApiRequest } from "@/CommonFunctions";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AnimatedLoading from "@/Components/AnimatedLoading";
import MainDetails from "./Component/ConsDetailsComp/MainDetails";
import SenderReceiverDetails from "./Component/ConsDetailsComp/SenderReceiverDetails";
import ConsDetailsComp from "./Component/ConsDetailsComp/ConsDetailsComp";
import DeliveryDetails from "./Component/ConsDetailsComp/DeliveryDetails";
import PalletDetails from "./Component/ConsDetailsComp/PalletDetails";
import PickupDelInfo from "./Component/ConsDetailsComp/PickupDelInfo";
export default function ConsDetails({ url, currentUser }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

        handleScrollToTop();

        window.addEventListener("beforeunload", handleScrollToTop);

        return () => {
            window.removeEventListener("beforeunload", handleScrollToTop);
        };
    }, []);
    const [Consignment, setConsignment] = useState(null);

    async function fetchData() {
        const data = await getApiRequest(`${url}ConsignmentById`, {
            UserId: currentUser?.UserId,
            Consignment_id: location?.state?.activeCons,
        });

        if (data) {
            setConsignment(data);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    let width = 0;
    if (Consignment)
        if (
            Consignment[0].MainDetails[0].ConsignmentStatus === "AWAITINGPICKUP"
        ) {
            width = 0;
        } else if (
            Consignment[0].MainDetails[0].ConsignmentStatus === "PICKEDUP"
        ) {
            width = 25;
        } else if (
            Consignment[0].MainDetails[0].ConsignmentStatus === "LOADED"
        ) {
            width = 42;
        } else if (
            Consignment[0].MainDetails[0].ConsignmentStatus === "DEPOT"
        ) {
            width = 59;
        } else if (
            Consignment[0].MainDetails[0].ConsignmentStatus ===
            "ON-FOR-DELIVERY"
        ) {
            width = 75;
        } else if (
            Consignment[0].MainDetails[0].ConsignmentStatus === "DELIVERED"
        ) {
            width = 100;
        }

    if (!Consignment) {
        return <AnimatedLoading />;
    } else {
        return (
            <div>
                <div className="px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="mx-3 py-5">
                        <div className="flex  flex-col gap-y-2">
                            <div className="h-10 flex">
                                <button
                                    type="button"
                                    className="mr-7 h-full inline-flex items-center rounded-md border border-transparent bg-gray-800 px-5 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={() => navigate(-1)}
                                >
                                    <svg
                                        viewBox="0 0 64 64"
                                        fill="currentColor"
                                        height="1.25em"
                                        width="1.25em"
                                    >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinejoin="bevel"
                                            strokeMiterlimit={10}
                                            strokeWidth={5}
                                            d="M37 15L20 32l17 17"
                                        />
                                    </svg>
                                    <span> Back</span>
                                </button>
                            </div>
                            <h4 className="text-2xl font-bold py-2 text-gray-900">
                                Consignment Details :{" "}
                                <span className="text-goldd">
                                    {" "}
                                    {
                                        Consignment[0].MainDetails[0]
                                            .ConsignmentNo
                                    }
                                </span>
                            </h4>
                        </div>
                        <div
                            className="mt-6 hidden md:block"
                            aria-hidden="true"
                        >
                            <div className="overflow-hidden rounded-full bg-gray-300">
                                <div
                                    className="h-2 rounded-full bg-goldd"
                                    style={{ width: `${width}%` }}
                                />
                            </div>
                            <div className="mt-6 hidden grid-cols-6 text-sm font-medium text-gray-600 sm:grid">
                                <div className="text-black font-bold">
                                    Awaiting Pickup
                                </div>
                                <div
                                    className={`text-center ${
                                        width >= 25
                                            ? "text-black font-bold"
                                            : "text-gray-400"
                                    } text-center `}
                                >
                                    Picked Up
                                </div>
                                <div
                                    className={`text-center ${
                                        width >= 42
                                            ? "text-black font-bold"
                                            : "text-gray-400"
                                    } text-center `}
                                >
                                    Loaded
                                </div>
                                <div
                                    className={`text-center ${
                                        width >= 59
                                            ? "text-black font-bold"
                                            : "text-gray-400"
                                    } text-center `}
                                >
                                    Depot
                                </div>
                                <div
                                    className={`text-center ${
                                        width >= 75
                                            ? "text-black font-bold"
                                            : "text-gray-400"
                                    } text-center `}
                                >
                                    On Delivery
                                </div>
                                <div
                                    className={`text-center ${
                                        width >= 100
                                            ? "text-black font-bold"
                                            : "text-gray-400"
                                    } text-right `}
                                >
                                    Delivered
                                </div>
                            </div>
                        </div>
                    </div>

                    {Consignment[0].MainDetails && (
                        <MainDetails
                            mainDetail={Consignment[0].MainDetails[0]}
                        />
                    )}

                    {Consignment[0].ConsReferences && (
                        <div className="overflow-hidden mx-3 mt-8 bg-white shadow sm:rounded-xl shadow-lg  mx-auto">
                            <div className="px-4 pb-3 sm:px-6">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                                        References
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:py-5 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-900">
                                                {Consignment[0].ConsReferences.map(
                                                    (item) => item.Value
                                                ).join(", ")}
                                            </dt>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    )}
                    {Consignment[0].SenderReciever && (
                        <SenderReceiverDetails
                            senderReceiver={Consignment[0].SenderReciever}
                            Consignment={Consignment}
                        />
                    )}

                    {Consignment[0].ConsignmentDetail && (
                        <ConsDetailsComp
                            consDetails={Consignment[0].ConsignmentDetail}
                        />
                    )}

                    {Consignment[0].DeliveryDetails && (
                        <DeliveryDetails
                            deliveryDetails={Consignment[0].DeliveryDetails[0]}
                        />
                    )}

                    {Consignment[0].PalletDetails && (
                        <PalletDetails
                            palletDetails={Consignment[0].PalletDetails[0]}
                        />
                    )}

                    {Consignment[0].PickupDelInfo && (
                        <PickupDelInfo
                            deliveryInfo={Consignment[0].PickupDelInfo}
                        />
                    )}
                </div>
            </div>
        );
    }
}
