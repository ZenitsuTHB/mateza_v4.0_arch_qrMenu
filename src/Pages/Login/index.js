// src/components/Login.js
import React, { useState } from 'react';
import useApi from '../../Hooks/useApi'; // Adjust the path as needed
import './css/login.css'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // If you're using React Router

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = useApi();
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await api.post('http://localhost:5000/api/auth/jwt-sign-in/', data);
      const { accessToken, refreshToken } = response;

	  console.log(response);

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('loginSuccessful', true);

        navigate('/');
		window.location.reload();
      } else {
        throw new Error('Token not received');
      }
    } catch (err) {
      console.error('Login failed:', err);
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

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
