import InvoicesButton from "../components/InvoicesButton";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import DropBox from "../components/DropBox";
import moment from "moment";
import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import * as signalRCore from "@microsoft/signalr";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function POdetails({
    setActiveIndexInv,
    states,
    url,
    closeReasons,
    AlertToast,
    PODetails,
    setPODetails,
    supplierData,
    POBack,
    companies,
    categories,
    currentUser,
    getPOs,
    getInvoices,
    hubConnection,
    invoices,
}) {
    
    const [processedData, setProcessedData] = useState([]);
    const [isLoading, SetIsLoading] = useState(false);
    const [isLoadingApprove, SetIsLoadingApprove] = useState(false);
    const [createdby, setCreatedBy] = useState();
    axios.get(`/findUserById/${PODetails?.AddedBy}`).then((res) => {
        setCreatedBy(res.data.user_name);
    });
    useEffect(() => {
        getPObyId(PODetails.PoId);
    }, []);
    useEffect(() => {
        authorizeToEditReject();
        setauthorizeToEditApprove(authorityToEditApprove());
        setauthorizeToConvert(authorityToConvert());
    }, [PODetails]);
    function getPObyId(POId) {
        axios
            .get(`${url}api/GTIS/POs`, {
                headers: {
                    UserId: currentUser.user_id,
                    PO_Id: POId,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setPODetails(parsedData[0]);
                    setActiveIndexInv(9);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
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
        const fetchLogsAndReplaceData = async () => {
            try {
                const inputValues = {
                    Model: 2,
                    MainId: PODetails.PoId,
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
                                    if (approval.ApprovedBy) {
                                        approval.ApprovedBy =
                                            await searchUserByName(
                                                approval.ApprovedBy
                                            );
                                    }
                                    if (approval.ApprovedAt) {
                                        approval.ApprovedAt =
                                            convertUtcToUserTimezone(
                                                approval.ApprovedAt + "Z"
                                            );
                                    }
                                    return approval;
                                })
                            );
                        }

                        if (item.MatchInvoice) {
                            newItem.MatchInvoice = await Promise.all(
                                item.MatchInvoice.map(async (match) => {
                                    if (match.AddedBy) {
                                        match.AddedBy = await searchUserByName(
                                            match.AddedBy
                                        );
                                    }
                                    if (match.AddedAt) {
                                        match.AddedAt =
                                            convertUtcToUserTimezone(
                                                match.AddedAt + "Z"
                                            );
                                    }
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
    }, []);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [paymentType, setPaymentType] = useState(2);
    const [selectedReason, setSelectedReason] = useState(
        closeReasons.filter((item) => item.StatusId == 1)[0]
    );
    const [showClose, setshowClose] = useState(false);
    const [existedFiles, setExistedFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [paymentField, setpaymentField] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(0);
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    function GoBack() {
        setActiveIndexInv(POBack);
    }
    function authorizeToEditReject() {
        if (currentUser.role_id == 6 || currentUser.role_id == 9) {
            // If State Manager
            if (PODetails.SecondApproval == 1) {
                // if there's no second approval or rejection
                if (PODetails.ApprovalStatus != 3) {
                    // if it not already rejected by SM
                    if (PODetails.MatchInvoice == 1) {
                        //If the match invoice status is still waiting
                        return true; // Show the rejection Button
                    } else {
                        // if the match invoice status is not waiting anymore
                        return false; //Dont Show the rejection Button
                    }
                }
            }
        } else if (currentUser.role_id == 10) {
            // if CEO
            if (PODetails.SecondApproval != 3) {
                //  if not already rejected
                if (PODetails.MatchInvoice == 1) {
                    //If the match invoice status is still waiting
                    return true;
                } else {
                    //If the match invoice status is not waiting anymore
                    return false;
                }
            } else {
                //if the secondApproval is rejected
                return false;
            }
        } else {
            return false; // can't pay
        }
    }
    function authorityToEditApprove() {
        if (currentUser.role_id == 6 || currentUser.role_id == 9) {
            // if state manager
            if (PODetails.SecondApproval == 2) {
                //if second Approved Already
                return false; //Hide Approve button
            } else if (PODetails.ApprovalStatus != 2) {
                // if second approval is waiting and first approval also waiting
                if (PODetails.MatchInvoice == 1) {
                    //If the match invoice status is still waiting
                    return true; // Show the rejection Button
                } else {
                    // if the match invoice status is not waiting anymore
                    return false; //Dont Show the rejection Button
                } // Else Hide the button
            }
        } else if (currentUser.role_id == 10) {
            // If CEO
            if (PODetails.SecondApproval != 2) {
                // If not already approved
                if (PODetails.MatchInvoice == 1) {
                    //If the match invoice status is still waiting
                    return true; // Show the rejection Button
                } else {
                    // if the match invoice status is not waiting anymore
                    return false; //Dont Show the rejection Button
                }
            } else {
                return false; //Dont Show the Approval Button
            }
        }
    }
    const [authorizeToEditApprove, setauthorizeToEditApprove] = useState(
        authorityToEditApprove()
    );
    function authorityToConvert() {
        if (
            currentUser.role_id == 8 &&
            PODetails.SecondApproval == 2 &&
            PODetails.MatchInvoice == 1
        ) {
            return true;
        } else {
            return false;
        }
    }
    const [authorizeToConvert, setauthorizeToConvert] = useState(
        authorityToConvert()
    );
    let filenamesArray = [];
    const handleFileUpload = async () => {
        if (newFiles.length > 0) {
            try {
                const uploadPromises = newFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                        const response = await axios.post(
                            "/api/upload",
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );

                        if (response.status === 200) {
                            const filename = response.data.filename;
                            filenamesArray.push({
                                DocId: null,
                                DocName: filename,
                                DocStatus: 1,
                            });
                            // You can perform any additional actions here for each uploaded file if needed
                        } else {
                        }
                    } catch (error) {
                        console.error("Error:", error);
                    }
                });

                // Wait for all uploads to complete before proceeding
                await Promise.all(uploadPromises);

                // After all uploads are complete, you can proceed with further actions
                handleConverToInvoice();
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            handleConverToInvoice();
        }
    };
    function determinePaymentStatus() {
        const value = event.target.value;

        if (value == 1) {
            //if credit card type

            setPaymentType(value); // set the value of the payment Type

            setPaymentStatus(1); // Set the payment status true if the payment is credit card
        } else {
            //if cash type

            setPaymentStatus(0); // Set the payment status true if the payment is Cash

            setPaymentType(value); // set the value of the payment Type
        }
    }
    const handleConverToInvoice = () => {
        SetIsLoading(true);
        // defineApprovalStatus();
        existedFiles.map((file) => {
            filenamesArray.push({
                DocId: file.DocId,
                DocName: file.DocName,
                DocStatus: file.DocStatus,
            });
        });
        // Get the input values here and update the newobject state
        let PodRequired = 0;
        let Paid = 0;
        if (document.getElementById("PodRequired")?.value == "on") {
            PodRequired = 1;
        }
        if (document.getElementById("PaymentStatus")?.value == "on") {
            Paid = 1;
        }

        const inputValues = {
            InvoiceDate: document.getElementById("InvoiceDate").value,
            InvoiceNo: document.getElementById("InvoiceNo").value,
            DueDate: document.getElementById("DueDate").value,
            PaymentTypeId: document.getElementById("PaymentTypeId").value,
            ProcessedBank: document.getElementById("ProcessedBank")?.value,
            PaymentDate: document.getElementById("PaymentDate")?.value,
            PaymentStatus: paymentStatus,
            PodRequired: PodRequired,
            InvoiceDoc: filenamesArray,
            AddedBy: currentUser.user_id,
        };
        const duplicateInvoice = invoices.find(
            (invoice) =>
                invoice.InvoiceNo === inputValues.InvoiceNo &&
                invoice.SupplierId === PODetails.SupplierId
        );
        if (duplicateInvoice) {
            SetIsLoading(false);
            AlertToast("An Invoice # for the same supplier already exist", 2);
            return;
        }
        axios
            .post(`${url}api/GTIS/MatchInvoice`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                    PO_Id: PODetails.PoId,
                },
            })
            .then((res) => {
                AlertToast("Converted Successfully", 1);
                setActiveIndexInv(2);
                getInvoices();
                getPOs();
                SetIsLoading(false);
                const fileNamesToDelete = existedFiles
                    .filter((file) => file.DocStatus === 2)
                    .map((file) => file.DocName);
                // deleteFilesWithStatusTwo(fileNamesToDelete);
            })
            .catch((err) => {
                console.log(err);
                SetIsLoading(false);
                AlertToast("Error please try again.", 2);
            });
    };

    function HideShowPaymenFields() {
        if (paymentType == 1) {
            setpaymentField(false);
        } else {
            setpaymentField(true);
        }
    }
    useEffect(() => {
        HideShowPaymenFields();
        authorityToConvert();
        // HideShowPaymentStatusBasedOnRole();
    }, [paymentType]);
    function determinePaymentStatus() {
        const value = event.target.value;
        if (value == 1) {
            //if credit card type
            setPaymentType(value); // set the value of the payment Type
            setPaymentStatus(1); // Set the payment status true if the payment is credit card
        } else {
            //if cash type
            setPaymentStatus(0); // Set the payment status true if the payment is Cash
            setPaymentType(value); // set the value of the payment Type
        }
    }
    function ApprovePO(status) {
        SetIsLoadingApprove(true);
        toApprove={OwnerId:PODetails?.PoId}
        let type = 0;
        if (currentUser.role_id == 10) {
            type = 2;
        } else {
            type = 1;
        }
        const inputValues = {
            ApprovalModel: 2,
            ApprovalType: type,
            MainId:toApprove ,
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
                getPOs();
                if (status == 2) {
                    AlertToast("Approved Successfully", 1);
                } else if (status == 3) {
                    AlertToast("Rejected Successfully", 1);
                }
                setActiveIndexInv(2);
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
            });
    }
    function ClosePO() {
        const inputValues = {
            PoId: PODetails?.PoId,
            ReasonId: selectedReason.ReasonId,
            Description: document.getElementById("Reason").value,
        };
        axios
            .post(`${url}api/GTIS/ClosePO`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                AlertToast("Closed Successfully", 1);
                setActiveIndexInv(2);
                getPOs();
            })
            .catch((err) => {
                console.log(err);
                AlertToast("Error please try again.", 2);
            });
    }
    const validateForm = (e) => {
        e.preventDefault();
        if (invoiceNo === "" || invoiceDate === "" || dueDate === "") {
            AlertToast("Please fill in all required fields !", 2);
        } else {
            handleFileUpload();
        }
    };

    if (authorizeToConvert) {
        return (
            <div className="bg-smooth">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 p-5">
                    {/* Approve or Edit Po Part */}
                    <div className="rounded-xl bg-white shadow h-auto  p-5">
                        <h1 className="text-dark font-bold text-2xl">
                            PO #{" "}
                            <span className="text-goldd">{PODetails.PoNo}</span>
                        </h1>
                        <div className="grid grid-cols-2 p-2 gap-y-3 pb-5 mt-5 text-sm sm:text-base">
                            <h1 className="text-gray-400">State:</h1>
                            <p className="font-bold">
                                {
                                    states?.find(
                                        (state) =>
                                            state.StateId === PODetails.StateId
                                    )?.StateCode
                                }
                            </p>
                            <h1 className="text-gray-400">Supplier:</h1>
                            <p className="font-bold">
                                {
                                    supplierData?.find(
                                        (supplier) =>
                                            supplier.SupplierId ===
                                            PODetails.SupplierId
                                    )?.SupplierName
                                }
                            </p>
                            <h1 className="text-gray-400">Company:</h1>
                            <p className="font-bold">
                                {
                                    companies?.find(
                                        (company) =>
                                            company.CompanyId ===
                                            PODetails.CompanyId
                                    )?.CompanyName
                                }
                            </p>
                            <h1 className="text-gray-400">Category:</h1>
                            <p className="font-bold">
                                {
                                    categories?.find(
                                        (category) =>
                                            category.CategoryId ===
                                            PODetails.CategoryId
                                    )?.CategoryName
                                }
                            </p>
                            <h1 className="text-gray-400">PO Date:</h1>
                            <p className="font-bold">
                                {}
                                {moment(
                                    PODetails.PoDate.replace("T", " "),
                                    "YYYY-MM-DD HH:mm:ss"
                                ).format("DD-MM-YYYY h:mm A")}
                            </p>
                            <h1 className="text-gray-400">Approval Status:</h1>
                            <p className="font-bold">
                                {" "}
                                {
                                    <div>
                                        {" "}
                                        {PODetails.ApprovalStatus == 1 ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                Waiting
                                            </span>
                                        ) : PODetails.ApprovalStatus == 2 ? (
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
                                        {PODetails.SecondApproval == 1 ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                Waiting
                                            </span>
                                        ) : PODetails.SecondApproval == 2 ? (
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
                            <h1 className="text-gray-400">Match invoice:</h1>
                            <p className="font-bold">
                                {" "}
                                {
                                    <div>
                                        {" "}
                                        {PODetails.MatchInvoice == 1 ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                Waiting
                                            </span>
                                        ) : PODetails.MatchInvoice == 2 ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                Match
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                Closed
                                            </span>
                                        )}
                                    </div>
                                }
                            </p>
                            <h1 className="text-gray-400">Description:</h1>
                            <p className="font-bold">{PODetails.Description}</p>
                            <h1 className="text-gray-400">Amount:</h1>
                            <p className="font-bold">{PODetails.Amount}</p>
                            <h1 className="text-gray-400">File:</h1>
                            <ul>
                                {PODetails.PoDoc?.filter(
                                    (file) => file.DocStatus === 1
                                ).map((file, index) => (
                                    <li
                                        key={index}
                                        className="justify-between flex"
                                    >
                                        {/* {renderPreview(file)} */}
                                        <a
                                            href={`/POs/${file.DocName}`}
                                            target="_blank"
                                            className="text-blue-500 underline truncate"
                                            rel="noopener noreferrer"
                                        >
                                            <span>{file.DocName}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>

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
                                    <div className="">
                                        <div className="flex justify-end w-full gap-x-2">
                                            {authorizeToEditApprove ? (
                                                <InvoicesButton
                                                    name="Approve"
                                                    disabled={isLoadingApprove}
                                                    onClick={() => {
                                                        ApprovePO(2);
                                                    }}
                                                />
                                            ) : null}
                                            {authorizeToEditReject() ? (
                                                <InvoicesButton
                                                    name="Reject"
                                                    disabled={isLoadingApprove}
                                                    onClick={() => {
                                                        ApprovePO(3);
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                    <div>
                                        {PODetails.ClosePO ? null : (
                                            <div className="flex justify-end w-full gap-x-2">
                                                {authorizeToConvert ? (
                                                    <InvoicesButton
                                                        name="Close"
                                                        onClick={() => {
                                                            setshowClose(
                                                                !showClose
                                                            );
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                        )}{" "}
                                    </div>
                                </div>
                            }
                        </div>
                        {showClose ? (
                            <div className="">
                                <h1 className="text-dark font-bold text-2xl">
                                    Reason for closing
                                </h1>
                                <div className="grid grid-cols-2 p-2 gap-y-2 mt-5 text-sm sm:text-base">
                                    <h1 className="text-gray-400 border-b">
                                        Reason:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <div>
                                            <Listbox
                                                value={selectedReason}
                                                onChange={(e) => {
                                                    setSelectedReason(e);
                                                }}
                                            >
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative ">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                <span className="block truncate">
                                                                    {
                                                                        selectedReason?.ReasonName
                                                                    }
                                                                </span>
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronUpDownIcon
                                                                        className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    {closeReasons
                                                                        ?.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.StatusId ==
                                                                                1
                                                                        )
                                                                        .map(
                                                                            (
                                                                                closeReason
                                                                            ) => (
                                                                                <Listbox.Option
                                                                                    key={
                                                                                        closeReason.ReasonId
                                                                                    }
                                                                                    className={({
                                                                                        active,
                                                                                    }) =>
                                                                                        classNames(
                                                                                            active
                                                                                                ? "bg-indigo-600 text-white"
                                                                                                : "text-gray-900",
                                                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        closeReason
                                                                                    }
                                                                                >
                                                                                    {({
                                                                                        selected,
                                                                                        active,
                                                                                    }) => (
                                                                                        <>
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    selected
                                                                                                        ? "font-semibold"
                                                                                                        : "font-normal",
                                                                                                    "block truncate"
                                                                                                )}
                                                                                            >
                                                                                                {
                                                                                                    closeReason.ReasonName
                                                                                                }
                                                                                            </span>

                                                                                            {selected ? (
                                                                                                <span
                                                                                                    className={classNames(
                                                                                                        active
                                                                                                            ? "text-white"
                                                                                                            : "text-indigo-600",
                                                                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                    )}
                                                                                                >
                                                                                                    <CheckIcon
                                                                                                        className="h-5 w-5"
                                                                                                        aria-hidden="true"
                                                                                                    />
                                                                                                </span>
                                                                                            ) : null}
                                                                                        </>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                            )
                                                                        )}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Description:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <textarea
                                            type="text"
                                            id="Reason"
                                            className="rounded w-full h-auto border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end w-full gap-x-2">
                                    {
                                        <div className="">
                                            {" "}
                                            <div className="flex justify-end w-full gap-x-2">
                                                <InvoicesButton
                                                    name="Save"
                                                    onClick={ClosePO}
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        ) : null}
                    </div>
                    {/* Convert To invoice Part */}
                    {authorizeToConvert ? (
                        <div className="rounded-xl bg-white shadow p-5">
                            <form onSubmit={validateForm}>
                                <h1 className="text-dark font-bold text-2xl">
                                    Convert to Invoice
                                </h1>
                                <div className="grid grid-cols-2 p-2 gap-y-2 mt-5 text-sm sm:text-base">
                                    <h1 className="text-gray-400 border-b">
                                        State:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        {
                                            states?.find(
                                                (state) =>
                                                    state.StateId ===
                                                    PODetails.StateId
                                            )?.StateCode
                                        }
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Supplier:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        {
                                            supplierData?.find(
                                                (supplier) =>
                                                    supplier.SupplierId ===
                                                    PODetails.SupplierId
                                            )?.SupplierName
                                        }
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Company:
                                    </h1>
                                    <div className="pb-2 w-full border-b">
                                        {
                                            companies?.find(
                                                (company) =>
                                                    company.CompanyId ===
                                                    PODetails.CompanyId
                                            )?.CompanyName
                                        }
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Category:
                                    </h1>
                                    <div className="pb-2 w-full border-b">
                                        {
                                            categories?.find(
                                                (category) =>
                                                    category.CategoryId ===
                                                    PODetails.CategoryId
                                            )?.CategoryName
                                        }
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Invoice #:{" "}
                                        <span className="text-red-500">*</span>
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <input
                                            type="text"
                                            required
                                            id="InvoiceNo"
                                            onChange={(e) => {
                                                setInvoiceNo(e.target.value);
                                            }}
                                            className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                        />
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Invoice Date:{" "}
                                        <span className="text-red-500">*</span>
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <input
                                            type="date"
                                            required
                                            id="InvoiceDate"
                                            name="to-date"
                                            onChange={(e) => {
                                                setInvoiceDate(e.target.value);
                                            }}
                                            className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Due Date:{" "}
                                        <span className="text-red-500">*</span>
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <input
                                            type="date"
                                            name="to-date"
                                            required
                                            id="DueDate"
                                            onChange={(e) => {
                                                setDueDate(e.target.value);
                                            }}
                                            className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Description:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        {PODetails.Description}
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Amount:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        {PODetails.Amount}
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Payment Type:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <select
                                            id="PaymentTypeId"
                                            defaultValue={paymentType}
                                            onChange={determinePaymentStatus}
                                            className="runded w-full border-gray-200 border-1 f focus:ring focus:ring-goldt"
                                        >
                                            <option value="2">Cash</option>
                                            <option value="1">
                                                Credit Card
                                            </option>
                                        </select>
                                    </div>
                                    {!paymentField ? (
                                        <h1 className="text-gray-400 border-b">
                                            Processed Bank:{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </h1>
                                    ) : null}
                                    {!paymentField ? (
                                        <div className="pb-2 border-b">
                                            <input
                                                type="text"
                                                required
                                                id="ProcessedBank"
                                                className="rounded w-full h-7 border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                            />
                                        </div>
                                    ) : null}
                                    {!paymentField ? (
                                        <h1 className="text-gray-400 border-b">
                                            Payment Date:{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </h1>
                                    ) : null}
                                    {!paymentField ? (
                                        <div className="pb-2 border-b">
                                            <input
                                                type="date"
                                                required
                                                id="PaymentDate"
                                                name="to-date"
                                                className="block w-full max-w-lg h-[25px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    ) : null}
                                    <h1 className="text-gray-400 border-b">
                                        POD Required:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <input
                                            type="checkbox"
                                            id="PodRequired"
                                            className="rounded text-green-500 focus:ring-green-300"
                                        />
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        File:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <DropBox
                                            selectedFiles={selectedFiles}
                                            setSelectedFiles={setSelectedFiles}
                                            existedFile={existedFiles}
                                            setExistedFiles={setExistedFiles}
                                            newFiles={newFiles}
                                            setNewFiles={setNewFiles}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end w-full gap-x-2">
                                    {
                                        <div className="">
                                            {" "}
                                            {authorizeToConvert ? (
                                                <div className="flex justify-end w-full gap-x-2">
                                                    <InvoicesButton
                                                        type={"submit"}
                                                        name={
                                                            isLoading ? (
                                                                <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                                                </div>
                                                            ) : (
                                                                "Convert"
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                        // onClick={validateForm}
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    }
                                </div>
                            </form>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    } else {
        return (
            <div className="bg-smooth">
                <div className=" md:flex md:justify-center p-5">
                    <div className="rounded-xl bg-white shadow h-auto p-5 md:w-[40rem]">
                        <h1 className="text-dark font-bold text-2xl">
                            PO #{" "}
                            <span className="text-goldd">{PODetails.PoNo}</span>
                        </h1>
                        <div className="grid grid-cols-2 p-2 gap-y-3 pb-5 mt-5 text-sm sm:text-base">
                            <h1 className="text-gray-400">State:</h1>
                            <p className="font-bold">
                                {
                                    states?.find(
                                        (state) =>
                                            state.StateId === PODetails.StateId
                                    )?.StateCode
                                }
                            </p>
                            <h1 className="text-gray-400">Supplier:</h1>
                            <p className="font-bold">
                                {
                                    supplierData?.find(
                                        (supplier) =>
                                            supplier.SupplierId ===
                                            PODetails.SupplierId
                                    )?.SupplierName
                                }
                            </p>
                            <h1 className="text-gray-400">Company:</h1>
                            <p className="font-bold">
                                {
                                    companies?.find(
                                        (company) =>
                                            company.CompanyId ===
                                            PODetails.CompanyId
                                    )?.CompanyName
                                }
                            </p>
                            <h1 className="text-gray-400">Category:</h1>
                            <p className="font-bold">
                                {
                                    categories?.find(
                                        (category) =>
                                            category.CategoryId ===
                                            PODetails.CategoryId
                                    )?.CategoryName
                                }
                            </p>

                            <h1 className="text-gray-400">PO Date:</h1>
                            <p className="font-bold">
                                {}
                                {moment(
                                    PODetails.PoDate.replace("T", " "),
                                    "YYYY-MM-DD HH:mm:ss"
                                ).format("DD-MM-YYYY h:mm A")}
                            </p>
                            <h1 className="text-gray-400">Approval Status:</h1>
                            <p className="font-bold">
                                {" "}
                                {
                                    <div>
                                        {" "}
                                        {PODetails.ApprovalStatus == 1 ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                Waiting
                                            </span>
                                        ) : PODetails.ApprovalStatus == 2 ? (
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
                                        {PODetails.SecondApproval == 1 ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                Waiting
                                            </span>
                                        ) : PODetails.SecondApproval == 2 ? (
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
                            <h1 className="text-gray-400">Match invoice:</h1>
                            <p className="font-bold">
                                {" "}
                                {
                                    <div>
                                        {" "}
                                        {PODetails.MatchInvoice == 1 ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                Waiting
                                            </span>
                                        ) : PODetails.MatchInvoice == 2 ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                Match
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                Closed
                                            </span>
                                        )}
                                    </div>
                                }
                            </p>
                            {PODetails.MatchInvoice == 3 ? (
                                <div className="col-span-2 grid grid-cols-2 gap-y-4">
                                    <h1 className="text-gray-400">
                                        Closed reason:
                                    </h1>
                                    <p className="font-bold">
                                        {
                                            closeReasons?.find(
                                                (reason) =>
                                                    reason.ReasonId ===
                                                    PODetails.ClosedReason
                                            )?.ReasonName
                                        }
                                    </p>
                                    <h1 className="text-gray-400">
                                        Closed reason description:
                                    </h1>
                                    <p className="font-bold">
                                        {PODetails.ClosedDesc}
                                    </p>
                                </div>
                            ) : null}
                            <h1 className="text-gray-400">Description:</h1>
                            <p className="font-bold">{PODetails.Description}</p>
                            <h1 className="text-gray-400">Amount:</h1>
                            <p className="font-bold">{PODetails.Amount}</p>
                            <h1 className="text-gray-400">File:</h1>
                            <ul>
                                {PODetails.PoDoc?.filter(
                                    (file) => file.DocStatus === 1
                                ).map((file, index) => (
                                    <li
                                        key={index}
                                        className="justify-between flex"
                                    >
                                        {/* {renderPreview(file)} */}
                                        <a
                                            href={`/POs/${file.DocName}`}
                                            target="_blank"
                                            className="text-blue-500 underline truncate"
                                            rel="noopener noreferrer"
                                        >
                                            <span>{file.DocName}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
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
                                    <div className="flex justify-end w-full gap-x-2">
                                        {authorizeToEditApprove ? (
                                            <InvoicesButton
                                                name="Approve"
                                                disabled={isLoadingApprove}
                                                onClick={() => {
                                                    ApprovePO(2);
                                                }}
                                            />
                                        ) : null}

                                        {authorizeToEditReject() ? (
                                            <InvoicesButton
                                                name="Reject"
                                                disabled={isLoadingApprove}
                                                onClick={() => {
                                                    ApprovePO(3);
                                                }}
                                            />
                                        ) : null}
                                        <div>
                                            {PODetails.ClosePO ? null : (
                                                <div className="flex justify-end w-full gap-x-2">
                                                    {authorizeToConvert ? (
                                                        <InvoicesButton
                                                            name="Close"
                                                            onClick={() => {
                                                                setshowClose(
                                                                    !showClose
                                                                );
                                                            }}
                                                        />
                                                    ) : null}
                                                </div>
                                            )}{" "}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {showClose ? (
                            <div className="">
                                <h1 className="text-dark font-bold text-2xl">
                                    Reason for closing
                                </h1>
                                <div className="grid grid-cols-2 p-2 gap-y-2 mt-5 text-sm sm:text-base">
                                    <h1 className="text-gray-400 border-b">
                                        Reason:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <div>
                                            <Listbox
                                                value={selectedReason}
                                                onChange={(e) => {
                                                    setSelectedReason(e);
                                                }}
                                            >
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative ">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-[0.07rem] pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                <span className="block truncate">
                                                                    {
                                                                        selectedReason?.ReasonName
                                                                    }
                                                                </span>
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronUpDownIcon
                                                                        className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    {closeReasons
                                                                        ?.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.StatusId ==
                                                                                1
                                                                        )
                                                                        .map(
                                                                            (
                                                                                closeReason
                                                                            ) => (
                                                                                <Listbox.Option
                                                                                    key={
                                                                                        closeReason.ReasonId
                                                                                    }
                                                                                    className={({
                                                                                        active,
                                                                                    }) =>
                                                                                        classNames(
                                                                                            active
                                                                                                ? "bg-indigo-600 text-white"
                                                                                                : "text-gray-900",
                                                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        closeReason
                                                                                    }
                                                                                >
                                                                                    {({
                                                                                        selected,
                                                                                        active,
                                                                                    }) => (
                                                                                        <>
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    selected
                                                                                                        ? "font-semibold"
                                                                                                        : "font-normal",
                                                                                                    "block truncate"
                                                                                                )}
                                                                                            >
                                                                                                {
                                                                                                    closeReason.ReasonName
                                                                                                }
                                                                                            </span>

                                                                                            {selected ? (
                                                                                                <span
                                                                                                    className={classNames(
                                                                                                        active
                                                                                                            ? "text-white"
                                                                                                            : "text-indigo-600",
                                                                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                                    )}
                                                                                                >
                                                                                                    <CheckIcon
                                                                                                        className="h-5 w-5"
                                                                                                        aria-hidden="true"
                                                                                                    />
                                                                                                </span>
                                                                                            ) : null}
                                                                                        </>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                            )
                                                                        )}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>
                                    </div>
                                    <h1 className="text-gray-400 border-b">
                                        Description:
                                    </h1>
                                    <div className="pb-2 border-b">
                                        <textarea
                                            type="text"
                                            id="Reason"
                                            className="rounded w-full h-auto border-gray-200 focus:border-0 focus:ring focus:ring-goldt"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end w-full gap-x-2">
                                    {
                                        <div className="">
                                            {" "}
                                            {authorizeToConvert &&
                                            convertPoBasedOnStatus() ? (
                                                <div className="flex justify-end w-full gap-x-2">
                                                    <InvoicesButton
                                                        name="Save"
                                                        onClick={ClosePO}
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    }
                                </div>
                            </div>
                        ) : null}
                        <div>
                            {showHidelogsSection() ? (
                                <div>
                                    {processedData ? (
                                        <div className=" rounded-xl  p-5">
                                            <div className="font-bold py-2 border-b w-auto text-lg">
                                                Created by{" "}
                                                {processedData[0]?.CreatedBy} at{" "}
                                                {moment(
                                                    processedData[0]?.CreatedAt.replace(
                                                        "T",
                                                        " "
                                                    ),

                                                    "MM/DD/YYYY, h:mm:ss A"
                                                ).format(
                                                    "YYYY-MM-DD hh:mm A"
                                                ) == "Invalid date"
                                                    ? ""
                                                    : moment(
                                                          processedData[0]?.CreatedAt.replace(
                                                              "T",
                                                              " "
                                                          ),

                                                          "MM/DD/YYYY, h:mm:ss A"
                                                      ).format(
                                                          "YYYY-MM-DD hh:mm A"
                                                      )}
                                            </div>
                                            <ol class="relative border-l border-gray-200 dark:border-gray-700">
                                                {processedData[0]?.Approval?.map(
                                                    (item) => (
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
                                                                ) ==
                                                                "Invalid date"
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
                                                                {
                                                                    item.ApprovedBy
                                                                }{" "}
                                                                has{" "}
                                                                {item.ApprovalStatus ==
                                                                2
                                                                    ? "approved"
                                                                    : "rejected"}{" "}
                                                                this Purchase
                                                                Order
                                                            </h3>
                                                        </li>
                                                    )
                                                )}
                                                {processedData[0]
                                                    ?.MatchInvoice[0]
                                                    ?.MatchStatus == 1
                                                    ? null
                                                    : processedData[0]?.MatchInvoice?.map(
                                                          (item) => (
                                                              <li class="mb-10 ml-4">
                                                                  <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                                                  <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                                      {moment(
                                                                          item.AddedAt.replace(
                                                                              "T",
                                                                              " "
                                                                          ),
                                                                          "MM/DD/YYYY, h:mm:ss A"
                                                                      ).format(
                                                                          "YYYY-MM-DD hh:mm A"
                                                                      )}
                                                                  </time>
                                                                  <h3 class="text-lg font-semibold text-gray-900">
                                                                      {
                                                                          item.AddedBy
                                                                      }{" "}
                                                                      has{" "}
                                                                      {item.MatchStatus ==
                                                                      2
                                                                          ? "converted"
                                                                          : "closed"}{" "}
                                                                      this
                                                                      Purchase
                                                                      Order
                                                                  </h3>
                                                              </li>
                                                          )
                                                      )}
                                            </ol>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
