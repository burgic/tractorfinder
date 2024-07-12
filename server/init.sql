DROP TABLE IF EXISTS inspectors;

CREATE TABLE inspectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact_info TEXT, 
    postcode TEXT,
    brands_inspected TEXT,
    country TEXT,
    latitude REAL,
    longitude REAL
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


/*

CREATE DATABASE test;

USE test;

CREATE TABLE inspectors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    brands_inspected TEXT NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL (9,6)
);

*/