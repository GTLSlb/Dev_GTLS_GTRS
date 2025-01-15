import { formatDateToExcel } from "@/CommonFunctions";
import SafetyModal from "@/Components/AddsafetyModal";
import AnimatedLoading from "@/Components/AnimatedLoading";
import DescriptionModal from "@/Components/DescriptionModal";
import TableStructure from "@/Components/TableStructure";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { canAddSafetyReport, canEditSafetyReport } from "@/permissions";
import { PencilIcon } from "@heroicons/react/24/outline";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import moment from "moment";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ToastContainer } from 'react-toastify';
import { AlertToast } from "@/permissions";

export default function SafetyRepTable({
    currentPageRep,
    safetyData,
    AToken,
    url,
    filterValue,
    customerAccounts,
    setFilterValue,
    currentUser,
    userPermission,
    setFilteredData,
    setDataEdited,
    safetyTypes,
    fetchData,
    setsafetyData,
    safetyCauses,
}) {
    window.moment = moment;
    const minDate = getMinMaxValue(safetyData, "OccuredAt", 1);
    const maxDate = getMinMaxValue(safetyData, "OccuredAt", 2);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpendesc, setIsModalOpendesc] = useState(false);
    const [safetyDesc, setSafetyDesc] = useState();
    const checkbox = useRef();
    const [currentPage, setCurrentPage] = useState(currentPageRep);
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedRecords, setselectedRecords] = useState([]);
    const [isSuccessfull, setIsSuccessfull] = useState(false);
    useLayoutEffect(() => {
        const isIndeterminate =
            selectedRecords?.length > 0 &&
            selectedRecords?.length < safetyData?.length;
        setChecked(selectedRecords?.length === safetyData?.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedRecords]);
    const gridRef = useRef(null);

    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, safetyData); // Fetch the filtered data

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers for specific columns
        const customCellHandlers = {
            SafetyType: (value, item) => {
                const reason = safetyTypes?.find(
                    (reason) => reason.SafetyTypeId === item.SafetyType
                );
                return reason?.SafetyTypeName || "";
            },
            DebtorId: (value, item) => {
                const account = customerAccounts?.find(
                    (acc) => acc.DebtorId == item.DebtorId
                );
                return account?.AccountNo || "";
            },
            OccuredAt: (value) => formatDateToExcel(value), // Convert date to Excel format
            Reference: (value, item) => {
                if (value === 1) return "Internal";
                if (value === 2) return "External";
                if (value === 3) return "Type 3";
                return "";
            },
        };

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Safety-Report.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            ["OccuredAt"]
        );
    };
    const [selected, setSelected] = useState([]);
    const [buttonAction, setbuttonAction] = useState();
    const [modalRepId, setmodalRepId] = useState();
    const [modalSafetyType, setmodalSafetyType] = useState();
    const [modalMainCause, setmodalMainCause] = useState();
    const [modalState, setmodalState] = useState();
    const [modalDebtorId, setmodalDebtorId] = useState();
    const [modalDepar, setmodalDepar] = useState();
    const [modalExpl, setmodalExpl] = useState();
    const [modalResol, setmodalResol] = useState();
    const [modalRefer, setmodalRefer] = useState(2);
    const [modalOccuredAt, setmodalOccuredAt] = useState();
    const [modaladdedBy, setmodaladdedBy] = useState();
    const [modalConsNo, setmodalConsNo] = useState();
    const handleAddClick = () => {
        setbuttonAction(1); //To define it's a Add Action
        setmodalRepId("");
        setIsModalOpen(!isModalOpen);
    };
    const handleEditClick = (
        reportId,
        safetyType,
        debtorId,
        mainCause,
        state,
        expl,
        resol,
        refer,
        occuredAt,
        consNo,
        addedBy
    ) => {
        setbuttonAction(2); //To define it's a Edit Action
        setmodalRepId(reportId);
        setmodalDebtorId(debtorId);
        setmodalSafetyType(safetyType);
        setmodalMainCause(mainCause);
        setmodalState(state);
        setmodalExpl(expl);
        setmodalResol(resol);
        setmodalRefer(refer);
        setmodalOccuredAt(occuredAt);
        setmodalConsNo(consNo);
        setmodaladdedBy(addedBy);
        const isModalCurrentlyOpen = !isModalOpen;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpen(isModalCurrentlyOpen);
    };
    const handleEditClickdesc = (report) => {
        setSafetyDesc(report);
        const isModalCurrentlyOpen = !isModalOpendesc;
        document.body.style.overflow = isModalCurrentlyOpen ? "hidden" : "auto";
        setIsModalOpendesc(isModalCurrentlyOpen);
    };
    const generateUniqueId = () => {
        const timestamp = new Date().getTime();
        const uniqueId = `id_${timestamp}`;
        return uniqueId;
    };
    const updateLocalData = (id, updates) => {
        let itemFound = false;

        const updatedData = safetyData?.map((item) => {
            if (item.ReportId === id) {
                itemFound = true;
                // Update the fields of the matching item
                return { ...item, ...updates };
            }
            return item;
        });

        if (!itemFound) {
            // Create a new item if the provided id was not found
            updatedData?.push({ id: generateUniqueId(), ...updates });
        }
        setsafetyData(updatedData);
        setDataEdited(true);
    };
    const stateOptions = createNewLabelObjects(safetyData, "State");

    const safetyTypeOptions = safetyTypes.map((reason) => ({
        id: reason.SafetyTypeId,
        label: reason.SafetyTypeName,
    }));
    const debtorsOptions = customerAccounts.map((reason) => ({
        id: parseInt(reason.DebtorId.trim(), 10), // Convert id to integer and remove any whitespace
        label: reason.AccountNo,
    }));
    const [canEdit, setCanEdit] = useState(true);

    useEffect(() => {
        if (userPermission) {
            setCanEdit(canEditSafetyReport(userPermission));
        }
    }, [userPermission]);
    const referenceOptions = [
        {
            id: 1,
            label: "Internal",
        },
        {
            id: 2,
            label: "External",
        },
    ];
    const columns = [
        {
            name: "SafetyType",
            header: "Safety Type",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: safetyTypeOptions,
            },
            defaultWidth: 200,
            render: ({ value }) => {
                return (
                    <div>
                        {/* {value} */}
                        {
                            safetyTypes?.find(
                                (type) => type.SafetyTypeId === value
                            )?.SafetyTypeName
                        }
                    </div>
                );
            },
        },
        {
            name: "ConsNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "DebtorId",
            header: "Account Name",
            headerAlign: "center",
            textAlign: "center",
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: false,
                wrapMultiple: false,
                dataSource: debtorsOptions,
            },
            defaultWidth: 200,
            render: ({ value }) => {
                return (
                    <div>
                        {/* {value} */}
                        {
                            customerAccounts?.find(
                                (customer) => customer.DebtorId == value
                            )?.AccountNo
                        }
                    </div>
                );
            },
        },
        {
            name: "CAUSE",
            header: "Main Cause",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "State",
            header: "State",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: stateOptions,
            },
        },
        {
            name: "Explanation",
            header: "Explanation",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Resolution",
            header: "Resolution",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Reference",
            header: "Reference",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: referenceOptions,
            },
            render: ({ value }) => {
                return value == 1 ? (
                    <span>Internal</span>
                ) : value == 2 ? (
                    <span>External</span>
                ) : (
                    <span></span>
                );
            },
        },
        {
            name: "OccuredAt",
            header: "Occured at",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value, cellProps }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "AddedBy",
            header: "Added By",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "edit",
            header: "Edit",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 100,
            render: ({ value, data }) => {
                return (
                    <div>
                        {canEdit ? (
                            <button
                                className={
                                    "rounded text-blue-500 justify-center items-center  "
                                }
                                onClick={() => {
                                    handleEditClick(
                                        data.ReportId,
                                        data.SafetyType,
                                        data.DebtorId,
                                        data.CAUSE,
                                        data.State,
                                        data.Explanation,
                                        data.Resolution,
                                        data.Reference,
                                        data.OccuredAt,
                                        data.ConsNo,
                                        data.AddedBy
                                    );
                                }}
                            >
                                <span className="flex gap-x-1">
                                    <PencilIcon className="h-4" />
                                    Edit
                                </span>
                            </button>
                        ) : null}
                    </div>
                );
            },
        },
    ];
    const newArray = columns?.slice(0, -1);
    const [newColumns, setNewColumns] = useState();
    useEffect(() => {
        if (userPermission) {
            if (canEditSafetyReport(userPermission)) {
                setNewColumns(columns);
            } else {
                setNewColumns(newArray);
            }
        }
    }, [userPermission]);

    const additionalButtons = canAddSafetyReport(userPermission) ? (
        <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center w-[5.5rem] h-[36px] rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            Add safety
        </button>
    ) : (
        <div></div>
    );

    useEffect(() => {
        if(isSuccessfull){
            AlertToast("Saved Successfully", 1);
            setIsSuccessfull(false);
        }
    },[isSuccessfull])
    return (
        <div>
            {/* Added toast container since it wasn't showing */}
            <ToastContainer />
            <div className=" w-full bg-smooth pb-20">
                {!newColumns ? (
                    <AnimatedLoading />
                ) : (
                    <div>
                        <TableStructure
                            id={"ReportId"}
                            handleDownloadExcel={handleDownloadExcel}
                            title={"Safety Reports"}
                            setSelected={setSelected}
                            gridRef={gridRef}
                            additionalButtons={additionalButtons}
                            selected={selected}
                            setFilterValueElements={setFilterValue}
                            tableDataElements={safetyData}
                            filterValueElements={filterValue}
                            columnsElements={newColumns}
                        />
                    </div>
                )}
            </div>
            <DescriptionModal
                isOpen={isModalOpendesc}
                handleClose={handleEditClickdesc}
                safetyDesc={safetyDesc}
                setSafetyDesc={setSafetyDesc}
                safetyTypes={safetyTypes}
            />
            <SafetyModal
                url={url}
                setIsSuccessfull={setIsSuccessfull}
                AToken={AToken}
                customerAccounts={debtorsOptions}
                safetyTypes={safetyTypes}
                safetyCauses={safetyCauses}
                isOpen={isModalOpen}
                handleClose={handleEditClick}
                modalConsNo={modalConsNo}
                modaladdedBy={modaladdedBy}
                modalRepId={modalRepId}
                modalSafetyType={modalSafetyType}
                modalMainCause={modalMainCause}
                modalState={modalState}
                modalDepar={modalDepar}
                modalDebtorId={modalDebtorId}
                modalExpl={modalExpl}
                modalResol={modalResol}
                modalRefer={modalRefer}
                modalOccuredAt={modalOccuredAt}
                currentUser={currentUser}
                userPermission={userPermission}
                buttonAction={buttonAction}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}
