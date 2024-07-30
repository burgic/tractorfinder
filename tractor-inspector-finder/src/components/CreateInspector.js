import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function CreateInspector(){
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [country, setCountry] = useState('');
    const [postCode, setPostcode] = useState('');
    const [brandsInspected, setBrandsInspected] = useState('');
    const [file, setFile] = useState(null);
    const [inspectors, setInspectors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [csvData, setCsvData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');
    const [brands, setBrands] = useState([]);


    useEffect(() => {
        // Fetch country codes when component mounts
        const fetchCountryCodes = async () => {
          try {
            console.log('Fetching country codes');
            const response = await axios.get('http://localhost:3001/api/country-codes');
            console.log('Country codes:', response.data);
            const uniqueCountries = Array.from(new Set(response.data.map(c => c.country_code)))
                    .map(country_code => {
                        return response.data.find(c => c.country_code === country_code);
                    });
            console.log('Fetched countries:', uniqueCountries)
            setCountries(uniqueCountries); 
          } catch (error) {
            console.error('Error fetching country codes:', error);
            setError('Error fetching country codes. Please try again.');
          }
        };
    
        fetchCountryCodes();
      }, []);

      useEffect(() => {
        console.log('Countries state updated:', countries);
    }, [countries]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                console.log('Fetching brands');
                const response = await axios.get('http://localhost:3001/api/brands');
                console.log('Received brands:', response.data);
                setBrands(response.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
                setError('Error fetching brands. Please try again.');
            }
        }
        fetchBrands();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (csvData) {
                const response = await axios.post('http://localhost:3001/api/inspectors/import', csvData);
                console.log('Import successful:', response.data);
            } else {        
            const response = await axios.post('http://localhost:3001/api/inspectors', {
                name,
                contact_info: contactInfo,
                country,
                postcode: postCode,
                brands_inspected: JSON.stringify(brandsInspected),
            });
            setSuccessMessage('Inspector added successfully');
            setErrorMessage('');
            console.log('Inspector added:', response.data);
            }
        } catch (error) {
            console.error('Error adding inspector:', error.message);
            setErrorMessage('Error adding inspector');
            console.error('Error adding inspector:', error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        if (file) {
            Papa.parse(file, {
            header: true,
            complete: (results) => {
                setCsvData(results.data);
                console.log('Parsed CSV:', results.data);
            }, 
            error: (error) => {
                console.error('Error parsing CSV:', error);
            }
        });
    }
    };

    const handleImportSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage('Please select a file to import');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try{
            const response = await axios.post('http://localhost:3001/api/inspectors/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Import successful:', response.data);
        } catch (error) {
        console.error('Error importing inspectors:', error);
        setErrorMessage('Error importing inspectors', error);
        setSuccessMessage('');
    }
    };

    const handleBrandsChange = (brandName) => {
        setBrandsInspected(prev => {
            if (prev.includes(brandName)) {
                return prev.filter(b => b !== brandName);
            } else {
                return [...prev, brandName];
            }
        });
    };

    return (
        <div>
            <h1>Create Inspector</h1>
            <form onSubmit = {handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type = "text" value = {name} onChange = {e => setName(e.target.value)} />
                </div>
                <div>
                    <label>Contact Info</label>
                    <input type = "text" value = {contactInfo} onChange = {e => setContactInfo(e.target.value)} />
                </div>
                <div>
                    <label>Country</label>
                
                    <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                required
                >
            <option key="default" value="">Select a country ({countries.length} countries loaded)</option>
            {countries.map((country, index) => (
                    <option 
                    key={`${country.code}-${index}`} 
                    value={country.code}
                    >
                    {country.country_name}
                </option>
                ))}
            </select>
                </div>
                <div>
                    <label>Postcode</label>
                    <input type = "text" value = {postCode} onChange = {e => setPostcode(e.target.value)} />
                </div>
                
                    <label>Brands Inspected</label>
                    {brands.map((brand, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={`brand-${index}`}
                                checked={brandsInspected.includes(brand.brand_name)}
                                onChange={() => handleBrandsChange(brand.brand_name)}
                            />
                            <label htmlFor={`brand-${index}`}>{brand.brand_name}</label>
                        </div>
                    ))}
                <button type = "submit">Create Inspector</button>
            </form>
            
            <h1>Or Upload CSV</h1>
            <form onSubmit = {handleImportSubmit}>
                <div>
                    <label>CSV File</label>
                    <input type = "file" accept=".csv" onChange = {handleFileChange} />
                </div>
            
                <button type ="submit">Import</button>
            </form>

            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        
        </div>
    )
}

export default CreateInspector;



/*

      useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/countries');
                console.log('Received countries:', response.data);
                const uniqueCountries = Array.from(new Set(response.data.map(c => c.country_code)))
                    .map(country_code => {
                        return response.data.find(c => c.country_code === country_code);
                    });
                setCountries(uniqueCountries);
            } catch (error) {
                console.error('Error fetching countries:', error);
                setError('Error fetching countries. Please try again.');
            }
        };
        fetchCountries();
    }, []);

        useEffect(() => {
        // Fetch country codes when component mounts
        const fetchCountryCodes = async () => {
          try {
            console.log('Fetching country codes');
            const response = await axios.get('http://localhost:3001/api/country-codes');
            console.log('Country codes:', response.data);
            setCountries(response.data.map(country => ({
                code: country.country_code,
                name: country.country_name
          }))); 
          } catch (error) {
            console.error('Error fetching country codes:', error);
            setError('Error fetching country codes. Please try again.');
          }
        };
    
        fetchCountryCodes();
      }, []);

       <input type = "text" value = {brandsInspected} onChange = {e => setBrandsInspected(e.target.value)} />
*/