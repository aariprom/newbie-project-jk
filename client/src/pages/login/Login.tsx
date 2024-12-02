import React, { useState } from 'react';
import AxiosInstance from '../../utils/AxiosInstance';
import './Login.css';
import { useNavigate } from 'react-router-dom';

// Define the login request interface
interface LoginRequest {
  id: string;
  pw: string;
}

const Login: React.FC<{ setIsAuthenticated: (isAuth: boolean) => void }> = ({ setIsAuthenticated }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.post('/auth/login', { id, pw }); // Adjust endpoint as needed
      setIsAuthenticated(true); // Update auth state to logged in
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="id">ID</label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="pw">Password</label>
            <input
              type="password"
              id="pw"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
