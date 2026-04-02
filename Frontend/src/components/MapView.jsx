import { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';

const libraries = ['places'];

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 30.3165, // Dehradun
    lng: 78.0322,
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f5f1e6' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#616161' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9e9e9e' }],
        },
    ],
};

export default function MapView({ hospitals = [], center = defaultCenter, zoom = 13, onMarkerClick, userLocation }) {
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [map, setMap] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMarkerClick = (hospital) => {
        setSelectedHospital(hospital);
        if (onMarkerClick) {
            onMarkerClick(hospital);
        }
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {/* User location marker */}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={{
                        path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                        fillColor: '#3B82F6',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 3,
                        scale: 10,
                    }}
                    title="You are here"
                />
            )}

            {/* Hospital markers */}
            {hospitals.map((hospital) => (
                <Marker
                    key={hospital._id}
                    position={{
                        lat: hospital.location.coordinates[1],
                        lng: hospital.location.coordinates[0],
                    }}
                    onClick={() => handleMarkerClick(hospital)}
                    icon={{
                        url: hospital.type === 'lab'
                            ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwOTY4OCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2Ij48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVzMS4xMi0yLjUgMi41LTIuNSAyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+'
                            : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzE5NzZEMiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2Ij48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVzMS4xMi0yLjUgMi41LTIuNSAyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+',
                        scaledSize: new window.google.maps.Size(36, 36),
                    }}
                />
            ))}

            {/* Info window for selected hospital */}
            {selectedHospital && (
                <InfoWindow
                    position={{
                        lat: selectedHospital.location.coordinates[1],
                        lng: selectedHospital.location.coordinates[0],
                    }}
                    onCloseClick={() => setSelectedHospital(null)}
                >
                    <div className="p-2 max-w-xs">
                        <h3 className="font-semibold text-base mb-1">{selectedHospital.name}</h3>
                        <p className="text-sm text-neutral-600 mb-2 flex items-start gap-1">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{selectedHospital.address}</span>
                        </p>
                        {selectedHospital.phone && (
                            <p className="text-sm text-neutral-600 mb-2 flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                <a href={`tel:${selectedHospital.phone}`} className="hover:text-primary">
                                    {selectedHospital.phone}
                                </a>
                            </p>
                        )}
                        {selectedHospital.distance && (
                            <p className="text-xs font-medium text-primary mb-2">
                                {selectedHospital.distance.toFixed(1)} km away
                            </p>
                        )}
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.location.coordinates[1]},${selectedHospital.location.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            <Navigation className="w-3.5 h-3.5" />
                            Get Directions
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
