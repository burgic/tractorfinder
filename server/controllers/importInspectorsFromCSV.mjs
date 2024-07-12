import fs from 'fs';
import { pipeline } from 'stream';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { geocodePostcode } from './geoCoding.mjs';
import { openDb } from '../db.mjs';

const validateInspectorData = (data) => {
    const { name, contact_info, postcode, country, brands_inspected } = data;
    if (!name || !contact_info || !postcode || !country || !brands_inspected) {
        throw new Error('Missing required fields');
    }
};

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

