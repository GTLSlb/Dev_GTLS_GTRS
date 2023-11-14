import React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { PencilIcon } from "@heroicons/react/24/solid";
import notFound from "../../../../assets//pictures/NotFound.png";
import moment from "moment";
import { useEffect } from "react";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function MainTable({
    header,
    body,
    POs,
    states,
    supplierData,
    companies,
    categories,
    setPOBack,
    currentPage,
    setCurrentPage,
    setToPay,
    setInvoice,
    selectedRecords,
    setSelectedRecords,
    setPO,
    setActiveIndexInv,
    setInvoiceDetails,
    setPODetails,
    currentUser,
    sortedData,
    setSortedData,
    originalData,
    scroll,
    setScroll,
}) {
    const tableRef = useRef(null);
    //lezem ldata li 3am tenba3eat tiji mn Safety page mech mn hon
    const checkbox = useRef();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [userlist, setUserList] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);
    // const [selectedRecords, setSelectedRecords] = useState([]);
    useLayoutEffect(() => {
        const isIndeterminate =
            selectedRecords?.length > 0 &&
            selectedRecords?.length < body?.length;
        setChecked(selectedRecords?.length === body?.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedRecords, body]);

    function toggleAll() {
        setSelectedRecords(checked || indeterminate ? [] : data);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }
    const handleRowSelect = (row) => {
        if (selectedRecords.includes(row)) {
            setSelectedRecords(selectedRecords.filter((r) => r !== row));
        } else {
            setSelectedRecords([...selectedRecords, row]);
        }
    };
    const [PER_PAGE, setPER_PAGE] = useState(20);
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        tableRef.current.scrollTop=0
        setCurrentPage(selectedPage.selected);
    };
    const pageCount = Math.ceil(body?.length / PER_PAGE);
    function handleEditInvoice(row) {
        setInvoice(row);
        setActiveIndexInv(7);
    }
    function handleEditPO(row) {
        setPO(row);
        setActiveIndexInv(8);
    }
    function InvoiceDetail(row) {
        setActiveIndexInv(6);
        setInvoiceDetails(row);
    }

    function PoDetails(row, key) {
        if (key == "PoNo") {
            setPOBack(2);
        } else if (key == "PoNb") {
            setPOBack(1);
        }
        setActiveIndexInv(9);
        setPODetails(row);
    }
    function HideShowEditInvFunc(row) {
        if (currentUser.role_id == 6) {
            //If State Manager
            if (row.SecondApproval == 1 && row.ApprovalStatus == 1) {
                // If Second Approval Still Waiting
                return true;
            }
        } else if (currentUser.role_id == 7) {
            if (
                row.SecondApproval == 1 &&
                row.ApprovalStatus == 1 &&
                row.AddedBy == currentUser.user_id
            ) {
                return true;
            } else {
                return false;
            }
        } else if (currentUser.role_id == 8) {
            if (row.SecondApproval == 1 && row.AddedBy == currentUser.user_id) {
                return true;
            } else {
                return false;
            }
        } else if (currentUser.role_id == 1) {
            // Allow to edit if admin
            return true;
        } else {
            return false; // no one else can edit
        }
    }
    function HideShowEditPoFunc(row) {
        if (currentUser.role_id == 6) {
            //If State Manager
            if (row.SecondApproval == 1 && row.ApprovalStatus == 1) {
                // If Second Approval Still Waiting
                return true;
            }
        } else if (currentUser.role_id == 7) {
            if (
                row.SecondApproval == 1 &&
                row.ApprovalStatus == 1 &&
                row.AddedBy == currentUser.user_id
            ) {
                return true;
            } else {
                return false;
            }
        } else if (currentUser.role_id == 1) {
            // Allow to edit if admin
            return true;
        } else {
            return false; // no one else can edit
        }
    }
    function HideEditColumn() {
        if (currentUser?.role_id == 10) {
            return false;
        } else {
            return true;
        }
    }
    function replaceFirstApprovedByInArray(jsonArray, mapping) {
        return jsonArray.map((json) => {
            const updatedJson = { ...json };
            const firstApprovedBy = updatedJson.FirstApprovedBy;

            // Find the corresponding user object by user_id
            const user = mapping?.find(
                (user) => user.user_id === String(firstApprovedBy)
            );

            // If a matching user is found, replace FirstApprovedBy with the user's name
            if (user) {
                updatedJson.FirstApprovedBy = user.name;
            } else {
                updatedJson.FirstApprovedBy = "";
            }

            return updatedJson;
        });
    }
    function replaceSecondApprovedByInArray(jsonArray, mapping) {
        return jsonArray.map((json) => {
            const updatedJson = { ...json };
            const secondApprovedBy = updatedJson.SecondApprovedBy;

            // Find the corresponding user object by user_id
            const user = mapping?.find(
                (user) => user.user_id === String(secondApprovedBy)
            );

            // If a matching user is found, replace FirstApprovedBy with the user's name
            if (user) {
                updatedJson.SecondApprovedBy = user.name;
            } else {
                updatedJson.SecondApprovedBy = "";
            }

            return updatedJson;
        });
    }
    function fetchUserWhoCanApprove() {
        const apiUrl = "/getUsersWhoCanApprove";
        axios
            .get(apiUrl)
            .then((response) => {
                // setUserList(response.data);
                const updatedJsonArray = replaceFirstApprovedByInArray(
                    body,
                    response.data
                );
                const updatedJsonArray2 = replaceSecondApprovedByInArray(
                    updatedJsonArray,
                    response.data
                );
                setData(updatedJsonArray2);
                setloading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    useEffect(() => {
        setloading(true);
        fetchUserWhoCanApprove();
    }, [body]);
    const [colSpan, setColSpan] = useState(15);
    useEffect(() => {
        // Function to update colSpan based on screen width
        const updateColSpan = () => {
            if (window.innerWidth <= 768) {
                setColSpan(8); // Set colSpan to 8 for smaller screens
            } else if (window.innerWidth <= 1024) {
                setColSpan(10); // Set colSpan to 10 for larger screens
            } else if (window.innerWidth <= 1280) {
                setColSpan(10); // Set colSpan to 10 for larger screens
            } else {
                setColSpan(15); // Set colSpan to 15 for larger screens
            }
        };

        // Initial update
        updateColSpan();

        // Listen for window resize events and update colSpan accordingly
        window.addEventListener("resize", updateColSpan);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("resize", updateColSpan);
        };
    }, []);
    

    const saveScrollPosition = () => {
        if (tableRef.current) {
          setScroll(tableRef.current.scrollTop);
        }
      };
    
      // This function will be called to restore the saved scroll position
      const restoreScrollPosition = () => {
        if (tableRef.current) {
          tableRef.current.scrollTop = scroll;
        }
      };

      useEffect(() => {
        restoreScrollPosition();
      }, [data]);

      useEffect(() => {
        const table = tableRef.current;
        if (table) {
          table.addEventListener('scroll', saveScrollPosition);
        }
    
        // Cleanup function to remove the event listener
        return () => {
          if (table) {
            table.removeEventListener('scroll', saveScrollPosition);
          }
        };
      }, []);
      
    
    return (
        <div>
            <div className="w-full bg-smooth">
                <div className="mx-auto mt-4 rounded">
                    <div className="pt-2">
                        <div>
                            <div className="flow-root  bg-white">
                                <div className="w-full border rounded-lg overflow-x-auto containerscroll">
                                    <div className="inline-block min-w-full  align-middle">
                                        <div ref={tableRef} className="relative  table-container max-h-[380px] overflow-y-auto containerscroll">
                                            {selectedRecords?.length > 0 && (
                                                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12"></div>
                                            )}
                                            <table className="min-w-full table-fixed divide-y divide-gray-300">
                                                <thead className="h-12 bg-gray-100 sticky shadow -mt-2 -top-1 z-10">
                                                    <tr className="">
                                                        <th
                                                            scope="col"
                                                            className="w-8 text-left text-sm font-semibold text-gray-600 border"
                                                        >
                                                            <span className="sr-only">
                                                                ID
                                                            </span>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="relative border min-w-[2rem]  "
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="absolute left-2 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                                                                ref={checkbox}
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={
                                                                    toggleAll
                                                                }
                                                            />
                                                        </th>
                                                        {header.map(
                                                            (column) => (
                                                                <th
                                                                    scope="col"
                                                                    className="p-2 text-left text-sm font-semibold text-gray-400 border"
                                                                    key={
                                                                        column.key
                                                                    }
                                                                >
                                                                    <div className="flex justify-center items-center h-[2rem] p-1">
                                                                        {
                                                                            column.label
                                                                        }
                                                                        {column.Filter ? (
                                                                            <column.Filter
                                                                                header={
                                                                                    column.key
                                                                                }
                                                                                sortedData={
                                                                                    sortedData
                                                                                }
                                                                                setSortedData={
                                                                                    setSortedData
                                                                                }
                                                                                originalData={
                                                                                    originalData
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </th>
                                                            )
                                                        )}
                                                        {HideEditColumn() ? (
                                                            <th
                                                                scope="col"
                                                                className="px-3 w-10 text-left text-sm font-semibold text-gray-400 border"
                                                            >
                                                                <span className="">
                                                                    Edit
                                                                </span>
                                                            </th>
                                                        ) : null}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-300 h-5">
                                                    {!loading ? (
                                                        data?.length > 0 ? (
                                                            data
                                                                ?.slice(
                                                                    OFFSET,
                                                                    OFFSET +
                                                                        PER_PAGE
                                                                )
                                                                .map(
                                                                    (
                                                                        row,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td className="whitespace-nowrap bg-gray-100 tezt-dark py-2 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-3 border">
                                                                                {index +
                                                                                    1 +
                                                                                    currentPage *
                                                                                        PER_PAGE}
                                                                            </td>
                                                                            <td className="relative w-8 border w-[2rem]">
                                                                                {selectedRecords.includes(
                                                                                    row
                                                                                ) && (
                                                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-green-500" />
                                                                                )}
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="absolute left-2 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                                                                                    value={
                                                                                        row.name
                                                                                    }
                                                                                    checked={selectedRecords.includes(
                                                                                        row
                                                                                    )}
                                                                                    onChange={() =>
                                                                                        handleRowSelect(
                                                                                            row
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            {header.map(
                                                                                (
                                                                                    header
                                                                                ) => (
                                                                                    <td
                                                                                        key={
                                                                                            header.key
                                                                                        }
                                                                                        className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-dark sm:pl-2 border"
                                                                                    >
                                                                                        <div>
                                                                                            {header.key ==
                                                                                            "StateId" ? (
                                                                                                states?.find(
                                                                                                    (
                                                                                                        state
                                                                                                    ) =>
                                                                                                        state.StateId ===
                                                                                                        row[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                )
                                                                                                    ?.StateCode
                                                                                            ) : header.key ==
                                                                                              "InvoiceNo" ? (
                                                                                                <div
                                                                                                    className="text-blue-600 underline hover:cursor-pointer"
                                                                                                    onClick={() =>
                                                                                                        InvoiceDetail(
                                                                                                            row
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        row[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                    }
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "PoNo" ? (
                                                                                                <div
                                                                                                    className="text-blue-600 underline hover:cursor-pointer"
                                                                                                    onClick={() =>
                                                                                                        PoDetails(
                                                                                                            row,
                                                                                                            header.key
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        row[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                    }
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "PoNb" ? (
                                                                                                <div
                                                                                                    className="text-blue-600 underline hover:cursor-pointer"
                                                                                                    onClick={() =>
                                                                                                        PoDetails(
                                                                                                            POs.find(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) =>
                                                                                                                    item.PoId ===
                                                                                                                    row[
                                                                                                                        "PoId"
                                                                                                                    ]
                                                                                                            ),
                                                                                                            header.key
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        row[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                    }
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "SupplierId" ? (
                                                                                                supplierData?.find(
                                                                                                    (
                                                                                                        supplier
                                                                                                    ) =>
                                                                                                        supplier.SupplierId ===
                                                                                                        row[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                )
                                                                                                    ?.SupplierName
                                                                                            ) : header.key ==
                                                                                              "CompanyId" ? (
                                                                                                companies?.find(
                                                                                                    (
                                                                                                        company
                                                                                                    ) =>
                                                                                                        company.CompanyId ===
                                                                                                        row[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                )
                                                                                                    ?.CompanyName
                                                                                            ) : header.key ==
                                                                                              "CategoryId" ? (
                                                                                                categories?.find(
                                                                                                    (
                                                                                                        category
                                                                                                    ) =>
                                                                                                        category.CategoryId ===
                                                                                                        row[
                                                                                                            header
                                                                                                                .key
                                                                                                        ]
                                                                                                )
                                                                                                    ?.CategoryName
                                                                                            ) : header.key ==
                                                                                              "PodRequired" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    true ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                                                            true
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                                                            false
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "ClosePo" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    true ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                                                            true
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                                                            false
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "MatchInvoice" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    1 ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-gray-300 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                                                                            Waiting
                                                                                                        </span>
                                                                                                    ) : row[
                                                                                                          header
                                                                                                              .key
                                                                                                      ] ==
                                                                                                      2 ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                                                            Match
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                                                            Closed
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "PaymentStatus" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    true ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                                                            paid
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                                                            not
                                                                                                            paid
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "ApprovalStatus" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    1 ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-gray-300 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                                                                            Waiting
                                                                                                        </span>
                                                                                                    ) : row[
                                                                                                          header
                                                                                                              .key
                                                                                                      ] ==
                                                                                                      2 ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                                                            Approved
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                                                            Rejected
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "SecondApproval" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    1 ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-gray-300 px-3 py-0.5 text-sm font-medium text-gray-800">
                                                                                                            Waiting
                                                                                                        </span>
                                                                                                    ) : row[
                                                                                                          header
                                                                                                              .key
                                                                                                      ] ==
                                                                                                      2 ? (
                                                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                                                            Approved
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                                                            Rejected
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "FirstApprovedBy" ? (
                                                                                                <div>
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    0
                                                                                                        ? null
                                                                                                        : row[
                                                                                                              header
                                                                                                                  .key
                                                                                                          ]}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "PaymentTypeId" ? (
                                                                                                <div>
                                                                                                    {" "}
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ] ==
                                                                                                    1 ? (
                                                                                                        <span>
                                                                                                            Credit
                                                                                                            Card
                                                                                                        </span>
                                                                                                    ) : row[
                                                                                                          header
                                                                                                              .key
                                                                                                      ] ==
                                                                                                      2 ? (
                                                                                                        <span>
                                                                                                            Cash
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span></span>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "InvoiceDate" ? (
                                                                                                <div>
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ]
                                                                                                        ? moment(
                                                                                                              row[
                                                                                                                  header
                                                                                                                      .key
                                                                                                              ].replace(
                                                                                                                  "T",
                                                                                                                  " "
                                                                                                              ),
                                                                                                              "YYYY-MM-DD"
                                                                                                          ).format(
                                                                                                              "DD-MM-YYYY"
                                                                                                          ) ==
                                                                                                          "Invalid date"
                                                                                                            ? ""
                                                                                                            : moment(
                                                                                                                  row[
                                                                                                                      header
                                                                                                                          .key
                                                                                                                  ].replace(
                                                                                                                      "T",
                                                                                                                      " "
                                                                                                                  ),
                                                                                                                  "YYYY-MM-DD"
                                                                                                              ).format(
                                                                                                                  "DD-MM-YYYY"
                                                                                                              )
                                                                                                        : null}{" "}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "DueDate" ? (
                                                                                                <div>
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ]
                                                                                                        ? moment(
                                                                                                              row[
                                                                                                                  header
                                                                                                                      .key
                                                                                                              ].replace(
                                                                                                                  "T",
                                                                                                                  " "
                                                                                                              ),
                                                                                                              "YYYY-MM-DD"
                                                                                                          ).format(
                                                                                                              "DD-MM-YYYY"
                                                                                                          ) ==
                                                                                                          "Invalid date"
                                                                                                            ? ""
                                                                                                            : moment(
                                                                                                                  row[
                                                                                                                      header
                                                                                                                          .key
                                                                                                                  ].replace(
                                                                                                                      "T",
                                                                                                                      " "
                                                                                                                  ),
                                                                                                                  "YYYY-MM-DD"
                                                                                                              ).format(
                                                                                                                  "DD-MM-YYYY"
                                                                                                              )
                                                                                                        : null}{" "}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "PaymentDate" ? (
                                                                                                <div>
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ]
                                                                                                        ? moment(
                                                                                                              row[
                                                                                                                  header
                                                                                                                      .key
                                                                                                              ].replace(
                                                                                                                  "T",
                                                                                                                  " "
                                                                                                              ),
                                                                                                              "YYYY-MM-DD"
                                                                                                          ).format(
                                                                                                              "DD-MM-YYYY"
                                                                                                          ) ==
                                                                                                          "Invalid date"
                                                                                                            ? ""
                                                                                                            : moment(
                                                                                                                  row[
                                                                                                                      header
                                                                                                                          .key
                                                                                                                  ].replace(
                                                                                                                      "T",
                                                                                                                      " "
                                                                                                                  ),
                                                                                                                  "YYYY-MM-DD"
                                                                                                              ).format(
                                                                                                                  "DD-MM-YYYY"
                                                                                                              )
                                                                                                        : null}{" "}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "PoDate" ? (
                                                                                                <div>
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ]
                                                                                                        ? moment(
                                                                                                              row[
                                                                                                                  header
                                                                                                                      .key
                                                                                                              ].replace(
                                                                                                                  "T",
                                                                                                                  " "
                                                                                                              ),
                                                                                                              "YYYY-MM-DD"
                                                                                                          ).format(
                                                                                                              "DD-MM-YYYY"
                                                                                                          ) ==
                                                                                                          "Invalid date"
                                                                                                            ? ""
                                                                                                            : moment(
                                                                                                                  row[
                                                                                                                      header
                                                                                                                          .key
                                                                                                                  ].replace(
                                                                                                                      "T",
                                                                                                                      " "
                                                                                                                  ),
                                                                                                                  "YYYY-MM-DD"
                                                                                                              ).format(
                                                                                                                  "DD-MM-YYYY"
                                                                                                              )
                                                                                                        : null}{" "}
                                                                                                </div>
                                                                                            ) : header.key ==
                                                                                              "AddedAt" ? (
                                                                                                <div>
                                                                                                    {row[
                                                                                                        header
                                                                                                            .key
                                                                                                    ]
                                                                                                        ? moment(
                                                                                                              row[
                                                                                                                  header
                                                                                                                      .key
                                                                                                              ].replace(
                                                                                                                  "T",
                                                                                                                  " "
                                                                                                              ),
                                                                                                              "YYYY-MM-DD HH:mm:ss"
                                                                                                          ).format(
                                                                                                              "DD-MM-YYYY h:mm A"
                                                                                                          ) ==
                                                                                                          "Invalid date"
                                                                                                            ? ""
                                                                                                            : moment(
                                                                                                                  row[
                                                                                                                      header
                                                                                                                          .key
                                                                                                                  ].replace(
                                                                                                                      "T",
                                                                                                                      " "
                                                                                                                  ),
                                                                                                                  "YYYY-MM-DD HH:mm:ss"
                                                                                                              ).format(
                                                                                                                  "DD-MM-YYYY h:mm A"
                                                                                                              )
                                                                                                        : null}{" "}
                                                                                                </div>
                                                                                            ) : (
                                                                                                row[
                                                                                                    header
                                                                                                        .key
                                                                                                ]
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                )
                                                                            )}
                                                                            {HideEditColumn() ? (
                                                                                <td className="relative whitespace-nowrap py-2 pl-2 pr-4 text-right text-sm font-medium sm:pr-0 border">
                                                                                    <div className="ml-0">
                                                                                        {header[0]
                                                                                            .key ==
                                                                                            "InvoiceNo" &&
                                                                                        HideShowEditInvFunc(
                                                                                            row
                                                                                        ) ? (
                                                                                            <a
                                                                                                href="#"
                                                                                                onClick={() => {
                                                                                                    handleEditInvoice(
                                                                                                        row
                                                                                                    );
                                                                                                }}
                                                                                                className="text-blue-500 hover:text-blue-900 flex gap-x-1 pr-2"
                                                                                            >
                                                                                                <PencilIcon className="text-blue-400 w-5 h-5" />
                                                                                                <span className="underline">
                                                                                                    Edit
                                                                                                </span>
                                                                                            </a>
                                                                                        ) : header[0]
                                                                                              .key ==
                                                                                              "PoNo" &&
                                                                                          HideShowEditPoFunc(
                                                                                              row
                                                                                          ) ? (
                                                                                            <a
                                                                                                href="#"
                                                                                                onClick={() => {
                                                                                                    handleEditPO(
                                                                                                        row
                                                                                                    );
                                                                                                }}
                                                                                                className="text-blue-500 hover:text-blue-900 flex gap-x-1 pr-2"
                                                                                            >
                                                                                                <PencilIcon className="text-blue-400 w-5 h-5" />
                                                                                                <span className="underline">
                                                                                                    Edit
                                                                                                </span>
                                                                                            </a>
                                                                                        ) : null}
                                                                                    </div>
                                                                                </td>
                                                                            ) : null}
                                                                        </tr>
                                                                    )
                                                                )
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan={
                                                                        colSpan
                                                                    }
                                                                >
                                                                    <div className=" h-72 flex items-center justify-center mt-5">
                                                                        <div className="text-center flex justify-center flex-col">
                                                                            <img
                                                                                src={
                                                                                    notFound
                                                                                }
                                                                                alt=""
                                                                                className="w-52 h-auto "
                                                                            />
                                                                            <h1 className="text-3xl font-bold text-gray-900">
                                                                                No
                                                                                Data
                                                                                Found
                                                                            </h1>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    colSpan
                                                                }
                                                            >
                                                                <div className="min-h-[300px] md:pl-20 h-full flex flex-col items-center justify-center">
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
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex items-center justify-center text-xs text-gray-400">
                                <div className="flex gap-x-2 items-center">
                                    <p>Showing</p>
                                    <select
                                        value={PER_PAGE}
                                        className="block w-12 h-6 text-xs px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        onChange={(e) => {
                                            setPER_PAGE(
                                                parseInt(e.target.value)
                                            );
                                        }}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={40}>40</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <p>of {sortedData?.length}</p>
                                </div>
                                <ReactPaginate
                                    previousLabel={"← Previous"}
                                    nextLabel={"Next →"}
                                    pageCount={pageCount}
                                    initialPage={currentPage}
                                    onPageChange={handlePageClick}
                                    containerClassName={
                                        "flex justify-center items-center my-1"
                                    }
                                    pageClassName={
                                        "mx-2 rounded-full hover:bg-gray-100"
                                    }
                                    previousLinkClassName={
                                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                                    }
                                    nextLinkClassName={
                                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                                    }
                                    disabledClassName={
                                        "opacity-50 cursor-not-allowed"
                                    }
                                    activeClassName={"text-blue-500 font-bold"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
