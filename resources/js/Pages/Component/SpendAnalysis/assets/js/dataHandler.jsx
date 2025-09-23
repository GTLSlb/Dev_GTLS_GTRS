import {
    FaBox,
    FaChartLine,
    FaClipboardCheck,
    FaCube,
    FaTruckLoading,
    FaDollarSign,
    FaGasPump,
    FaTruck,
    FaUsers,
    FaUserShield,
    FaWeightHanging,
} from "react-icons/fa";

const australianStates = ["nsw", "qld", "vic", "sa", "wa", "tas", "nt"];
const demurrageTypes = [
    "Rigid Demurrage",
    "Semi Demurrage",
    "BD Demurrage",
    "Demurrage",
];
const serviceTypes = ["Express", "Normal"];

const additionalCostTypes = [
    "Demurrage",
    "Overlength",
    "Redelivery",
    "Split Fee",
    "Incorrect Data",
];

const australiaStateCoordinates = {
    nsw: { lat: -31.8152, lng: 147.1656 },
    qld: { lat: -20.9176, lng: 142.7028 },
    vic: { lat: -36.5986, lng: 144.678 },
    sa: { lat: -30.0, lng: 135.0 },
    wa: { lat: -25.0, lng: 120.0 },
    tas: { lat: -41.6667, lng: 146.75 },
    nt: { lat: -19.4914, lng: 132.551 },
    act: { lat: -35.2809, lng: 149.13 },
};

const getRandomState = () => {
    const randomIndex = Math.floor(Math.random() * australianStates.length);
    return australianStates[randomIndex].toLocaleUpperCase();
};

const getRandomDemurrage = () => {
    const randomIndex = Math.floor(Math.random() * demurrageTypes.length);
    return demurrageTypes[randomIndex];
};

const getRandomService = () => {
    const randomIndex = Math.floor(Math.random() * serviceTypes.length);
    return serviceTypes[randomIndex];
};

const generateAdditionalCosts = () => {
    const costs = [];
    const numCosts = Math.floor(
        Math.random() * (additionalCostTypes.length + 1)
    );
    const shuffledTypes = [...additionalCostTypes].sort(
        () => 0.5 - Math.random()
    );
    for (let i = 0; i < numCosts; i++) {
        const type = shuffledTypes[i];
        const chargeRate = Math.floor(Math.random() * 100) + 1;
        const quantity = Math.random() * 5.001;
        const cost = chargeRate * quantity;
        costs.push({
            name: type,
            cost: cost,
            chargeRate: chargeRate,
            quantity: quantity,
        });
    }
    return costs;
};

const getReceiverLocation = (state) => {
    const coords = australiaStateCoordinates[state.toLowerCase()];
    if (coords) {
        const jitterLat = (Math.random() - 0.5) * 2;
        const jitterLng = (Math.random() - 0.5) * 2;
        return {
            receiverLat: coords.lat + jitterLat,
            receiverLng: coords.lng + jitterLng,
        };
    }

    return { receiverLat: null, receiverLng: null };
};

function formatDate(date) {
    return date.toISOString().split(".")[0];
}

function getRandomDate(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
}

function getRandomConsStatus(){
    const statuses = ["PASS", "PENDING", "FAIL"]
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
}

export function generateDummySpendData(options = {}) {
    const {
        count = 200,
        startDate = "2023-01-01",
        endDate = "2025-10-30",
        receivers = ["Receiver 1", "Receiver 2"],
    } = options;

    const data = [];

    for (let i = 0; i < count; i++) {
        const state = getRandomState();
        const location = getReceiverLocation(state);
        const randomDate = getRandomDate(startDate, endDate);
        const additionalCost = generateAdditionalCosts();

        const baseCost = 8000 + Math.floor(Math.random() * 5000);
        // Store as number, not string - this prevents concatenation issues
        const additional = additionalCost
            .reduce((acc, item) => acc + parseFloat(item.cost), 0);
        const fuelLevy = 70 + Math.floor(Math.random() * 250);
        const gst = 3 + Math.random() * 3.5;

        data.push({
            date: formatDate(randomDate),
            cost: baseCost,
            additional: additional, // Now stored as number
            fuelLevy: fuelLevy,
            GST: Math.round(gst * 10) / 10,
            state: state,
            receiver: receivers[i % receivers.length],
            demurrageType: getRandomDemurrage(),
            demurrageCost: Math.floor(Math.random() * 5000),
            serviceType: getRandomService(),
            weight: Math.floor(Math.random() * 100),
            palletSpace: Math.floor(Math.random() * 50),
            additionalCost: additionalCost,
            receiverLat: location.receiverLat,
            receiverLng: location.receiverLng,
            ConsStatus: getRandomConsStatus(),
            CustomerOwn: Math.floor(Math.random() * 5000),
            Chep: Math.floor(Math.random() * 5000),
            Loscam: Math.floor(Math.random() * 5000),
            POD: Math.random() < 0.5 ? true : false,

        });
    }

    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export const dummySpendData = generateDummySpendData();

export const generateUTCDate = (year, month, day) => {
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

export function getDateRange(input, year = new Date().getFullYear()) {
    const inputLower = input.toLowerCase().trim();

    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function getWeekEnd(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + 7;
        return new Date(d.setDate(diff));
    }

    const monthMap = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11,
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        june: 6,
        july: 7,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
    };

    try {
        if (inputLower.match(/^q[1-4]$/)) {
            const quarter = parseInt(inputLower.charAt(1));
            const startMonth = (quarter - 1) * 3;
            const endMonth = startMonth + 2;

            return {
                start: new Date(year, startMonth, 1),
                end: new Date(year, endMonth + 1, 0),
            };
        }

        if (monthMap.hasOwnProperty(inputLower)) {
            const monthIndex = monthMap[inputLower];
            return {
                start: new Date(year, monthIndex, 1),
                end: new Date(year, monthIndex + 1, 0),
            };
        }

        const weekMatch = inputLower.match(/week\s*(\d+)\s+(\w+)/);
        if (weekMatch) {
            const weekNumber = parseInt(weekMatch[1]);
            const monthName = weekMatch[2];

            if (monthMap.hasOwnProperty(monthName)) {
                const monthIndex = monthMap[monthName];
                const monthStart = new Date(year, monthIndex, 1);

                const firstMonday = getWeekStart(monthStart);
                if (firstMonday.getMonth() < monthIndex) {
                    firstMonday.setDate(firstMonday.getDate() + 7);
                }

                const targetWeekStart = new Date(firstMonday);
                targetWeekStart.setDate(
                    firstMonday.getDate() + (weekNumber - 1) * 7
                );

                const targetWeekEnd = new Date(targetWeekStart);
                targetWeekEnd.setDate(targetWeekStart.getDate() + 6);

                if (targetWeekStart.getMonth() === monthIndex) {
                    return {
                        start: targetWeekStart,
                        end: targetWeekEnd,
                    };
                } else {
                    throw new Error(
                        `Week ${weekNumber} extends beyond ${monthName}`
                    );
                }
            }
        }

        const simpleWeekMatch = inputLower.match(/^week\s*(\d+)$/);
        if (simpleWeekMatch) {
            const weekNumber = parseInt(simpleWeekMatch[1]);
            const currentMonth = new Date().getMonth();
            const monthStart = new Date(year, currentMonth, 1);

            const firstMonday = getWeekStart(monthStart);
            if (firstMonday.getMonth() < currentMonth) {
                firstMonday.setDate(firstMonday.getDate() + 7);
            }

            const targetWeekStart = new Date(firstMonday);
            targetWeekStart.setDate(
                firstMonday.getDate() + (weekNumber - 1) * 7
            );

            const targetWeekEnd = new Date(targetWeekStart);
            targetWeekEnd.setDate(targetWeekStart.getDate() + 6);

            return {
                start: targetWeekStart,
                end: targetWeekEnd,
            };
        }

        throw new Error(`Unrecognized date range format: ${input}`);
    } catch (error) {
        throw new Error(
            `Error parsing date range "${input}": ${error.message}`
        );
    }
}

export function parseHeatMapData(data) {
    let informationData = [];
        // Get total number of unique receivers
        // Receiver can be unique by name, state, and lat/lng
        const uniqueReceivers = new Map();
        data.forEach(d => {
            const receiver = {
                name: d.receiver,
                state: d.state,
                latLng: `${d.receiverLat}, ${d.receiverLng}`,
            };

            if (!uniqueReceivers.has(receiver.name)) {
                uniqueReceivers.set(receiver.name, new Map());
            }

            if (!uniqueReceivers.get(receiver.name).has(receiver.state)) {
                uniqueReceivers.get(receiver.name).set(receiver.state, new Set());
            }

            uniqueReceivers.get(receiver.name).get(receiver.state).add(receiver.latLng);
        });

        const totalReceivers = uniqueReceivers.size;

        // Get total cost
        const totalCost = data.reduce((sum, d) => sum + d.cost, 0);

        // Get consignment counts by state
        const consByState = {};
        data.forEach(d => {
            if (d.state) {
                if (!consByState[d.state]) {
                    consByState[d.state] = 0;
                }
                consByState[d.state]++;
            }
        });

        // Consignment Status
        const consStatus = {};
        data.forEach(d => {
            if (d.ConsStatus) {
                if (!consStatus[d.ConsStatus]) {
                    consStatus[d.ConsStatus] = 0;
                }
                consStatus[d.ConsStatus]++;
            }
        });

        informationData = [
            {
                groupName: "General Information",
                items: [
                    { label: "# of Receivers", value: totalReceivers.toString(), icon: <FaUsers /> },
                    { label: "Total Cost", value: `$${totalCost.toFixed(2).toString()}`, icon: <FaDollarSign /> },
                ],
            },
            {
                groupName: "Consignments by State",
                items: Object.entries(consByState).map(([state, count]) => ({
                    label: `Total cons in ${state.toUpperCase()}`,
                    value: count.toString(),
                    icon: <FaTruckLoading />,
                })),
            },
            {
                groupName: "Consignment Status",
                items: Object.entries(consStatus).map(([status, count]) => ({
                    label: `${status}`,
                    value: count.toString(),
                })),
            }
        ];

    return informationData
}

export const parseOperationAnalysisInfo = (data) => {
    let information = [];

            // Get total number of unique receivers
        // Receiver can be unique by name, state, and lat/lng
        const uniqueReceivers = new Map();
        data.forEach(d => {
            const receiver = {
                name: d.receiver,
                state: d.state,
                latLng: `${d.receiverLat}, ${d.receiverLng}`,
            };

            if (!uniqueReceivers.has(receiver.name)) {
                uniqueReceivers.set(receiver.name, new Map());
            }

            if (!uniqueReceivers.get(receiver.name).has(receiver.state)) {
                uniqueReceivers.get(receiver.name).set(receiver.state, new Set());
            }

            uniqueReceivers.get(receiver.name).get(receiver.state).add(receiver.latLng);
        });

        const totalReceivers = uniqueReceivers.size;
        // Get total cost
        const totalCost = data.reduce((sum, d) => sum + d.cost, 0);

        // Get total fuel surcharge
        const totalFuel = data.reduce((sum, d) => sum + d.fuelLevy, 0);

        // Get total weight
        const totalWeight = data.reduce((sum, d) => sum + d.weight, 0);

        // Get total pallet space
        const totalPalletSpace = data.reduce((sum, d) => sum + d.palletSpace, 0);

        // Get total Chep
        const totalChep = data.reduce((sum, d) => sum + d.Chep, 0);

        // Get total Loscam
        const totalLoscam = data.reduce((sum, d) => sum + d.Loscam, 0);

        // Get total Customer OWN
        const totalCustomerOwn = data.reduce((sum, d) => sum + d.CustomerOwn, 0);

        // Get total True PODs
        const totalTruePODs = data.filter(d => d.POD == true).length;

        // Get % of True PODs
        const percentTruePODs = `${((totalTruePODs / data.length) * 100).toFixed(2).toString()}$`;

        // Consignment Status
        const consStatus = {};
        data.forEach(d => {
            if (d.ConsStatus) {
                if (!consStatus[d.ConsStatus]) {
                    consStatus[d.ConsStatus] = 0;
                }
                consStatus[d.ConsStatus]++;
            }
        });

        information = [
        { label: "# of Receivers", value: totalReceivers.toString() , icon: <FaUsers /> },
        {
            label: "Total Cost",
            value: totalCost.toFixed(2).toString(),
            icon: <FaDollarSign />,
        },
        {
            label: "Fuel Surcharge cost",
            value: totalFuel.toFixed(2).toString(),
            icon: <FaGasPump />,
        },
        {
            label: "Total Weight",
            value: totalWeight.toFixed(2).toString(),
            icon: <FaWeightHanging />,
        },
        { label: "Total pallet space", value: totalPalletSpace.toFixed(2).toString(), icon: <FaBox /> },
        { label: "Total Chep", value: totalChep.toFixed(2).toString(), icon: <FaCube /> },
        { label: "Total Loscam", value: totalLoscam.toFixed(2).toString(), icon: <FaTruck /> },
        {
            label: "Total Customer OWN",
            value: totalCustomerOwn.toFixed(2).toString(),
            icon: <FaUserShield />,
        },
        {
            label: "# of True PODs",
            value: totalTruePODs.toString(),
            icon: <FaClipboardCheck />,
        },
        { label: "% of True PODs", value: percentTruePODs, icon: <FaChartLine /> },
        {
            groupName: "Consignment Status",
            items: Object.entries(consStatus).map(([status, count]) => ({
                label: `${status}`,
                value: count.toString(),
            })),
        },
    ]

    return information;
}

export function getUniqueStates(data) {
    const uniqueStates = [...new Set(data.map((item) => item.state))];
    const uniqueColors = [
        "#FF6633", "#00c49f", "#FF33FF",
        "#ffbb28", "#3366E6", "#8884d8", "#B34D4D",]
    const stateOptions = uniqueStates.map((state, index) => ({
    label: state,
    value: state.toLowerCase(),
    color: uniqueColors[index],
    }));

    return stateOptions;
}
