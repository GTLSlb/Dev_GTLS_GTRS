import { CustomContext } from "@/CommonContext";
import AnimatedLoading from "@/Components/AnimatedLoading";
import TableStructure from "@/Components/TableStructure";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import { getFiltersContactsTable } from "@/Components/utils/filters";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import axios from "axios";
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import swal from "sweetalert";

function ContactRep() {
    const { url, Token, user, userPermissions } = useContext(CustomContext);
    const gridRef = useRef(null);
    const [selected] = useState({});
    const [contactsData, setcontactsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        axios
            .get(`${url}/Contacts`, {
                headers: {
                    UserId: user.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                const parsedData = res.data;
                setcontactsData(parsedData || []);
                setColumns([
                    {
                        name: "DebtorName",
                        header: "Debtor Name",
                        headerAlign: "center",
                        textAlign: "left",
                        defaultFlex: 1,
                        minWidth: 200,
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: createNewLabelObjects(
                                parsedData,
                                "DebtorName"
                            ),
                        },
                    },
                    {
                        name: "ContactTitle",
                        header: "Contact type",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        filterEditor: SelectFilter,
                        filterEditorProps: {
                            multiple: true,
                            wrapMultiple: false,
                            dataSource: createNewLabelObjects(
                                parsedData,
                                "ContactTitle"
                            ),
                        },
                    },
                    {
                        name: "ContactName",
                        header: "Contact Name",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "left",
                        defaultFlex: 1,
                        minWidth: 200,
                        filterEditor: StringFilter,
                    },
                    {
                        name: "ContactEmailAddress",
                        header: "Contact Email Address",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "left",
                        defaultFlex: 1,
                        minWidth: 200,
                        filterEditor: StringFilter,
                    },
                    {
                        name: "MobileNumber",
                        header: "Mobile Number",
                        type: "string",
                        headerAlign: "center",
                        textAlign: "center",
                        defaultFlex: 1,
                        minWidth: 200,
                        filterEditor: StringFilter,
                    },
                ]);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(() => {
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
                    console.log(err);
                }
            });
    }, [userPermissions, Token, url]);

    const [filtersValue, setFiltersValue] = useState(getFiltersContactsTable());

    function handleDownloadExcel() {
        const jsonData = handleFilterTable(gridRef, contactsData);

        // Dynamically create column mapping from the `columns` array
        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        // Define custom cell handlers
        const customCellHandlers = {};

        // Call the `exportToExcel` function
        exportToExcel(
            jsonData, // Filtered data
            columnMapping, // Dynamic column mapping from columns
            "Contacts-Data.xlsx", // Export file name
            customCellHandlers, // Custom handlers for formatting cells
            []
        );
    }

    const Title = () => {
        return (
            <>
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto md:mt-2">
                        <h1 className="text-2xl py-2 px-2 font-extrabold text-gray-600">
                            Contacts Report
                        </h1>
                    </div>
                </div>
            </>
        );
    };

    const renderTable = useCallback(() => {
        return (
            <div className="px-4 sm:px-6 pb-4 bg-smooth">
                <div className="px-4 sm:px-6 lg:px-0 w-full bg-smooth">
                    <TableStructure
                        handleDownloadExcel={handleDownloadExcel}
                        title={Title()}
                        id={"ContactId"}
                        // HeaderContent={HeaderContent()}
                        // setSelected={setSelected}
                        gridRef={gridRef}
                        selected={selected}
                        tableDataElements={contactsData}
                        filterValueElements={filtersValue}
                        setFilterValueElements={setFiltersValue}
                        columnsElements={columns}
                    />
                </div>
            </div>
        );
    }, [columns, contactsData, filtersValue, setFiltersValue]);

    return loading ? <AnimatedLoading /> : renderTable();
}

export default ContactRep;
