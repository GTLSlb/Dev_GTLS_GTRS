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
        const cost = Math.floor(Math.random() * 401) + 100;
        costs.push({ name: type, cost: cost });
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

export function generateDummySpendData(options = {}) {
    const {
        count = 5,
        startDate = "2023-01-01",
        endDate = "2025-06-30",
        receivers = ["Receiver 1", "Receiver 2"],
    } = options;

    const data = [];

    for (let i = 0; i < count; i++) {
        const state = getRandomState();
        const location = getReceiverLocation(state);
        const randomDate = getRandomDate(startDate, endDate);

        const baseCost = 8000 + Math.floor(Math.random() * 5000);
        const additional = 2000 + Math.floor(Math.random() * 4000);
        const fuelLevy = 70 + Math.floor(Math.random() * 250);
        const gst = 3 + Math.random() * 3.5;

        data.push({
            date: formatDate(randomDate),
            cost: baseCost,
            additional: additional,
            fuelLevy: fuelLevy,
            GST: Math.round(gst * 10) / 10,
            state: state,
            receiver: receivers[i % receivers.length],
            demurrageType: getRandomDemurrage(),
            demurrageCost: Math.floor(Math.random() * 5000),
            serviceType: getRandomService(),
            weight: Math.floor(Math.random() * 100),
            palletSpace: Math.floor(Math.random() * 50),
            additionalCost: generateAdditionalCosts(),
            receiverLat: location.receiverLat,
            receiverLng: location.receiverLng,
        });
    }

    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export const dummySpendData = generateDummySpendData();

export const generateUTCDate = (year, month, day) => {
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
};
