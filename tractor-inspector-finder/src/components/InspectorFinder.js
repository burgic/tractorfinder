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
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [brands_inspected, setBrandsInspected] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');


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

  useEffect(() => {
    const fetchBrands = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/brands');
            setBrandsInspected(response.data.map(brand => ({
                brand_name: brand.brand_name
            })));
        } catch (error) {
            console.error('Error fetching brands:', error);
            setError('Error fetching brands. Please try again.');
        }
    }
    fetchBrands();
}, []);

  const deleteInspector = async (id) => {
    try {
        await axios.delete(`http://localhost:3001/api/inspectors/${id}`);
        setInspectors(inspectors.filter(inspector => inspector.id !== id));
    } catch(error) {
        console.error('Error deleting inspector:', error);
        setError('Error deleting inspector. Please try again.');
    }
  }

  const fetchInspectors = async (e, loadMore = false) => {
    if (e) e.preventDefault();

    // Reset everything if it's a new search
    if (!loadMore) {
        setError(null);
        setInspectors([]);
        setLoadedCount(0);
        setHasMore(true);
    }
    
    if(!postcode || !country) {
        setError('Please enter a postcode and select a country');
        return;
    }

    const currentOffset = loadMore ? loadedCount : 0;
    console.log('About to make API call with offset:', currentOffset);

    try {    
        const response = await axios.get('http://localhost:3001/api/inspectors/distancecalc', {
            params: {
                postcode,
                country,
                brands_inspected: selectedBrand,
                sortBy: sortBy,
                sortOrder: sortOrder,
                offset: currentOffset.toString(),
                limit: 10,
            },
        });
        console.log('API response:', response.data);

        if (response.data.inspectors.length === 0) {
            setHasMore(false);
            if (!loadMore) {
                setError('No inspectors found for this location.');
            }
            return;
        }

        if (loadMore) {
            setInspectors(prevInspectors => [...prevInspectors, ...response.data.inspectors]);
        } else {
            setInspectors(response.data.inspectors.map(inspector => ({
                ...inspector,
                brands_inspected: inspector.brands_inspected || 'Not specified'  // Assuming brands_inspected comes from the API
              })));
        }
        
        setLoadedCount(prevCount => prevCount + response.data.inspectors.length);
        
        if (response.data.origin && !loadMore) {
            setOrigin(response.data.origin);
        }

        // Check if we've loaded all available inspectors
        if (response.data.inspectors.length < 10 || (loadedCount + response.data.inspectors.length) >= response.data.totalCount) {
            setHasMore(false);
        }
    } catch (error) {
        console.error('Error fetching inspectors:', error);
        setError('Error fetching inspectors. Please try again.');
        setHasMore(false);
    }
};

    
    const handleSort = (column) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(newSortOrder);
        
        // Sort the current list of inspectors
        const sortedInspectors = [...inspectors].sort((a, b) => {
          if (column === 'brands_inspected') {
            return newSortOrder === 'asc' ? a.brands_inspected.localeCompare(b.brands_inspected) : b.brands_inspected.localeCompare(a.brands_inspected);
        } else if (column === 'distance') {
            return newSortOrder === 'asc' ? a.distance - b.distance : b.distance - a.distance;
          } else if (column === 'name') {
            return newSortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          }
          return 0;
        });
    
        setInspectors(sortedInspectors);
    };

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
            {countries.map((country) => (
                    <option 
                    key={country.code} 
                    value={country.code}
                    >
                    {country.name}
                </option>
                ))}
            </select>

            <select value = {selectedBrand} onChange = {e => setSelectedBrand(e.target.value)} required>
                <option key = "default" value = "">Select a brand</option>
                {brands_inspected.map((brand, index) => (
                    <option key = {index} value = {brand.brand_name}>{brand.brand_name}</option>
                    
                ))}
            </select>

            <button type="submit">Find Inspectors</button>
        </form>

        {error && <div>{error}</div>}

        {inspectors.length > 0 && (
            <div>
                {origin && <p>Origin: {origin.latitude}, {origin.longitude}</p>}
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortOrder ==='asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('distance')}>Distance {sortBy === 'distance' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('brands_inspected')}>Brands Inspected {sortBy === 'brands_inspected' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
            {inspectors.map((inspector) => (
              <tr key={inspector.id}>
                <td>{inspector.name}</td>
                <td>{inspector.distance ? inspector.distance.toFixed(2) : 'N/A'} km</td>
                <td>{inspector.brands_inspected}</td>
                <td><button onClick = {() => deleteInspector(inspector.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && inspectors.length > 0 && (
        <button onClick={(e) => fetchInspectors(e, true)}>Load More</button>
        )}
        </div>
    )}
 

        
      
    </div>
   
  );

};


export default InspectorFinder;

  /*    
  
      useEffect(() => {
        if(postcode && country) {
            fetchInspectors();
        }
    }, [sortBy, sortOrder]);
  
  console.log('API response:', response.data);
      
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

*/