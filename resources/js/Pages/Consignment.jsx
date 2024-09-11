import { useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "../../css/scroll.css";
import moment from "moment";
import swal from "sweetalert";
export default function ConsignmentD({
    setActiveIndexGTRS,
    activeCon,
    lastIndex,
    AToken,
    url,
    currentUser,
    userPermission,
}) {
    const handleClick = (i) => {
        setActiveIndexGTRS(lastIndex);
    };
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
    function fetchData() {
        return axios
            .get(
                `${url}ConsignmentById`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                        Consignment_id: activeCon,
                    },
                }
                // ?User_id=${currentUser.user_id}&Consignment_id=${activeCon}
            )
            .then((response) => setConsignment(response.data))
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(function () {
                        axios
                            .post("/logoutAPI")
                            .then((response) => {
                                if (response.status == 200) {
                                    window.location.href = "/";
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                }
            });
    }
    useEffect(() => {
        fetchData();
    }, []);
    let width = 0;
    const sender = Consignment ? generateOptions(Consignment) : [];
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
        return (
            <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                    <div
                        className={`h-4 w-4 bg-goldd rounded-full mr-5 animate-bounce`}
                    ></div>
                    <div
                        className={`h-4 w-4 bg-goldd rounded-full mr-5 animate-bounce200`}
                    ></div>
                    <div
                        className={`h-4 w-4 bg-goldd rounded-full animate-bounce400`}
                    ></div>
                </div>
                <div className="text-dark mt-4 font-bold">
                    Please wait while we get the data for you.
                </div>
            </div>
        );
    } else {
        return (
            <div>
                {/* <Sidebar /> */}

                <div className="px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="mx-3 py-5">
                        <div className="flex  flex-col gap-y-2">
                            <div className="h-10 flex">
                                <button
                                    type="button"
                                    className="mr-7 h-full inline-flex items-center rounded-md border border-transparent bg-gray-800 px-5 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={() => handleClick(3)}
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

                    {Consignment[0].MainDetails ? (
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
                                                {
                                                    Consignment[0]
                                                        .MainDetails[0]
                                                        .ConsignmentNo
                                                }
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Charge To
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                {
                                                    Consignment[0]
                                                        .MainDetails[0].ChargeTo
                                                }
                                            </dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-900">
                                                Despatch Date
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                {Consignment[0].MainDetails[0]
                                                    .DespatchDate
                                                    ? moment(
                                                          Consignment[0].MainDetails[0].DespatchDate.replace(
                                                              "T",
                                                              " "
                                                          ),
                                                          "YYYY-MM-DD HH:mm:ss"
                                                      ).format(
                                                          "DD-MM-YYYY h:mm A"
                                                      )
                                                    : null}
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Service
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                {
                                                    Consignment[0]
                                                        .MainDetails[0].Service
                                                }
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Date Time
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                {Consignment[0].MainDetails[0]
                                                    .DateTime
                                                    ? moment(
                                                          Consignment[0].MainDetails[0].DateTime.replace(
                                                              "T",
                                                              " "
                                                          ),
                                                          "YYYY-MM-DD HH:mm:ss"
                                                      ).format(
                                                          "DD-MM-YYYY h:mm A"
                                                      )
                                                    : null}
                                            </dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-900">
                                                General Instruction
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                {
                                                    Consignment[0]
                                                        .MainDetails[0]
                                                        .GeneralInstructions
                                                }
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Dangerous Goods
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                {
                                                    Consignment[0]
                                                        .MainDetails[0]
                                                        .DangerousGoods
                                                }
                                            </dd>
                                        </div>
                                        {Consignment[0].MainDetails[0]
                                            .Status === "FAIL" && (
                                            <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">
                                                    Failed Reason
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500 sm:mt-0">
                                                    {
                                                        Consignment[0]
                                                            .MainDetails[0]
                                                            .FailedReason
                                                    }
                                                </dd>
                                                <dt className="text-sm font-medium text-gray-900">
                                                    Failed Description
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500 sm:mt-0 ">
                                                    {
                                                        Consignment[0]
                                                            .MainDetails[0]
                                                            .Faileddesc
                                                    }
                                                </dd>
                                                <dt className="text-sm font-medium text-gray-900">
                                                    Failed Notes
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500 sm:mt-0 ">
                                                    {
                                                        Consignment[0]
                                                            .MainDetails[0]
                                                            .FailedNote
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                        {Consignment[0].MainDetails[0]
                                            .Status === "FAIL" && (
                                            <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-900">
                                                    Resolution
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                    {
                                                        Consignment[0]
                                                            .MainDetails[0]
                                                            .Resolution
                                                    }
                                                </dd>
                                                <dt className="text-sm font-medium text-gray-900">
                                                    Reference
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                    {Consignment[0]
                                                        .MainDetails[0]
                                                        .Reference === 1
                                                        ? "Internal"
                                                        : Consignment[0]
                                                              .MainDetails[0]
                                                              .Reference === 2
                                                        ? "External"
                                                        : ""}
                                                </dd>
                                                <dt className="text-sm font-medium text-gray-900">
                                                    Department
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-500  sm:mt-0">
                                                    {
                                                        Consignment[0]
                                                            .MainDetails[0]
                                                            .Department
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    {Consignment[0].SenderReciever ? (
                        <div className="overflow-hidden mx-3 mt-8 bg-white shadow sm:rounded-xl shadow-lg  mx-auto">
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
                                                .reduce(
                                                    (chunks, item, index) => {
                                                        if (index % 2 === 0)
                                                            chunks.push([]);
                                                        chunks[
                                                            chunks.length - 1
                                                        ].push(item);
                                                        return chunks;
                                                    },
                                                    []
                                                )
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
                    ) : (
                        ""
                    )}

                    {Consignment[0].ConsignmentDetail ? (
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
                                                    {/* <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Unit
                                                    </th> */}
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
                                                {Consignment[0].ConsignmentDetail?.map(
                                                    (item) => (
                                                        <tr className=" ">
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                                {
                                                                    item.Description
                                                                }
                                                            </td>
                                                            {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                                {item.Unit}
                                                            </td> */}
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
                                                                {
                                                                    item.PalletSpace
                                                                }
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
                    ) : (
                        ""
                    )}

                    {Consignment[0].DeliveryDetails ? (
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
                                                {Consignment[0]
                                                    .DeliveryDetails[0]
                                                    .DelReqDate
                                                    ? moment(
                                                          Consignment[0].DeliveryDetails[0].DelReqDate.replace(
                                                              "T",
                                                              " "
                                                          ),
                                                          "YYYY-MM-DD HH:mm:ss"
                                                      ).format(
                                                          "DD-MM-YYYY h:mm A"
                                                      )
                                                    : null}
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Time slot
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                                {Consignment[0].DeliveryDetails[0].TimeSlot.toString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    {Consignment[0].PalletDetails ? (
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
                                                {
                                                    Consignment[0]
                                                        .PalletDetails[0]
                                                        .PalletSpaces
                                                }
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Chep
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                                {
                                                    Consignment[0]
                                                        .PalletDetails[0].Chep
                                                }
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Loscam
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                                {
                                                    Consignment[0]
                                                        .PalletDetails[0].Loscam
                                                }
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Customer Own
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                                {
                                                    Consignment[0]
                                                        .PalletDetails[0]
                                                        .CustomerOwn
                                                }
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-900">
                                                Docket No
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                                                {
                                                    Consignment[0]
                                                        .PalletDetails[0]
                                                        .DocketNo
                                                }
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    {Consignment[0].PickupDelInfo ? (
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
                                                    {/* <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                    >
                                                        Type
                                                    </th> */}
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
                                                {Consignment[0].PickupDelInfo?.map(
                                                    (item) => (
                                                        <tr className=" ">
                                                            {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                                {item.Type}
                                                            </td> */}
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                                {item.PODdateTime.replace(
                                                                    "T",
                                                                    " "
                                                                )}
                                                            </td>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-3">
                                                                <a
                                                                    href={
                                                                        item.PODimage
                                                                    }
                                                                    target="_blank"
                                                                    className="text-indigo-600 hover:text-goldds"
                                                                >
                                                                    {
                                                                        item.PODimage
                                                                    }
                                                                </a>
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
                    ) : (
                        ""
                    )}
                    {/* <div className="overflow-hidden mx-3 mt-8 bg-white shadow sm:rounded-xl shadow-lg  mx-auto">
                            <div className="px-4 pb-3 sm:px-6">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                                        POD Details
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 col-span-3">
                                                file.pdf
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900  sm:mt-0 col-span-2">
                                                Download
                                            </dd>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Click to enlarge
                                            </dt>
                                        </div>
                                    </dl>
                                </div>
                                </div>
                            </div> */}
                </div>
            </div>
        );
    }
}
