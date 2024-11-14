import React, { useState, useEffect } from "react";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import moment from "moment";
import MetcashReports from "./MetcashReports";
import WoolworthsReports from "./WoolworthsReports";
import OtherReports from "./OtherReports";
import { EyeIcon, PlusIcon } from "@heroicons/react/20/solid";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { Spinner } from "@nextui-org/react";

import { getFiltersDeliveryReport } from "@/Components/utils/filters";
import {
    canAddDeliveryReportComment,
    canViewDailyReportComment,
    canViewMetcashDailyReport,
    canViewWoolworthsDeliveryReport,
    canViewOtherDailyReport,
} from "@/permissions";
import { useRef } from "react";
import { isDummyAccount } from "@/CommonFunctions";

export default function DailyReportPage({
    url,
    AToken,
    dailyReportData,
    currentUser,
    fetchDeliveryReport,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
}) {
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(21);
        setactiveCon(coindex);
    };
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
    
        // Sort newData alphabetically by the label property
        newData.sort((a, b) => a.label.localeCompare(b.label));
    
        return newData;
    };
    
    const receiverZoneOptions = createNewLabelObjects(dailyReportData, "ReceiverZone");
    const receiverStateOptions = createNewLabelObjects(dailyReportData, "ReceiverState");
    const senderZoneOptions = createNewLabelObjects(dailyReportData, "SenderZone");
    const senderStateOptions = createNewLabelObjects(dailyReportData,"SenderState")
    const consStateOptions = createNewLabelObjects(
        dailyReportData,
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
            name: "ReceiverZone",
            operator: "inlist",
            type: "select",
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

    // useEffect(() => {
    //     setFilterValue([
    //         {
    //             name: "AccountNumber",
    //             operator: "eq",
    //             type: "string",
    //             value: "",
    //         },
    //         {
    //             name: "DespatchDateTime",
    //             operator: "inrange",
    //             type: "date",
    //         },
    //         {
    //             name: "ConsignmentNo",
    //             operator: "contains",
    //             type: "string",
    //             value: "",
    //         },
    //         {
    //             name: "SenderName",
    //             operator: "contains",
    //             type: "string",
    //             value: "",
    //         },
    //         {
    //             name: "SenderReference",
    //             operator: "contains",
    //             type: "string",
    //             value: "",
    //         },
    //         {
    //             name: "SenderState",
    //             operator: "inlist",
    //             type: "select",
    //             value: null,
    //             emptyValue: "",
    //         },
    //         {
    //             name: "ReceiverName",
    //             operator: "contains",
    //             type: "string",
    //             value: null,
    //             emptyValue: "",
    //         },
    //         {
    //             name: "ReceiverReference",
    //             operator: "contains",
    //             type: "string",
    //             value: null,
    //             emptyValue: "",
    //         },
    //         {
    //             name: "ReceiverState",
    //             operator: "inlist",
    //             type: "select",
    //             value: null,
    //             emptyValue: "",
    //         },
    //         {
    //             name: "ConsignmentStatus",
    //             operator: "inlist",
    //             type: "select",
    //             value: null,
    //             emptyValue: "",
    //         },
    //         {
    //             name: "DeliveryInstructions",
    //             operator: "contains",
    //             type: "string",
    //             value: "",
    //             emptyValue: "",
    //         },
    //         {
    //             name: "POD",
    //             operator: "inlist",
    //             type: "select",
    //             value: null,
    //             emptyValue: "",
    //         },
    //         {
    //             name: "DeliveryRequiredDateTime",
    //             operator: "inrange",
    //             type: "date",
    //         },
    //         {
    //             name: "DeliveredDateTime",
    //             operator: "inrange",
    //             type: "date",
    //         },
    //         {
    //             name: "Comments",
    //             operator: "contains",
    //             type: "string",
    //             value: "",
    //             emptyValue: "",
    //         },
    //     ]);
    // }, [activeComponentIndex]);
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

    const handleViewComments = (data) => {
        setCommentsData(data?.Comments);
        setConsId(data?.ConsignmentID);
        setIsViewModalOpen(true);
    };

    function CustomColumnEditor(props) {
        const { value, onChange, onComplete, cellProps, onCancel } = props;

        const [prvsComment, setPrvsComment] = useState(
            value ? value[0].Comment : null
        );
        const [inputValue, setInputValue] = useState(prvsComment);
        const [commentId, setCommentId] = useState(
            value ? value[0].CommentId : null
        );

        // Create a ref for the textarea
        const textareaRef = useRef(null);

        // Focus the textarea when the component mounts
        useEffect(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }, []); // Empty dependency array ensures this runs once on mount

        const onValueChange = (e) => {
            let newValue = e.target.value;

            setInputValue(newValue);
            onChange(newValue);
        };

        const handleComplete = async () => {
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
                                    if (response.status === 200) {
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
                onCancel();
            }
        };

        return (
            canAddDeliveryReportComment(currentUser) && (
                <>
                    <textarea
                        ref={textareaRef} // Attach the ref here
                        style={{ width: "100%", maxHeight: "100%" }}
                        type="text"
                        value={inputValue}
                        className="text-sm font-semibold placeholder:text-sm placeholder:font-light resize-none placeholder:text-gray-500"
                        placeholder="Add a new comment"
                        onBlur={onCancel}
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
            } else if (lastValue == undefined) {
                return "";
            } else {
                return `${lastValue}`;
            }
        };

        return <div>{getLastValue(inputString)}</div>;
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
                return isDummyAccount(value);
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
                minDate: getMinMaxValue(dailyReportData, "DespatchDateTime", 1),
                maxDate: getMinMaxValue(dailyReportData, "DespatchDateTime", 2),
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
                            {isDummyAccount(value)}
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
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            group: "senderDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 180,
            filterEditor: StringFilter,
            render: ({ value }) => {
                return isDummyAccount(value);
            },
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
            render: ({ value }) => {
                return isDummyAccount(value);
            },
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            group: "receiverDetails",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 180,
            filterEditor: StringFilter,
            render: ({ value }) => {
                return isDummyAccount(value);
            },
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
                    dailyReportData,
                    "DeliveryRequiredDateTime",
                    1
                ),
                maxDate: getMinMaxValue(
                    dailyReportData,
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
                    dailyReportData,
                    "DeliveredDateTime",
                    1
                ),
                maxDate: getMinMaxValue(
                    dailyReportData,
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
                                        ) : (
                                            ""
                                        )}
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
        dailyReportData?.filter((item) => item?.CustomerTypeId == 1)
    );
    const [filteredWoolworthData, setFilteredWoolworthData] = useState(
        dailyReportData?.filter((item) => item?.CustomerTypeId == 2)
    );
    const [filteredOtherData, setFilteredOtherData] = useState(
        dailyReportData?.filter((item) => item?.CustomerTypeId == 3)
    );
    useEffect(() => {
        if (dailyReportData?.length > 0) {
            setFilteredMetcashData(
                dailyReportData?.filter((item) => item?.CustomerTypeId == 1)
            );
            setFilteredWoolworthData(
                dailyReportData?.filter((item) => item?.CustomerTypeId == 2)
            );
            setFilteredOtherData(
                dailyReportData?.filter((item) => item?.CustomerTypeId == 3)
            );
        }
    }, [dailyReportData]);

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
                    {canViewMetcashDailyReport(currentUser) && (
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
                    {canViewOtherDailyReport(currentUser) && (
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
            canViewMetcashDailyReport(currentUser) ? (
                <div>{components[activeComponentIndex]}</div>
            ) : activeComponentIndex == 1 &&
              canViewWoolworthsDeliveryReport(currentUser) ? (
                <div>{components[activeComponentIndex]}</div>
            ) : activeComponentIndex == 2 &&
              canViewOtherDailyReport(currentUser) ? (
                <div>{components[activeComponentIndex]}</div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
