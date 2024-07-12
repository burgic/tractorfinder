import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling/inspectorFind.css';


function InspectorFind() {
    const [postcode, setPostcode] = useState('');
    const [country, setCountry] = useState('');
    const [countries, setCountries] = useState([]); 
    const [inspectors, setInspectors] = useState([]);
    const [limit, setLimit] = useState(5);
    const [error, setError] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);


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

    const handlePostcodeChange = (e) => {
        setPostcode(e.target.value);
    };

    const handleCountryChange = (e) => {
        setCountry(e.target.value);
        setDropdownVisible(false);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
 

    const fetchInspectors = async (postcodeValue, countryValue, limitValue) => {
        try {
          const response = await axios.get('http://localhost:3001/api/inspectors/distance', {
            params: { postcode: postcodeValue, country: countryValue, limit: limitValue }
          });
          console.log('Received inspectors:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error fetching inspectors:', error);
          setError('Error fetching inspectors. Please try again.');
          return [];
        }
      };


      const handleFindInspectors = async (e) => {
        e.preventDefault();
        const newInspectors = await fetchInspectors(postcode, country, limit);
        setInspectors(newInspectors);
      };

    const handleLoadMore = async () => {
        console.log('Load more clicked');
        const newLimit = limit + 5;
        setLimit(newLimit);
        const newInspectors = await fetchInspectors(postcode, country, newLimit);
        setInspectors(prevInspectors => [... prevInspectors, ... newInspectors.slice(prevInspectors.length)]);
    };

    useEffect(() => {
        console.log('Inspectors updated:', inspectors);
        console.log('Current limit:', limit);
      }, [inspectors, limit]);


    return (
        <>
            <h1>Find Inspectors</h1>
            <form onSubmit={handleFindInspectors}>
                <label>
                    Postcode:
                    <input type="text" value={postcode} onChange={handlePostcodeChange} required />
                </label>
                <label>
                    Country:
                    <div className='dropdown'>
                        <button type = "button" onClick={toggleDropdown}>
                            {country ? countries.find(c => c.country_code === country).country_name : 'Select a Country'}
                        </button>
                        {dropdownVisible && (
                            <ul className='dropdown-menu'>
                        {countries.map((c) => 
                            <li 
                            key={c.country_code} 
                            onClick={() => {
                                handleCountryChange({ target: { value: c.country_code } });
                                setDropdownVisible(false);  // This ensures the dropdown closes
                            }}
                        > 
                            {c.country_name}
                        </li>
                        )}
                        </ul>
                        )}
                </div>
                </label>
                <button type="submit">Find Inspectors</button>
            </form>
            {error && <p>{error}</p>}
            <ul>
                {inspectors.map((inspector, index) => (
                    <li key={inspector.id || index}>
                        {inspector.name} | {inspector.contact_info} | {inspector.postcode} | {inspector.brands_inspected} | {inspector.distance}

                    </li>
                 ))}
            </ul>
            {inspectors.length > 0 && inspectors.length % limit === 0 && (
                <button onClick={handleLoadMore}>Load More</button>
            )}
        </>
    );
}

export default InspectorFind;

    /*
    const handleFindInspectors = async (e) => {
        e.preventDefault();
        try {
            // Fetch inspectors by distance using the postcode
            const response = await axios.get('http://localhost:3001/api/inspectors/distance', { // 'http://localhost:3001/api/inspectors/distance' '/api/inspectors/distance'
                params: { postcode, limit }
            });
            console.log('Received inspectors:', response.data);
            setInspectors(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching inspectors:', error);
            setError('Error fetching inspectors. Please try again.');
        }
    };
    */
