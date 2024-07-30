// Using CommonJS syntax if ES Modules are not configured
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function inspectDatabase() {
    const db = await open({
        filename: '/Users/christianburgin/Documents/projects/tractorFactor/projects/server/tractor_inspector.db',
        driver: sqlite3.Database
    });

    try {
        const inspectors = await db.all('SELECT * FROM inspectors');
        console.log(inspectors);
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        await db.close();
    }
}

inspectDatabase().catch(console.error);
