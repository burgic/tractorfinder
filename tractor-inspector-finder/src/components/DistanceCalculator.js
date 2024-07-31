/*

import React, { useEffect, useState } from 'react';

const DistanceCalculator = ({ originLat, originLon, destinations }) => {
  // const [destLat, setDestLat] = useState('');
  // const [destLon, setDestLon] = useState('');
  const [distances, setDistances] = useState([]);

  useEffect(() => {
  const calculateDistances = () => {
    const R = 6371; // Radius of the Earth in kilometers
    return destinations.map(destination => {
      const lat1 = parseFloat(originLat) * Math.PI / 180;
      const lon1 = parseFloat(originLon) * Math.PI / 180;
      const lat2 = parseFloat(destination.lat) * Math.PI / 180;
      const lon2 = parseFloat(destination.lon) * Math.PI / 180;

      const dLat = (lat2 - lat1) 
      const dLon = (lon2 - lon1) 

      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distance in kilometers
      return distance;
    });
  }
  if (destinations && destinations.length > 0) {
    setDistances(calculateDistances());
  }
  }, [originLat, originLon, destinations]);

  if(!destinations || destinations.length === 0) {
    return <p>No destinations provided</p>;
  }

  return (
    <div>
      {distances.map((distance, index) => (
        <p key={index}>Distance to {destinations[index].name}: {distance.toFixed(2)} km</p>
      ))}
    </div>
  );
};

export default DistanceCalculator;