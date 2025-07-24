import { MapContainer, TileLayer } from "react-leaflet";
import { useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";

function HeatMap({ }) {
    const mapRef = useRef(null);

    const australiaBounds = [
        [-43.00311, 113.6594],
        [-10.6897, 153.61194],
    ];

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    }, []);

    return (
        <MapContainer
            className="markercluster-map mt-10"
            center={[-25.2744, 133.7751]}
            maxZoom={18}
            minZoom={4}
            maxBounds={australiaBounds}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            style={{ height: '80vh', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}

export default HeatMap;