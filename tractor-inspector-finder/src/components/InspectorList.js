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
                    <li key={inspector.id}>
                        {inspector.name} - {inspector.contact_info} - {inspector.postcode} - {inspector.brands_inspected}
                        <Link to={`/edit-inspector/${inspector.id}`}>Edit</Link>
                        <button onClick={() => handleDelete(inspector.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ImportInspectors() {
    const [file, setFile] = useState(null);
    const [inspectors, setInspectors] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3001/api/inspectors/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Import successful:', response.data);

            // Refresh the inspector list after successful import
            axios.get('/api/inspectors').then(response => {
                setInspectors(response.data);
            });
        } catch (error) {
            console.error('Error importing inspectors:', error);
        }
    };

    return (
        <div>

            <h1>Import Inspectors</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>CSV File</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Import</button>
            </form>
        </div>
    );
}

export default InspectorList;
export { ImportInspectors };
