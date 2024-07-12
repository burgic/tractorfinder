import { openDb } from './db.mjs';

const initDb = async () => {
    try {
        const db = await openDb();
        await db.exec(`

            
        DROP TABLE IF EXISTS country_codes;
        DROP TABLE IF EXISTS inspectors;
        DROP TABLE IF EXISTS brands;

        CREATE TABLE IF NOT EXISTS inspectors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            contact_info TEXT,
            country TEXT,
            postcode TEXT,
            brands_inspected TEXT,
            latitude REAL,
            longitude REAL
        );

        CREATE TABLE IF NOT EXISTS country_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            country_name TEXT NOT NULL,
            country_code TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
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
            ('Czech Republic', 'CZ');

        INSERT INTO brands (name) VALUES 
            ('Kubota'), 
            ('Caterpillar'), 
            ('Fendt'), 
            ('Valtra'), 
            ('Claas'), 
            ('Deutz-Fahr'), 
            ('JCB'), 
            ('McCormick');

        INSERT INTO inspectors (name, contact_info, country, postcode, brands_inspected, latitude, longitude) VALUES
            ('Suffolk Plant Machinery Ltd', 'email', 'United Kingdom', 'IP13 8BL', 'New Holland', 1.3214367, 52.2926336),
            ('Andrew Carr', 'email', 'United Kingdom', 'EH2 1JE', 'New Holland', -2.4289027, 55.6093057),
            ('Woldside Plant and Agri', 'email', 'United Kingdom', 'EH2 1JE', 'New Holland', -0.0174669, 53.3223141),
            ('RD Haslam', 'email', 'United Kingdom', 'EH2 1JE', 'New Holland', -1.7998831, 52.9494017),
            ('BriggsThomas Engineering ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', -2.5717686, 52.5003116),
            ('JM Dixon Engineering', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', -2.8816132, 54.2217706),
            ('Logan Agri & Plant Services', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', -3.0173169, 57.5733042),
            ('John Gray Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', -1.7092937, 55.4158116),
            ('Westbrook Commercials Limited', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', -2.1340277, 51.3678774),
            ('Rea Valley Tractors', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson', -2.4517532, 53.1569365),
            ('Lloyd Ltd Penrith', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson', -2.7715965, 54.6699758),
            ('Oliver Plant Services Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson', -1.7187782, 55.3145345),
            ('Bowland Tractors Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson', -2.9281635, 53.0754142),
            ('Shaun Colley', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson', -1.5334128, 53.5971791),
            ('R & L Miller', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere', -4.6592465, 55.6866074),
            ('France Agri', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere', -2.87574, 53.9179437),
            ('Cliff Jenkins Agri Services Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere', -4.5059286, 51.8697654),
            ('Malpas Tractors (Wrexham) Ltd.', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere', -2.940492, 53.0371584),
            ('R&R Machinery - Lanark (Formerly Ross of Lanark)', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere', -2.2558442, 53.1371937),
            ('Peter Cliff & Sons Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere', -2.2558442, 53.1371937),
            ('Ravenhill Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH', -2.2118688, 57.2083549),
            ('Ravenhill Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH', -2.2118688, 57.2083549),
            ('Ravenhill Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH', -2.1421103, 57.5209064),
            ('Ravenhill Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH', -2.456972, 57.541621),
            ('Ross Agri Services', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH', -2.4626228, 57.5333599),
            ('Ross Agri Services Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH', -2.4189793, 56.7791384),
            ('Meredith Davies Agri Repairs Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH', -4.0154815, 52.0227331),
            ('Adcock Agri Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar', 0.6228457, 51.6505373),
            ('M M R Engineering', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar', -4.2398288, 56.1247556),
            ('Thurlow Nunn Standen Kennett', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar', 0.4930652, 52.2711622),
            ('James Green Farm Machinery Ltd - JGFM', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar', -1.9796914, 52.2146649),
            ('Matthew Jones', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar', -1.9796914, 52.2146649)
            ;

        `);

        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
};

initDb();
