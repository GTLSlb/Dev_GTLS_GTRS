import { Tabs, Tab } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
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
import NewConsignmentTracking from "./NewConsignmentTracking";
import Runsheet from "./Runsheet";

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

export default function MainTracking() {
    const [selected, setSelected] = useState(1);
    const [loading, setLoading] = useState(false);
    const [startPoint, setStartPoint] = useState(null); // To store the start point of the route
    const [endPoint, setEndPoint] = useState(null); // To store the end point of the route
    const [polyline, setPolyline] = useState(null);
    const [eventsMarkers, setEventsMarkers] = useState([]);
    const [markerDetails, setMarkerDetails] = useState(null);
    const mapRef = useRef(null); // Create a ref for the map instance

    useEffect(() => {
        if (polyline && mapRef.current && !loading) {
            zoomToPolyline(polyline);
        }
    }, [polyline]);

    const zoomToPolyline = (path) => {
        if (!mapRef.current || !path || path.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();

        path.forEach((point) => {
            bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
        });

        mapRef.current.fitBounds(bounds, {
            padding: 50, // Optional: Adds padding around the polyline
        });
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

    const resetAllStates = () => {
        setStartPoint(null);
        setEndPoint(null);
        setPolyline(null);
        setEventsMarkers([]);
        setMarkerDetails(null);
    };

    const handleTabChange = (newSelected) => {
        setSelected(newSelected);
        resetAllStates(); // Reset all states when switching tabs
    };

    return (
        <div className=" h-full min-w-[550px] flex">
            <div className="flex w-[550px] flex-col py-3">
                <Tabs
                    aria-label="Options"
                    variant="underlined"
                    classNames={{ tabList: "bg-white" }}
                    selectedKey={selected}
                    onSelectionChange={handleTabChange} // Use the new function
                >
                    <Tab key={1} title="Consignment">
                        <NewConsignmentTracking
                            setStartPoint={setStartPoint}
                            setMarkerDetails={setMarkerDetails}
                            markerDetails={markerDetails}
                            setLoading={setLoading}
                            loading={loading}
                            setPolyline={setPolyline}
                            polyline={polyline}
                            setEndPoint={setEndPoint}
                            setEventsMarkers={setEventsMarkers}
                        />
                    </Tab>
                    <Tab key={2} title="Runsheet">
                        <Runsheet />
                    </Tab>
                </Tabs>
            </div>
            <div className=" h-full w-full">
                <LoadScript
                    googleMapsApiKey="AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go"
                    libraries={["geometry", "visualization"]}
                >
                    <GoogleMap
                        mapContainerStyle={{
                            width: "100%",
                            height: "100%",
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
                        {polyline && (
                            <Polyline
                                path={polyline}
                                options={polylineOptions}
                                onClick={zoomToPolyline(polyline)}
                            />
                        )}

                        {startPoint && (
                            <Marker
                                position={{
                                    lat: startPoint.lat,
                                    lng: startPoint.lng,
                                }}
                                label={{
                                    text: "Sender",
                                    color: "green",
                                    fontSize: "14px",
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                    scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                    ), 
                                    labelOrigin: new window.google.maps.Point(
                                        20,
                                        50
                                    ), 
                                }}
                            />
                        )}

                        {endPoint && (
                            <Marker
                                position={{
                                    lat: endPoint.lat,
                                    lng: endPoint.lng,
                                }}
                                label={{
                                    text: "End",
                                    fontSize: "14px",
                                    color: "Receiver",
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                    scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                    ), 
                                    labelOrigin: new window.google.maps.Point(
                                        20,
                                        50
                                    ), 
                                }}
                            />
                        )}

                        {eventsMarkers.map((position, index) => (
                            <Marker
                                key={index}
                                position={{
                                    lat: parseFloat(position.latitude),
                                    lng: parseFloat(position.longitude),
                                }}
                                icon={getIcon(position.event_type)}
                                onClick={() => handleMarkerClick(position)}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}
