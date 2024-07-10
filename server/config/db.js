/*

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = pool;



import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.resolve('./tractor_inspector.db');

const openDb = async () => {
    return open({
        filename: dbPath,
        driver: sqlite3.Database
    });
};

export { openDb };

*/