import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const inspectDatabase = async () => {
    const db = await open({
        filename: '/Users/christianburgin/Documents/projects/tractorFactor/projects/server/tractor_inspector.db',
        driver: sqlite3.Database
    });

    const inspectors = await db.all('SELECT * FROM inspectors');
    console.log(inspectors);

    await db.close();
};

inspectDatabase().catch(console.error);
