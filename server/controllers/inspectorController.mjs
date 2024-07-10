
import { openDb } from '../db.mjs';
import dotenv from 'dotenv';
import axios from 'axios';
import CSVParser from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });



const validateInspectorData = (data) => {
    const { name, contact_info, postcode, brands_inspected } = data;
    if (!name || !contact_info || !postcode || !brands_inspected) {
        throw new Error('Missing required fields');
    }
};


export const getInspectors = async (req, res) => {
    try {
        const db = await openDb();
        const inspectors = await db.all('SELECT * FROM inspectors');
        res.json(inspectors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export const createInspector = async (req, res) => {
    try {
        validateInspectorData(req.body);
        const { name, contact_info, postcode, brands_inspected } = req.body;
        // const latitude = 0.0; // Default value for latitude
        // const longitude = 0.0; // Default value for longitude
        const { latitude, longitude } = await geocodePostcode(postcode);

        console.log('Geocoded data:', { latitude, longitude })

        const db = await openDb();
        const result = await db.run(
            'INSERT INTO inspectors (name, contact_info, postcode, brands_inspected, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
            [name, contact_info, postcode, brands_inspected, latitude, longitude]
        );
        const inspector = await db.get('SELECT * FROM inspectors WHERE id = last_insert_rowid()');
        res.json(inspector);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send({error: 'Server Error', details: error.message });
    }
};

export const getInspectorById = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await openDb();
        const inspector = await db.get('SELECT * FROM inspectors WHERE id = ?', [id]);
        if (inspector) {
            res.json(inspector);
        } else {
            res.status(404).send('Inspector not found');
        }
    } catch(error) {
        console.error('Error fetching inspector:', error);
    }
}

export const updateInspector = async (req, res) => {
        const { id } = req.params;
        const { name, contact_info, postcode, brands_inspected } = req.body;
    try {
        const db = await openDb();
        await db.run(
            'UPDATE inspectors SET name = ?, contact_info = ?, postcode = ?, brands_inspected = ?, latitude = ?, longitude =? WHERE id = ?',
            [name, contact_info, postcode, brands_inspected, latitude, longitude, id]
        );
        const inspector = await db.get('SELECT * FROM inspectors WHERE id = ?', [id]);
        res.json(inspector);
    } catch (error) {
        console.error('Error in updateInspector:', error);
        res.status(500).send('Server Error');
    }
};



export const deleteInspector = async (req, res) => {
        const { id } = req.params;
    try {
        const db = await openDb();
        await db.run('DELETE FROM inspectors WHERE id = ?', [id]);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting inspector:', error);
        res.status(500).send('Server Error');
    }
};

const geocodePostcode = async (postcode) => {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${postcode}&key=${apiKey}`;

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

export const getInspectorsByDistance = async (req, res) => {
    try {

        console.log('Received request:', req.query);
        
        const { postcode, limit = 5 } = req.query;

        if (!postcode) {
            console.error('Missing postcode');
            return res.status(400).send('Missing postcode');
        }

        // geocode users postcode
        const { latitude, longitude } = await geocodePostcode(postcode);

        console.log('User location:', { latitude, longitude });

        const db = await openDb();
        const inspectors = await db.all('SELECT * FROM inspectors');
        console.log('Inspectors from DB:', inspectors);

        const destinations = inspectors.map(inspector => `${inspector.latitude},${inspector.longitude}`).join('|');
        if (!destinations) {
            return res.status(400).send('No inspectors found');
        }

        const apiKey = process.env.DISTANCEMATRIX_API_KEY;
        const url = `https://api-v2.distancematrix.ai/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${destinations}&key=${apiKey}`;

        console.log('Distance Matrix API URL:', url);

        const response = await axios.get(url);

        console.log('Distance Matrix API response:', response.data);

        if (response.data.status !== 'OK') {
            throw new Error(`Distance Matrix API error: ${response.data.status}`);
        }

        const distances = response.data.rows[0].elements;

        

        const inspectorsWithDistance = inspectors.map((inspector, index) => ({
            ...inspector,
            distance: distances[index].distance ? distances[index].distance.text : 'N/A',
            duration: distances[index].duration ? distances[index].duration.text : 'N/A'
        }));

        inspectorsWithDistance.sort((a, b) => 
            parseFloat(a.distance.replace(' km', '')) - parseFloat(b.distance.replace(' km', ''))
        );

        const closestInspectors = inspectorsWithDistance.slice(0, parseInt(limit));

        res.json(closestInspectors);
    } catch (error) {
        console.error('Error fetching inspectors by distance:', error);
        res.status(500).send('Server Error');
    }

};

export const importInspectorsFromCSV = async (req, res) => {
    const filePath = req.file.path;
    const inspectors = [];

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', async (row) => {
            try {
                const { name, contact_info, postcode, brands_inspected } = row;

                // Geocode the postcode to get latitude and longitude
                const { latitude, longitude } = await geocodePostcode(postcode);

                inspectors.push({ name, contact_info, postcode, brands_inspected, latitude, longitude });
            } catch (error) {
                console.error('Error processing row:', row, error);
            }
        })
        .on('end', async () => {
            try {
                const db = await openDb();
                const insertStmt = db.prepare('INSERT INTO inspectors (name, contact_info, postcode, brands_inspected, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)');

                db.transaction(() => {
                    inspectors.forEach((inspector) => {
                        insertStmt.run(inspector.name, inspector.contact_info, inspector.postcode, inspector.brands_inspected, inspector.latitude, inspector.longitude);
                    });
                })();

                res.send('Inspectors imported successfully');
            } catch (error) {
                console.error('Error inserting inspectors:', error);
                res.status(500).send('Server Error');
            } finally {
                // Clean up the uploaded file
                fs.unlinkSync(filePath);
            }
        });
};

/*

export const updateInspector = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact_info, postcode, brands_inspected } = req.body;
        const db = await openDb();
        await db.run(
            'UPDATE inspectors SET name = ?, contact_info = ?, postcode = ?, brands_inspected = ? WHERE id = ?',
            [name, contact_info, postcode, brands_inspected, id]
        );
        const inspector = await db.get('SELECT * FROM inspectors WHERE id = ?', [id]);
        res.json(inspector);
    } catch (error) {
        console.error('Error updating inspector:', error);
        res.status(500).send('Server Error');
    }
};

*/



/*

// import CreateInspector  from '../../tractor-inspector-finder/src/components/CreateInspector.js';
// const { getInspectors, createInspector, updateInspector, deleteInspector } = pkg;
// import pkg from 'pg';
// const { Pool } = pkg;
// import { pool } from '../db.mjs';
// const { Pool } = pkg;
// require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

exports.getInspectors = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inspectors');
        res.json(result.rows);
    } catch (error) {
        console.error(error)
            res.status(500).send('Server Error');
        }
    };


exports.createInspector = async (req, res) => {
    try {
        const { name, contact_info, postcode, brands_inspected } = req.body;
        const result = await pool.query(
            'INSERT INTO inspectors (name, contact_info, postcode, brands_inspected) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, contact_info, postcode, brands_inspected]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.updateInspector = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, contact_info, postcode, brands_inspected } = req.body;
        const result = await pool.query(
            'UPDATE inspectors SET name = $1, contact_info = $2, postcode = $3, brands_inspected = $4, WHERE id = $5 RETURNING *'
            [name, contact_info, postcode, brands_inspected, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteInspector = async(req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM inspectors WHERE id = $1', [id])
        res.sendStatus(204);
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error');
    }
};

// export default CreateInspector;


module.exports = {
    getInspectors, 
    createInspector,
    updateInspector,
    deleteInspector
}
    */

