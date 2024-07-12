import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function CreateInspector(){
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [postCode, setPostcode] = useState('');
    const [brandsInspected, setBrandsInspected] = useState('');
    const [file, setFile] = useState(null);
    const [inspectors, setInspectors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/inspectors', {
                name,
                contact_info: contactInfo,
                postcode: postCode,
                brands_inspected: brandsInspected,
            });
            setSuccessMessage('Inspector added successfully');
            setErrorMessage('');
            console.log('Inspector added:', response.data);
        } catch (error) {
            console.error('Error adding inspector:', error.message);
            setErrorMessage('Error adding inspector');
            console.error('Error adding inspector:', error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
        setErrorMessage('Error importing inspectors. ${error.message}');
        setSuccessMessage('');
    }
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
                    <label>Postcode</label>
                    <input type = "text" value = {postCode} onChange = {e => setPostcode(e.target.value)} />
                </div>
                <div>
                    <label>Brands Inspected</label>
                    <input type = "text" value = {brandsInspected} onChange = {e => setBrandsInspected(e.target.value)} />
                </div>
                <button type = "submit">Create Inspector</button>
            </form>
            <div>
                <h2>Or Upload CSV</h2>
                <input type = "file" accept=".csv" onChange = {handleFileChange} />
            </div>
            <form onSubmit = {handleImportSubmit}>
            <button type ="submit">Import</button>
            </form>
        </div>
    )
}

export default CreateInspector;