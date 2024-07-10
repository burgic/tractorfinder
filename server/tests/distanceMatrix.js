import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine the directory name in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const testDistanceMatrix = async () => {
    try {
        const originLatitude = 51.4822656; // Replace with your test latitude
        const originLongitude = -0.1933769; // Replace with your test longitude
        const destinations = '51.4994794,-0.1269979'; // Replace with your test destinations

        const apiKey = process.env.DISTANCEMATRIX_API_KEY;
        console.log('Distance Matrix API Key:', apiKey); // Log the API key

        if (!apiKey) {
            throw new Error('API key not found in environment variables');
        }

        const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${originLatitude},${originLongitude}&destinations=${destinations}&key=${apiKey}`;

        console.log('Distance Matrix API URL:', url); // Log the API URL

        const response = await axios.get(url);
        console.log('Distance Matrix API response:', response.data); // Log the API response

        if (response.data.status !== 'OK') {
            throw new Error(`Distance Matrix API error: ${response.data.status}`);
        }

        const distances = response.data.rows[0].elements;
        console.log('Distances:', distances);
    } catch (error) {
        console.error('Error in Distance Matrix API:', error.response ? error.response.data : error.message);
    }
};

testDistanceMatrix();
