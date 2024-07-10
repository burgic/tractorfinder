/* const axios = require('axios');
import axios from 'axios';


describe('InspectorFind Component', () => {
    const baseURL = 'http://localhost:3001/api/inspectors/distance';

    test('should return a list of inspectors for a valid postcode', async () => {
        const postcode = 'EH2 1JE';
        const response = await axios.get(baseURL, { params: { postcode } });

        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBeGreaterThan(0);

        response.data.forEach(inspector => {
            expect(inspector).toHaveProperty('name');
            expect(inspector).toHaveProperty('contact_info');
            expect(inspector).toHaveProperty('postcode');
            expect(inspector).toHaveProperty('brands_inspected');
            expect(inspector).toHaveProperty('distance');
        });
    });

    test('should return 404 for an invalid postcode', async () => {
        const postcode = 'INVALID_POSTCODE';
        try {
            await axios.get(baseURL, { params: { postcode } });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toBe('Inspector not found');
        }
    });

    test('should return 400 for a missing postcode', async () => {
        try {
            await axios.get(baseURL);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Missing postcode');
        }
    });
});

*/