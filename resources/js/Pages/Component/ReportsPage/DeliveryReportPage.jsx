import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { EyeIcon } from "@heroicons/react/20/solid";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import { Spinner } from "@nextui-org/react";
import moment from "moment";
import { useEffect, useState } from "react";
import MetcashReports from "./MetcashReports";
import OtherReports from "./OtherReports";
import WoolworthsReports from "./WoolworthsReports";
import { renderConsDetailsLink } from "@/CommonFunctions";
import {
    canAddDeliveryReportComment, canViewMetcashDeliveryReport, canViewOtherDeliveryReport, canViewWoolworthsDeliveryReport
} from "@/permissions";
import { useNavigate } from "react-router-dom";

export default function DeliveryReportPage({
    url,
    AToken,
    deliveryReportData,
    currentUser,
    userPermission,
    fetchDeliveryReport,
}) {
    const navigate = useNavigate();
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
    const [receiverZoneOptions, setReceiverZoneOptions] = useState(createNewLabelObjects(
        deliveryReportData,
        "ReceiverZone"
    ));
    const [senderZoneOptions, setSenderZoneOptions] = useState(createNewLabelObjects(
        deliveryReportData,
        "SenderZone"
    ));
    const [receiverStateOptions, setReceiverStateOptions] = useState(createNewLabelObjects(
        deliveryReportData,
        "ReceiverState"
    ));
    const [senderStateOptions, setSenderStateOptions] = useState(createNewLabelObjects(
        deliveryReportData,
        "SenderState"
    ));
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
    const [cellLoading, setCellLoading] = useState(false);

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
    }, [deliveryReportData, consId]);
    const handleViewComments = (data) => {
        setCommentsData(data?.Comments);
        setConsId(data?.ConsignmentID);
        setIsViewModalOpen(true);
    };

    function CustomColumnEditor(props) {
        const { value, onChange, onComplete, cellProps, onCancel } = props; // Destructure relevant props

        const [prvsComment, setPrvsComment] = useState(
            value ? value[0].Comment : null
        );
        const [inputValue, setInputValue] = useState(prvsComment);
        const [commentId, setCommentId] = useState(
            value ? value[0].CommentId : null
        );

        const onValueChange = (e) => {
            let newValue = e.target.value;

            setInputValue(newValue);
            onChange(newValue);
        };

        const handleComplete = async (event) => {
            setCellLoading(cellProps.data.ConsignmentID);
            await axios
                .post(
                    `${url}Add/Delivery/Comment`,
                    {
                        CommentId: commentId,
                        ConsId: cellProps.data.ConsignmentID,
                        Comment: `${inputValue}`,
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
            onComplete(inputValue);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleComplete();
            }
        };

        return (
            canAddDeliveryReportComment(userPermission) && (
                <>
                    <textarea
                        style={{ width: "100%", maxHeight: "100%" }}
                        type={"text"}
                        value={inputValue}
                        className="text-sm font-semibold placeholder:text-sm placeholder:font-light resize-none placeholder:text-gray-500"
                        placeholder="Add a new comment"
                        onBlur={onCancel}
                        onBlurCapture={onCancel}
                        onChange={onValueChange}
                        onKeyDown={handleKeyDown}
                    />
                </>
            )
        );
    }

    const GetLastValue = ({ inputString }) => {
        const getLastValue = (str) => {
            const values = str
                .split(/\r?\n/)
                .filter((value) => value.trim() !== "");

            const lastValue = values[values.length - 1];

            const count = values.length - 1;
            if (values.length - 1 > 0) {
                return (
                    <div>
                        {lastValue} + {count}{" "}
                        {count == 1 ? "Comment" : "Comments"}
                    </div>
                );
            } else {
                return `${lastValue}`;
            }
        };

        return inputString != "" ? (
            <div>{getLastValue(inputString)}</div>
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
                return renderConsDetailsLink(
                    userPermission,
                    value,
                    data.ConsignmentID
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
                                                inputString={value[0].Comment}
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
            header: "Show all comments",
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
        if(userPermission){
            canViewMetcashDeliveryReport(userPermission) ? (
                setActiveComponentIndex(0)
            ) : canViewWoolworthsDeliveryReport(userPermission) ? (
                setActiveComponentIndex(1)
            ) : canViewOtherDeliveryReport(userPermission) ? (
                setActiveComponentIndex(2)
            ) : null}
    },[userPermission])
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
        />,
    ];

    return (
        <div className="min-h-full px-8">
            <div className="sm:flex-auto mt-6">
                <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                    Unilever Delivery Report
                </h1>
            </div>
            <div className="w-full flex gap-4 items-center mt-4">
                <ul className="flex space-x-0">
                    {canViewMetcashDeliveryReport(userPermission) && (
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
                    {canViewWoolworthsDeliveryReport(userPermission) && (
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
                    {canViewOtherDeliveryReport(userPermission) && (
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
            canViewMetcashDeliveryReport(userPermission) ? (
                <div>{components[activeComponentIndex]}</div>
            ) : activeComponentIndex == 1 &&
              canViewWoolworthsDeliveryReport(userPermission) ? (
                <div>{components[activeComponentIndex]}</div>
            ) : activeComponentIndex == 2 &&
              canViewOtherDeliveryReport(userPermission) ? (
                <div>{components[activeComponentIndex]}</div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
