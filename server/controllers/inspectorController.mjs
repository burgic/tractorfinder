import { openDb } from '../db.mjs';
import dotenv from 'dotenv';
import axios from 'axios';
import csv from 'csv-parser';
import path, { parse } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { pipeline } from 'stream';
import { createReadStream } from 'fs';
import { geocodePostcode, getCountryCode } from './geoCoding.mjs';
import { importInspectorsFromCSV } from './importInspectorsFromCSV.mjs';
import { response } from 'express';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });



const validateInspectorData = (data) => {
    const { name, contact_info, postcode, country, brands_inspected, cost_mile } = data;
    if (!name || !contact_info || !postcode || !country ||!brands_inspected ||!cost_mile) {
        throw new Error('Missing required fields');
    }
};


export const getInspectors = async (req, res) => {
    try {
        const db = await openDb();
        const inspectors = await db.all('SELECT * FROM inspectors');
        const parsedInspectors = inspectors.map(inspector => ({
            ...inspector,
            brands_inspected: JSON.parse(inspector.brands_inspected)
        }));
        res.json(parsedInspectors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


export const createInspector = async (req, res) => {
    const { name, contact_info, country, postcode, brands_inspected, cost_mile, latitude, longitude } = req.body;
    try {
        validateInspectorData(req.body);
        const countryCode = await getCountryCode(country);
        const geocodedLocation = await geocodePostcode(postcode, countryCode);
        const { latitude, longitude } = geocodedLocation;
        // const latitude = 0.0; // Default value for latitude
        // const longitude = 0.0; // Default value for longitude
        // const { latitude, longitude } = await geocodePostcode(postcode, country);

        console.log('brands_inspected before stringfy:', brands_inspected);

        const brandsJSON = JSON.stringify(brands_inspected);

        console.log('brands_inspected after stringfy:', brandsJSON);
        console.log('Geocoded data:', { latitude, longitude })

        const db = await openDb();
        const result = await db.run(
            'INSERT INTO inspectors (name, contact_info, country, postcode, brands_inspected, cost_mile, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, contact_info, country, postcode, brandsJSON, cost_mile, latitude, longitude]
        );
        // const inspector = await db.get('SELECT * FROM inspectors WHERE id = last_insert_rowid()');
        console.log(`Inspector created with ID: ${result.lastID}, Latitude: ${latitude}, Longitude: ${longitude}`);
        res.json({ success: true, message: 'Inspector created successfully', inspectorId: result.lastID});
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({error: 'Server Error', details: error.message });
    }
};

export const getInspectorById = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await openDb();
        const inspector = await db.get('SELECT * FROM inspectors WHERE id = ?', [id]);
        const parsedInspectors = inspectors.map(inspector => ({
            ... inspector,
            brands_inspected: JSON.parse(inspector.brands_inspected)
        }));
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
        const { name, contact_info, country, postcode, brands_inspected, cost_mile } = req.body;
    try {

        const countryCode = await getCountryCode(country);
        const { latitude, longitude } = await geocodePostcode(postcode, countryCode);
        const db = await openDb();
        await db.run(
            'UPDATE inspectors SET name = ?, contact_info = ?, country = ?, postcode = ?, brands_inspected = ?, cost_mile = ?, latitude = ?, longitude =? WHERE id = ?',
            [name, contact_info, country, postcode, brands_inspected, cost_mile, latitude, longitude, id]
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

export const calculateAndGetInspectorsByDistance = async (req, res) => {
    try {
        console.log('Received request:', req.query);

        const { postcode, country, brands_inspected, limit = 10, offset = 0, sortBy = 'distance', sortOrder = 'asc' } = req.query;
        
        const parsedLimit = parseInt(limit);
        const parsedOffset = parseInt(offset) || 0;
        console.log('Received offset:', offset, 'Parsed offset:', parsedOffset);
        
        if (isNaN(parsedLimit) || isNaN(parsedOffset) || parsedLimit < 1 || parsedOffset < 0) {
            return res.status(400).send('Invalid limit or offset');
        }

        if (!postcode || !country) {
            console.error('Missing postcode or country');
            return res.status(400).send('Missing postcode or country');
        }

        const { latitude, longitude } = await geocodePostcode(postcode, country);
    
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error('Invalid coordinates:', { latitude, longitude });
            return res.status(400).send('Invalid coordinates');
        }

        console.log('User location:', { latitude, longitude });

        const db = await openDb();

        let query = `
            SELECT *,
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
            FROM inspectors
        `;

        const queryParams = [latitude, longitude, latitude];

        if (brands_inspected && brands_inspected.length > 0) {
            const brandsArray = Array.isArray(brands_inspected) ? brands_inspected : [brands_inspected];
            query += ` WHERE (`;
            brandsArray.forEach((brand, index) => {
                if (index > 0) query += ' OR ';
                query += `json_valid(brands_inspected) AND json_extract(brands_inspected, '$') LIKE ?`;
                queryParams.push(`%${brand}%`);
            });
            query += ')';
        }

        query += ` ORDER BY ${sortBy === 'distance' ? 'distance' : 'name'} ${sortOrder.toUpperCase()}`;
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parsedLimit, parsedOffset);

        const inspectors = await db.all(query, queryParams);
        console.log('Inspectors:', inspectors.length);

        const totalCountResult = await db.get('SELECT COUNT(*) as count FROM inspectors');
        const totalCount = totalCountResult.count;

        const response = {
            origin: { latitude, longitude },
            inspectors: inspectors.map(inspector => ({
                ...inspector,
                distance: parseFloat(inspector.distance.toFixed(2)),
                latitude: parseFloat(inspector.latitude),
                longitude: parseFloat(inspector.longitude),
                brands_inspected: JSON.parse(inspector.brands_inspected).map(brand => 
                    typeof brand === 'object' ? JSON.stringify(brand) : brand
                )
            })),
            totalCount: totalCount
        };

        console.log('Response object:', JSON.stringify(response, null, 2));

        return res.json(response);
    } catch (error) {
        console.error('Error in calculateAndGetInspectorsByDistance:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};


export const getCountries = async (req, res) => {
    try {
        const db = await openDb();
        const countries = await db.all('SELECT country_name, country_code FROM country_codes');
        console.log('Fetched country codes:', countries);
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).send('Server Error');
    }
};

export const getBrands = async (req, res) => {
    try {
        const db = await openDb();
        const brands = await db.all('SELECT brand_name FROM brands');
        console.log('Fetched brands:', brands);
        res.json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).send('Server Error');

    }
};

export const cleanupInspectorData = async () => {
    try {
        const db = await openDb();
        const inspectors = await db.all('SELECT id, brands_inspected FROM inspectors');
        
        for (const inspector of inspectors) {
            let brandsArray;
            try {
                brandsArray = JSON.parse(inspector.brands_inspected);
            } catch (e) {
                // If it's not valid JSON, assume it's a comma-separated string
                brandsArray = inspector.brands_inspected.split(',').map(brand => brand.trim());
            }
            
            const brandsJSON = JSON.stringify(brandsArray);
            
            await db.run('UPDATE inspectors SET brands_inspected = ? WHERE id = ?', [brandsJSON, inspector.id]);
        }
        
        console.log('Inspector data cleanup completed');
    } catch (error) {
        console.error('Error in cleanupInspectorData:', error);
    }
};

/*

 const totalCountResult = await db.get(`
            SELECT COUNT(*) as count
            FROM inspectors
        `);
        const totalCount = totalCountResult.count;

        const inspectors = await db.all(`
            SELECT *, 
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
            FROM inspectors
            ORDER BY distance ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
            LIMIT ? OFFSET ?
        `, [latitude, longitude, latitude, parsedLimit, parsedOffset]);
        console.log('Inspectors:', inspectors.length);

        let inspectorsWithDistance = inspectors.map(inspector => ({
            ...inspector,
            distance: parseFloat(inspector.distance.toFixed(2)),
            latitude: parseFloat(inspector.latitude),
            longitude: parseFloat(inspector.longitude)
        }));

        const response = {
            origin: { latitude, longitude },
            inspectors: inspectorsWithDistance,
            totalCount: totalCount
        };

        

        Sort the inspectors
        inspectorsWithDistance.sort((a, b) => {
            if (sortBy === 'distance') {
                return sortOrder === 'asc' ? a.distance - b.distance : b.distance - a.distance;
            } else if (sortBy === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            // Add more sorting conditions as needed
        });
        
        // const totalCountResult = await db.get('SELECT COUNT(*) as count FROM inspectors');
        // const totalCount = totalCountResult.count;

        // Apply offset and limit the results
        // const startIndex = parseInt(offset);
        // const endIndex = startIndex + parseInt(limit);
        // inspectorsWithDistance = inspectorsWithDistance.slice(parsedOffset, parsedOffset + parsedLimit);

        console.log('Inspectors with distance before sending:', inspectorsWithDistance);

        const response = {
            origin: { latitude, longitude },
            inspectors: inspectorsWithDistance.map(inspector => ({
                ...inspector,
                latitude: parseFloat(inspector.latitude),
                longitude: parseFloat(inspector.longitude),
                distance: inspector.distance !== undefined ? parseFloat(inspector.distance.toFixed(2)) : null
            })),
            totalCount: totalCount
        };

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

export const getInspectorsByDistance = async (req, res) => {
    console.log('getInspectorsByDistance called')
    try {

        console.log('Received request:', req.query);
        
        const { postcode, country, limit = 5 } = req.query;

        if (!postcode || !country) {
            console.error('Missing postcode');
            return res.status(400).send('Missing postcode or country');
        }

        // geocode users postcode
        const { latitude, longitude } = await geocodePostcode(postcode, country);

        console.log('User location:', { latitude, longitude });

        const db = await openDb();
        const inspectors = await db.all('SELECT * FROM inspectors');
        console.log('Inspectors from DB:', inspectors);

        const destinations = inspectors.map(inspector => {
            const dest = `${inspector.latitude},${inspector.longitude}`;
            console.log('Destination:', dest);
            return dest;
        }).join('|');

        if (!destinations) {
            return res.status(400).send('No inspectors found');
        }

    function getRandomApiKey() {
        const keys = [
            process.env.DISTANCEMATRIX_API_KEY,
            process.env.DISTANCEMATRIX_API_KEY1,
            process.env.DISTANCEMATRIX_API_KEY2
        ];
    
        // Filter out any undefined keys
        const validKeys = keys.filter(key => key !== undefined);
    
        if (validKeys.length === 0) {
            throw new Error('No valid API keys found');
        }
    
        // Randomly select one of the valid keys
        const randomIndex = Math.floor(Math.random() * validKeys.length);
        return validKeys[randomIndex];
    }

        const apiKey = getRandomApiKey();
        const url = `https://api-v2.distancematrix.ai/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${destinations}&key=${apiKey}`;

        console.log('Distance Matrix API URL:', url);

        const response = await axios.get(url);

        console.log('Distance Matrix API response:', JSON.stringify(response.data, null,2));

        if (response.data.status !== 'OK') {
            throw new Error(`Distance Matrix API error: ${response.data.status}`);
        }

        const distances = response.data.rows[0].elements;

        console.log('Distances:', distances);

        const inspectorsWithDistance = inspectors.map((inspector, index) => ({
            ...inspector,
            distance: distances[index].distance ? distances[index].distance.text : 'N/A',
            duration: distances[index].duration ? distances[index].duration.text : 'N/A'
        }));

        inspectorsWithDistance.sort((a, b) => {
            if (a.distance === 'N/A') return 1;
            if (b.distance === 'N/A') return -1;
            return parseFloat(a.distance.replace(' km', '')) - parseFloat(b.distance.replace(' km', ''));
        });

        const closestInspectors = inspectorsWithDistance.slice(0, parseInt(limit));

        res.json(closestInspectors);
    } catch (error) {
        console.error('Error fetching inspectors by distance:', error);
        res.status(500).send('Server Error');
    }
}
*/



/*

export const importInspectorsFromCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const filePath = req.file.path;
    const inspectors = [];
    let errorCount = 0;

    const processRow = async (row) => {
            try {
                const { name, contact_info, country, postcode, brands_inspected, latitude, longitude } = row;
                
                validateInspectorData(row);
                
                let lat = latitude;
                let lng = longitude;

                if (!lat || !lng) {
                    const geocodedData = await geocodePostcode(postcode);
                    lat = geocodedData.latitude;
                    lng = geocodedData.longitude;
                }

                return { name, contact_info, country, postcode, brands_inspected, latitude: lat, longitude: lng };
            } catch (error) {
                console.error('Error processing row:', row, error);
                errorCount++;
                return null;
            }
        };

        try {
            await fs.promises.access(filePath);

            await pipeline(
                createReadStream(filePath),
                csv(),
                async function* (source) {
                    for await (const row of source) {
                        const processedRow = await processRow(row);
                        if (processedRow) {
                            inspectors.push(processedRow);
                        }
                        yield row;
                    }
                }
            );

        const db = await openDb();
        const insertStmt = db.prepare('INSERT INTO inspectors (name, contact_info, country, postcode, brands_inspected, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)');
        
        try {
        await db.run('BEGIN TRANSACTION');
            for (const inspector of inspectors) {
                insertStmt.run(inspector.name, inspector.contact_info, inspector.country, inspector.postcode, inspector.brands_inspected, inspector.latitude, inspector.longitude);
            }
            await db.run('COMMIT');
        } catch (err) {
            await db.run('ROLLBACK');
            throw err;
        }

        res.status(200).json({
            message: 'Inspectors imported successfully',
            count: inspectors.length,
            errors: errorCount
        });

        } catch (error) {
            console.error('Error inserting inspectors:', error);
            res.status(500).send('Server Error');
        } finally {
            // Clean up the uploaded file
            fs.unlinkSync(filePath);
        try {
            await fs.promises.unlink(filePath);
        } catch (unlinkError) {
            if (unlinkError.code !== 'ENOENT') {
            console.error('Error deleting file:', unlinkError);
            }
        }
};
}


export const importInspectorsFromCSV = async (req, res) => {
    const filePath = req.file.path;
    const inspectors = [];

    fs.createReadStream(filePath    
        .pipe(csvParser())
        .on('data', async (row) => {
            try {
                const { name, contact_info, postcode, brands_inspected } = row;
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
                fs.unlinkSync(filePath);
            }
        });
};


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
