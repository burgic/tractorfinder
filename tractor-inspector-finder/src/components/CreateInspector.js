import React, { useState } from 'react';
import axios from 'axios';

function CreateInspector(){
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [postCode, setPostcode] = useState('');
    const [brandsInspected, setBrandsInspected] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/inspectors', {
                name,
                contact_info: contactInfo,
                postcode: postCode,
                brands_inspected: brandsInspected,
            });
            console.log('Inspector added:', response.data);
        } catch (error) {
            console.error('Error adding inspector:', error.message);
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
        </div>
    )
}

export default CreateInspector;