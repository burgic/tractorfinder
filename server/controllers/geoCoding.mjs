import axios from 'axios';
import dotenv from 'dotenv';
import { openDb } from '../db.mjs';


export const geocodePostcode = async (postcode, countryCode) => {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${postcode},${countryCode}&key=${apiKey}`;

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
        console.error('Error in geocoding:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCountryCode = async (country) => {
    const db = await openDb();
    try{
    const result = await db.get('SELECT country_code FROM country_codes WHERE country_name = ?', [country]);
    if (!result) {
            throw new Error('Country code not found');
        }
        return result.country_code;
    } catch (error) {
        console.error(`Country code not found for country: ${country}`);
        throw new Error('Country code not found');
    }
};

