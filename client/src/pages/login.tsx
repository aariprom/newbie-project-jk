import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { id: id, pw: password }, {
        withCredentials: true
        });
      console.log(response);
      if (response.status === 201) {
        console.log('Login successful:', response.data);
        alert('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data.message);
          alert("Login failed: "+JSON.stringify(error.response.data.message));
        }
      }
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Id"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;