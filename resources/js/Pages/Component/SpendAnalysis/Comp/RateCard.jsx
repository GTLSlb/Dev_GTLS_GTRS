import {
    Card,
    CardBody,
    CardHeader,
    Image,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Input,
} from "@heroui/react";
import React from "react";
import PropTypes from "prop-types";
import { Phone, PinDrop, Search } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import CompLogo from "../assets/pics/logo.png"; // Assuming pics folder is in the same directory

// --- Data Definitions (Unchanged) ---
const rateCardInfo = [
    {
        Charge: "Cubic m3/t",
        Frequency: "Cubic m3/t",
    },
    {
        Charge: "Minimum Charge",
        Frequency:
            "One Pallet and or Minimum space used for oversized pallet spaces",
    },
    {
        Charge: "Full Pallet UP TO 120 x 120 x 220@ < 1000kgs",
        Frequency: "1 Pallet",
    },
    {
        Charge: "1/2 Pallet UP TO 120 x 120 x 115 @ < 500kgs",
        Frequency: "1 Pallet",
    },
    {
        Charge: "Rigid - Demurrage - After 30 Minutes or Part Thereof pick and delivery per consignment on delivery",
        Frequency: "$1.41",
        Notes: "Vehicle Waiting allowance 30 minutes > Time thereafter charged per minute",
    },
    {
        Charge: "Semi - Demurrage - After 60 Minutes or Part Thereof per consignment on delivery",
        Frequency: "$2.08",
        Notes: "Vehicle Waiting allowance 60 minutes > Time thereafter charged per minute",
    },
    {
        Charge: "BD - Demurrage - After 90 Minutes or Part Thereof per consignment on delivery",
        Frequency: "$2.91",
        Notes: "Vehicle Waiting allowance 90 minutes > Time thereafter charged per minute",
    },
    {
        Charge: "Tailgate",
        Frequency: "$45.00",
        Notes: "Per pallets (only if applicable) weight max 500kg height up to eyes versions 1.8 m",
    },
    {
        Charge: "OVERLENGTH 2.4 - 2.99M",
        Frequency: "$103.46",
        Notes: "Per Consignment (only if applicable)",
    },
    {
        Charge: "OVERLENGTH 3.0M - 3.99M",
        Frequency: "$180.00",
        Notes: "Per Consignment (only if applicable)",
    },
    {
        Charge: "OVERLENGTH 4.0M - 4.99M",
        Frequency: "$420.00",
        Notes: "Per Consignment (only if applicable)",
    },
    {
        Charge: "OVERLENGTH 5M +",
        Frequency: "$620.76",
        Notes: "Per Consignment (only if applicable)",
    },
    {
        Charge: "Manual Consignment Fee",
        Frequency: "$10.35",
        Notes: "Per Consignment (only if applicable)",
    },
    {
        Charge: "DG",
        Frequency: "$75.00",
        Notes: "Per Consignment (only if applicable)",
    },
    {
        Charge: "Pallet Wrap Fee if required or freight deemed not safe to be transported",
        Frequency: "$7.00",
        Notes: "Per pallet",
    },
    {
        Charge: "Toll Fee",
        Frequency: "$8.90",
        Notes: "Per Consignment",
    },
    {
        Charge: "Toll Fee for North Shore / Hornsby Region central cost extra on the original charges",
        Frequency: "$15.00",
        Notes: "Per Consignment",
    },
    {
        Charge: "Time Slot Booking Fee",
        Frequency: "$25.00",
        Notes: "Per Consignment",
    },
    {
        Charge: "Overweight pallet charge above 1000kg",
        Frequency: "Pro Rata",
        Notes: "Per kilo above 1000kg",
    },
    {
        Charge: "Pallet removal fee",
        Frequency: "$6.00",
        Notes: "Per pallet",
    },
    {
        Charge: "Hand Unload Fee",
        Frequency: "$55.00",
        Notes: "Per pallets (only if applicable)",
    },
    {
        Charge: "Incorrect Data information supplied",
        Frequency: "$100.00",
        Notes: "Per Instance where incorrect Volume and Weight information provided",
    },
    {
        Charge: "Storage fee applied for any freight held more than 5 working days to obtain timeslot.",
        Frequency: "$1.00",
        Notes: "per day per pallets",
    },
    {
        Charge: "LOSCAM pallets delay / hire fee more than 28 days and supply must supply",
        Frequency: "$0.16",
        Notes: "per day per pallets",
    },
    {
        Charge: "CHEP pallets delay rental fee more than 28 days and supply must supply 30-day transfer",
        Frequency: "$0.25",
        Notes: "per day per pallets",
    },
    {
        Charge: "Weekend and Public Holiday deliveries or ad hoc",
        Frequency: "ON REQUEST",
    },
    {
        Charge: "Return of freight with no rates GTLS house rates will be applicable",
        Frequency: "$",
    },
    {
        Charge: "Restacking of freight by request of customer",
        Frequency: "$55.00",
        Notes: "PER HOUR PER PERSON",
    },
    {
        Charge: "B Double Split Fee",
        Frequency: "$500.00",
        Notes: "Per Load",
    },
    {
        Charge: "Pallets transfer to carrier accounts admin fee per consignment",
        Frequency: "$3.90",
        Notes: "Per docket",
    },
    {
        Charge: "Freight label if customer hasn’t labeled",
        Frequency: "$0.80",
        Notes: "per pallets /LABEL",
    },
    {
        Charge: "Re-Delivery Fee",
        Frequency: "$45.00",
        Notes: "Per Pallet",
    },
    {
        Charge: "Pallets height which exceeds 2.2 metres shall be considered as taking two pallets spaces and will be billed accordingly.",
        Frequency: "Per Pallet",
    },
    {
        Charge: "Express Service Surcharge",
        Frequency: "0.2",
        Notes: "Additional charge - Per Consignment",
    },
    {
        Charge: "Fuel Service Charge (FSC) - Applies to Transport services only",
        Frequency: "%",
        Notes: "Additional charge - For Transport activity only - Rise and Fall '(+/-) Variable' - Reviewed Weekly",
    },
];

const companyDataOptimized = {
    companyInfo: {
        logoSrc: CompLogo, // Actual path to the image
        name: "Dragon Logistics Pty Ltd",
        addressPrimary: "7 Padova Drive, Greenvale Victoria 3059",
        phonePrimary: "03 8373 2033",
    },
    sections: [
        {
            id: "contact", // Unique ID for key prop
            gridClasses:
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8 mb-2",
            items: [
                { label: "Customer Entity", value: "Dragon Logistics" },
                { label: "Contact Name", value: "David Bennett" },
                { label: "Phone Number", value: "03 8373 2033" },
                {
                    label: "Email Address",
                    value: "david@dragonlogistics.com.au",
                    valueClasses: "text-blue-600 break-words",
                    divClasses: "md:col-span-2 lg:col-span-1",
                },
                {
                    label: "Address",
                    value: "7 Padova Drive, Greenvale, Victoria 3059",
                },
            ],
        },
        {
            id: "rates", // Unique ID for key prop
            gridClasses:
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8 pb-4 border-b border-gray-200 mb-6",
            items: [
                { label: "ABN", value: "47 142 447 818" },
                { label: "Rate Type", value: "Pallet & Full Load" },
                { label: "Cubic Conversion", value: "333" },
                { label: "Rate Effective Date", value: "9th October 2023" },
                { label: "Rate Expiry Date", value: "30th June 2024" },
            ],
        },
    ],
    tenure: {
        label: "Tenure:",
        value: "Rates are effective for a fixed term of 3 months (Conduct and review transport data)",
    },
};

const allTableData = [
    {
        id: "melbourneToSydney",
        headerTitle:
            "Gold Tiger - Linehaul Services (LTL/FTL) Ex Melbourne to Sydney",
        columns: [
            { key: "Charge", label: "Charge" },
            { key: "Amount", label: "Per Pallet" },
            { key: "Notes", label: "Important Comments" },
        ],
        data: [
            {
                Charge: "Pallet Scales - 1-2 Pallets",
                Amount: "$140.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 3-6 Pallets",
                Amount: "$135.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 7-10 Pallets",
                Amount: "$130.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 11 Pallets & over",
                Amount: "$125.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "22 Space Semi Trailer",
                Amount: "$2,000.00",
                Notes: "Fuel Service Charge additional",
            },
            {
                Charge: "34 Space B Double",
                Amount: "$2,800.00",
                Notes: "Fuel Service Charge additional",
            },
        ],
    },
    {
        id: "melbourneToBrisbane",
        headerTitle:
            "Gold Tiger - Linehaul Services (LTL/FTL) Ex Melbourne to Brisbane",
        columns: [
            { key: "Charge", label: "Charge" },
            { key: "Amount", label: "Per Pallet" },
            { key: "Notes", label: "Important Comments" },
        ],
        data: [
            {
                Charge: "Pallet Scales - 1-2 Pallets",
                Amount: "$240.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 3-6 Pallets",
                Amount: "$235.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 7-10 Pallets",
                Amount: "$230.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 11 Pallets & over",
                Amount: "$225.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "22 Space Semi Trailer",
                Amount: "$4,900.00",
                Notes: "Fuel Service Charge additional",
            },
            {
                Charge: "34 Space B Double",
                Amount: "$6,000.00",
                Notes: "Fuel Service Charge additional",
            },
        ],
    },
    {
        id: "melbourneToAdelaide",
        headerTitle:
            "Gold Tiger - Linehaul Services (LTL/FTL) Ex Melbourne to Adelaide",
        columns: [
            { key: "Charge", label: "Charge" },
            { key: "Amount", label: "Per Pallet" },
            { key: "Notes", label: "Important Comments" },
        ],
        data: [
            {
                Charge: "Pallet Scales - 1-2 Pallets",
                Amount: "$150.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 3-6 Pallets",
                Amount: "$145.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 7-10 Pallets",
                Amount: "$140.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "Pallet Scales - 11 Pallets & over",
                Amount: "$135.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Charge: "22 Space Semi Trailer",
                Amount: "$2,200.00",
                Notes: "Fuel Service Charge additional",
            },
            {
                Charge: "34 Space B Double",
                Amount: "$3,000.00",
                Notes: "Fuel Service Charge additional",
            },
        ],
    },
    {
        id: "melbourneToRegionalNSW",
        headerTitle:
            "Gold Tiger - Linehaul Services (LTL) Ex Melbourne to Regional NSW",
        columns: [
            { key: "Location", label: "Location", width: 600 },
            { key: "Amount", label: "Per Pallet", width: 600 },
            { key: "Notes", label: "Important Comments", width: 600 },
        ],
        data: [
            {
                Location: "Gosford",
                Amount: "$236.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Newcastle",
                Amount: "$295.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Singleton/Musswellbrook/Scone",
                Amount: "$360.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Taree",
                Amount: "$305.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Forster/Tuncurry/Kempsey",
                Amount: "$365.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Port Macquarie/Wauchope",
                Amount: "$340.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Coffs Harbour/Sawtell",
                Amount: "$365.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Grafton",
                Amount: "$365.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Wollongong",
                Amount: "$240.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Bega/Eden",
                Amount: "$335.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Canberra/Goulburn",
                Amount: "$260.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Wagga",
                Amount: "$220.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Junee/Gundagai/Tumut",
                Amount: "$230.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Young/Cootamundra/Griffith/Leeton/Temora",
                Amount: "$385.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Bathurst",
                Amount: "$300.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Cowra/Mudgee/Oberon",
                Amount: "$365.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Orange",
                Amount: "$310.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Parkes/Forbes/Condobolin/Canowindra",
                Amount: "$365.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Dubbo",
                Amount: "$365.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Tamworth",
                Amount: "$315.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
            {
                Location: "Armidale/Gunnedah",
                Amount: "$365.00",
                Notes: "Charge per pallet + Fuel Service Charge (FSC)",
            },
        ],
    },
    {
        id: "incidentalCharges",
        headerTitle: "Incidental Charges",
        columns: [
            { key: "Charge", label: "Charge" },
            // Assuming "Frequency" from rateCardInfo acts as "Amount" or similar for this table
            { key: "Frequency", label: "Amount / Frequency" },
            { key: "Notes", label: "Important Comments" },
        ],
        data: rateCardInfo.map((item) => ({
            Charge: item.Charge,
            Frequency: item.Frequency, // Map Frequency to a more general "Amount" or "Frequency" column
            Notes: item.Notes || "", // Ensure Notes is always a string
        })),
    },
];

// --- New Single Table Component ---
function SingleLogisticsTable({ tableConfig, globalFilterValue }) {
    const primarySearchKey = tableConfig.columns[0].key;
    const [localSearchTerm, setLocalSearchTerm] = useState("");

    const onLocalSearchChange = useCallback((value) => {
        setLocalSearchTerm(value ? value.toLowerCase() : "");
    }, []);

    const onClearLocalSearch = useCallback(() => {
        setLocalSearchTerm("");
    }, []);

    // Filter data for this specific table based on global and local search
    const filteredData = useMemo(() => {
        let items = [...tableConfig.data];
        const lowerCaseGlobalFilter = globalFilterValue;
        const lowerCaseLocalFilter = localSearchTerm;

        // Determine if the table header itself matches the global filter
        const headerMatchesGlobalFilter = tableConfig.headerTitle
            .toLowerCase()
            .includes(lowerCaseGlobalFilter);

        // If the header matches the global filter, we want to show all data for this table
        // (subject to its own local filter).
        // Otherwise, filter items based on the global filter AND local filter.
        if (!headerMatchesGlobalFilter && lowerCaseGlobalFilter) {
            // Apply global filter to rows only if the header didn't match
            // AND there's a global filter value
            items = items.filter((item) =>
                String(item[primarySearchKey])
                    .toLowerCase()
                    .includes(lowerCaseGlobalFilter)
            );
        }

        // Always apply the local filter if it exists, on top of any global filtering applied to rows
        if (lowerCaseLocalFilter) {
            items = items.filter((item) =>
                String(item[primarySearchKey])
                    .toLowerCase()
                    .includes(lowerCaseLocalFilter)
            );
        }

        return items;
    }, [
        tableConfig.data,
        globalFilterValue,
        localSearchTerm,
        primarySearchKey,
        tableConfig.headerTitle,
    ]);

    // Define topContent for this specific table
    const topContentForTable = useMemo(() => {
        const hasLocalSearchFilter = Boolean(localSearchTerm);
        // Calculate the initial total based on if the global filter caused this table to be displayed
        // If the header matched, it's all data. If only rows matched, it's just the rows that matched.
        let initialTotalCount = tableConfig.data.length;
        if (
            globalFilterValue &&
            !tableConfig.headerTitle.toLowerCase().includes(globalFilterValue)
        ) {
            initialTotalCount = tableConfig.data.filter((item) =>
                String(item[primarySearchKey])
                    .toLowerCase()
                    .includes(globalFilterValue)
            ).length;
        }

        return (
            <div className="flex w-full items-center justify-between flex-wrap gap-2">
                <div className="flex-grow font-bold text-lg text-default-700 min-w-[200px]">
                    {tableConfig.headerTitle}
                </div>
                <div className="flex flex-col gap-1 items-end min-w-[200px]">
                    <div className="flex justify-between gap-3 items-end w-full">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[100%] bg-white"
                            placeholder={`Search by ${primarySearchKey}...`}
                            startContent={<Search />}
                            value={localSearchTerm}
                            onClear={onClearLocalSearch}
                            onValueChange={onLocalSearchChange}
                            variant="bordered"
                            classNames={{
                                input: "!border-0 !outline-0 focus:ring-0",
                            }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-default-400 text-xs">
                        Total {filteredData.length} entries
                        {hasLocalSearchFilter &&
                            ` (filtered from ${initialTotalCount})`}
                    </div>
                </div>
            </div>
        );
    }, [
        tableConfig.headerTitle,
        localSearchTerm,
        onClearLocalSearch,
        onLocalSearchChange,
        primarySearchKey,
        filteredData.length,
        globalFilterValue,
        tableConfig.data,
    ]);

    return (
        <Table
            key={tableConfig.id}
            aria-label={`Table for ${tableConfig.headerTitle}`}
            className="mt-5"
            isStriped
            topContent={topContentForTable}
            topContentPlacement="outside"
        >
            <TableHeader columns={tableConfig.columns}>
                {(column) => (
                    <TableColumn key={column.key} width={column.width}>
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No matching entries found for this table."}
                items={filteredData}
            >
                {(item) => (
                    <TableRow
                        key={`${tableConfig.id}-row-${item[primarySearchKey]}-${
                            item.Amount || item.Notes || Math.random()
                        }`}
                    >
                        {(columnKey) => (
                            <TableCell>{item[columnKey]}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

SingleLogisticsTable.propTypes = {
    tableConfig: PropTypes.object,
    globalFilterValue: PropTypes.string,
};

// --- Main RateCard Component ---
function RateCard() {
    const [globalFilterValue, setGlobalFilterValue] = useState("");

    const onGlobalSearchChange = useCallback((value) => {
        setGlobalFilterValue(value ? value.toLowerCase() : "");
    }, []);

    const onClearGlobalSearch = useCallback(() => {
        setGlobalFilterValue("");
    }, []);

    // Memoize the list of tables to render, based on global search
    const tablesToRender = useMemo(() => {
        if (!globalFilterValue) {
            // If no global search, render all tables
            return allTableData;
        }

        const lowerCaseGlobalFilter = globalFilterValue;

        return allTableData.filter((tableConfig) => {
            const primarySearchKey = tableConfig.columns[0].key;

            // Check if the table header matches the global search term
            const headerMatches = tableConfig.headerTitle
                .toLowerCase()
                .includes(lowerCaseGlobalFilter);

            // Check if any of the rows in this table match the global search term
            const anyRowMatches = tableConfig.data.some((item) =>
                String(item[primarySearchKey])
                    .toLowerCase()
                    .includes(lowerCaseGlobalFilter)
            );

            // Include this table if its header matches OR any of its rows match
            return headerMatches || anyRowMatches;
        });
    }, [globalFilterValue]);

    return (
        <div className="mt-12">
            <Card>
                <CardHeader className="font-bold border-b-1">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={companyDataOptimized.companyInfo.logoSrc}
                            alt={`${companyDataOptimized.companyInfo.name} logo`}
                            height={150}
                            width={150}
                        />
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {companyDataOptimized.companyInfo.name}
                            </h1>
                            <div className="flex items-center text-gray-600 mt-1">
                                <span className="material-icons text-lg mr-1">
                                    <PinDrop />
                                </span>
                                <span>
                                    {
                                        companyDataOptimized.companyInfo
                                            .addressPrimary
                                    }
                                </span>
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                                <span className="material-icons text-lg mr-1">
                                    <Phone />
                                </span>
                                <span>
                                    {
                                        companyDataOptimized.companyInfo
                                            .phonePrimary
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {companyDataOptimized.sections.map((section) => (
                        <div key={section.id} className={section.gridClasses}>
                            {section.items.map((item, index) => (
                                <div
                                    key={index}
                                    className={item.divClasses || ""}
                                >
                                    <p className="text-sm font-medium text-gray-500">
                                        {item.label}:
                                    </p>
                                    <p
                                        className={`text-base font-semibold text-gray-900 ${
                                            item.valueClasses || ""
                                        }`}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Tenure Section */}
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            {companyDataOptimized.tenure.label}
                        </p>
                        <p className="text-base text-gray-700">
                            {companyDataOptimized.tenure.value}
                        </p>
                    </div>
                </CardBody>
            </Card>

            <div className="flex justify-start w-full mt-5">
                <Input
                    isClearable
                    className="w-full sm:max-w-[60%] bg-white"
                    placeholder="Search tables by title or charge/location..."
                    startContent={<Search />}
                    value={globalFilterValue}
                    onClear={onClearGlobalSearch}
                    onValueChange={onGlobalSearchChange}
                    variant="bordered"
                    classNames={{
                        input: "!border-0 !outline-0 focus:ring-0",
                    }}
                />
            </div>

            {tablesToRender.length > 0 ? (
                tablesToRender.map((tableConfig) => (
                    <SingleLogisticsTable
                        key={tableConfig.id}
                        tableConfig={tableConfig}
                        globalFilterValue={globalFilterValue}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500 mt-10 text-lg">
                    No tables or data found matching "{globalFilterValue}"
                </p>
            )}
        </div>
    );
}

RateCard.propTypes = {
    companyDataOptimized: PropTypes.object,
};

export default RateCard;
