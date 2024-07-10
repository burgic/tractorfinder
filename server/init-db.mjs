import { openDb } from './db.mjs';

const initDb = async () => {
    try {
        const db = await openDb();
        await db.exec(`
            DROP TABLE IF EXISTS inspectors;
            CREATE TABLE inspectors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                contact_info TEXT,
                postcode TEXT,
                brands_inspected TEXT,
                latitude TEXT,
                longitude TEXT
            );
        `);
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
};

initDb();
