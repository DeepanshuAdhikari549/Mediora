import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export const googleMapsService = {
  /**
   * Geocode an address to get coordinates
   */
  async geocodeAddress(address) {
    try {
      const response = await client.geocode({
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
          formattedAddress: response.data.results[0].formatted_address,
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  },

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(lat, lng) {
    try {
      const response = await client.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Failed to reverse geocode');
    }
  },

  /**
   * Calculate distance between two points (in km)
   */
  async getDistance(origin, destination) {
    try {
      const response = await client.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.rows[0].elements[0].status === 'OK') {
        return {
          distance: response.data.rows[0].elements[0].distance.value / 1000, // Convert to km
          duration: response.data.rows[0].elements[0].duration.text,
        };
      }
      return null;
    } catch (error) {
      console.error('Distance calculation error:', error);
      throw new Error('Failed to calculate distance');
    }
  },

  /**
   * Calculate distance between coordinates (Haversine formula)
   * Faster than API call for simple distance
   */
  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },
};
