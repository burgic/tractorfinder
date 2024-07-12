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

            CREATE TABLE IF NOT EXISTS country_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                country_name TEXT NOT NULL,
                country_code TEXT NOT NULL
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
                ('Czech Republic', 'CZ'),
                ('Slovakia', 'SK'),
                ('Hungary', 'HU'),
                ('Romania', 'RO'),
                ('Bulgaria', 'BG'),
                ('Greece', 'GR'),
                ('Turkey', 'TR'),
                ('Russia', 'RU'),
                ('Japan', 'JP'),
                ('China', 'CN'),
                ('South Korea', 'KR'),
                ('India', 'IN'),
                ('Brazil', 'BR'),
                ('Mexico', 'MX'),
                ('South Africa', 'ZA'),
                ('Nigeria', 'NG'),
                ('Egypt', 'EG'),
                ('Kenya', 'KE'),
                ('Ghana', 'GH'),
                ('Morocco', 'MA'),
                ('Argentina', 'AR'),
                ('Chile', 'CL'),
                ('Colombia', 'CO'),
                ('Peru', 'PE'),
                ('Venezuela', 'VE'),
                ('Saudi Arabia', 'SA'),
                ('United Arab Emirates', 'AE'),
                -- Add more countries as needed
            ;
        `);

        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
};

initDb();
