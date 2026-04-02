import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let loader;
let isLoaded = false;

/**
 * Initialize Google Maps API
 */
export const initGoogleMaps = async () => {
    if (isLoaded) return;

    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API key not found');
        return;
    }

    loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geometry'],
    });

    try {
        await loader.load();
        isLoaded = true;
    } catch (error) {
        console.error('Error loading Google Maps:', error);
        throw error;
    }
};

/**
 * Geocode address to coordinates
 */
export const geocodeAddress = async (address) => {
    await initGoogleMaps();

    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng(),
                    formattedAddress: results[0].formatted_address,
                });
            } else {
                reject(new Error('Geocoding failed: ' + status));
            }
        });
    });
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (lat, lng) => {
    await initGoogleMaps();

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    return new Promise((resolve, reject) => {
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
                // Get city name
                const addressComponents = results[0].address_components;
                const city = addressComponents.find(
                    (component) =>
                        component.types.includes('locality') ||
                        component.types.includes('administrative_area_level_2')
                );

                resolve({
                    formattedAddress: results[0].formatted_address,
                    city: city?.long_name || 'Unknown',
                });
            } else {
                reject(new Error('Reverse geocoding failed: ' + status));
            }
        });
    });
};

/**
 * Calculate distance between two points (using Haversine formula)
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRad = (value) => {
    return (value * Math.PI) / 180;
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
};
