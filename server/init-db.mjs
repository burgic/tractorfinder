import { openDb } from './db.mjs';

const initDb = async () => {
    try {
        const db = await openDb();
        await db.exec(`
            
            DROP TABLE IF EXISTS country_codes;
            
            CREATE TABLE IF NOT EXISTS inspectors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                contact_info TEXT,
                country TEXT,
                postcode TEXT,
                brands_inspected TEXT,
                latitude TEXT,
                longitude TEXT
            );
            
            CREATE TABLE IF NOT EXISTS country_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                country_name TEXT NOT NULL,
                country_code TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS brands (
                brand TEXT,
            );

            INSERT INTO country_codes (country_name, country_code) VALUES
                ('United States', 'US'),
                ('Canada', 'CA'),
                ('United Kingdom', 'GB'), 
                ('Australia', 'AU'),
                ('New Zealand', 'NZ'),
                ('Ireland', 'IE'),
                ('Italy', 'IT'),
                ('France', 'FR'),
                ('Germany', 'DE'),
                ('Spain', 'ES'),
                ('Portugal', 'PT'),
                ('Netherlands', 'NL'),
                ('Belgium', 'BE'),
                ('Switzerland', 'CH'),
                ('Austria', 'AT'),
                ('Denmark', 'DK'),
                ('Sweden', 'SE'),
                ('Norway', 'NO'),
                ('Finland', 'FI'),
                ('Poland', 'PL'),
                ('Czech Republic', 'CZ')

            INSERT INTO brands (brand) VALUES
                ('John Deere'),
                ('Case IH'),
                ('New Holland'),
                ('Massey Ferguson'),
                ('Kubota'),
                ('Caterpillar'),
                ('Fendt'),
                ('Valtra'),
                ('Claas'),
                ('Deutz-Fahr'),
                ('JCB'),
                ('McCormick')
              
                
        `);

        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
};

initDb();
