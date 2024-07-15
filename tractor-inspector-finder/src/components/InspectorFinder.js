import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DistanceCalculator from './DistanceCalculator.js';

const InspectorFinder = () => {
  const [origin, setOrigin] = useState(null);
  const [inspectors, setInspectors] = useState([]);
  const [error, setError] = useState(null);
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');



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

  const fetchInspectors = async (e) => {
    e.preventDefault(); // Prevent form submission
    setError(null); // Clear any previous errors
    
    try {    
      const response = await axios.get('http://localhost:3001/api/inspectors/distancecalc', {
        params: {postcode, country, sortBy, sortOrder}
             
        }); 
        setInspectors(response.data.inspectors); 
    } catch (error) {
        setError('Error fetching inspectors. Please try again.');
        }
      };

    const handleSort = (column) => {
    if (sortBy === column) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
        setSortBy(column);
        setSortOrder('asc');
    }
    };

  /*    console.log('API response:', response.data);
      
      if (response.data && response.data.origin && Array.isArray(response.data.inspectors)) {
        setOrigin(response.data.origin);
        setInspectors(response.data.inspectors);
      } else {
        setError('Unexpected data structure returned from API');
      }
    } catch (error) {
      console.error('Error fetching inspectors:', error);
      setError('Error fetching inspectors. Please try again.');
    };

*/

  return (
    <div>
        <form onSubmit={fetchInspectors}>
            <input type = "text" value = {postcode} onChange = {e => setPostcode(e.target.value)} 
            placeholder='Enter Postcode' required />
            
            <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                required
                >
            <option key="default" value="">Select a country ({countries.length} countries loaded)</option>
            {Array.isArray(countries) && countries.map((country, index) => (
                    <option 
                    key={country.code || `country-${index}`} 
                    value={country.code || ''}
                    >
                    {country.name || 'Unknown Country'}
                </option>
                ))}
            </select>
            <button type="submit">Find Inspectors</button>
        </form>

        {error && <div>{error}</div>}

        {inspectors.length > 0 && (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('distance')}>Distance</th>
            </tr>
          </thead>
          <tbody>
            {inspectors.map((inspector) => (
              <tr key={inspector.id}>
                <td>{inspector.name}</td>
                <td>{inspector.distance ? inspector.distance.toFixed(2) : 'N/A'} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
/*
        {origin && inspectors.length > 0 && (
        <DistanceCalculator 
          originLat={origin.latitude}
          originLon={origin.longitude}
          destinations={inspectors.map(inspector => ({
            lat: inspector.latitude, 
            lon: inspector.longitude,
            name: inspector.name
          }))}
        />
      )}

      <h2>Inspectors</h2>
      {inspectors.length > 0 ? (
        <ul>
            {inspectors.map(inspector => (
                <li key={inspector.id || `${inspector.latitude}-${inspector.longitude}`}>
                    {inspector.name} - Lat: {inspector.latitude}, Lon: {inspector.longitude}
                </li>
                ))}
        </ul>
      ) : <p>No inspectors found</p>}

    </div>
   
  );

};
*/

export default InspectorFinder;

