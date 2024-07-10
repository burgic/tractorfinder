import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // implement auth logic here
        console.log('User Logged in');
        navigate.push('/');
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Log in with the Google</button>
        </div>
    );
}

export default Login;