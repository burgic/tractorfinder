import axios from 'axios';

const testInspectorFind = async (postcode) => {
    try {
        const response = await axios.get('http://localhost:3001/api/inspectors/distance', {
            params: { postcode }
        });
        console.log('Inspectors:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error fetching inspectors:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

const postcode = 'EH12 5PJ'; // Replace with the postcode you want to test
testInspectorFind(postcode);
