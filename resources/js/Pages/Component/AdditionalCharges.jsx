import React, { useRef, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import StringFilter from "@inovua/reactdatagrid-community/StringFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import TableStructure from "@/Components/TableStructure";
import {
    formatDateToExcel,
    renderConsDetailsLink,
    useApiRequests,
} from "@/CommonFunctions";
import { getMinMaxValue } from "@/Components/utils/dateUtils";
import { createNewLabelObjects } from "@/Components/utils/dataUtils";
import { handleFilterTable } from "@/Components/utils/filterUtils";
import { exportToExcel } from "@/Components/utils/excelUtils";
import AnimatedLoading from "@/Components/AnimatedLoading";
import { CustomContext } from "@/CommonContext";

export default function AdditionalCharges({
    AdditionalData,
    setAdditionalData,
    filterValue,
    setFilterValue,
}) {
    const { user, url, userPermissions } = useContext(CustomContext);
    const { getApiRequest } = useApiRequests();
    window.moment = moment;
    const [isFetching, setIsFetching] = useState();
    useEffect(() => {
        if (AdditionalData === null || AdditionalData === undefined) {
            setIsFetching(true);
            fetchData();
        }
    }, []);

    async function fetchData() {
        const data = await getApiRequest(`${url}AddCharges`, {
            UserId: user?.UserId,
        });

        if (data) {
            const updatedData = data.map((item) => ({
                ...item,
                TotalCharge: (
                    (item.ChargeRate || 0) * (item.Quantity || 0)
                ).toFixed(2),
            }));
            setAdditionalData(updatedData);
            setIsFetching(false);
        }
    }
    const gridRef = useRef(null);
    const handleDownloadExcel = () => {
        const jsonData = handleFilterTable(gridRef, AdditionalData);

        const columnMapping = columns.reduce((acc, column) => {
            acc[column.name] = column.header;
            return acc;
        }, {});

        const customCellHandlers = {
            DespatchDateTime: (value) =>
                value ? formatDateToExcel(value) : "",
            FuelLevyAmountRef: (value) => (value ? value : 0),
        };

        exportToExcel(
            jsonData,
            columnMapping,
            "Additional-Charges.xlsx",
            customCellHandlers,
            ["DespatchDateTime"]
        );
    };

    const [selected, setSelected] = useState([]);

    const minDate = getMinMaxValue(AdditionalData, "DespatchDateTime", 1);
    const maxDate = getMinMaxValue(AdditionalData, "DespatchDateTime", 2);

    const reference = createNewLabelObjects(AdditionalData, "CodeRef");
    const name = createNewLabelObjects(AdditionalData, "Name");
    const description = createNewLabelObjects(AdditionalData, "Description");
    const columns = [
        {
            name: "ConsignmentNo",
            header: "Cons No",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
            render: ({ value, data }) => {
                return renderConsDetailsLink(
                    userPermissions,
                    value,
                    data.ConsignmentID
                );
            },
        },
        {
            name: "SenderReference",
            header: "Sender Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "ReceiverReference",
            header: "Receiver Reference",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "Quantity",
            header: "Quantity",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "ChargeRate",
            header: "Charge Rate",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "TotalCharge",
            header: "Total Charge",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
            render: ({ value }) => {
                return Number(value).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            },
        },
        {
            name: "CodeRef",
            header: "Code Ref",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: reference,
            },
        },
        {
            name: "DescriptionRef",
            header: "Description Ref",
            type: "string",
            headerAlign: "center",
            textAlign: "start",
            defaultWidth: 170,
            filterEditor: StringFilter,
        },
        {
            name: "FuelLevyAmountRef",
            header: "Fuel Levy Amount Ref",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
        {
            name: "DespatchDateTime",
            header: "Despatch Date",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            dateFormat: "DD-MM-YYYY",
            filterEditor: DateFilter,
            filterEditorProps: {
                minDate: minDate,
                maxDate: maxDate,
            },
            render: ({ value }) => {
                return moment(value).format("DD-MM-YYYY hh:mm A") ==
                    "Invalid date"
                    ? ""
                    : moment(value).format("DD-MM-YYYY hh:mm A");
            },
        },
        {
            name: "Name",
            header: "Name",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: name,
            },
        },
        {
            name: "Description",
            header: "Description",
            type: "string",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: description,
            },
        },
        {
            name: "Code",
            header: "Code",
            headerAlign: "center",
            textAlign: "center",
            defaultWidth: 170,
            type: "number",
            filterEditor: NumberFilter,
        },
    ];

    if (isFetching) {
        return <AnimatedLoading />;
    }
    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <TableStructure
                id={"ConsignmentID"}
                gridRef={gridRef}
                handleDownloadExcel={handleDownloadExcel}
                title={"Additional Charges"}
                setSelected={setSelected}
                selected={selected}
                tableDataElements={AdditionalData}
                filterValueElements={filterValue}
                setFilterValueElements={setFilterValue}
                columnsElements={columns}
            />
        </div>
    );
}

AdditionalCharges.propTypes = {
    AdditionalData: PropTypes.array,
    setAdditionalData: PropTypes.func,
    filterValue: PropTypes.array,
    setFilterValue: PropTypes.func,
    url: PropTypes.string,
};
