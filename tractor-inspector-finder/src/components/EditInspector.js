import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditInspector () {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [inspector, setInspector] = useState({
        name: '',
        contactInfo: '',
        postCode: '',
        brandsInspected: '',
    }); 
    
    // [name, setName
    // const [name, setName] = useState('');
    // const [contactInfo, setContactInfo] = useState('');
    // const [postCode, setPostcode] = useState('');
    // const [brandsInspected, setBrandsInspected] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        axios.get(`/api/inspectors/${id}`).then(response => {
            setInspector(response.data);
            
            // setName(name);
            // setContactInfo(contact_info);
            // setPostcode(postcode);
            // setBrandsInspected(brands_inspected);
        })
        .catch(error => {
            setError('Error retrieving data:', error);
        });
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInspector(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        axios.put(`/api/inspectors/${id}`, inspector).then(response => {
            setSuccess('Inspector updated:', response.data);
            navigate('/inspectors');
        });
    };

    return (
        <div>
            <h1>Edit Inspector</h1>
            <form onSubmit = {handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type = "text" value = {inspector.name} onChange = {handleChange} />
                </div>
                <div>
                    <label>Contact Info</label>
                    <input type = "text" value = {inspector.contact_info} onChange = {handleChange} />
                </div>
                <div>
                    <label>Postcode</label>
                    <input type = "text" value = {inspector.postcode} onChange = {handleChange} />
                </div>
                <div>
                    <label>Brands Inspected</label>
                    <input type = "text" value = {inspector.brands_inspected} onChange = {handleChange} />
                </div>
                <button type = "submit">Update Inspector</button>
            </form>
            {error && <p style = {{ color: 'red' }}>{error}</p>}
            {success && <p style = {{ color: 'green' }}>{success}</p>}
        </div>
    )

}

export default EditInspector;