import express from 'express';
import bodyParser from 'body-parser';
import { openDb } from './db.mjs';
// import pkg from 'pg';
// const { Pool } = pkg;
import { getInspectors, createInspector, getInspectorById, updateInspector, deleteInspector } from './controllers/inspectorController.mjs'; 
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config()

// configDotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from the React app
}));


app.get('/api/inspectors', getInspectors);
app.get('/api/inspectors/:id', getInspectorById);
app.post('/api/inspectors', createInspector);
app.put('/api/inspectors/:id', updateInspector);
app.delete('/api/inspectors/:id', deleteInspector);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server running on http://localhost:3001');

});

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