    /*
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
