
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


/*

//const mysql = require('mysql2/promise');
// require('dotenv').config();

import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';



dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

// module.exports = pool;

export { pool };

*/