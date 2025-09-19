import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    useContext,
} from "react";
import PropTypes from "prop-types";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import axios from "axios";
import swal from "sweetalert";
import { handleSessionExpiration } from "@/CommonFunctions";
import { EyeIcon } from "@heroicons/react/20/solid";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { Spinner } from "@heroui/react";
import ComboBox from "@/Components/ComboBox";
import ViewComments from "./Modals/ViewComments";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { formatDateToExcel, formatDate } from "@/CommonFunctions";
import {
    canAddDeliveryReportComment,
    canViewMetcashDeliveryReport,
    canViewWoolworthsDeliveryReport,
    canViewOtherDeliveryReport,
    AlertToast,
} from "@/permissions";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TableStructure from "@/Components/TableStructure";
import { CustomContext } from "@/CommonContext";

export default function DeliveryReportPage({
    deliveryReportData,
    fetchDeliveryReport,
    deliveryReportComments,
    fetchDeliveryReportCommentsDataGTRS,
}) {
    const { Token, user, userPermissions, url } = useContext(CustomContext);
    const navigate = useNavigate();
    const handleClick = (coindex) => {
        navigate("/gtrs/consignment-details", {
            state: { activeCons: coindex },
        });
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
    const receiverZoneOptions = createNewLabelObjects(
        deliveryReportData,
        "ReceiverZone"
    );
    const senderZoneOptions = createNewLabelObjects(
        deliveryReportData,
        "SenderZone"
    );

    const receiverStateOptions = createNewLabelObjects(
        deliveryReportData,
        "ReceiverState"
    );

    const senderStateOptions = createNewLabelObjects(
        deliveryReportData,
        "SenderState"
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
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
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
                console.error(err);
            }
        }
    };

    function CustomColumnEditor(props) {
        const { value, cellProps, onCancel } = props; // Destructure relevant props

        const deliveryCommentId = null;
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
                        UserId: user.UserId,
                        Authorization: `Bearer ${Token}`,
                    },
                })
                .then(async () => {
                    await axios
                        .get(`${url}Delivery/Comments`, {
                            headers: {
                                UserId: user.UserId,
                                Authorization: `Bearer ${Token}`,
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
                                                    UserId: user.UserId,
                                                    Authorization: `Bearer ${Token}`,
                                                },
                                            }
                                        )
                                        .then(() => {
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
                    await handleSessionExpiration();
                });
                                            } else {
                                                // Handle other errors
                                                console.error(error);
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
                        console.error(err);
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
        const [newCommentsArr, setNewCommentsArr] = useState([]);

        const onSelectComment = (e, newValue) => {
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
                                UserId: user.UserId,
                                Authorization: `Bearer ${Token}`,
                            },
                        }
                    )
                    .then(() => {
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
                    await handleSessionExpiration();
                });
                        } else {
                            // Handle other errors
                            console.error(error);
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
                        AddComment(check, check?.trim());
                    } else {
                        // Adding a new comment to the consignment
                        setAddedComment(true);
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
            canAddDeliveryReportComment(userPermissions) && (
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
    CustomColumnEditor.propTypes = {
        cellProps: PropTypes.object,
        value: PropTypes.array,
        onCancel: PropTypes.func,
    };

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

    GetLastValue.propTypes = {
        comments: PropTypes.array,
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
            render: ({ value }) => {
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
            render: ({ value }) => {
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
            render: ({ value }) => {
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
            render: ({ data }) => {
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
            render: ({ data }) => {
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
        if (userPermissions) {
            canViewMetcashDeliveryReport(userPermissions)
                ? setActiveComponentIndex(0)
                : canViewWoolworthsDeliveryReport(userPermissions)
                ? setActiveComponentIndex(1)
                : canViewOtherDeliveryReport(userPermissions)
                ? setActiveComponentIndex(2)
                : null;
        }
    }, [userPermissions]);

    const gridRef = useRef(null);
    const [selected, setSelected] = useState([]);
    function handleDownloadExcel() {
        const filteredData =
            activeComponentIndex == 0
                ? filteredMetcashData
                : activeComponentIndex == 1
                ? filteredWoolworthData
                : activeComponentIndex == 2
                ? filteredOtherData
                : deliveryReportData;
        const jsonData = handleFilterTable(gridRef, filteredData);

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
                Array.isArray(value)
                    ?
                // eslint-disable-next-line react/prop-types
                    value.map(
                              (item) =>
                                  `${formatDate(item.AddedAt)}, ${item.Comment}`
                          )
                          .join("\n")
                    : "",
            POD: (value) => (value ? value : "FALSE"),
        };
        customCellHandlers.PropTypes = {
            value: PropTypes.string,
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
        const MemoizedTable = () => (
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

        return MemoizedTable;
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
                    {canViewMetcashDeliveryReport(userPermissions) && (
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
                    {canViewWoolworthsDeliveryReport(userPermissions) && (
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
                    {canViewOtherDeliveryReport(userPermissions) && (
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
            canViewMetcashDeliveryReport(userPermissions) ? (
                <div>{renderTable()}</div>
            ) : activeComponentIndex == 1 &&
              canViewWoolworthsDeliveryReport(userPermissions) ? (
                <div>{renderTable()}</div>
            ) : activeComponentIndex == 2 &&
              canViewOtherDeliveryReport(userPermissions) ? (
                <div>{renderTable()}</div>
            ) : (
                <div></div>
            )}
            <ViewComments
                url={url}
                Token={Token}
                isOpen={isViewModalOpen}
                handleClose={handleViewClose}
                consId={consId}
                fetchData={fetchDeliveryReport}
                userPermissions={userPermissions}
                commentsData={commentsData}
                deliveryCommentsOptions={deliveryCommentsOptions}
                fetchDeliveryReportCommentsData={
                    fetchDeliveryReportCommentsData
                }
            />
        </div>
    );
}

DeliveryReportPage.propTypes = {
    deliveryReportData: PropTypes.array,
    deliveryCommentsOptions: PropTypes.array,
    fetchDeliveryReport: PropTypes.func,
    fetchDeliveryReportCommentsData: PropTypes.func,
    deliveryReportComments: PropTypes.array,
    fetchDeliveryReportCommentsDataGTRS: PropTypes.func,
};
