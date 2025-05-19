import React, { useState, useCallback, useEffect } from "react";
import {
    GoogleMap,
    LoadScript,
    Marker,
    DirectionsService,
    TrafficLayer,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { Button, Card, Divider, Image } from "@heroui/react";
import { ChevronLeftIcon, MapPinIcon } from "@heroicons/react/20/solid";
import Roadworks from "@/assets/icons/RoadWork.png";
import Alpine from "@/assets/icons/Alpine.png";
import Flooding from "@/assets/icons/Flooding.png";
import Congestion from "@/assets/icons/Congestion.png";
import Hazard from "@/assets/icons/Hazard.png";
import RegionalLGA from "@/assets/icons/RegionalLGA.png";
import Incident from "@/assets/icons/Incident.png";
import Major from "@/assets/icons/Major.png";
import Other from "@/assets/icons/Other.png";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function ConsMap({ }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsRequested, setDirectionsRequested] = useState(false);
    const [event, setEvent] = useState();
    const [mapCenter, setMapCenter] = useState(null);

    const sender = {
        lat: location?.state.consignmentToTrack.Coordinates[0].SenderLatitude,
        lng: location?.state.consignmentToTrack.Coordinates[0].SenderLongitude,
    };

    const receiver = {
        lat: location?.state.consignmentToTrack.Coordinates[0].ReceiverLatitude,
        lng: location?.state.consignmentToTrack.Coordinates[0].ReceiverLongitude,
    };

    const events = location?.state.consignmentToTrack.events;
    useEffect(() => {
        if (!mapCenter) {
            setMapCenter({
                lat: (sender.lat + receiver.lat) / 2,
                lng: (sender.lng + receiver.lng) / 2,
            });
        }
    }, [sender, receiver, mapCenter]);
    const handleDirectionsCallback = useCallback((response) => {
        if (response !== null && response.status === "OK") {
            setDirectionsResponse(response);
            setDirectionsRequested(true);
        } else {
            console.error(
                "Directions request failed due to " + response?.status
            );
        }
    }, []);

    const mapContainerStyle = { width: "100%", height: "100%" };
    const australiaBounds = {
        north: -5.0,
        south: -55.0,
        east: 165.0,
        west: 105.0,
    };
    const getIcon = (eventType) => {
        const mainCategory = Object.keys(eventTypeMapping).find((category) =>
            eventTypeMapping[category].includes(eventType)
        );
        const iconUrl =
            iconMappings[mainCategory] ||
            "https://qldtraffic.qld.gov.au/images/roadevents/SpecialEvents.png";

        // Ensure window.google.maps is available before using it
        if (window.google && window.google.maps) {
            return {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
            };
        }

        // Fallback to only the icon URL if window.google.maps is not available yet
        return {
            url: iconUrl,
        };
    };
    return (
        <div className="w-full h-full min-w-[500px] flex">
            {event ? (
                <div className="flex flex-col w-96 p-3">
                    <div>
                        <Button
                            size="sm"
                            variant="light"
                            startContent={
                                <ChevronLeftIcon className="h-4 w-4" />
                            }
                            onClick={() => setEvent(null)}
                            className="mt-2 w-20"
                        >
                            Back
                        </Button>
                    </div>

                    <Divider className="my-2" />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-3 w-full items-center">
                            <Image
                                className="w-10"
                                src={getIcon(event.event_type).url}
                            />
                            <div className="flex flex-col items-start gap-0">
                                <span>{event.event_type}</span>
                            </div>
                        </div>
                        <span className="text-[15px] text-gray-400">
                            {event.description}
                        </span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <div>
                                <MapPinIcon className="h-8 !w-8 text-gray-500" />
                            </div>
                            <span className="text-[13px]">
                                {event.road_name}, {event.suburb}
                            </span>
                        </div>
                        {event.start_date && (
                            <div className="flex gap-2 items-center">
                                <div>
                                    <ScheduleSendIcon className="h-8 !w-8 text-gray-500" />
                                </div>
                                <span className="text-[13px]">
                                    {moment(event.start_date).format(
                                        "DD-MM-YYYY hh:mm A"
                                    ) == "Invalid date"
                                        ? ""
                                        : moment(event.start_date).format(
                                              "DD-MM-YYYY hh:mm A"
                                          )}
                                </span>
                            </div>
                        )}
                        {event.end_date && (
                            <div className="flex gap-2 items-center">
                                <div>
                                    <AlarmOnIcon className="h-8 !w-8 text-gray-500" />
                                </div>
                                <span className="text-[13px]">
                                    {moment(event.end_date).format(
                                        "DD-MM-YYYY hh:mm A"
                                    ) == "Invalid date"
                                        ? ""
                                        : moment(event.end_date).format(
                                              "DD-MM-YYYY hh:mm A"
                                          )}
                                </span>
                            </div>
                        )}
                    </div>
                    <Divider className="my-2" />
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold">Advice</span>
                            <span>{event.advice}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold">Other Advice</span>
                            <span>{event.advice}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-96 p-3">
                    <div>
                        <Button
                            size="sm"
                            variant="light"
                            startContent={
                                <ChevronLeftIcon className="h-4 w-4" />
                            }
                            onClick={() => navigate(-1)}
                            className="mt-2 w-20"
                        >
                            Back
                        </Button>
                    </div>

                    <Divider className="my-2" />
                    <div className="flex gap-2">
                        <span className="font-bold">Consignment No</span>
                        <span>{location?.state.consignmentToTrack?.ConsignmentNo}</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex flex-col gap-2">
                        <span className="font-bold">Trip</span>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex gap-2 items-center">
                                <MapPinIcon className="h-6 w-6" />
                                <span>{location?.state.consignmentToTrack?.SenderAddressName}</span>
                            </div>
                            <Divider
                                orientation="vertical"
                                className="w-1 ml-2.5 rounded h-5"
                            />
                            <div className="flex gap-2 items-center">
                                <MapPinIcon className="h-6 w-6" />
                                <span>{location?.state.consignmentToTrack?.ReceiverAddressName}</span>
                            </div>
                        </div>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex flex-col gap-3">
                        <span className="font-bold">
                            {location?.state.consignmentToTrack.EventCount} event(s) on your route:
                        </span>
                        {location?.state.consignmentToTrack.events.map((event) => (
                            <Card
                                variant="light"
                                className="w-full items-start p-2"
                                isPressable
                                onClick={() => setEvent(event)}
                            >
                                <div className="flex gap-2 w-full items-center">
                                    <Image
                                        className="w-8"
                                        src={getIcon(event.event_type).url}
                                    />
                                    <div className="flex flex-col items-start gap-0">
                                        <span>{event.event_type}</span>
                                        <span className="text-[10px] truncate">
                                            {" "}
                                            {event.description.length > 30
                                                ? `${event.description.slice(
                                                      0,
                                                      30
                                                  )}...`
                                                : event.description}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <LoadScript googleMapsApiKey="AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={6}
                    options={{
                        restriction: {
                            latLngBounds: australiaBounds,
                            strictBounds: true,
                        },
                    }}
                    center={mapCenter}
                >
                    {/* <TrafficLayer />  */}
                    {!directionsRequested && (
                        <DirectionsService
                            options={{
                                origin: sender,
                                destination: receiver,
                                travelMode: "DRIVING",
                            }}
                            callback={handleDirectionsCallback}
                        />
                    )}

                    {/* Render the route */}
                    {directionsResponse && (
                        <DirectionsRenderer
                            directions={directionsResponse}
                            options={{
                                polylineOptions: {
                                    strokeColor: "#8b5cf6", // Change to your desired color, e.g., red
                                    strokeOpacity: 0.9, // Adjust opacity if needed
                                    strokeWeight: 6, // Adjust the thickness of the line
                                },
                            }}
                        />
                    )}

                    {/* Markers for the events */}
                    {events.map((event) => {
                        try {
                            // Use latitude and longitude directly from the event object
                            const lat = parseFloat(event.latitude);
                            const lng = parseFloat(event.longitude);

                            // Check if lat and lng are valid numbers before rendering the marker
                            if (!isNaN(lat) && !isNaN(lng)) {
                                // Check if the coordinates fall within the map bounds
                                if (
                                    lat >= australiaBounds.south &&
                                    lat <= australiaBounds.north &&
                                    lng >= australiaBounds.west &&
                                    lng <= australiaBounds.east
                                ) {
                                    return (
                                        <Marker
                                            key={event.id}
                                            position={{ lat, lng }}
                                            icon={getIcon(event.event_type)}
                                            onClick={() => setEvent(event)}
                                        />
                                    );
                                } else {
                                    console.warn(
                                        `Event ${event.id} is outside of Australia bounds: Lat: ${lat}, Lng: ${lng}`
                                    );
                                }
                            }
                        } catch (error) {
                            console.error(
                                "Error processing event coordinates:",
                                error
                            );
                        }

                        return null; // Do not render marker if coordinates are invalid
                    })}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
