import express from 'express';
import { googleMapsService } from '../services/googleMapsService.js';

const router = express.Router();

/**
 * GET /api/location/nearby
 * Get nearby hospitals based on user coordinates
 */
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 10 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = parseFloat(radius);

        // Import Hospital model
        const Hospital = (await import('../models/Hospital.js')).default;

        // Find nearby hospitals using geospatial query
        const hospitals = await Hospital.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: radiusKm * 1000, // Convert km to meters
                },
            },
            verified: true,
        }).limit(20);

        // Calculate actual distance for each hospital
        const hospitalsWithDistance = hospitals.map((hospital) => {
            const distance = googleMapsService.calculateDistanceKm(
                latitude,
                longitude,
                hospital.location.coordinates[1],
                hospital.location.coordinates[0]
            );

            return {
                ...hospital.toObject(),
                distance,
            };
        });

        res.json({
            success: true,
            count: hospitalsWithDistance.length,
            hospitals: hospitalsWithDistance,
        });
    } catch (error) {
        console.error('Nearby search error:', error);
        res.status(500).json({ error: 'Failed to search nearby hospitals' });
    }
});

/**
 * POST /api/location/geocode
 * Convert address to coordinates
 */
router.post('/geocode', async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const result = await googleMapsService.geocodeAddress(address);

        if (!result) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ error: 'Failed to geocode address' });
    }
});

/**
 * POST /api/location/reverse-geocode
 * Convert coordinates to address
 */
router.post('/reverse-geocode', async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const address = await googleMapsService.reverseGeocode(parseFloat(lat), parseFloat(lng));

        if (!address) {
            return res.status(404).json({ error: 'No address found' });
        }

        res.json({
            success: true,
            address,
        });
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        res.status(500).json({ error: 'Failed to reverse geocode' });
    }
});

/**
 * GET /api/location/distance
 * Calculate distance between two points
 */
router.get('/distance', async (req, res) => {
    try {
        const { lat1, lng1, lat2, lng2 } = req.query;

        if (!lat1 || !lng1 || !lat2 || !lng2) {
            return res.status(400).json({ error: 'All coordinates are required' });
        }

        const distance = googleMapsService.calculateDistanceKm(
            parseFloat(lat1),
            parseFloat(lng1),
            parseFloat(lat2),
            parseFloat(lng2)
        );

        res.json({
            success: true,
            distance,
            unit: 'km',
        });
    } catch (error) {
        console.error('Distance calculation error:', error);
        res.status(500).json({ error: 'Failed to calculate distance' });
    }
});

export default router;
