import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import MetcashReports from "./MetcashReports";
import WoolworthsReports from "./WoolworthsReports";
import OtherReports from "./OtherReports";
import { EyeIcon, PencilIcon, PlusIcon } from "@heroicons/react/20/solid";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { Spinner } from "@nextui-org/react";
import {
    canAddDeliveryReportComment,
    canEditDeliveryReportComment,
    canViewMetcashDeliveryReport,
    canViewWoolworthsDeliveryReport,
    canViewOtherDeliveryReport,
    AlertToast,
} from "@/permissions";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TableStructure from "@/Components/TableStructure";
import ComboBox from "@/Components/ComboBox";
import ViewComments from "./Modals/ViewComments";
import { exportToExcel } from "@/Components/utils/excelUtils";

const formatDateToExcel = (dateValue) => {
    const date = new Date(dateValue);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return ""; // Return empty string if invalid date
    }

    // Convert to Excel date serial number format
    return (
        (date.getTime() - date.getTimezoneOffset() * 60000) / 86400000 + 25569
    );
};

export default function DailyReportPage({
    url,
    AToken,
    deliveryReportData,
    currentUser,
    userPermission,
    setActiveIndexGTRS,
    fetchDeliveryReport,
    deliveryReportComments,
    setactiveCon,
    fetchDeliveryReportCommentsDataGTRS,
}) {
    const handleClick = (coindex) => {
        setactiveCon(coindex);
        setActiveIndexGTRS(3);
    };
    const [deliveryCommentsOptions, setDeliveryCommentsOptions] = useState(
        deliveryReportComments
    );
    const createNewLabelObjects = (data, fieldName) => {
        const uniqueLabels = new Set(); // To keep track of unique labels
        const newData = [];

        // Map through the data and create new objects
        data?.forEach((item) => {
            const fieldValue = item[fieldName];

            // Check if the label is not already included and is not null or empty
            if (
                fieldValue &&
                !uniqueLabels.has(fieldValue) &&
                fieldValue?.trim() !== ""
            ) {
                if (typeof fieldValue === "string") {
                    uniqueLabels.add(fieldValue);
                    const newObject = {
                        id: fieldValue,
                        label: fieldValue,
                    };
                    newData.push(newObject);
                }
            }
        });

        return newData;
    };
    const [receiverZoneOptions, setReceiverZoneOptions] = useState(
        createNewLabelObjects(deliveryReportData, "ReceiverZone")
    );
    const [senderZoneOptions, setSenderZoneOptions] = useState(
        createNewLabelObjects(deliveryReportData, "SenderZone")
    );
    const [receiverStateOptions, setReceiverStateOptions] = useState(
        createNewLabelObjects(deliveryReportData, "ReceiverState")
    );
    const [senderStateOptions, setSenderStateOptions] = useState(
        createNewLabelObjects(deliveryReportData, "SenderState")
    );
    const consStateOptions = createNewLabelObjects(
        deliveryReportData,
        "ConsignmentStatus"
    );

    const podAvlOptions = [
        {
            id: true,
            label: "True",
        },
        {
            id: false,
            label: "False",
        },
    ];

    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const [cellLoading, setCellLoading] = useState(null);

    const [filterValue, setFilterValue] = useState([
        {
            name: "AccountNumber",
            operator: "eq",
            type: "string",
            value: "",
        },
        {
            name: "DespatchDateTime",
            operator: "inrange",
            type: "date",
        },
        {
            name: "ConsignmentNo",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderName",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderReference",
            operator: "contains",
            type: "string",
            value: "",
        },
        {
            name: "SenderState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "SenderZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverName",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverReference",
            operator: "contains",
            type: "string",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverState",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ReceiverZone",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "ConsignmentStatus",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DeliveryInstructions",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
        {
            name: "POD",
            operator: "inlist",
            type: "select",
            value: null,
            emptyValue: "",
        },
        {
            name: "DeliveryRequiredDateTime",
            operator: "inrange",
            type: "date",
        },
        {
            name: "DeliveredDateTime",
            operator: "inrange",
            type: "date",
        },
        {
            name: "Comments",
            operator: "contains",
            type: "string",
            value: "",
            emptyValue: "",
        },
    ]);

    useEffect(() => {
        setFilterValue([
            {
                name: "AccountNumber",
                operator: "eq",
                type: "string",
                value: "",
            },
            {
                name: "DespatchDateTime",
                operator: "inrange",
                type: "date",
            },
            {
                name: "ConsignmentNo",
                operator: "contains",
                type: "string",
                value: "",
            },
            {
                name: "SenderName",
                operator: "contains",
                type: "string",
                value: "",
            },
            {
                name: "SenderReference",
                operator: "contains",
                type: "string",
                value: "",
            },
            {
                name: "SenderState",
                operator: "inlist",
                type: "select",
                value: null,
                emptyValue: "",
            },
            {
                name: "ReceiverName",
                operator: "contains",
                type: "string",
                value: null,
                emptyValue: "",
            },
            {
                name: "ReceiverReference",
                operator: "contains",
                type: "string",
                value: null,
                emptyValue: "",
            },
            {
                name: "ReceiverState",
                operator: "inlist",
                type: "select",
                value: null,
                emptyValue: "",
            },
            {
                name: "ConsignmentStatus",
                operator: "inlist",
                type: "select",
                value: null,
                emptyValue: "",
            },
            {
                name: "DeliveryInstructions",
                operator: "contains",
                type: "string",
                value: "",
                emptyValue: "",
            },
            {
                name: "POD",
                operator: "inlist",
                type: "select",
                value: null,
                emptyValue: "",
            },
            {
                name: "DeliveryRequiredDateTime",
                operator: "inrange",
                type: "date",
            },
            {
                name: "DeliveredDateTime",
                operator: "inrange",
                type: "date",
            },
            {
                name: "Comments",
                operator: "contains",
                type: "string",
                value: "",
                emptyValue: "",
            },
        ]);
    }, [activeComponentIndex]);
    const groups = [
        {
            name: "senderDetails",
            header: "Sender Details",
            headerAlign: "center",
        },
        {
            name: "receiverDetails",
            header: "Receiver Details",
            headerAlign: "center",
        },
    ];

    const [consId, setConsId] = useState(null);
    const [commentsData, setCommentsData] = useState(null);

    useEffect(() => {
        if (deliveryReportData?.length > 0 && consId) {
            setCommentsData(
                deliveryReportData.find((data) => data.ConsignmentID == consId)
                    ?.Comments
            );
        }
    }, [deliveryReportData, consId, deliveryCommentsOptions]);

    const handleViewComments = (data) => {
        setCommentsData(data?.Comments);
        setConsId(data?.ConsignmentID);
        setIsViewModalOpen(true);
    };

    const [newCommentValue, setNewCommentValue] = useState("");
    const [addedComment, setAddedComment] = useState(true);

    const fetchDeliveryReportCommentsData = async () => {
        try {
            const res = await axios.get(`${url}Delivery/Comments`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${AToken}`,
                },
            });
            setDeliveryCommentsOptions(res.data || []);
            fetchDeliveryReportCommentsDataGTRS();
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Handle 401 error using SweetAlert
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "success",
                    icon: "info",
                    confirmButtonText: "OK",
                }).then(async function () {
                    await handleSessionExpiration();
                });
            } else {
                // Handle other errors
                console.log(err);
            }
        }
    };

    function CustomColumnEditor(props) {
        const { value, onChange, onComplete, cellProps, onCancel } = props; // Destructure relevant props

        const [deliveryCommentId, setDeliveryCommentId] = useState(null);
        const [defaultDeliveryComment, setDefaultDeliveryComment] = useState(
            value && value?.length > 0 ? [value[0]] : []
        );

        // Add Comment to list not to delivery table
        function AddComment(value, CommentValue) {
            setCellLoading(cellProps.data.ConsignmentID);
            const inputValues = {
                CommentId: null,
                Comment: value,
                StatusId: 1,
            };

            axios
                .post(`${url}Add/Comment`, inputValues, {
                    headers: {
                        UserId: currentUser.UserId,
                        Authorization: `Bearer ${AToken}`,
                    },
                })
                .then(async () => {
                    await axios
                        .get(`${url}Delivery/Comments`, {
                            headers: {
                                UserId: currentUser.UserId,
                                Authorization: `Bearer ${AToken}`,
                            },
                        })
                        .then((res) => {
                            const extracted =
                                CommentValue.split('"')[1] || CommentValue;
                            setDeliveryCommentsOptions(res.data);
                            if (res.data?.length > 0 && CommentValue !== "") {
                                const newValue = res.data?.find(
                                    (item) => item.Comment === extracted
                                );

                                if (
                                    newValue &&
                                    newValue?.Comment === extracted
                                ) {
                                    axios
                                        .post(
                                            `${url}Add/Delivery/Comment`,
                                            {
                                                DeliveryCommentId:
                                                    deliveryCommentId,
                                                ConsId: cellProps.data
                                                    .ConsignmentID,
                                                CommentId: newValue?.CommentId,
                                            },
                                            {
                                                headers: {
                                                    UserId: currentUser.UserId,
                                                    Authorization: `Bearer ${AToken}`,
                                                },
                                            }
                                        )
                                        .then((response) => {
                                            fetchDeliveryReport(setCellLoading);
                                            fetchDeliveryReportCommentsDataGTRS();
                                            setAddedComment(true);
                                            setNewCommentValue("");
                                            AlertToast("Saved successfully", 1);
                                        })
                                        .catch((error) => {
                                            // Handle error
                                            if (
                                                error.response &&
                                                error.response.status === 401
                                            ) {
                                                // Handle 401 error using SweetAlert
                                                swal({
                                                    title: "Session Expired!",
                                                    text: "Please login again",
                                                    type: "success",
                                                    icon: "info",
                                                    confirmButtonText: "OK",
                                                }).then(async function () {
                                                    axios
                                                        .post("/logoutAPI")
                                                        .then((response) => {
                                                            if (
                                                                response.status ==
                                                                200
                                                            ) {
                                                                window.location.href =
                                                                    "/";
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            console.log(error);
                                                        });
                                                });
                                            } else {
                                                // Handle other errors
                                                console.log(error);
                                            }
                                        });
                                }
                            }
                        });
                })
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        // Handle 401 error using SweetAlert
                        swal({
                            title: "Session Expired!",
                            text: "Please login again",
                            type: "success",
                            icon: "info",
                            confirmButtonText: "OK",
                        }).then(async function () {
                            await handleSessionExpiration();
                        });
                    } else {
                        // Handle other errors
                        console.log(err);
                    }
                });
        }
        const onLoseFocus = () => {
            handleAddMultiComments();
            if (newCommentValue == "") {
                onCancel();
            }
        };
        const addCommentToConsignmentCallback = useCallback(
            (newValue) => {
                if (!addedComment) {
                    handleComplete(newValue, false);
                }
            },
            [addedComment]
        );

        const [event, setEvent] = useState(null);
        const [isAddingNewComment, setIsAddingNewComment] = useState(true);
        const [newCommentsArr, setNewCommentsArr] = useState([]);

        const onSelectComment = (e, newValue, value) => {
            setEvent(e);
            setNewCommentsArr(newValue);
        };
        useEffect(() => {
            if (deliveryCommentsOptions?.length > 0 && newCommentValue !== "") {
                const newValue = deliveryCommentsOptions?.find(
                    (item) => item.Comment === newCommentValue
                );
                if (newValue && newValue?.Comment === newCommentValue) {
                    // setAddedComment(false);
                    addCommentToConsignmentCallback(newValue?.CommentId);
                }
            }
        }, [deliveryCommentsOptions, newCommentValue]);
        const handleComplete = async (commentId, IsAddingNewComm) => {
            if (commentId !== null && !IsAddingNewComm) {
                setCellLoading(cellProps.data.ConsignmentID);
                await axios
                    .post(
                        `${url}Add/Delivery/Comment`,
                        {
                            DeliveryCommentId: deliveryCommentId,
                            ConsId: cellProps.data.ConsignmentID,
                            CommentId: commentId,
                        },
                        {
                            headers: {
                                UserId: currentUser.UserId,
                                Authorization: `Bearer ${AToken}`,
                            },
                        }
                    )
                    .then((response) => {
                        fetchDeliveryReport(setCellLoading);
                        setAddedComment(true);
                        setCellLoading(null);
                    })
                    .catch((error) => {
                        // Handle error
                        if (error.response && error.response.status === 401) {
                            // Handle 401 error using SweetAlert
                            swal({
                                title: "Session Expired!",
                                text: "Please login again",
                                type: "success",
                                icon: "info",
                                confirmButtonText: "OK",
                            }).then(async function () {
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
                            console.log(error);
                        }
                    });
            }
        };

        const handleAddMultiComments = () => {
            if (event != null) {
                if (Array.isArray(newCommentsArr)) {
                    let i = 0;
                    while (i < newCommentsArr.length) {
                        const item = newCommentsArr[i];
                        // Check if the user is pressing on the "Add" button only works for when adding 1 options
                        // If adding multiple options, check if the option is already in the list if not add it
                        const isAddingNewComment =
                            event.target.textContent ===
                            `Add "${item?.CommentId}"`
                                ? true
                                : deliveryCommentsOptions.find(
                                      (item) =>
                                          item.Comment?.toString()?.trim() ===
                                          item.CommentId?.toString()?.trim()
                                  )
                                ? false
                                : true;
                        if (isAddingNewComment) {
                            // Adding a new comment to the list not to the consignment
                            setIsAddingNewComment(true);
                            setNewCommentValue(
                                typeof item?.CommentId === "string"
                                    ? item.CommentId.trim()
                                    : String(item?.CommentId)
                            );
                            setAddedComment(false);
                            AddComment(item?.CommentId, item?.Comment?.trim());
                        } else {
                            // Adding a new comment to the consignment
                            setAddedComment(true);
                            setIsAddingNewComment(false);
                            setNewCommentValue("");
                            handleComplete(item?.CommentId, false);
                        }
                        i++;
                    }
                } else {
                    const check =
                        typeof newCommentsArr == "string"
                            ? newCommentsArr
                            : newCommentsArr?.CommentId;
                    if (event.target.textContent === `Add "${check}"`) {
                        // Adding a new comment to the list not to the consignment
                        setNewCommentValue(check?.trim());
                        setAddedComment(false);
                        setIsAddingNewComment(true);
                        AddComment(check, check?.trim());
                    } else {
                        // Adding a new comment to the consignment
                        setAddedComment(true);
                        setIsAddingNewComment(false);
                        setNewCommentValue("");
                        handleComplete(check, false);
                    }
                }
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.stopPropagation();
                onLoseFocus();
            }
        };

        return (
            canAddDeliveryReportComment(currentUser) && (
                <>
                    <ComboBox
                        onCancel={() => {}}
                        idField={"CommentId"}
                        valueField={"Comment"}
                        onChange={onSelectComment}
                        isMulti={true}
                        inputValue={defaultDeliveryComment}
                        options={deliveryCommentsOptions?.filter(
                            (item) => item.CommentStatus == 1
                        )}
                        isDisabled={false}
                        onKeyDown={handleKeyDown}
                        setInputValue={setDefaultDeliveryComment}
                    />
                </>
            )
        );
    }

    const GetLastValue = ({ comments }) => {
        function getLatestElement(arr) {
            return arr.reduce((latest, current) => {
                const latestDate = new Date(latest.AddedAt);
                const currentDate = new Date(current.AddedAt);
                return currentDate > latestDate ? current : latest;
            }, arr[0]);
        }

        return comments?.length > 0 ? (
            <div>{getLatestElement(comments)?.Comment}</div>
        ) : null;
    };

    const columns = [
        {
            name: "AccountNumber",
            header: "Account Number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
            render: ({ value }) => {
                return <div>{value}</div>;
            },
        },
        {
            name: "DespatchDateTime",
            header: "Despatch date",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: getMinMaxValue(
                    deliveryReportData,
                    "DespatchDateTime",
                    1
                ),
                maxDate: getMinMaxValue(
                    deliveryReportData,
                    "DespatchDateTime",
                    2
                ),
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "ConsignmentNo",
            header: "Consignment Number",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: StringFilter,
            defaultWidth: 200,
            render: ({ value, data }) => {
                return (
                    <div>
                        <span
                            className="underline text-blue-500 hover:cursor-pointer"
                            onClick={() => handleClick(data.ConsignmentID)}
                        >
                            {" "}
                            {value}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "SenderName",
            header: "Sender Name",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 180,
            filterEditor: StringFilter,
        },
        {
            name: "SenderState",
            header: "Sender State",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderStateOptions,
            },
        },
        {
            name: "SenderZone",
            header: "Sender Zone",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: senderZoneOptions,
            },
        },
        {
            name: "ReceiverName",
            header: "Receiver Name",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 180,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverState",
            header: "Receiver State",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverStateOptions,
            },
        },
        {
            name: "ReceiverZone",
            header: "Receiver Zone",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: receiverZoneOptions,
            },
        },
        {
            name: "ConsignmentStatus",
            header: "Consignment Status",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: consStateOptions,
            },
        },
        {
            name: "DeliveryInstructions",
            header: "Special Instructions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "DeliveryRequiredDateTime",
            header: "Delivery Required DateTime",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: getMinMaxValue(
                    deliveryReportData,
                    "DeliveryRequiredDateTime",
                    1
                ),
                maxDate: getMinMaxValue(
                    deliveryReportData,
                    "DeliveryRequiredDateTime",
                    2
                ),
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "DeliveredDateTime",
            header: "Delivered DateTime",
            headerAlign: "center",
            textAlign: "center",
            defaultFlex: 1,
            minWidth: 200,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: getMinMaxValue(
                    deliveryReportData,
                    "DeliveredDateTime",
                    1
                ),
                maxDate: getMinMaxValue(
                    deliveryReportData,
                    "DeliveredDateTime",
                    2
                ),
            },
            render: ({ value, cellProps }) => {
                return value
                    ? moment(value).format("DD-MM-YYYY") == "Invalid date"
                        ? ""
                        : moment(value).format("DD-MM-YYYY")
                    : "";
            },
        },
        {
            name: "POD",
            header: "POD Avl",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: podAvlOptions,
            },
            render: ({ value, data }) => {
                return (
                    <div>
                        {data?.POD ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                True
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                false
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            name: "Comments",
            header: "Comments",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 280,
            editable: true,
            filterEditor: StringFilter,
            editor: CustomColumnEditor,
            // Add the getFilterValue function
            getFilterValue: ({ data }) => {
                if (data.Comments && data.Comments.length > 0) {
                    return data.Comments[0].Comment;
                }
                return "";
            },
            render: ({ value, data }) => {
                return (
                    <div className="flex gap-4 items-center px-2">
                        {data.ConsignmentID == cellLoading ? (
                            <div className="flex flex-col w-full">
                                <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                    <Spinner color="default" size="sm" />
                                </div>
                            </div>
                        ) : (
                            <>
                                {" "}
                                {value ? (
                                    <>
                                        {value != "" ? (
                                            <GetLastValue
                                                comments={data?.Comments}
                                            />
                                        ) : null}
                                    </>
                                ) : null}
                            </>
                        )}
                    </div>
                );
            },
        },
        {
            name: "Actions",
            header: "Actions",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 200,
            render: ({ value, data }) => {
                return (
                    <div className="flex gap-4 items-center justify-center px-2">
                        <span
                            className="underline text-blue-400 hover:cursor-pointer"
                            onClick={() => handleViewComments(data)}
                        >
                            <EyeIcon className="h-5 w-5 text-goldt" />
                        </span>
                    </div>
                );
            },
        },
    ];

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const handleAddClose = () => {
        setIsAddModalOpen(false);
    };
    const handleViewClose = () => {
        setIsViewModalOpen(false);
        setCommentsData(null);
    };
    const [filteredMetcashData, setFilteredMetcashData] = useState(
        deliveryReportData?.filter((item) => item?.CustomerTypeId == 1)
    );
    const [filteredWoolworthData, setFilteredWoolworthData] = useState(
        deliveryReportData?.filter((item) => item?.CustomerTypeId == 2)
    );
    const [filteredOtherData, setFilteredOtherData] = useState(
        deliveryReportData?.filter((item) => item?.CustomerTypeId == 3)
    );
    useEffect(() => {
        if (deliveryReportData?.length > 0) {
            setFilteredMetcashData(
                deliveryReportData?.filter((item) => item?.CustomerTypeId == 1)
            );
            setFilteredWoolworthData(
                deliveryReportData?.filter((item) => item?.CustomerTypeId == 2)
            );
            setFilteredOtherData(
                deliveryReportData?.filter((item) => item?.CustomerTypeId == 3)
            );
        }
    }, [deliveryReportData]);

    useEffect(() => {
        if (currentUser) {
            canViewMetcashDeliveryReport(currentUser)
                ? setActiveComponentIndex(0)
                : canViewWoolworthsDeliveryReport(currentUser)
                ? setActiveComponentIndex(1)
                : canViewOtherDeliveryReport(currentUser)
                ? setActiveComponentIndex(2)
                : null;
        }
    }, [currentUser]);
    let components = [
        <MetcashReports
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            groups={groups}
            columns={columns}
            data={filteredMetcashData}
            url={url}
            AToken={AToken}
            consId={consId}
            setCellLoading={setCellLoading}
            fetchData={fetchDeliveryReport}
            currentUser={currentUser}
            isViewModalOpen={isViewModalOpen}
            handleViewModalClose={handleViewClose}
            isAddModalOpen={isAddModalOpen}
            handleAddModalClose={handleAddClose}
            commentsData={commentsData}
            deliveryCommentsOptions={deliveryCommentsOptions}
            fetchDeliveryReportCommentsData={fetchDeliveryReportCommentsData}
        />,
        <WoolworthsReports
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            groups={groups}
            columns={columns}
            data={filteredWoolworthData}
            url={url}
            AToken={AToken}
            setCellLoading={setCellLoading}
            consId={consId}
            fetchData={fetchDeliveryReport}
            currentUser={currentUser}
            isViewModalOpen={isViewModalOpen}
            handleViewModalClose={handleViewClose}
            isAddModalOpen={isAddModalOpen}
            handleAddModalClose={handleAddClose}
            commentsData={commentsData}
            deliveryCommentsOptions={deliveryCommentsOptions}
            fetchDeliveryReportCommentsData={fetchDeliveryReportCommentsData}
        />,
        <OtherReports
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            groups={groups}
            columns={columns}
            data={filteredOtherData}
            url={url}
            AToken={AToken}
            consId={consId}
            setCellLoading={setCellLoading}
            fetchData={fetchDeliveryReport}
            currentUser={currentUser}
            isViewModalOpen={isViewModalOpen}
            handleViewModalClose={handleViewClose}
            isAddModalOpen={isAddModalOpen}
            handleAddModalClose={handleAddClose}
            commentsData={commentsData}
            deliveryCommentsOptions={deliveryCommentsOptions}
            fetchDeliveryReportCommentsData={fetchDeliveryReportCommentsData}
        />,
    ];

    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);

    function handleFilterTable(ref, filteredData) {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        let allHeaderColumns = gridRef?.current?.visibleColumns?.map(
            (column) => ({
                name: column.name,
                value: column.computedFilterValue?.value,
                label: column.computedHeader,
                type: column.computedFilterValue?.type,
                operator: column.computedFilterValue?.operator,
            })
        );
        let selectedColVal = allHeaderColumns?.filter(
            (col) => col?.label?.toString().toLowerCase() !== "edit"
        );
        const filterValue = [];
        filteredData?.map((val) => {
            let isMatch = true;

            for (const col of selectedColVal) {
                const { name, value, type, operator } = col;
                const cellValue = value;
                let conditionMet = false;
                // Skip the filter condition if no filter is set (cellValue is null or empty)
                if (!cellValue || cellValue.length === 0) {
                    conditionMet = true;
                    continue;
                }
                if (type === "string") {
                    const valLowerCase = val[col.name]
                        ?.toString()
                        .toLowerCase();
                    const cellValueLowerCase = cellValue
                        ?.toString()
                        .toLowerCase();

                    switch (operator) {
                        case "contains":
                            conditionMet =
                                cellValue?.length > 0 &&
                                valLowerCase.includes(cellValueLowerCase);
                            break;
                        case "notContains":
                            conditionMet =
                                cellValue?.length > 0 &&
                                !valLowerCase.includes(cellValueLowerCase);
                            break;
                        case "eq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                cellValueLowerCase === valLowerCase;
                            break;
                        case "neq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                cellValueLowerCase !== valLowerCase;
                            break;
                        case "empty":
                            conditionMet =
                                cellValue?.length > 0 && val[col.name] === "";
                            break;
                        case "notEmpty":
                            conditionMet =
                                cellValue?.length > 0 && val[col.name] !== "";
                            break;
                        case "startsWith":
                            conditionMet =
                                cellValue?.length > 0 &&
                                valLowerCase.startsWith(cellValueLowerCase);
                            break;
                        case "endsWith":
                            conditionMet =
                                cellValue?.length > 0 &&
                                valLowerCase.endsWith(cellValueLowerCase);
                            break;
                        // ... (add other string type conditions here)
                    }
                } else if (type === "number") {
                    const numericCellValue = parseFloat(cellValue);
                    const numericValue = parseFloat(val[col.name]);

                    switch (operator) {
                        case "eq":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue === numericCellValue;
                            break;
                        case "neq":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue !== numericCellValue;
                            break;
                        case "gt":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue > numericCellValue;
                            break;
                        case "gte":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue >= numericCellValue;
                            break;
                        case "lt":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue < numericCellValue;
                            break;
                        case "lte":
                            conditionMet =
                                numericCellValue != "" &&
                                numericValue != "" &&
                                numericValue <= numericCellValue;
                            break;
                        case "inrange":
                            const rangeValues = value.split(",");
                            const minRangeValue = parseFloat(rangeValues[0]);
                            const maxRangeValue = parseFloat(rangeValues[1]);
                            conditionMet =
                                cellValue?.length > 0 &&
                                numericCellValue >= minRangeValue &&
                                numericCellValue <= maxRangeValue;
                            break;
                        case "notinrange":
                            const rangeValuesNotBetween = value.split(",");
                            const minRangeValueNotBetween = parseFloat(
                                rangeValuesNotBetween[0]
                            );
                            const maxRangeValueNotBetween = parseFloat(
                                rangeValuesNotBetween[1]
                            );
                            conditionMet =
                                cellValue?.length > 0 &&
                                (numericCellValue < minRangeValueNotBetween ||
                                    numericCellValue > maxRangeValueNotBetween);
                            break;
                        // ... (add other number type conditions here if necessary)
                    }
                } else if (type === "boolean") {
                    // Assuming booleanCellValue is a string 'true' or 'false' and needs conversion to a boolean
                    const booleanCellValue = cellValue === "true";
                    const booleanValue = val[col.name] === true; // Convert to boolean if it's not already

                    switch (operator) {
                        case "eq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                booleanCellValue === booleanValue;
                            break;
                        case "neq":
                            conditionMet =
                                cellValue?.length > 0 &&
                                booleanCellValue !== booleanValue;
                            break;
                        // ... (add other boolean type conditions here if necessary)
                    }
                } else if (type === "select") {
                    let cellValueLowerCase = null;
                    let valLowerCase = null;

                    if (typeof cellValue === "number") {
                        cellValueLowerCase = cellValue;
                        valLowerCase = val[col.name];
                    } else {
                        cellValueLowerCase = cellValue
                            ?.toString()
                            .toLowerCase();
                        valLowerCase = val[col.name]?.toString().toLowerCase();
                    }
                    switch (operator) {
                        case "eq":
                            if (typeof valLowerCase === "number") {
                                conditionMet =
                                    cellValueLowerCase === valLowerCase;
                            } else {
                                conditionMet =
                                    cellValue?.length > 0 &&
                                    cellValueLowerCase === valLowerCase;
                            }

                            break;
                        case "neq":
                            if (typeof valLowerCase === "number") {
                                conditionMet =
                                    cellValueLowerCase !== valLowerCase;
                            } else {
                                conditionMet =
                                    cellValue?.length > 0 &&
                                    cellValueLowerCase !== valLowerCase;
                            }
                            break;
                        case "inlist":
                            const listValues = Array.isArray(value)
                                ? value.map((v) => v.toLowerCase())
                                : [value?.toLowerCase()];
                            conditionMet =
                                cellValue?.length > 0 &&
                                listValues.includes(valLowerCase);
                            break;
                        case "notinlist":
                            const listValuesNotIn = Array.isArray(value)
                                ? value.map((v) => v.toLowerCase())
                                : [value?.toLowerCase()];
                            conditionMet =
                                cellValue?.length > 0 &&
                                !listValuesNotIn.includes(valLowerCase);
                            break;
                        // ... (add other select type conditions here if necessary)
                    }
                } else if (type === "date") {
                    const dateValue = moment(
                        val[col.name].replace("T", " "),
                        "YYYY-MM-DD HH:mm:ss"
                    );
                    const hasStartDate =
                        cellValue?.start && cellValue.start.length > 0;
                    const hasEndDate =
                        cellValue?.end && cellValue.end.length > 0;
                    const dateCellValueStart = hasStartDate
                        ? moment(cellValue.start, "DD-MM-YYYY")
                        : null;
                    const dateCellValueEnd = hasEndDate
                        ? moment(cellValue.end, "DD-MM-YYYY").endOf("day")
                        : null;

                    switch (operator) {
                        case "after":
                            // Parse the cellValue date with the format you know it might have
                            const afterd = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );

                            // Parse the dateValue as an ISO 8601 date string
                            const afterdateToCompare = moment(dateValue);

                            // Check if both dates are valid and if cellValue is after dateValue
                            conditionMet =
                                afterd.isValid() &&
                                afterdateToCompare.isValid() &&
                                afterdateToCompare.isAfter(afterd);

                            break;
                        case "afterOrOn":
                            const afterOrOnd = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );
                            const afterOrOnDateToCompare = moment(dateValue);

                            conditionMet =
                                afterOrOnd.isValid() &&
                                afterOrOnDateToCompare.isValid() &&
                                afterOrOnDateToCompare.isSameOrAfter(
                                    afterOrOnd
                                );
                            break;

                        case "before":
                            const befored = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );
                            const beforeDateToCompare = moment(dateValue);

                            conditionMet =
                                befored.isValid() &&
                                beforeDateToCompare.isValid() &&
                                beforeDateToCompare.isBefore(befored);

                            break;

                        case "beforeOrOn":
                            const beforeOrOnd = moment(
                                cellValue,
                                "DD-MM-YYYY",
                                true
                            );
                            const beforeOrOnDateToCompare = moment(dateValue);

                            conditionMet =
                                beforeOrOnd.isValid() &&
                                beforeOrOnDateToCompare.isValid() &&
                                beforeOrOnDateToCompare.isSameOrBefore(
                                    beforeOrOnd
                                );

                            break;
                        case "eq":
                            // Parse the cellValue date with the format you know it might have
                            const d = moment(
                                cellValue,
                                ["DD-MM-YYYY", moment.ISO_8601],
                                true
                            );

                            // Parse the dateValue with the expected format or formats
                            const dateToCompare = moment(
                                dateValue,
                                ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601],
                                true
                            );

                            // Check if both dates are valid and if they represent the same calendar day
                            conditionMet =
                                cellValue &&
                                d.isValid() &&
                                dateToCompare.isValid() &&
                                d.isSame(dateToCompare, "day");

                            break;
                        case "neq":
                            const neqd = moment(cellValue, "DD-MM-YYYY", true);
                            const neqDateToCompare = moment(dateValue);

                            conditionMet =
                                neqd.isValid() &&
                                neqDateToCompare.isValid() &&
                                !neqd.isSame(neqDateToCompare, "day");

                            break;
                        case "inrange":
                            conditionMet =
                                (!hasStartDate ||
                                    dateValue.isSameOrAfter(
                                        dateCellValueStart
                                    )) &&
                                (!hasEndDate ||
                                    dateValue.isSameOrBefore(dateCellValueEnd));
                            break;
                        case "notinrange":
                            conditionMet =
                                (hasStartDate &&
                                    dateValue.isBefore(dateCellValueStart)) ||
                                (hasEndDate &&
                                    dateValue.isAfter(dateCellValueEnd));
                            break;
                        // ... (add other date type conditions here if necessary)
                    }
                }

                if (!conditionMet) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) {
                filterValue.push(val);
            }
        });
        selectedColVal = [];
        if (selectedColumns.length === 0) {
            selectedColVal = allHeaderColumns?.filter(
                (col) => col?.label?.toString().toLowerCase() !== "edit"
            ); // Use all columns
        } else {
            allHeaderColumns?.map((header) => {
                selectedColumns?.map((column) => {
                    const formattedColumn = column
                        .replace(/\s/g, "")
                        .toLowerCase();
                    if (header.name.toLowerCase() === formattedColumn) {
                        selectedColVal?.push(header);
                    }
                });
            });
        }
        return { selectedColumns: selectedColVal, filterValue: filterValue };
    }
    function handleDownloadExcel() {
        const jsonData = handleFilterTable(
            gridRef,
            activeComponentIndex == 0
                ? filteredMetcashData
                : activeComponentIndex == 1
                ? filteredWoolworthData
                : activeComponentIndex == 2
                ? filteredOtherData
                : deliveryReportData
        );

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers
        const customCellHandlers = {
            DespatchDateTime: (value) => formatDateToExcel(value),
            DeliveryRequiredDateTime: (value) => formatDateToExcel(value),
            DeliveredDateTime: (value) => formatDateToExcel(value),
            Comments: (value) =>
                value
                    ?.map(
                        (item) => `${formatDate(item.AddedAt)}, ${item.Comment}`
                    )
                    .join("\n"),
            POD: (value) => (value ? value : "FALSE"),
        };

        // Call the `exportToExcel` function
        const ExcelName =
            activeComponentIndex == 0
                ? "Unilever-Metcash-Reports.xlsx"
                : activeComponentIndex == 1
                ? "Unilever-Woolworths-Reports.xlsx"
                : activeComponentIndex == 2
                ? "Unilever-Other-Reports.xlsx"
                : null;
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            ExcelName, // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            [
                "DespatchDateTime",
                "DeliveryRequiredDateTime",
                "DeliveredDateTime",
            ]
        );
    }
    const renderTable = useMemo(() => {
        return () => (
            <TableStructure
                rowHeight={50}
                id={"ReportId"}
                handleDownloadExcel={handleDownloadExcel}
                setSelected={setSelected}
                gridRef={gridRef}
                selected={selected}
                setFilterValueElements={setFilterValue}
                tableDataElements={
                    activeComponentIndex == 0
                        ? filteredMetcashData
                        : activeComponentIndex == 1
                        ? filteredWoolworthData
                        : activeComponentIndex == 2
                        ? filteredOtherData
                        : deliveryReportData
                }
                filterValueElements={filterValue}
                groupsElements={groups}
                columnsElements={columns}
            />
        );
    }, [
        activeComponentIndex,
        filterValue,
        groups,
        columns,
        handleDownloadExcel,
        setSelected,
        gridRef,
        selected,
        setFilterValue,
    ]);

    return (
        <div className="min-h-full px-8">
            <ToastContainer />
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Unilever Delivery Report
                </h1>
            </div>
            <div className="w-full flex gap-4 items-center mt-4">
                <ul className="flex space-x-0">
                    {canViewMetcashDeliveryReport(currentUser) && (
                        <li
                            className={`cursor-pointer ${
                                activeComponentIndex === 0
                                    ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                    : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                            }`}
                            onClick={() => setActiveComponentIndex(0)}
                        >
                            <div className="px-2"> Metcash</div>
                        </li>
                    )}
                    {canViewWoolworthsDeliveryReport(currentUser) && (
                        <li
                            className={`cursor-pointer ${
                                activeComponentIndex === 1
                                    ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                    : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                            }`}
                            onClick={() => setActiveComponentIndex(1)}
                        >
                            <div className="px-2">Woolworths</div>
                        </li>
                    )}
                    {canViewOtherDeliveryReport(currentUser) && (
                        <li
                            className={`cursor-pointer ${
                                activeComponentIndex === 2
                                    ? "text-dark border-b-4 py-2 border-goldt font-bold text-xs sm:text-base"
                                    : "text-dark py-2 text-xs sm:text-base border-b-2 border-gray-300"
                            }`}
                            onClick={() => setActiveComponentIndex(2)}
                        >
                            <div className="px-2"> Other</div>
                        </li>
                    )}
                </ul>
            </div>
            {activeComponentIndex == 0 &&
            canViewMetcashDeliveryReport(currentUser) ? (
                <div>{renderTable()}</div>
            ) : activeComponentIndex == 1 &&
              canViewWoolworthsDeliveryReport(currentUser) ? (
                <div>{renderTable()}</div>
            ) : activeComponentIndex == 2 &&
              canViewOtherDeliveryReport(currentUser) ? (
                <div>{renderTable()}</div>
            ) : (
                <div></div>
            )}
            <ViewComments
                url={url}
                AToken={AToken}
                setCellLoading={setCellLoading}
                isOpen={isViewModalOpen}
                handleClose={handleViewClose}
                consId={consId}
                fetchData={fetchDeliveryReport}
                currentUser={currentUser}
                commentsData={commentsData}
            />
        </div>
    );
}
