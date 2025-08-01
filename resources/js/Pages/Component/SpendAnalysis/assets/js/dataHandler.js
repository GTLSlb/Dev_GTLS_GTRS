const australianStates = ["nsw", "qld", "vic", "sa", "wa", "tas", "nt"]; // Added more states for better representation
const demurrageTypes = ["Rigid Demurrage", "Semi Demurrage", "BD Demurrage", "Demurrage"];
const serviceTypes = ["Express", "Normal"];

const additionalCostTypes = [
  "Demurrage",
  "Overlength",
  "Redelivery",
  "Split Fee",
  "Incorrect Data",
];

// 1. Define Australian State Coordinates
// These are approximate central points for each state/territory.
const australiaStateCoordinates = {
  nsw: { lat: -31.8152, lng: 147.1656 }, // New South Wales (approx. centre)
  qld: { lat: -20.9176, lng: 142.7028 }, // Queensland (approx. centre)
  vic: { lat: -36.5986, lng: 144.6780 }, // Victoria (approx. centre)
  sa: { lat: -30.0000, lng: 135.0000 }, // South Australia (approx. centre)
  wa: { lat: -25.0000, lng: 120.0000 }, // Western Australia (approx. centre)
  tas: { lat: -41.6667, lng: 146.7500 }, // Tasmania (approx. centre)
  nt: { lat: -19.4914, lng: 132.5510 }, // Northern Territory (approx. centre)
  act: { lat: -35.2809, lng: 149.1300 }, // Australian Capital Territory (Canberra)
};

const getRandomState = () => {
  const randomIndex = Math.floor(Math.random() * australianStates.length);
  return australianStates[randomIndex];
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
  const numCosts = Math.floor(Math.random() * (additionalCostTypes.length + 1));
  const shuffledTypes = [...additionalCostTypes].sort(() => 0.5 - Math.random());
  for (let i = 0; i < numCosts; i++) {
    const type = shuffledTypes[i];
    const cost = Math.floor(Math.random() * 401) + 100; // random number from 100 to 400
    costs.push({ name: type, cost: cost });
  }
  return costs;
};

// New helper function to get coordinates for a given state
const getReceiverLocation = (state) => {
  const coords = australiaStateCoordinates[state.toLowerCase()]; // Ensure case-insensitivity
  if (coords) {
    // Add some random "jitter" to simulate different locations within a state
    const jitterLat = (Math.random() - 0.5) * 2; // +/- 1 degree
    const jitterLng = (Math.random() - 0.5) * 2; // +/- 1 degree
    return {
      receiverLat: coords.lat + jitterLat,
      receiverLng: coords.lng + jitterLng,
    };
  }
  // Fallback for states not defined (shouldn't happen if australianStates matches keys)
  return { receiverLat: null, receiverLng: null };
};


export const dummySpendData = [
  ...[
    { date: "2023-01-07", cost: 10542, additional: 5500, fuelLevy: 150, GST: 5 },
    { date: "2023-01-07", cost: 10542, additional: 5500, fuelLevy: 150, GST: 5 },
    { date: "2023-01-07", cost: 10542, additional: 5500, fuelLevy: 150, GST: 5 },
    { date: "2023-01-07", cost: 10542, additional: 5500, fuelLevy: 150, GST: 5 },
    { date: "2023-01-14", cost: 9450, additional: 2000, fuelLevy: 80, GST: 4 },
    { date: "2023-01-21", cost: 8546, additional: 3000, fuelLevy: 300, GST: 3 },
    { date: "2023-01-28", cost: 12355, additional: 5500, fuelLevy: 85, GST: 3.5 },
    { date: "2023-02-04", cost: 9800, additional: 4000, fuelLevy: 120, GST: 4.5 },
    { date: "2023-02-11", cost: 11200, additional: 6000, fuelLevy: 180, GST: 6 },
    { date: "2023-02-18", cost: 7800, additional: 2500, fuelLevy: 70, GST: 3 },
    { date: "2023-02-25", cost: 10500, additional: 4500, fuelLevy: 90, GST: 4 },
    { date: "2023-03-04", cost: 9000, additional: 3500, fuelLevy: 90, GST: 3.5 },
    { date: "2023-03-11", cost: 10200, additional: 4500, fuelLevy: 110, GST: 4.0 },
    { date: "2023-03-18", cost: 8200, additional: 2800, fuelLevy: 78, GST: 3.2 },
    { date: "2023-03-25", cost: 11800, additional: 5200, fuelLevy: 100, GST: 4.5 },
    { date: "2023-04-01", cost: 9500, additional: 3800, fuelLevy: 100, GST: 3.8 },
    { date: "2023-04-08", cost: 10800, additional: 4800, fuelLevy: 120, GST: 4.3 },
    { date: "2023-04-15", cost: 8900, additional: 3200, fuelLevy: 85, GST: 3.4 },
    { date: "2023-04-22", cost: 12500, additional: 5500, fuelLevy: 110, GST: 4.7 },
    { date: "2024-01-06", cost: 11000, additional: 5800, fuelLevy: 160, GST: 5.2 },
    { date: "2024-01-13", cost: 9800, additional: 2200, fuelLevy: 85, GST: 4.2 },
    { date: "2024-01-20", cost: 8800, additional: 3200, fuelLevy: 320, GST: 3.2 },
    { date: "2024-01-27", cost: 12800, additional: 5800, fuelLevy: 90, GST: 3.7 },
    { date: "2024-02-03", cost: 10000, additional: 4200, fuelLevy: 125, GST: 4.6 },
    { date: "2024-02-10", cost: 11500, additional: 6200, fuelLevy: 185, GST: 6.1 },
    { date: "2024-02-17", cost: 8000, additional: 2600, fuelLevy: 75, GST: 3.1 },
    { date: "2024-02-24", cost: 10800, additional: 4700, fuelLevy: 95, GST: 4.1 },
    { date: "2024-03-03", cost: 9200, additional: 3600, fuelLevy: 95, GST: 3.6 },
    { date: "2024-03-10", cost: 10500, additional: 4600, fuelLevy: 115, GST: 4.1 },
    { date: "2024-03-17", cost: 8400, additional: 2900, fuelLevy: 80, GST: 3.3 },
    { date: "2024-03-24", cost: 12000, additional: 5300, fuelLevy: 105, GST: 4.6 },
    { date: "2025-01-05", cost: 10800, additional: 5600, fuelLevy: 155, GST: 5.1 },
    { date: "2025-01-12", cost: 9600, additional: 2100, fuelLevy: 82, GST: 4.1 },
    { date: "2025-01-12", cost: 9600, additional: 2100, fuelLevy: 82, GST: 4.1 },
    { date: "2025-01-12", cost: 9600, additional: 2100, fuelLevy: 82, GST: 4.1 },
    { date: "2025-01-12", cost: 9600, additional: 2100, fuelLevy: 82, GST: 4.1 },
    { date: "2025-01-19", cost: 8700, additional: 3100, fuelLevy: 310, GST: 3.1 },
    { date: "2025-01-26", cost: 12600, additional: 5600, fuelLevy: 88, GST: 3.6 },
    { date: "2025-02-02", cost: 10000, additional: 4200, fuelLevy: 125, GST: 4.6 },
    { date: "2025-02-09", cost: 11500, additional: 6200, fuelLevy: 185, GST: 6.1 },
    { date: "2025-02-16", cost: 8000, additional: 2600, fuelLevy: 75, GST: 3.1 },
    { date: "2025-02-23", cost: 10800, additional: 4700, fuelLevy: 95, GST: 4.1 },
    { date: "2025-03-02", cost: 9000, additional: 3500, fuelLevy: 90, GST: 3.5 },
    { date: "2025-03-09", cost: 10200, additional: 4500, fuelLevy: 110, GST: 4.0 },
    { date: "2025-03-16", cost: 8200, additional: 2800, fuelLevy: 78, GST: 3.2 },
    { date: "2025-03-23", cost: 11800, additional: 5200, fuelLevy: 100, GST: 4.5 },
    { date: "2025-04-06", cost: 9500, additional: 3800, fuelLevy: 100, GST: 3.8 },
    { date: "2025-04-13", cost: 10800, additional: 4800, fuelLevy: 120, GST: 4.3 },
    { date: "2025-04-20", cost: 8900, additional: 3200, fuelLevy: 85, GST: 3.4 },
    { date: "2025-04-27", cost: 12500, additional: 5500, fuelLevy: 110, GST: 4.7 },
    { date: "2025-05-04", cost: 9200, additional: 3600, fuelLevy: 95, GST: 3.6 },
    { date: "2025-05-11", cost: 10500, additional: 4600, fuelLevy: 115, GST: 4.1 },
    { date: "2025-05-18", cost: 8400, additional: 2900, fuelLevy: 80, GST: 3.3 },
    { date: "2025-05-25", cost: 12000, additional: 5300, fuelLevy: 105, GST: 4.6 },
    { date: "2025-06-01", cost: 9800, additional: 3900, fuelLevy: 105, GST: 3.9 },
    { date: "2025-06-08", cost: 11200, additional: 4900, fuelLevy: 125, GST: 4.4 },
    { date: "2025-06-15", cost: 9100, additional: 3300, fuelLevy: 90, GST: 3.5 },
    { date: "2025-06-22", cost: 12800, additional: 5600, fuelLevy: 115, GST: 4.8 },
  ].map((item, i) => {
    const state = getRandomState(); // Get the state first
    const location = getReceiverLocation(state); // Then get coordinates based on the state

    return {
      ...item,
      state: state,
      receiver: `Receiver ${(i % 2) + 1}`,
      demurrageType: getRandomDemurrage(),
      demurrageCost: Math.floor(Math.random() * 5000),
      serviceType: getRandomService(),
      weight: Math.floor(Math.random() * 100),
      palletSpace: Math.floor(Math.random() * 50),
      additionalCost: generateAdditionalCosts(),
      // Add the receiver location
      receiverLat: location.receiverLat,
      receiverLng: location.receiverLng,
    };
  })
];