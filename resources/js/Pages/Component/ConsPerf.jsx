import { useState } from "react";
import Details from "./consPerf/Details";
import General from "./consPerf/General";
import Navbar from "./consPerf/navbar";
import notFound from "../../assets/pictures/NotFound.png";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ConsPerf({
    PerfData,
    EDate,
    accData,
    setEDate,
    SDate,
    setSDate,
    oldestDate,
    latestDate,
    currentUser,
    setSharedStartDate,
    setSharedEndDate,
}) {

    const [currentPage, setCurrentPage] = useState(0);
    const [filteredData, setFilteredData] = useState(PerfData);
    const [selectedConsignment, setSelectedConsignment] = useState("");
    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setSDate(value);
        setSharedStartDate(value);
        filterData(value, EDate, selectedConsignment);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEDate(value);
        setSharedEndDate(value);
        filterData(SDate, value, selectedConsignment);
    };
    const handleConsignmentChange = (value) => {
        setSelectedConsignment(value);
        filterData(SDate, EDate, value);
    };
    const filterData = (startDate, endDate, selectedConsignment) => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters
        const filtered = PerfData.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeTo);
            const itemDate = new Date(item.DESPATCHDATE); // Convert item's date string to Date object
            const filterStartDate = new Date(startDate); // Convert start date string to Date object
            const filterEndDate = new Date(endDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            const ConsNbMatch = selectedConsignment
                ? item.CONSIGNMENTNUMBER.toLowerCase().includes(
                      selectedConsignment.toLowerCase()
                  )
                : true;
            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                ConsNbMatch &&
                chargeToMatch
            ); // Compare the item date to the filter dates
        });
        setFilteredData(filtered);
        setCurrentPage(0);
    };
    useEffect(() => {
        filterData(SDate, EDate, selectedConsignment);
    }, [accData]);

    const PER_PAGE = 5;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    const pageCount = Math.ceil(filteredData.length / PER_PAGE);

    const headers = [
        "CONSIGNMENT STATUS",
        "ACCOUNT NAME",
        "POD",
        "KPI DATETIME",
        "POD DATETIME",
        "STATUS",
        "LOADING TIME",
        "DELIVERY REQUIRED DATETIME",
        "SERVICE",
        "TOTAL QUANTITY",
        "DELIVERED DATE TIME",
        "MANIFEST NO",
        "TOTAL WEIGHT",
        "DESPATCHDATE",
        "FUELLEVY",
        "NETT AMOUNT",
        "RATED AMOUNT",
        "SENDER NAME",
        "SENDER SUBURB",
        "SENDER REFERENCE",
        "SENDER ZONE",
        "SENDER POSTCODE",
        "RECEIVER NAME",
        "RECEIVER SUBURB",
        "RECEIVER REFERENCE",
        "RECEIVER ZONE",
        "RECEIVER POSTCODE",
    ];

    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected

        let selectedColumns = headers; // Use all columns

        // Extract the data for the selected columns  moment(consignment.DespatchDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
        const data = filteredData.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (column.replace(/\s+/g, "") === "RECEIVERREFERENCE") {
                        acc["RECEIVER REFERENCE"] =
                            person["RECEIVER REFERENCE"];
                    } else if (column.replace(/\s+/g, "") === "ACCOUNTNAME") {
                        acc[columnKey] = person["ACCOUNTNUMBER"];
                    } else if (column.replace(/\s+/g, "") === "KPIDATETIME") {
                        acc[columnKey] =
                            moment(
                                person["KPI DATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY HH:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["KPI DATETIME"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY HH:mm A");
                    } else if (column.replace(/\s+/g, "") === "PODDATETIME") {
                        acc[columnKey] =
                            moment(
                                person["POD DATETIME"]?.replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY HH:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["POD DATETIME"]?.replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY HH:mm A");
                    } else if (column.replace(/\s+/g, "") === "DELIVERYREQUIREDDATETIME") {
                        acc[columnKey] =
                            moment(
                                person["DELIVERYREQUIREDDATETIME"]?.replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY HH:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DELIVERYREQUIREDDATETIME"]?.replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY HH:mm A");
                    }else if (column.replace(/\s+/g, "") === "DESPATCHDATE") {
                        acc[columnKey] =
                            moment(
                                person["DESPATCHDATE"]?.replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY HH:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DESPATCHDATE"]?.replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY HH:mm A");
                    } else {
                        acc[column.replace(/\s+/g, "")] =
                            person[column.replace(/\s+/g, "")];
                    }
                }
                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        // Add the data to the worksheet
        data.forEach((rowData) => {
            worksheet.addRow(Object.values(rowData));
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 15); // Set width of each column
        worksheet.columns = columnWidths.map((width, index) => ({
            width,
            key: selectedColumns[index],
        }));

        // Generate the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            // Convert the buffer to a Blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js or alternative method
            saveAs(blob, "Performance-Report.xlsx");
        });
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth">
            <div className="sm:flex sm:items-center">
                <div className="flex items-center justify-between w-full mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Consignments performance
                    </h1>
                    <button
                        onClick={handleDownloadExcel}
                        className="text-white bg-dark hover:bg-dark  font-medium rounded-lg text-sm px-5 py-2 text-center mr-2 dark:bg-gray-800 dark:hover:bg-gray-600 dark:focus:ring-blue-800"
                    >
                        Export
                    </button>
                </div>
            </div>
            <div className="mt-3">
                <div className="w-full relative">
                    <div className=" sm:border-gray-200 text-gray-400 flex flex-col  md:flex-row gap-y-4 gap-x-2 md:items-center">
                        <label
                            htmlFor="last-name"
                            className="inline-block text-sm font-medium leading-6  flex-item "
                        >
                            Date From
                        </label>
                        <div className="sm:mt-0 md:px-4 ">
                            <input
                                type="date"
                                name="from-date"
                                onKeyDown={(e) => e.preventDefault()}
                                value={SDate}
                                min={oldestDate}
                                max={EDate}
                                onChange={handleStartDateChange}
                                id="from-date"
                                className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                            />
                        </div>

                        <label
                            htmlFor="last-name"
                            className="inline-block text-sm font-medium leading-6 flex-item"
                        >
                            To
                        </label>

                        <div className="mt-2 flex-item  sm:mt-0 md:px-4">
                            <input
                                type="date"
                                name="to-date"
                                onKeyDown={(e) => e.preventDefault()}
                                value={EDate}
                                min={SDate}
                                max={latestDate}
                                onChange={handleEndDateChange}
                                id="to-date"
                                className="block w-full h-[36px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="flex-item w-full md:max-w-xs mt-4 md:mt-0">
                            <div className="relative border rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Con. No."
                                    onChange={(e) =>
                                        handleConsignmentChange(e.target.value)
                                    }
                                    className="w-full py-0.5 h-[36px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {filteredData.length > 0 ? (
                filteredData.slice(OFFSET, OFFSET + PER_PAGE).map((item) => (
                    <div
                        key={item.id}
                        className="relative border-b border-gray-400 py-5 sm:pb-0 px-5 mt-5 h-auto bg-white rounded-xl shadow-md"
                    >
                        <div className="md:flex md:items-center md:justify-between">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                CONSIGNMENT NO. :{" "}
                                <span className="text-goldd">
                                    {item.CONSIGNMENTNUMBER}
                                </span>
                            </h3>
                        </div>
                        <Navbar
                            key={item.id}
                            id={item.id}
                            item={item}
                            currentUser={currentUser}
                        />
                    </div>
                ))
            ) : (
                <div class=" h-72 flex items-center justify-center mt-5">
                    <div class="text-center flex justify-center flex-col">
                        <img src={notFound} alt="" className="w-52 h-auto " />
                        <h1 class="text-3xl font-bold text-gray-900">
                            No Data Found
                        </h1>
                    </div>
                </div>
            )}
            <div className="pt-4 pb-10 text-xs text-gray-400">
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"flex justify-center items-center mt-4"}
                    pageClassName={"mx-2 rounded-full hover:bg-gray-100"}
                    previousLinkClassName={
                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                    }
                    nextLinkClassName={
                        "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                    }
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    activeClassName={"text-blue-500 font-bold"}
                />
            </div>
        </div>
    );
}
