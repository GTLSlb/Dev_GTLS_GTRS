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
import LocationOn from "@mui/icons-material/LocationOn";
import ConsIcon from "@/assets/icons/ConsIcon.png";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import List from "@mui/icons-material/List";
import HelpCenterRounded from "@mui/icons-material/HelpCenterRounded";
import {
    SelectItem,
    Divider,
    Select,
    Input,
    Button,
    Image,
} from "@nextui-org/react";
import { ChevronLeftIcon, MapPinIcon } from "@heroicons/react/20/solid";

const googleMapsKey = window.Laravel.googleMapsKey;
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
    const [consignmentDetails, setConsignmentDetails] = useState(null);
    const getConsignmentRoute = (e) => {
        setPolyline(null);
        setEventsMarkers([]);
        setLoading(true);
        setStartPoint(null);
        setEndPoint(null);
        setMarkerDetails(null);
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
                setConsignmentDetails(response.data.consignmentDetails);
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

    function formatDate(dateString) {
        const date = new Date(dateString);

        // Get day, month, and year
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
        const year = date.getFullYear();

        // Get hours and minutes
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");

        // Determine AM or PM
        const ampm = hours >= 12 ? "PM" : "AM";

        // Convert 24-hour format to 12-hour format
        hours = hours % 12 || 12;

        // Format hours
        const formattedHours = String(hours).padStart(2, "0");

        // Combine parts
        return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
    }
    return (
        <div className=" h-full min-w-[550px] flex">
            {markerDetails ? (
                <div className="flex flex-col w-[550px] p-3 bg-zinc-100">
                    <div className="flex">
                        <Button
                            size="md"
                            variant="light"
                            startContent={
                                <ChevronLeftIcon className="h-6 w-6" />
                            }
                            onClick={() => handleClose()}
                            className="mt-2 w-20"
                        >
                            Back
                        </Button>
                    </div>
                    <Divider className="my-2" />
                    <div className="p-3">
                        <div className="flex gap-5 items-center">
                            <img
                                src={markerDetails.image}
                                alt=""
                                width={30}
                                height={30}
                            />
                            <div>
                                <p className="font-bold text-xl text-[#2A3034]">
                                    {markerDetails.type}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-7 items-start">
                            <LocationOn
                                sx={{ color: "#e2b540" }}
                                className="!h-8 !w-8"
                            />
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
                            <AccessTimeIcon
                                sx={{ color: "#e2b540" }}
                                className="!h-8 !w-8"
                            />
                            <div className="flex flex-col text-[#2A3034]">
                                <p className="font-thin">
                                    Started At{" "}
                                    {formatDateTime(markerDetails.startDate)}
                                </p>
                                {markerDetails.endDate && (
                                    <p className="font-thin">
                                        Ends At{" "}
                                        {formatDateTime(markerDetails.endDate)}
                                    </p>
                                )}
                            </div>
                        </div>
                        {markerDetails.advice && (
                            <div className="mt-8 flex gap-7 items-start">
                                <List
                                    sx={{ color: "#e2b540" }}
                                    className="!h-8 !w-8"
                                />
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
                                    sx={{ color: "#e2b540" }}
                                    className="!h-8 !w-8"
                                />
                                <div className="flex flex-col text-[#2A3034]">
                                    <p className="font-semibold">Information</p>
                                    <p className=" font-thin max-h-[300px] overflow-y-auto pr-2 containerscroll">
                                        {markerDetails.information}
                                    </p>
                                </div>
                            </div>
                        ) : markerDetails.otherAdvice ? (
                            <div className="mt-8 flex gap-7 items-start">
                                <HelpCenterRounded
                                    sx={{ color: "#e2b540" }}
                                    className="!h-8 !w-8"
                                />
                                <div className="flex flex-col text-[#2A3034]">
                                    <p className="font-semibold">Information</p>

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
                </div>
            ) : (
                <div className="flex flex-col w-[550px] p-3 bg-zinc-100">
                    <div className="font-bold text-lg mt-3">
                        Consignment Tracking
                    </div>
                    <Divider className="my-2" />
                    <div className="py-5 grid grid-cols-2 gap-y-5 gap-x-2">
                        <Input
                            type="text"
                            label="Consignment No"
                            labelPlacement="outside"
                            placeholder=" "
                            radius="sm"
                            variant="bordered"
                            classNames={{
                                input: "border-0 focus:ring-0 focus:border-0",
                                inputWrapper: "bg-white shadow-none",
                            }}
                            value={consignmentNb}
                            onValueChange={setConsignmentNb}
                        />
                        <Select
                            label="Select Type"
                            variant="bordered"
                            placeholder=" "
                            radius="sm"
                            labelPlacement="outside"
                            selectedKeys={typeId}
                            className="max-w-xs"
                            classNames={{
                                mainWrapper: "bg-white shadow-none",
                            }}
                            onSelectionChange={(e) => setTypeId(e.currentKey)}
                        >
                            <SelectItem key={1}>Pickup</SelectItem>
                            <SelectItem key={2}>Delivery</SelectItem>
                        </Select>
                        <div className="flex flex-col">
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
                                    onChange={(e) =>
                                        setFromdate(e.target.value)
                                    }
                                    value={fromdate}
                                    className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
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
                                    value={todate}
                                    onChange={(e) => setTodate(e.target.value)}
                                    className="flex-item block w-full h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:max-w-xs sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={() => getConsignmentRoute()}
                            isLoading={loading}
                            className="mt-2 w-full bg-gray-800 text-white col-span-2"
                        >
                            Submit
                        </Button>
                    </div>
                    <Divider className="my-2" />
                    {consignmentDetails && (
                        <div className=" border-2 bg-white h-full p-5 rounded-md overflow-auto">
                            <div className=" font-bold flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-zinc-500"> Consignment No</div>
                                    <div>
                                        {
                                            consignmentDetails
                                                .consignmentDetails
                                                .ConsignmentNo
                                        }
                                    </div>
                                </div>
                                <Image src={ConsIcon} alt="" />
                            </div>
                            <div className="text-sm  mt-5">
                                <div className="flex gap-3">
                                    <span className="text-zinc-500">
                                        Charge Code
                                    </span>
                                    <span className="text-black">
                                        {
                                            consignmentDetails
                                                .consignmentDetails.ChargeCode
                                        }
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-zinc-500">
                                        Service Type
                                    </span>
                                    <span className="text-black">
                                        {
                                            consignmentDetails
                                                .consignmentDetails.ServiceType
                                        }
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-zinc-500">
                                        Pickup Date
                                    </span>
                                    <span className="text-black">
                                        {formatDate(
                                            consignmentDetails
                                                .consignmentDetails.Pickdate
                                        )}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-zinc-500">RDD</span>
                                    <span className="text-black">
                                        {formatDate(
                                            consignmentDetails
                                                .consignmentDetails.Pickdate
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className=" mt-5">
                                <div className="flex flex-col gap-5">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center relative">
                                            <div className=" w-min p-2 h-min bg-teal-600 rounded-full bg-opacity-30">
                                                <span className="">
                                                    <MapPinIcon className="h-6 w-6 text-teal-600" />
                                                </span>
                                            </div>
                                            <div className="absolute border-1 border-dashed top-10 h-[88%] border-blue-300"></div>
                                        </div>

                                        <div className=" border-1 w-full p-2 rounded-md text-sm border-teal-600 border-opacity-30">
                                            <span className="text-zinc-500 font-bold">
                                                Sender
                                            </span>
                                            <div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        Name
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .senderDetails
                                                                .SenderName
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        Address
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .senderDetails
                                                                .SenderAddress
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        Suburb
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .senderDetails
                                                                .SenderSuburb
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        State
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .senderDetails
                                                                .SenderState
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        PostCode
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .senderDetails
                                                                .SenderPostCode
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className=" w-min h-min p-2 bg-pink-600 rounded-full bg-opacity-30">
                                            <span className="">
                                                <MapPinIcon className="h-6 w-6 text-pink-600" />
                                            </span>
                                        </div>
                                        <div className=" border-1 w-full p-2 rounded-md text-sm border-pink-600 border-opacity-30">
                                            <span className="text-zinc-500 font-bold">
                                                Receiver
                                            </span>
                                            <div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        Name
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .receiverDetails
                                                                .ReceiverName
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        Address
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .receiverDetails
                                                                .ReceiverAddress
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        Suburb
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .receiverDetails
                                                                .ReceiverSuburb
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        State
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .receiverDetails
                                                                .ReceiverState
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-zinc-500">
                                                        PostCode
                                                    </span>
                                                    <span className="text-black">
                                                        {
                                                            consignmentDetails
                                                                .receiverDetails
                                                                .ReceiverPostcode
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className=" h-full w-full">
                <LoadScript
                    googleMapsApiKey={googleMapsKey}
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
                                    text: "Sender",
                                    color: "green",
                                    fontSize: "14px",
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                    scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                    ), // Increase marker size
                                    labelOrigin: new window.google.maps.Point(
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
                                    color: "Receiver",
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                    scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                    ), // Increase marker size
                                    labelOrigin: new window.google.maps.Point(
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
                                        lat: parseFloat(position.latitude),
                                        lng: parseFloat(position.longitude),
                                    }}
                                    icon={getIcon(position.event_type)}
                                    onClick={() => handleMarkerClick(position)}
                                />
                            );
                        })}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}

export default NewConsignmentTracking;
