import React, { useEffect, useState, useRef } from "react";
import {
    GoogleMap,
    LoadScript,
    Polyline,
    Marker,
} from "@react-google-maps/api";
import Roadworks from "@/assets/icons/RoadWork.png";
import Alpine from "@/assets/icons/Alpine.png";
import Flooding from "@/assets/icons/Flooding.png";
import Congestion from "@/assets/icons/Congestion.png";
import Hazard from "@/assets/icons/Hazard.png";
import RegionalLGA from "@/assets/icons/RegionalLGA.png";
import Incident from "@/assets/icons/Incident.png";
import Major from "@/assets/icons/Major.png";
import Other from "@/assets/icons/Other.png";
import CloseIcon from "@mui/icons-material/Close";
import LocationOn from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import List from "@mui/icons-material/List";
import HelpCenterRounded from "@mui/icons-material/HelpCenterRounded";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const center = { lat: -25.2744, lng: 133.7751 };
const australiaBounds = {
    north: -15.0,
    south: -39.0,
    west: 112.0,
    east: 154.0,
};

const polylineOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 5,
};

const eventTypeMapping = {
    Roadworks: ["ROADWORKS", "24HR ROADWORKS", "Roadwork", "Roadworks"],
    Alpine: ["Alpine"],
    Flooding: ["Flooding"],
    Congestion: ["Congestion"],
    Hazard: ["Hazard", "Vehicle fire", "Fire", "Vehicle rollover", "Landslip"],
    "Regional LGA Incident": ["Regional LGA Incident", "Emergency Incident"],
    "Major Event": ["Major Event", "Special event", "Demonstration"],
    Incident: [
        "INCIDENT",
        "COLLISION",
        "Incident",
        "Crash",
        "Emergency Incident",
    ],
    Other: ["Equipment damage", "Equipment fault"],
};

const iconMappings = {
    Roadworks,
    Alpine,
    Flooding,
    Congestion,
    Hazard,
    "Regional LGA Incident": RegionalLGA,
    "Major Event": Major,
    Incident,
    Other,
};

function NewConsignmentTracking() {
    const [consignmentNb, setConsignmentNb] = useState("");
    const [typeId, setTypeId] = useState("");
    const [fromdate, setFromdate] = useState("");
    const [todate, setTodate] = useState("");
    const [loading, setLoading] = useState(false);
    const [startPoint, setStartPoint] = useState(null); // To store the start point of the route
    const [endPoint, setEndPoint] = useState(null); // To store the end point of the route
    const [polyline, setPolyline] = useState(null);
    const [eventsMarkers, setEventsMarkers] = useState([]);
    const [markerDetails, setMarkerDetails] = useState(null);
    const mapRef = useRef(null); // Create a ref for the map instance
    const gtrsWebUrl = window.Laravel.gtrsWeb;

    const getConsignmentRoute = (e) => {
        e.preventDefault();
        setPolyline(null);
        setLoading(true);
        axios
            .get(`${gtrsWebUrl}getConsignmentRoute`, {
                params: {
                    consignmentNo: consignmentNb,
                    typeId: typeId,
                    fromDate: fromdate,
                    toDate: todate,
                },
            })
            .then((response) => {
                setLoading(false);

                // Process Event Markers here before setting them
                let updatedEventMarkers = response.data.routeWithEvents.map(
                    (event) => {
                        // Example modification: add a custom marker description or filter events
                        return {
                            ...event, // Keep existing event data
                            description:
                                event.description || "No description available", // Add default description if missing
                            icon: event.severity
                                ? getMarkerIcon(event.severity)
                                : "defaultIcon", // Example: change marker icon based on event severity
                            // Add or modify other fields as needed
                        };
                    }
                );

                // Set the updated polyline and event markers
                setPolyline(response.data.vehicleRoad);
                setEventsMarkers(updatedEventMarkers); // Set modified event markers

                // Set start and end points
                if (
                    response.data.vehicleRoad &&
                    response.data.vehicleRoad.length > 0
                ) {
                    setStartPoint(response.data.vehicleRoad[0]); // First point
                    setEndPoint(
                        response.data.vehicleRoad[
                            response.data.vehicleRoad.length - 1
                        ]
                    ); // Last point
                }

                // Zoom to fit the polyline after setting the data
                if (mapRef.current && response.data.vehicleRoad) {
                    zoomToPolyline(response.data.vehicleRoad);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    useEffect(() => {
        if (polyline && mapRef.current && loading) {
            zoomToPolyline(polyline);
        }
    }, [polyline]);

    const zoomToPolyline = (path) => {
        if (!mapRef.current || !path || path.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();

        // Extend bounds for each point in the polyline
        path.forEach((point) => {
            bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
        });

        // Fit the map to the bounds of the polyline with animation options
        mapRef.current.fitBounds(bounds, {
            padding: 50, // Optional: Adds padding around the polyline
        });
    };

    const handleClose = () => {
        setMarkerDetails(null);
    };

    const getIcon = (eventType) => {
        const mainCategory = Object.keys(eventTypeMapping).find((category) =>
            eventTypeMapping[category].includes(eventType)
        );
        const iconUrl =
            iconMappings[mainCategory] ||
            "https://qldtraffic.qld.gov.au/images/roadevents/SpecialEvents.png";
        return {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(20, 20),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(16, 16),
        };
    };
    const formatDateTime = (dateTimeString) => {
        const dateObj = new Date(dateTimeString);
        return dateObj.toLocaleString();
    };

    const handleMarkerClick = (position) => {
        setMarkerDetails({
            image: getIcon(position.event_type).url,
            id: position.event_id,
            type: position.event_type,
            subsurb: position.suburb,
            roadName: position.road_name,
            startDate: position.start_date,
            endDate: position.end_date,
            advice: position.advice,
            information: position.information,
            reportedBy: position.api_source,
            otherAdvice: position.otherAdvice,
        });
    };

    useEffect(() => {
        console.log(typeId);
    }, [typeId]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full bg-smooth pb-20">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex w-full items-center justify-between mt-2 lg:mt-6">
                    <h1 className="text-2xl py-2 px-0 font-extrabold text-gray-600">
                        Consignment Tracking 2
                    </h1>
                </div>
            </div>
            {/* Input fields */}
            <div className="mt-4 mb-4 grid grid-cols-5 gap-5">
                <div className="grid grid-cols-2 items-center gap-2">
                    {" "}
                    <label
                        htmlFor="last-name"
                        className="inline-block text-sm font-medium leading-6  flex-item "
                    >
                        Consignment Number
                    </label>
                    <div className="sm:mt-0 ">
                        <input
                            type="text"
                            rows={4}
                            name="comment"
                            id="comment"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => {
                                setConsignmentNb(event.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 items-center gap-2">
                    {" "}
                    <label
                        htmlFor="last-name"
                        className="inline-block text-sm font-medium leading-6  flex-item "
                    >
                        Consignment type
                    </label>
                    <div className="sm:mt-0 ">
                        {/* <input
                            type="number"
                            onChange={(event) => {
                                setTypeId(event.target.value);
                            }}
                            className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                        /> */}
                        <select
                            name="cars"
                            id="cars"
                            form="carform"
                            value={typeId}
                            onChange={(event) => {
                                setTypeId(event.target.value);
                            }}
                            className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option value="" disabled={typeId !== ""}>
                                Select a type
                            </option>
                            <option value="1">Pickup</option>
                            <option value="2">Delivery</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    {" "}
                    <label
                        htmlFor="last-name"
                        className="inline-block text-sm font-medium leading-6  flex-item "
                    >
                        Date From
                    </label>
                    <div className="sm:mt-0 ">
                        <input
                            type="datetime-local"
                            onChange={(e) => setFromdate(e.target.value)}
                            className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    {" "}
                    <label
                        htmlFor="last-name"
                        className="inline-block text-sm font-medium leading-6  flex-item "
                    >
                        Date From
                    </label>
                    <div className="sm:mt-0 ">
                        <input
                            type="datetime-local"
                            onChange={(e) => setTodate(e.target.value)}
                            className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div className="flex items-end justify-end">
                    <button
                        onClick={(e) => getConsignmentRoute(e)}
                        className="bg-dark text-white p-2 w-1/2 rounded-md"
                    >
                        {loading ? (
                            <div className="w-full flex justify-center">
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            </div>
                        ) : (
                            <>Check</>
                        )}
                    </button>
                </div>
            </div>

            {/* Google Map and Sidebar*/}
            <div className="flex flex-col h-[750px] mt-10">
                <div className="flex-grow flex flex-row-reverse">
                    <div className="flex-grow rounded-3xl">
                        {/* Google Map */}
                        <LoadScript
                            googleMapsApiKey="AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go"
                            libraries={["geometry", "visualization"]}
                        >
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "100%",
                                    borderTopRightRadius: "1rem",
                                    borderBottomRightRadius: "1rem",
                                }}
                                center={center}
                                zoom={5}
                                onLoad={(map) => (mapRef.current = map)} // Save map instance to mapRef
                                options={{
                                    restriction: {
                                        latLngBounds: australiaBounds,
                                    },
                                }}
                            >
                                {/* <TrafficLayer /> */}
                                {/* Render Polyline */}
                                {polyline && (
                                    <Polyline
                                        path={polyline}
                                        options={polylineOptions}
                                        onClick={zoomToPolyline(polyline)}
                                    />
                                )}
                                {/* Render start marker */}
                                {startPoint && (
                                    <Marker
                                        position={{
                                            lat: startPoint.lat,
                                            lng: startPoint.lng,
                                        }}
                                        label={{
                                            text: "Start",
                                            color: "green",
                                            fontSize: "14px",
                                        }}
                                        icon={{
                                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                            scaledSize:
                                                new window.google.maps.Size(
                                                    40,
                                                    40
                                                ), // Increase marker size
                                            labelOrigin:
                                                new window.google.maps.Point(
                                                    20,
                                                    50
                                                ), // Adjust label position
                                        }}
                                    />
                                )}

                                {/* Render end marker */}
                                {endPoint && (
                                    <Marker
                                        position={{
                                            lat: endPoint.lat,
                                            lng: endPoint.lng,
                                        }}
                                        label={{
                                            text: "End",
                                            fontSize: "14px",
                                            color: "red",
                                        }}
                                        icon={{
                                            labelOrigin:
                                                new window.google.maps.Point(
                                                    15,
                                                    -10
                                                ), // Position label above the marker
                                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                            scaledSize:
                                                new window.google.maps.Size(
                                                    40,
                                                    40
                                                ), // Increase marker size
                                            labelOrigin:
                                                new window.google.maps.Point(
                                                    20,
                                                    50
                                                ), // Adjust label position
                                        }}
                                    />
                                )}

                                {eventsMarkers.map((position, index) => {
                                    return (
                                        <Marker
                                            key={index}
                                            position={{
                                                lat: parseFloat(
                                                    position.latitude
                                                ),
                                                lng: parseFloat(
                                                    position.longitude
                                                ),
                                            }}
                                            icon={getIcon(position.event_type)}
                                            onClick={() =>
                                                handleMarkerClick(position)
                                            }
                                        />
                                    );
                                })}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                    {/* Sidebar */}
                    {markerDetails && (
                        <div className="h-full w-80 bg-gray-100 border-1 rounded-l-2xl p-4 pr-2 overflow-y-auto ">
                            <div className="flex justify-between">
                                <div className="flex gap-5 items-center">
                                    <img
                                        src={markerDetails.image}
                                        alt=""
                                        width={30}
                                        height={30}
                                    />
                                    <div>
                                        <p className="font-bold text-lg text-[#2A3034]">
                                            {markerDetails.type}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={handleClose}>
                                    <CloseIcon sx={{ color: "#e0c981" }} />
                                </button>
                            </div>
                            <div className="mt-8 flex gap-7 items-start">
                                <LocationOn sx={{ color: "#e0c981" }} />
                                <div className="flex flex-col text-[#2A3034]">
                                    <p className="font-semibold">
                                        {markerDetails.subsurb}
                                    </p>
                                    <p className=" font-thin">
                                        {markerDetails.roadName}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-7 items-start">
                                <AccessTimeIcon sx={{ color: "#e0c981" }} />
                                <div className="flex flex-col text-[#2A3034]">
                                    <p className="font-thin">
                                        Started At{" "}
                                        {formatDateTime(
                                            markerDetails.startDate
                                        )}
                                    </p>
                                    {markerDetails.endDate && (
                                        <p className="font-thin">
                                            Ends At{" "}
                                            {formatDateTime(
                                                markerDetails.endDate
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {markerDetails.advice && (
                                <div className="mt-8 flex gap-7 items-start">
                                    <List sx={{ color: "#e0c981" }} />
                                    <div className="flex flex-col text-[#2A3034]">
                                        <p className="font-semibold">Advice</p>
                                        <p className=" font-thin">
                                            {markerDetails.advice}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {markerDetails.information ? (
                                <div className="mt-8 flex gap-7 items-start">
                                    <HelpCenterRounded
                                        sx={{ color: "#e0c981" }}
                                    />
                                    <div className="flex flex-col text-[#2A3034]">
                                        <p className="font-semibold">
                                            Information
                                        </p>
                                        <p className=" font-thin max-h-[300px] overflow-y-auto pr-2 containerscroll">
                                            {markerDetails.information}
                                        </p>
                                    </div>
                                </div>
                            ) : markerDetails.otherAdvice ? (
                                <div className="mt-8 flex gap-7 items-start">
                                    <HelpCenterRounded
                                        sx={{ color: "#e0c981" }}
                                    />
                                    <div className="flex flex-col text-[#2A3034]">
                                        <p className="font-semibold">
                                            Information
                                        </p>

                                        <p
                                            className="font-thin max-w-60 max-h-[300px] overflow-y-auto pr-2 containerscroll"
                                            dangerouslySetInnerHTML={{
                                                __html: markerDetails.otherAdvice,
                                            }}
                                        ></p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewConsignmentTracking;
