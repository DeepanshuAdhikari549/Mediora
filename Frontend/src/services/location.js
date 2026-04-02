import { useState, useEffect } from 'react';

/**
 * Get user's current location using browser geolocation
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            },
            (error) => {
                let message = 'Unable to get your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out';
                        break;
                }
                reject(new Error(message));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
};

/**
 * Hook to get and track user's location
 */
export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const position = await getCurrentLocation();
            setLocation(position);
            return position;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { location, loading, error, getLocation };
};

/**
 * Check if geolocation is available
 */
export const isGeolocationAvailable = () => {
    return 'geolocation' in navigator;
};

/**
 * Request location permission
 */
export const requestLocationPermission = async () => {
    if (!isGeolocationAvailable()) {
        throw new Error('Geolocation is not supported by your browser');
    }

    try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
        // Fallback: try to get location directly
        try {
            await getCurrentLocation();
            return 'granted';
        } catch {
            return 'denied';
        }
    }
};
