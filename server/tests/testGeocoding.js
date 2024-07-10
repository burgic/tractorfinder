import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const geocodePostcode = async (postcode) => {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(postcode)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const { results } = response.data;

        if (results && results.length > 0) {
            const { lat, lng } = results[0].geometry;
            return { latitude: lat, longitude: lng };
        } else {
            throw new Error('Geocoding failed');
        }
    } catch (error) {
        console.error('Error in geocoding:', error);
    }
};

// Test the geocodePostcode function with a sample postcode
const testGeocode = async () => {
    const postcode = 'eh2 1je'; // Replace with a sample postcode
    const location = await geocodePostcode(postcode);
    console.log('Geocoded location:', location);
};

testGeocode();
