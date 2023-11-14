import { useEffect, useState } from "react";
import InvoicesButton from "../components/InvoicesButton";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import PdfPreview from "../components/PdfPreview";
import moment from "moment";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

export default function Invoice({
    setActiveIndexInv,
    setInvoiceDetails,
    invoiceDetails,
    AlertToast,
    states,
    url,
    getInvoices,
    supplierData,
    companies,
    services,
    categories,
    currentUser,
    hubConnection,
}) {
    useEffect(() => {
        getInvoicesbyId(invoiceDetails.InvoiceId);
    }, []);
    useEffect(() => {
        authorizeToEditReject();
        authorityToEditApprove();
        setauthorizeToPay(authorityToPay());
    }, [invoiceDetails]);
    function getInvoicesbyId(InvoiceId) {
        axios
            .get(`${url}/api/GTIS/Invoices`, {
                headers: {
                    UserId: currentUser.user_id,
                    InvoiceId: InvoiceId,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setInvoiceDetails(parsedData[0]);
                    authorizeToEditReject();
                    authorityToPay();
                    authorityToEditApprove();
                    setActiveIndexInv(6);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const [isLoadingApprove, SetIsLoadingApprove] = useState(false);
    const [createdby, setCreatedBy] = useState();
    axios.get(`/findUserById/${invoiceDetails.AddedBy}`).then((res) => {
        setCreatedBy(res.data.user_name);
    });
    function GoBack() {
        setActiveIndexInv(1);
    }
    const [selectedFileName] = useState(invoiceDetails.InvoicePic);
    const getFileUrl = (filename) => {
        return `../../../../../../Invoices/${filename}`; // Replace 'invoices' with the appropriate folder name
    };
    function authorityToEditApprove() {
        if (currentUser.role_id == 6 || currentUser.role_id == 9) {
            // if state manager
            if (invoiceDetails.SecondApproval == 2) {
                //if second Approved Already
                return false; //Hide Approve button
            } else if (invoiceDetails.ApprovalStatus != 2) {
                // if second approval is waiting and first approval also waiting
                return true; // Show approve Button
            } else {
                return false; // Else Hide the button
            }
        } else if (currentUser.role_id == 10) {
            // if CEO
            if (invoiceDetails.SecondApproval == 2) {
                // payment type 2 = >  cash 
                // payment status true => paid
                return false;
            } else {
                return true; // else show it
            }
        }
    }
    const [processedData, setProcessedData] = useState([]);

    const searchUserByName = async (userId) => {
        try {
            const response = await axios.get(`/findUserById/${userId}`);
            return response.data.user_name;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return "User not found";
        }
    };
    function showHidelogsSection() {
        if (currentUser.role_id == 10 || currentUser.role_id == 1) {
            return true;
        } else {
            return false;
        }
    }
    function convertUtcToUserTimezone(utcDateString) {
        // Create a Date object from the UTC date string
        const utcDate = new Date(utcDateString);
        
        // Get the current user's timezone
        const targetTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
        const formatter = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: targetTimezone,
        });
    
        const convertedDate = formatter.format(utcDate);
        return convertedDate;
    }
    
    useEffect(() => {
        if (showHidelogsSection() == true) {
            const fetchLogsAndReplaceData = async () => {
                try {
                    const inputValues = {
                        Model: 1,
                        MainId: invoiceDetails.InvoiceId,
                    };
                    const response = await axios.post(
                        `${url}api/GTIS/Logs`,
                        inputValues,
                        {
                            headers: {
                                UserId: currentUser.user_id,
                            },
                        }
                    );

                    const logsData = response.data;
                    const processedData = await Promise.all(
                        logsData.map(async (item) => {
                            const newItem = { ...item };
                            if (item.CreatedBy) {
                                newItem.CreatedBy = await searchUserByName(
                                    item.CreatedBy
                                );
                            }
                            if (item.CreatedAt) {
                                newItem.CreatedAt = convertUtcToUserTimezone(
                                    item.CreatedAt + "Z"
                                );
                            }
                            if (item.Approval) {
                                newItem.Approval = await Promise.all(
                                    item.Approval.map(async (approval) => {
                                        approval.ApprovedBy =
                                            await searchUserByName(
                                                approval.ApprovedBy
                                            );
                                        approval.ApprovedAt =
                                            convertUtcToUserTimezone(
                                                approval.ApprovedAt + "Z"
                                            );
                                        return approval;
                                    })
                                );
                            }
                            if (item.Payment) {
                                newItem.Payment = await Promise.all(
                                    item.Payment.map(async (match) => {
                                        match.PaidBy = await searchUserByName(
                                            match.PaidBy
                                        );
                                        match.PaidAt = convertUtcToUserTimezone(
                                            match.PaidAt + "Z"
                                        );
                                        return match;
                                    })
                                );
                            }

                            return newItem;
                        })
                    );
                    setProcessedData(processedData);
                } catch (error) {
                    AlertToast("Error with showing logs.", 2);
                    console.log(error);
                }
            };
            fetchLogsAndReplaceData();
        }
    }, []);

    function authorizeToEditReject() {
        if (currentUser.role_id == 6 || currentUser.role_id == 9) {
            // If State Manager
            if (invoiceDetails.SecondApproval == 1) {
                // if there's no second approval or rejection
                if (invoiceDetails.ApprovalStatus != 3) {
                    // if it not already rejected by SM
                    if (invoiceDetails.PaymentStatus == false) {
                        // if not paid already
                        return true; // Show the rejection Button
                    } else {
                        // if already paid
                        return false; //Dont Show the rejection Button
                    }
                }
            }
        } else if (currentUser.role_id == 10) {
            // if CEO
            if (invoiceDetails.SecondApproval != 3) {
                //  if not already rejected
                if (
                    invoiceDetails.PaymentTypeId == 2 &&
                    invoiceDetails.PaymentStatus == true
                ) {
                    // if payment type is cash && it's already paid
                    return false;
                } else return true;
            }
        } else {
            return false; // can't pay
        }
    }
    function authorityToPay() {
        if (currentUser.role_id == 8) {
            // if Audit Team
            if (invoiceDetails.SecondApproval == 2) {
                // If it second Approved
                return true; // Can Pay
            } else {
                return false; // Can't Pay
            }
        } else {
            return false; // no one else can pay
        }
    }
    const [authorizeToEditApprove, setauthorizeToEditApprove] = useState(
        authorityToEditApprove()
    );
    const [authorizeToPay, setauthorizeToPay] = useState(authorityToPay());
    function PayInvoice(status) {
        SetIsLoadingApprove(true);
        const inputValues = {
            InvoiceId: invoiceDetails.InvoiceId,
        };
        axios
            .post(`${url}api/GTIS/PayInvoice`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                    Payment_Status: status,
                },
            })
            
            .then((res) => {
                console.log(res)
                getInvoices();
                if (status == 1) {
                    AlertToast("Paid Successfully", 1);
                } else {
                    AlertToast("Not Paid Successfully", 1);
                }
                setActiveIndexInv(1);
                SetIsLoadingApprove(false);
            })
            .catch((err) => {

                AlertToast("Error please try again.", 2);
                console.log(err);
                SetIsLoadingApprove(false);
            });
    }
    function ApproveInvoice(status) {
        SetIsLoadingApprove(true);
        let toApprove={OwnerId:invoiceDetails?.InvoiceId}
        let type = 0;
        if (currentUser.role_id == 10) {
            type = 2;
        } else {
            type = 1;
        }
        const inputValues = {
            ApprovalModel: 1,
            ApprovalType: type,
            MainId: toApprove,
            StatusId: status,
            AddedBy: currentUser.user_id,
        };
        axios
            .post(`${url}api/GTIS/ApprovalStatus`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                console.log(res.data)
                getInvoices();
                if (status == 2) {
                    AlertToast("Approved Successfully", 1);
                } else if (status == 3) {
                    AlertToast("Rejected Successfully", 1);
                }
                setActiveIndexInv(1);
                SetIsLoadingApprove(false);
                if (
                    hubConnection &&
                    hubConnection.state === signalR.HubConnectionState.Connected
                ) {
                    hubConnection
                        .invoke("SendNotification", res.data)
                        .catch((error) => {
                            console.error("Error sending notification:", error);
                        });
                }
            })
            .catch((err) => {
                SetIsLoadingApprove(false);
                AlertToast("Error please try again.", 2);
                console.log(err);
            });
    }
    return (
        <div className="bg-smooth">
            <div className="grid grid-cols-1 xl:grid-cols-2 p-5 gap-x-5 gap-y-5 ">
                <div className="rounded-xl shadow bg-white p-5 ">
                    <h1 className="font-bold text-dark text-3xl">
                        Invoice #{" "}
                        <span className="text-goldd">
                            {invoiceDetails.InvoiceNo}
                        </span>
                    </h1>
                    <div className="grid grid-cols-2 p-2 gap-y-3 pb-20 mt-5 text-sm sm:text-base">
                        {" "}
                        {invoiceDetails.PoNb ? (
                            <div className="col-span-2 grid grid-cols-2">
                                {" "}
                                <h1 className="text-gray-400">PO#:</h1>
                                <p className="font-bold">
                                    {invoiceDetails.PoNb}
                                </p>
                            </div>
                        ) : null}
                        <h1 className="text-gray-400">Supplier:</h1>
                        <p className="font-bold">
                            {
                                supplierData?.find(
                                    (supplier) =>
                                        supplier.SupplierId ===
                                        invoiceDetails.SupplierId
                                )?.SupplierName
                            }
                        </p>
                        <h1 className="text-gray-400">Company:</h1>
                        <p className="font-bold">
                            {
                                companies?.find(
                                    (company) =>
                                        company.CompanyId ===
                                        invoiceDetails.CompanyId
                                )?.CompanyName
                            }
                        </p>
                        <h1 className="text-gray-400">Category:</h1>
                        <p className="font-bold">
                            {
                                categories?.find(
                                    (category) =>
                                        category.CategoryId ===
                                        invoiceDetails.CategoryId
                                )?.CategoryName
                            }
                        </p>
                        <h1 className="text-gray-400">State:</h1>
                        <p className="font-bold">
                            {
                                states?.find(
                                    (state) =>
                                        state.StateId === invoiceDetails.StateId
                                )?.StateCode
                            }
                        </p>
                        <h1 className="text-gray-400">Date:</h1>
                        <p className="font-bold">
                            {invoiceDetails.DueDate
                                ? moment(
                                      invoiceDetails.DueDate.replace("T", " "),
                                      "YYYY-MM-DD"
                                  ).format("DD-MM-YYYY")
                                : ""}
                        </p>
                        <h1 className="text-gray-400">Due Date:</h1>
                        <p className="font-bold">
                            {invoiceDetails.DueDate
                                ? moment(
                                      invoiceDetails.DueDate.replace("T", " "),
                                      "YYYY-MM-DD"
                                  ).format("DD-MM-YYYY")
                                : ""}
                        </p>
                        <h1 className="text-gray-400">Description:</h1>
                        <p className="font-bold">
                            {invoiceDetails.Description}
                        </p>
                        <h1 className="text-gray-400">Amount:</h1>
                        <p className="font-bold">{invoiceDetails.Amount}</p>
                        <h1 className="text-gray-400">Payment Type:</h1>
                        <p className="font-bold">
                            {invoiceDetails.PaymentTypeId === 1
                                ? "Credit Card"
                                : invoiceDetails.PaymentTypeId === 2
                                ? "Cash"
                                : ""}
                        </p>
                        {invoiceDetails.PaymentTypeId === 1 ? (
                            <div className="col-span-2 grid grid-cols-2">
                                <h1 className="text-gray-400">Payment Bank:</h1>
                                <p className="font-bold">
                                    {invoiceDetails.ProcessedBank}
                                </p>
                            </div>
                        ) : null}
                        {invoiceDetails.PaymentTypeId === 1 ? (
                            <div className="col-span-2 grid grid-cols-2">
                                <h1 className="text-gray-400">Payment Date:</h1>
                                <p className="font-bold">
                                    {invoiceDetails.PaymentDate
                                        ? moment(
                                              invoiceDetails.PaymentDate.replace(
                                                  "T",
                                                  " "
                                              ),
                                              "YYYY-MM-DD"
                                          ).format("DD-MM-YYYY")
                                        : ""}
                                </p>
                            </div>
                        ) : null}
                        <h1 className="text-gray-400">Invoice Date:</h1>
                        <p className="font-bold">
                            {invoiceDetails.InvoiceDate
                                ? moment(
                                      invoiceDetails.InvoiceDate.replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD"
                                  ).format("DD-MM-YYYY")
                                : ""}
                        </p>
                        <h1 className="text-gray-400">POD Required:</h1>
                        <p className="font-bold">
                            {
                                <div>
                                    {" "}
                                    {invoiceDetails.PodRequired == true ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            true
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                            false
                                        </span>
                                    )}
                                </div>
                            }
                        </p>
                        <h1 className="text-gray-400">Status:</h1>
                        <p className="font-bold">
                            {
                                <div>
                                    {" "}
                                    {invoiceDetails.ApprovalStatus == 1 ? (
                                        <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                            Waiting
                                        </span>
                                    ) : invoiceDetails.ApprovalStatus == 2 ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                            Rejected
                                        </span>
                                    )}
                                </div>
                            }
                        </p>
                        <h1 className="text-gray-400">Second approval:</h1>
                        <p className="font-bold">
                            {" "}
                            {
                                <div>
                                    {" "}
                                    {invoiceDetails.SecondApproval == 1 ? (
                                        <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                            Waiting
                                        </span>
                                    ) : invoiceDetails.SecondApproval == 2 ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                            Rejected
                                        </span>
                                    )}
                                </div>
                            }
                        </p>
                        <h1 className="text-gray-400">Paid:</h1>
                        <p className="font-bold">
                            {
                                <div>
                                    {" "}
                                    {invoiceDetails.PaymentStatus == true ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            paid
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                            not paid
                                        </span>
                                    )}
                                </div>
                            }
                        </p>
                        <h1 className="text-gray-400">Created By:</h1>
                        <p className="font-bold">{createdby}</p>
                    </div>
                    <div className="flex justify-end w-full gap-x-2">
                        <InvoicesButton
                            name="Back"
                            onClick={() => {
                                GoBack();
                            }}
                            icon={<ChevronLeftIcon className="mr-1 h-5" />}
                        />
                        {
                            <div className="">
                                {" "}
                                {authorizeToEditApprove ? (
                                    <div className="flex justify-end w-full gap-x-2">
                                        <InvoicesButton
                                            name="Approve"
                                            disabled={isLoadingApprove}
                                            onClick={() => {
                                                ApproveInvoice(2);
                                            }}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        }
                        {
                            <div className="">
                                {" "}
                                {authorizeToEditReject() ? (
                                    <div className="flex justify-end w-full gap-x-2">
                                        <InvoicesButton
                                            disabled={isLoadingApprove}
                                            name="Reject"
                                            onClick={() => {
                                                ApproveInvoice(3);
                                            }}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        }
                        {
                            <div className="">
                                {" "}
                                {authorizeToPay ? (
                                    <div className="flex justify-end w-full gap-x-2">
                                        {invoiceDetails?.PaymentStatus == 
                                        false ? (
                                            <InvoicesButton
                                                name="Pay"
                                                disabled={isLoadingApprove}
                                                onClick={() => {
                                                    PayInvoice(1);
                                                }}
                                            />
                                        ) : (
                                            <InvoicesButton
                                                name="Unpay"
                                                disabled={isLoadingApprove}
                                                onClick={() => {
                                                    PayInvoice(0);
                                                }}
                                            />
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        }
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                    {/* pdf preview */}
                    {/* <a href={`Invoices/${invoiceDetails.InvoicePic}`} target="_blank" rel="noopener noreferrer">
                            View File
                        </a> */}
                    <div>
                        <PdfPreview pdfUrls={invoiceDetails.InvoiceDoc} />
                    </div>
                </div>
                {showHidelogsSection() ? (
                    <div>
                        {" "}
                        {processedData ? (
                            <div className="xl:col-span-2 bg-white rounded-xl shadow p-5">
                                <div className="font-bold py-2 border-b w-auto text-lg">
                                    Created by {processedData[0]?.CreatedBy} at{" "}
                                    {moment(
                                        processedData[0]?.CreatedAt.replace(
                                            "T",
                                            " "
                                        ),

                                        "MM/DD/YYYY, h:mm:ss A"
                                    ).format("YYYY-MM-DD hh:mm A") ==
                                    "Invalid date"
                                        ? ""
                                        : moment(
                                              processedData[0]?.CreatedAt.replace(
                                                  "T",
                                                  " "
                                              ),

                                              "MM/DD/YYYY, h:mm:ss A"
                                          ).format("YYYY-MM-DD hh:mm A")}
                                </div>
                                <ol class="relative border-l border-gray-200 dark:border-gray-700">
                                    {processedData[0]?.Approval?.map((item) => (
                                        <li class="mb-10 ml-4">
                                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                {moment(
                                                    item?.ApprovedAt.replace(
                                                        "T",
                                                        " "
                                                    ),

                                                    "MM/DD/YYYY, h:mm:ss A"
                                                ).format(
                                                    "YYYY-MM-DD hh:mm A"
                                                ) == "Invalid date"
                                                    ? ""
                                                    : moment(
                                                          item?.ApprovedAt.replace(
                                                              "T",
                                                              " "
                                                          ),

                                                          "MM/DD/YYYY, h:mm:ss A"
                                                      ).format(
                                                          "YYYY-MM-DD hh:mm A"
                                                      )}
                                            </time>
                                            <h3 class="text-lg font-semibold text-gray-900">
                                                {item.ApprovedBy} has{" "}
                                                {item.ApprovalStatus == 2
                                                    ? "approved"
                                                    : "rejected"}{" "}
                                                this invoice
                                            </h3>
                                        </li>
                                    ))}
                                    {processedData[0]?.Payment?.map((item) => (
                                        <li class="mb-10 ml-4">
                                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                {moment(
                                                    item.PaidAt.replace(
                                                        "T",
                                                        " "
                                                    ),
                                                    "MM/DD/YYYY, h:mm:ss A"
                                                ).format("YYYY-MM-DD hh:mm A")}
                                            </time>
                                            <h3 class="text-lg font-semibold text-gray-900">
                                                {item.PaidBy} has{" "}
                                                {item.PaymentStatus == 1
                                                    ? "paid"
                                                    : "unpaid"}{" "}
                                                this invoice
                                            </h3>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ) : null}{" "}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
