import React, { useEffect, useRef, useState } from "react";
import { dummySpendData } from "../../assets/js/dataHandler";

function HeatMap() {
    const mapRef = useRef();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [leafletLoaded, setLeafletLoaded] = useState(false);
    const australiaPosition = [-25.2744, 133.7751];


    useEffect(() => {
        const loadLeaflet = async () => {
            if (!document.querySelector('link[href*="leaflet"]')) {
                const leafletCSS = document.createElement("link");
                leafletCSS.rel = "stylesheet";
                leafletCSS.href =
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
                document.head.appendChild(leafletCSS);
            }

            if (!window.L) {
                await new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src =
                        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js";
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }

            if (!window.L.heatLayer) {
                await new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src =
                        "https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js";
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }

            setLeafletLoaded(true);
        };

        loadLeaflet();
    }, []);

    const generateAustralianHeatmapData = () => {
        const countsMap = new Map();

        dummySpendData.forEach((item) => {
            if (item.receiverLat !== null && item.receiverLng !== null) {
                const roundedLat = item.receiverLat.toFixed(2);
                const roundedLng = item.receiverLng.toFixed(2);
                const key = `${roundedLat}_${roundedLng}`;
                countsMap.set(key, (countsMap.get(key) || 0) + 15);
            }
        });

        const heatmapData = [];
        countsMap.forEach((count, key) => {
            const [latStr, lngStr] = key.split("_");
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            heatmapData.push([lat, lng, count]);
        });

        return heatmapData;
    };

    useEffect(() => {
        if (!leafletLoaded || mapLoaded) return;

        const L = window.L;

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        const australiaBounds = L.latLngBounds(
            L.latLng(-50, 85), // South-West corner: Latitude for Tasmania's south, Longitude just west of WA
            L.latLng(-9, 160) // North-East corner: Latitude for top of NT, Longitude just east of QLD
        );

        const map = L.map(mapRef.current, {
            center: australiaPosition,
            zoom: 5,
            minZoom: 4,
            maxZoom: 10,
            maxBounds: australiaBounds,
            maxBoundsViscosity: 1.0,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            bounds: australiaBounds,
        }).addTo(map);

        const heatmapData = generateAustralianHeatmapData();

        L.heatLayer(heatmapData, {
            radius: 20,
            blur: 12,
            maxZoom: 10,
            gradient: {
                0.0: "#0000ff", // Blue for low count
                0.2: "#00ffff", // Cyan
                0.4: "#00ff00", // Green
                0.6: "#ffff00", // Yellow
                0.8: "#ff8000", // Orange
                1.0: "#ff0000", // Red for high count
            },
        }).addTo(map);

        map.fitBounds(australiaBounds, { padding: [20, 20] });

        map.on("drag", function () {
            map.panInsideBounds(australiaBounds, { animate: false });
        });

        setMapLoaded(true);

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [leafletLoaded]);

    return (
        <div>
            {!leafletLoaded && (
                <div
                    style={{
                        height: "80vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "10px",
                    }}
                >
                    Loading map libraries...
                </div>
            )}
            <div
                ref={mapRef}
                style={{
                    height: "80vh",
                    width: "100%",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    display: leafletLoaded ? "block" : "none",
                }}
            />
        </div>
    );
}

export default HeatMap;
