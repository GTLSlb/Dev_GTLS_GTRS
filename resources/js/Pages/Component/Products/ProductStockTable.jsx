import React, { useCallback, useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Pagination,
    Select,
    SelectItem,
    Spinner,
} from "@nextui-org/react";
import { useMemo } from "react";
import { useRef } from "react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import moment from "moment/moment";

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

export default function ProductStockTable({ url, AToken, currentUser }) {
    const [productsData, setProductsData] = useState([]);
    const [debtors, setDebtors] = useState([]);
    const [page, setPage] = React.useState(1);
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
                    Authorization: `Bearer ${AToken}`,
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
        { name: "Debtor Name", uid: "DebtorName" },
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
                ...group.items.map((item, itemIndex) => ({
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
        // Filter rows based on ProductCode
        let filtered = groupedData.filter((item) => {
            if (item.isItemRow || item.isTotalRow) {
                return String(item.ProductCode)
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            }
            return true; // Keep separator rows
        });

        // Apply Debtor filter if a debtor is selected
        if (selectedDebtor.size > 0) {
            filtered = filtered.filter((item) => {
                // Apply filter only for item or total rows; keep separator rows
                if (item.isItemRow) {
                    return item.DebtorId == selectedDebtor.currentKey;
                }
                return true; // Keep separator rows
            });
        }

        // Apply Branch filter if a branch is selected
        if (selectedBranch.size > 0) {
            filtered = filtered.filter((item) => {
                // Apply filter only for item or total rows; keep separator rows
                if (item.isItemRow) {
                    return item.WarehouseID == selectedBranch.currentKey;
                }
                return true; // Keep separator rows
            });
        }

        filtered = filtered.filter((row, index, arr) => {
            if (row.isTotalRow) {
                const prevRow = arr[index - 1];
                return prevRow && prevRow.isItemRow; // Only include total row if the previous row is an item row
            }
            return true; // Keep all other rows
        });
        setPage(1);
        setDisplayCount(rowsPerPage);
        setHasMore(true);
        // Remove consecutive separator rows
        return filtered.filter((row, index, arr) => {
            if (row.isSeparatorRow) {
                const prevRow = arr[index - 1];
                return !(prevRow && prevRow.isSeparatorRow); // Exclude if previous row is also a separator
            }
            return true;
        });
    }, [groupedData, filterValue, selectedDebtor, selectedBranch]);
    console.log(filteredData);

    const renderCell = useCallback((item, columnKey) => {
        // Handle special cases first
        if (item.isTotalRow) {
            if (columnKey === "quantity") {
                return (
                    <strong className="truncate">
                        Total: {item.quantity.toLocaleString()}
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
                        ).format("DD-MM-YYYY HH:mm A") == "Invalid date"
                            ? ""
                            : moment(
                                  cellValue?.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY HH:mm A")}
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

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
                    <div>
                        <h1 className="text-2xl font-bold text-dark">
                            SOH Report
                        </h1>
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
                        <Select
                            classNames={{ trigger: "bg-white" }}
                            label="Debtor"
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
                                "containerscroll !p-0 border-[10px] border-white max-h-[700px]",
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
                        <TableBody items={displayedData}>
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

                    {/* <div className="flex w-full p-5 pt-0 justify-center">
                        <Pagination
                            isCompact
                            classNames={{
                                wrapper: "bg-white",
                                item: "bg-white",
                                next: "bg-white",
                                prev: "bg-white",
                                cursor: "bg-gray-500 shadow-gray-500/50",
                            }}
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div> */}
                </div>
            )}
        </div>
    );
}
