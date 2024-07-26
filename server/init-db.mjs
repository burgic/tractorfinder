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
            brand_name TEXT
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

        INSERT INTO brands (brand_name) VALUES 
            ('Kubota'), 
            ('Caterpillar'), 
            ('Fendt'), 
            ('Valtra'), 
            ('Claas'), 
            ('Deutz-Fahr'), 
            ('Massey Ferguson'),
            ('John Deere'),
            ('Case IH'),
            ('New Holland'),
            ('JCB'), 
            ('McCormick');

        INSERT INTO inspectors (name, contact_info, country, postcode, brands_inspected, latitude, longitude) VALUES
            ('BriggsThomas Engineering ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt',52.5003116,-2.5717686),
            ('JM Dixon Engineering', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt',54.2217706,-2.8816132),
            ('Logan Agri & Plant Services', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', 57.5733042,-3.0173169),
            ('John Gray Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', 55.4158116,-1.7092937),
            ('Westbrook Commercials Limited', 'email', 'United Kingdom', 'EH2 1JE', 'Fendt', 51.3678774,-2.1340277),
            ('Rea Valley Tractors', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson', 53.1569365,-2.4517532),
            ('Lloyd Ltd Penrith', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson', 54.6699758,-2.7715965),
            ('Oliver Plant Services Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson',55.3145345,-1.7187782),
            ('Bowland Tractors Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson',53.0754142,-2.9281635),
            ('Shaun Colley', 'email', 'United Kingdom', 'EH2 1JE', 'Massey Ferguson',53.5971791,-1.5334128),
            ('R & L Miller', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere',55.6866074,-4.6592465),
            ('France Agri', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere',53.9179437,-2.87574),
            ('Cliff Jenkins Agri Services Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere',51.8697654,-4.5059286),
            ('Malpas Tractors (Wrexham) Ltd.', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere',53.0371584,-2.940492),
            ('R&R Machinery - Lanark (Formerly Ross of Lanark)', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere',53.1371937,-2.2558442),
            ('Peter Cliff & Sons Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'John Deere',53.1371937,-2.2558442),
            ('Ravenhill Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH',57.2083549,-2.2118688),
            ('Ravenhill Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH',57.541621,-2.456972),
            ('Ross Agri Services', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH',57.5333599,-2.4626228),
            ('Ross Agri Services Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH',56.7791384,-2.4189793),
            ('Meredith Davies Agri Repairs Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Case IH',52.0227331,-4.0154815),
            ('Adcock Agri Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',51.6505373,0.6228457),
            ('M M R Engineering', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',56.1247556,-4.2398288),
            ('Thurlow Nunn Standen Kennett', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',52.2711622,0.4930652),
            ('James Green Farm Machinery Ltd - JGFM', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',52.2146649,-1.9796914),
            ('Matthew Jones', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',52.2146649,-1.9796914),
            ('Ross McTurk Agricultural Engineering', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',54.2498441,-1.2926411),
            ('M.J. Fry', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',50.7019969,-2.3340254),
            ('Agricar Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Caterpillar',56.4075904,-3.5039198),
            ('William Kerr Tractors Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Claas',55.4256671,-4.567605),
            ('Clwyd Agricultural Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Claas',53.2934303,-3.3777885),
            ('Robert Tyson Agricultural Engineering', 'email', 'United Kingdom', 'EH2 1JE', 'Claas',54.0370213,-1.9024305),
            ('Tuckwells', 'email', 'United Kingdom', 'EH2 1JE', 'Claas',51.9385457,-0.1147562),
            ('Tuckwells', 'email', 'United Kingdom', 'EH2 1JE', 'Claas',52.0167536,-0.4641224),
            ('Chichester Farm Machinery', 'email', 'United Kingdom', 'EH2 1JE', 'Claas',50.8200225,-0.7493813),
            ('Hardwick Agricultural Engineers Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Kubota',54.2278825,-0.5484018),
            ('Ernest Doe', 'email', 'United Kingdom', 'EH2 1JE', 'Kubota',52.567218,1.1185424),
            ('Francis Bugler Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Kubota',50.8115615,-2.7559599),
            ('Mark Jones Agricultural Solutions', 'email', 'United Kingdom', 'EH2 1JE', 'Kubota',51.3758641,-2.5423565),
            ('Ernest Doe', 'email', 'United Kingdom', 'EH2 1JE', 'Kubota',52.1685905,1.402746),
            ('Bell Agricultural Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Kubota',51.0112041,0.8877136),
            ('Smallridge Bros Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'JCB',51.039171,-4.076215),
            ('Read Agri Services', 'email', 'United Kingdom', 'EH2 1JE', 'JCB',51.1686064,-2.414901),
            ('Alan Mackay Machinery Forfar Ltd.', 'email', 'United Kingdom', 'EH2 1JE', 'JCB',56.6524223,-2.9287448),
            ('John Day Engineering', 'email', 'United Kingdom', 'EH2 1JE', 'JCB',51.4775505,-1.5503075),
            ('Beckett Agricultural Engineers', 'email', 'United Kingdom', 'EH2 1JE', 'JCB',51.669499,-1.706278),
            ('CFS UK Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'JCB',50.7531015,-0.7813334),
            ('Catley Engineering Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'McCormick',52.6075515,-1.301289),
            ('Startin Tractors Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'McCormick',52.6427782,-1.5054545),
            ('Robert D Webster Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'McCormick',53.7726913,-0.0795195),
            ('Robert D Webster Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'McCormick',53.7364082,-0.8784766),
            ('Robert D Webster Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'McCormick',53.9495405,-0.4507618),
            ('Lloyd Ltd Carlisle', 'email', 'United Kingdom', 'EH2 1JE', 'McCormick',54.9223342,-2.9498571),
            ('Lloyd Ltd Dumfries', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',55.0932509,-3.5732686),
            ('Russells (Kirbymoorside) Ltd Northallerton', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',54.347049,-1.4397588),
            ('Lloyd Ltd Bishop Auckland', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',54.6366062,-1.6989447),
            ('Haynes Agricultural Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',51.1501513,-1.249444),
            ('Russells (Kirbymoorside) Ltd Leyburn', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',54.3258374,-1.8482828),
            ('Rhodri Williams', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',51.734698,-4.1451248),
            ('Agri-Service (Michael Lloyd Yates)', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',51.186392,1.229855),
            ('Ravenhill Ltd', 'email', 'United Kingdom', 'EH2 1JE', 'Deutz-Fahr',57.599941,-4.4451289)
            
            ;
        `);

        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
};

initDb();
