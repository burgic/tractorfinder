import express from 'express';
import bodyParser from 'body-parser';
import { openDb } from './db.mjs';
import { getInspectors, createInspector, getInspectorById, updateInspector, deleteInspector,  getCountries, calculateAndGetInspectorsByDistance } from './controllers/inspectorController.mjs'; // getInspectorsByDistance ,
import { importInspectorsFromCSV } from './controllers/importInspectorsFromCSV.mjs';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { createUploadsDir } from './config.mjs';



dotenv.config()

// configDotenv.config();

const app = express();


createUploadsDir();

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from the React app
}));




const upload = multer({ dest: 'uploads/' });

// app.get('/api/inspectors/distance', getInspectorsByDistance); 
app.get('/api/inspectors/distancecalc',calculateAndGetInspectorsByDistance);
app.get('/api/inspectors/:id', getInspectorById);
app.post('/api/inspectors/import', upload.single('file'), importInspectorsFromCSV);
app.get('/api/inspectors', getInspectors);
app.get('/api/countries', getCountries);
app.get('/api/country-codes', getCountries);
app.put('/api/inspectors/:id', updateInspector);
app.post('/api/inspectors', createInspector);
app.delete('/api/inspectors/:id', deleteInspector);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server running on http://localhost:3001');

});



/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now() + '.csv');
    }
});
/*
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
            return cb(new Error('File must be a CSV'));
        }
        cb(null, true);
    }
});

*/

/*

app.get('/api/inspectors', inspectorController.getInspectors);
app.post('/api/inspectors', inspectorController.createInspector);
app.put('/api/inspectors/:id', inspectorController.updateInspector);
app.delete('api/inspectors/:id', inspectorController.deleteInspector);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    prot: process.env.DB_PORT
});

app.use(bodyParser.json());

app.get('/api/inspectors', async (req, res) => {
    const result = await pool.query('SELECT * FROM inspectors');
    res.json(result.rows);
});

app.post('/api/inspectors', async (req, res) => {
    const { name, contact_info, postcode, brands_inspected } = req.body;
    const result = await pool.query(
    'INSERT INTO inspectors (name, contact_info, postcode, brands_inspected) VALUES ($1, $2, $3) RETURNING *',
    [name, contact_info, postcode, brands_inspected]
    );
    res.json(result.rows[0]);
});

app.put('/api/inspectors/:id', async(req, res) => {
    const { id } = req.params;
    const { name, contact_info, postcode, brands_inspected } = req.body;
    const result = await pool.query(
        'UPDATE inspectors SET name = $1, contact_info = $2, postcode = $3, brands_inspected = $4, WHERE id = $5 RETURNING *', 
        [name, contact_info, postcode, brands_inspected, id]
    );
    res.json(result.rows[0]);
});

app.delete('/api/inspectors/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM inspectors WHERE id = $1', [id]);
    res.sendStatus(204);
});
*/