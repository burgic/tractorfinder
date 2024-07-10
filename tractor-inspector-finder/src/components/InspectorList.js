import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function InspectorList() {
    const [inspectors, setInspectors] = useState([]);

    useEffect(() => {
        axios.get('/api/inspectors').then(response => {
            setInspectors(response.data);
        });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`/api/inspectors/${id}`).then(() => {
            setInspectors(inspectors.filter(inspector => inspector.id !== id));
        });
    };

    return (
        <div>
            <h1>Inspectors</h1>
            <ul>
                {inspectors.map(inspector => (
                    <li key = {inspector.id}>{inspector.name} {inspector.contact_info} {inspector.postcode} {inspector.brands_inspected}
                    <Link to = {`/edit-inspector/${inspector.id}`}>Edit</Link>
                    <button onClick = {() => handleDelete(inspector.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InspectorList;