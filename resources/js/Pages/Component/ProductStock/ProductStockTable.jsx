import React, { useCallback, useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Select,
    SelectItem,
    Spinner,
} from "@heroui/react";
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";
import { useMemo } from "react";
import moment from "moment/moment";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import PropTypes from "prop-types";
import swal from "sweetalert";
export const SearchIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export default function ProductStockTable({ url, Token, currentUser }) {
    const [productsData, setProductsData] = useState([]);
    const [debtors, setDebtors] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedDebtor, setSelectedDebtor] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [displayCount, setDisplayCount] = useState(30);

    const rowsPerPage = 30;
    // const scrollRef = useRef(null);
    const [hasMore, setHasMore] = React.useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${url}/SOH`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            });

            // Convert TransitDays to string
            setProductsData(response.data);
            const debtorList = Array.from(
                new Map(
                    response.data.map((item) => [
                        item.DebtorId,
                        {
                            DebtorId: item.DebtorId,
                            DebtorName: item.DebtorName,
                        },
                    ])
                ).values()
            );
            setDebtors(debtorList);
            const branchlist = Array.from(
                new Map(
                    response.data.map((item) => [
                        item.WarehouseID,
                        {
                            BranchId: item.WarehouseID,
                            BranchName: item.BranchName,
                        },
                    ])
                ).values()
            );
            setBranches(branchlist);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                swal({
                    title: "Session Expired!",
                    text: "Please login again",
                    type: "error",
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
                            console.error(error);
                        });
                });
            } else {
                console.error(error);
            }
        }
    };

    const [filterValue, setFilterValue] = React.useState("");

    const columns = [
        { name: "Product Code", uid: "ProductCode" },
        { name: "Description", uid: "ProductDescription" },
        { name: "Account Name", uid: "DebtorName" },
        { name: "Branch Name", uid: "BranchName" },
        { name: "Weight", uid: "Weight" },
        { name: "Quantity", uid: "quantity" },
        { name: "Batch No", uid: "BatchNo" },
        { name: "Handling UOM", uid: "HandlingUOM" },
        { name: "Handling Type", uid: "HandlingType" },
        { name: "Pick/Put UOM ", uid: "PickPutUOM" },
        { name: "License Plate", uid: "LicensePlate" },
        { name: "Serial No", uid: "SerialNo" },
        { name: "Location", uid: "Location" },
        { name: "Date Req. Type ", uid: "DateReqType" },
        { name: "Date", uid: "DateRequirementDate" },
    ];

    const groupedColumns = [
        { name: "Account Name", uid: "DebtorName" },
        { name: "Branch Name", uid: "BranchName" },
        { name: "Total Pallets", uid: "Total" },
    ];

    // Group data by ProductId
    const groupedData = React.useMemo(() => {
        const groups = productsData.reduce((acc, item) => {
            if (!acc[item.ProductId]) {
                acc[item.ProductId] = { ...item, items: [] };
            }
            acc[item.ProductId].items.push(item);
            acc[item.ProductId].totalQuantity =
                (acc[item.ProductId].totalQuantity || 0) + item.quantity;
            return acc;
        }, {});
        return Object.values(groups).flatMap((group, groupIndex) => {
            let rowIndex = groupIndex * 1000; // Start index for each group (e.g., 1000 per group to ensure uniqueness)

            return [
                // Add items with index
                ...group.items.map((item) => ({
                    ...item,
                    isItemRow: true,
                    index: rowIndex++, // Increment index for each item
                })),
                // Add total row with index
                {
                    ProductId: group.ProductId,
                    ProductCode: group.ProductCode,
                    ProductDescription: group.ProductDescription,
                    DebtorName: "",
                    quantity: group.totalQuantity,
                    PalletTotal: group.items.length, // Use the count of items in the group
                    BatchNo: "",
                    isTotalRow: true,
                    index: rowIndex++, // Increment index for the total row
                },
                // Add separator row with index
                {
                    isSeparatorRow: true,
                    index: rowIndex++, // Increment index for the separator row
                },
            ];
        });
    }, [productsData]);

    // Filtered data based on the filter input
    const filteredData = React.useMemo(() => {
        // Step 1: Filter rows based on ProductCode
        let filtered = groupedData.filter((item) => {
            if (item.isItemRow) {
                return String(item.ProductCode)
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            }
            return true; // Keep separator rows
        });

        // Step 2: Apply Debtor filter if a debtor is selected
        if (selectedDebtor.size > 0) {
            filtered = filtered.filter((item) => {
                if (item.isItemRow) {
                    return item.DebtorId == selectedDebtor.currentKey;
                }
                return true; // Keep separator rows
            });
        }

        // Step 3: Apply Branch filter if a branch is selected
        if (selectedBranch.size > 0) {
            filtered = filtered.filter((item) => {
                if (item.isItemRow) {
                    return item.WarehouseID == selectedBranch.currentKey;
                }
                return true; // Keep separator rows
            });
        }

        // Step 4: Regroup filtered data by ProductId to calculate totals
        const recalculatedGroups = filtered.reduce((acc, item) => {
            if (item.isItemRow) {
                if (!acc[item.ProductId]) {
                    acc[item.ProductId] = {
                        ...item,
                        items: [],
                        totalQuantity: 0,
                        totalPallets: 0,
                    };
                }
                acc[item.ProductId].items.push(item);
                acc[item.ProductId].totalQuantity += item.quantity || 0;
                acc[item.ProductId].totalPallets += 1; // Count items for pallets
            }
            return acc;
        }, {});
        setDisplayCount(30)
        setHasMore(true)
        // Step 5: Flatten groups into rows with recalculated totals
        return Object.values(recalculatedGroups).flatMap(
            (group, groupIndex) => {
                let rowIndex = groupIndex * 1000; // Start index for each group (e.g., 1000 per group to ensure uniqueness)
                let rows = group.items.map((item) => ({
                    ...item,
                    isItemRow: true,
                    index: rowIndex++,
                }));

                // Add total row for each group
                rows.push({
                    ProductId: group.ProductId,
                    ProductCode: group.ProductCode,
                    ProductDescription: group.ProductDescription,
                    quantity: group.totalQuantity,
                    PalletTotal: group.totalPallets,
                    index: rowIndex++,
                    isTotalRow: true,
                });

                // Add separator row
                rows.push({ isSeparatorRow: true, index: rowIndex++ });

                return rows;
            }
        );
    }, [groupedData, filterValue, selectedDebtor, selectedBranch]);

    const groupedByDebtorAndBranch = React.useMemo(() => {
        // Initialize the result object
        const result = [];

        // Group data by DebtorId
        const groupedByDebtor = filteredData.reduce((acc, item) => {
            // Skip separator or total rows
            if (item.isSeparatorRow || item.isTotalRow) return acc;

            if (!acc[item.DebtorId]) {
                acc[item.DebtorId] = {
                    Debtor: item.DebtorId,
                    DebtorName: item.DebtorName,
                    data: {}, // Initialize an object to group by branch
                };
            }

            // Group data by branch within each debtor
            if (!acc[item.DebtorId].data[item.WarehouseID]) {
                acc[item.DebtorId].data[item.WarehouseID] = {
                    branch: item.WarehouseID,
                    branchName: item.BranchName,
                    total: 0, // Initialize total pallet count for this branch
                };
            }

            // Increment the total for the current branch
            acc[item.DebtorId].data[item.WarehouseID].total += 1; // Count 1 pallet per item

            return acc;
        }, {});

        // Transform the grouped data into the desired array format
        for (const debtorId in groupedByDebtor) {
            const debtor = groupedByDebtor[debtorId];
            result.push({
                Debtor: debtor.Debtor,
                DebtorName: debtor.DebtorName,
                data: Object.values(debtor.data), // Convert branch object into an array
            });
        }

        return result;
    }, [filteredData]);

    const renderCell = useCallback((item, columnKey) => {
        // Handle special cases first
        if (item.isTotalRow) {
            if (columnKey === "quantity") {
                return (
                    <strong className="truncate">
                        Total Quantity: {item.quantity.toLocaleString()}
                    </strong>
                );
            } else if (columnKey === "ProductCode") {
                return (
                    <strong className="truncate">
                        Total Pallets: {item.PalletTotal.toLocaleString()}
                    </strong>
                );
            }
            return null; // Empty cell for other columns in total row
        }

        if (item.isSeparatorRow) {
            return null; // Empty cell for separator rows
        }

        // Default rendering logic for regular rows
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "quantity":
                return <div className="">{cellValue.toLocaleString()}</div>;
            case "BranchName":
                return <div className="truncate">{cellValue}</div>;
            case "Location":
                return <div className="truncate">{cellValue}</div>;
            case "DebtorName":
                return <div className="truncate">{cellValue}</div>;
            case "DateReqType":
                return <div className="truncate">{cellValue}</div>;
            case "ProductDescription":
                return <div className="truncate">{cellValue}</div>;
            case "SerialNo":
                return <div className="truncate">{cellValue}</div>;
            case "HandlingUOM":
                return <div className="truncate">{cellValue}</div>;
            case "BatchNo":
                return <div className="truncate">{cellValue}</div>;
            case "ProductCode":
                return <div className="truncate">{cellValue}</div>;
            case "DateRequirementDate":
                return (
                    <div className="truncate">
                        {moment(
                            cellValue?.replace("T", " "),
                            "YYYY-MM-DD HH:mm:ss"
                        ).format("DD-MM-YYYY") == "Invalid date"
                            ? ""
                            : moment(
                                  cellValue?.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY")}
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);


    const onClear = React.useCallback(() => {
        setFilterValue("");
        setDisplayCount(30)
        setHasMore(true)
    }, []);

    function onClearAll() {
        setFilterValue("");
        setSelectedBranch(new Set());
        setSelectedDebtor(new Set());
        setDisplayCount(30)
        setHasMore(true)
    }

    const displayedData = useMemo(
        () => filteredData.slice(0, displayCount),
        [filteredData, displayCount]
    );

    function LoadMore() {
        setDisplayCount((prev) => {
            const newCount = Math.min(prev + rowsPerPage, filteredData.length);
            if (newCount >= filteredData.length) {
                setHasMore(false); // No more data to load
            }
            return newCount;
        });
    }

    const [loaderRef, scrollRef] = useInfiniteScroll({
        hasMore,
        onLoadMore: LoadMore,
    });

    function handleDownloadExcel() {
        // Map your column headers (key-value pairs for renaming)
        const columnMapping = {
            ProductCode: "Product Code",
            ProductDescription: "Description",
            DebtorName: "Account Name",
            BranchName: "Branch Name",
            Weight: "Weight",
            Quantity: "Quantity",
            BatchNo: "Batch No",
            HandlingUOM: "Handling UOM",
            HandlingType: "Handling Type",
            PickPutUOM: "Pick/Put UOM",
            LicensePlate: "License Plate",
            SerialNo: "Serial No",
            Location: "Location",
            DateReqType: "Date Req. Type",
            DateRequirementDate: "Date",
        };

        const palletSummaryColumns = [
            "Account Name",
            "Branch Name",
            "Total Pallets",
        ];

        // Map `filteredData` into table-ready rows for the first sheet
        const sohReportData = filteredData.map((item) => {
            if (item.isTotalRow) {
                // Handle the total row explicitly
                return Object.keys(columnMapping).map((key) => {
                    if (key === "Quantity") {
                        return `Total Quantity: ${
                            item.quantity?.toLocaleString() || 0
                        }`;
                    }
                    if (key === "ProductCode") {
                        return `Total Pallets: ${
                            item.PalletTotal?.toLocaleString() || 0
                        }`;
                    }
                    // Leave other columns blank for the total row
                    return "";
                });
            }

            // Handle normal rows
            return Object.keys(columnMapping).map((key) => {
                if (key === "DateRequirementDate") {
                    // Format dates
                    return moment(
                        item["DateRequirementDate"]?.replace("T", " "),
                        "YYYY-MM-DD HH:mm:ss"
                    ).format("DD-MM-YYYY") == "Invalid date"
                        ? ""
                        : moment(
                              item["DateRequirementDate"]?.replace("T", " "),
                              "YYYY-MM-DD HH:mm:ss"
                          ).format("DD-MM-YYYY");
                }
                if (key === "Quantity") {
                    // Format numeric values
                    return item["quantity"]
                        ? item["quantity"].toLocaleString()
                        : "";
                }
                // Return the item's value for other fields
                return item[key] || "";
            });
        });
        // Map `groupedByDebtorAndBranch` into rows for the second sheet
        const palletSummaryData = groupedByDebtorAndBranch.flatMap((debtor) =>
            debtor.data.map((branch) => [
                debtor.DebtorName,
                branch.branchName,
                branch.total,
            ])
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add the first worksheet: SOH Report
        const sohSheet = workbook.addWorksheet("SOH Report");
        sohSheet.addRow(Object.values(columnMapping)); // Add the header row
        sohReportData.forEach((row, rowIndex) => {
            const worksheetRow = sohSheet.addRow(row);

            if (filteredData[rowIndex]?.isTotalRow) {
                // Apply bold styling to total rows
                worksheetRow.eachCell((cell) => {
                    cell.font = { bold: true }; // Make text bold
                });
            }

            if (filteredData[rowIndex]?.isSeparatorRow) {
                // Apply styling for separator rows
                worksheetRow.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFCCCCCC" }, // Light gray background (#CCCCCC)
                    };
                    cell.font = { bold: true }; // Optional: Make text bold
                    cell.alignment = { horizontal: "center" }; // Optional: Center text
                });
            }
        });

        // Style the header row of the first sheet
        sohSheet.getRow(1).font = { bold: true };
        sohSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background
        };
        sohSheet.columns.forEach((column) => (column.width = 20)); // Set column widths

        // Add the second worksheet: Pallets Summary
        const palletSummarySheet = workbook.addWorksheet("Pallets Summary");
        palletSummarySheet.addRow(palletSummaryColumns); // Add the header row
        palletSummaryData.forEach((row) => palletSummarySheet.addRow(row)); // Add data rows

        // Style the header row of the second sheet
        palletSummarySheet.getRow(1).font = { bold: true };
        palletSummarySheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background
        };
        palletSummarySheet.columns.forEach((column) => (column.width = 20)); // Set column widths

        // Generate and download the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "SOH_Report.xlsx");
        });
    }

    return (
        <div>
            {productsData.length === 0 ? (
                <div className="min-h-screen md:pl-20 pt-16 h-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full mr-5 animate-bounce200`}
                        ></div>
                        <div
                            className={`h-5 w-5 bg-goldd rounded-full animate-bounce400`}
                        ></div>
                    </div>
                    <div className="text-dark mt-4 font-bold">
                        Please wait while we get the data for you.
                    </div>
                </div>
            ) : (
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex smitems-center flex-col sm:flex-row justify-between gap-5">
                        <h1 className="text-2xl font-bold text-dark">
                            SOH Report
                        </h1>
                        <div className="flex gap-4">
                            <Button
                                className="bg-gray-800 text-white"
                                onClick={() => onClearAll()}
                                radius="sm"
                                size="md"
                            >
                                Clear Filter
                            </Button>
                            <Button
                                className="bg-gray-800 text-white"
                                onClick={() => handleDownloadExcel()}
                                radius="sm"
                                size="md"
                            >
                                Export
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        <Input
                            isClearable
                            classNames={{
                                input: "!border-none focus:ring-0",
                                inputWrapper: "bg-white shadow",
                            }}
                            startContent={<SearchIcon />}
                            onClear={() => onClear()}
                            size="lg"
                            className="w-full"
                            placeholder="Product Code"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                        {debtors.length > 0 && (
                            <Select
                                classNames={{ trigger: "bg-white" }}
                                label="Account"
                                size="sm"
                                placeholder=" "
                                selectedKeys={selectedDebtor}
                                variant="bordered"
                                onSelectionChange={setSelectedDebtor}
                            >
                                {debtors.map((item) => (
                                    <SelectItem key={item.DebtorId}>
                                        {item.DebtorName}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}

                        <Select
                            classNames={{ trigger: "bg-white" }}
                            label="Branch"
                            size="sm"
                            placeholder=" "
                            selectedKeys={selectedBranch}
                            variant="bordered"
                            onSelectionChange={setSelectedBranch}
                        >
                            {branches.map((item) => (
                                <SelectItem key={item.BranchId}>
                                    {item.BranchName}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <Table
                        isStriped
                        id="product-stock-table"
                        isHeaderSticky
                        baseRef={scrollRef}
                        bottomContent={
                            hasMore ? (
                                <div className="flex w-full justify-center">
                                    <Spinner ref={loaderRef} color="white" />
                                </div>
                            ) : null
                        }
                        aria-label="Product Stock Table"
                        classNames={{
                            wrapper:
                                "containerscroll !p-0 border-[10px] border-white max-h-[650px]",
                            thead: "[&>tr]:first:shadow-none",
                            th: "bg-gray-200",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            items={displayedData}
                            emptyContent={"No data found"}
                        >
                            {(item) => (
                                <TableRow
                                    key={item.index}
                                    style={{
                                        backgroundColor: item.isSeparatorRow
                                            ? "white"
                                            : "inherit",
                                        borderTop: item.isSeparatorRow
                                            ? "2px solid black"
                                            : "none",
                                    }}
                                >
                                    {(columnKey) => (
                                        <TableCell
                                            className={
                                                item.isSeparatorRow
                                                    ? "py-3 px-0"
                                                    : ""
                                            }
                                        >
                                            {item.isSeparatorRow
                                                ? null
                                                : renderCell(item, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div>
                        <h1 className="text-2xl font-bold text-dark">
                            Pallets Summary
                        </h1>
                    </div>

                    <Table
                        isStriped
                        aria-label="Grouped Debtor and Branch Table"
                        classNames={{
                            wrapper:
                                "containerscroll !p-0 border-[10px] border-white max-h-[700px]",
                            thead: "[&>tr]:first:shadow-none",
                            th: "bg-gray-200",
                        }}
                    >
                        <TableHeader columns={groupedColumns}>
                            {(column) => (
                                <TableColumn key={column.uid}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"No data found"}>
                            {groupedByDebtorAndBranch.map((debtor) =>
                                debtor.data.map((branch, index) => (
                                    <TableRow
                                        key={`${debtor.Debtor}-${branch.branch}-${index}`}
                                    >
                                        <TableCell>
                                            {index === 0
                                                ? debtor.DebtorName
                                                : debtor.DebtorName}
                                        </TableCell>
                                        <TableCell>
                                            {branch.branchName}
                                        </TableCell>
                                        <TableCell>{branch.total}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

ProductStockTable.propTypes = {
    url: PropTypes.string,
    Token: PropTypes.string,
    currentUser: PropTypes.object,
};