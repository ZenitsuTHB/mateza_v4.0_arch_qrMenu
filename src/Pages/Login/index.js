// src/components/Login.js
import React, { useState } from 'react';
import useApi from '../../Hooks/useApi'; // Adjust the path as needed
import './css/login.css'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // If you're using React Router

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Local state for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = useApi();
  const navigate = useNavigate(); // Initialize navigate if using React Router

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset previous errors

    try {
      const data = {
        email: email, // Ensure your backend expects 'email'
        password: password,
      };

      // Make the POST request to the login endpoint
      const response = await api.post('http://localhost:5000/api/jwt-sign-in/', data);

      // Assuming the JWT is returned under 'token' in the response
      const { token } = response;

      if (token) {
        // Store the JWT in localStorage with the key 'jwtToken'
        localStorage.setItem('jwtToken', token);
        console.log('JWT Token stored successfully');

        // Optionally, redirect the user to a protected route
        navigate('/dashboard'); // Replace '/dashboard' with your desired route
      } else {
        throw new Error('Token not received');
      }
    } catch (err) {
      console.error('Login failed:', err);
      // Set the error message to display to the user
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={handlePasswordChange}
          className="login-input"
          required
        />

        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
