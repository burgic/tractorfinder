import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InspectorFind() {
    const [postcode, setPostcode] = useState('');
    const [inspectors, setInspectors] = useState([]);
    const [limit, setLimit] = useState(5);
    const [error, setError] = useState('');

    const handlePostcodeChange = (e) => {
        setPostcode(e.target.value);
    };
 
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

    const fetchInspectors = async (postcodeValue, limitValue) => {
        try {
          const response = await axios.get('http://localhost:3001/api/inspectors/distance', {
            params: { postcode: postcodeValue, limit: limitValue }
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
        const newInspectors = await fetchInspectors(postcode, limit);
        setInspectors(newInspectors);
      };

    const handleLoadMore = async () => {
        console.log('Load more clicked');
        const newLimit = limit + 5;
        setLimit(newLimit);
        const newInspectors = await fetchInspectors(postcode, newLimit);
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
                <button type="submit">Find Inspectors</button>
            </form>
            {error && <p>{error}</p>}
            <ul>
                {inspectors.map((inspector, index) => (
                    <li key={inspector.id || index}>
                        {inspector.name} - {inspector.contact_info} - {inspector.postcode} - {inspector.brands_inspected} - {inspector.distance}

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
