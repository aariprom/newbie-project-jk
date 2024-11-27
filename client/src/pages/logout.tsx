import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true); // Set loading to true when logout starts
    try {
      const response = await api.post('/auth/logout');
      if (response.status === 201) {
        alert('Logout successful.');
      } else {
        alert('Logout failed.');
      }
    } catch (error) {
      console.error('Logout failed.');
      alert('Logout failed.');
    } finally {
      setLoading(false);
      navigate('/'); // Redirect to homepage or login page after logout
    }
  };

  // Trigger the logout process immediately on link click
  if (!loading) {
    handleLogout();
  }

  return (
    <div>
      {loading ? (
        <p>Logging out...</p>
      ) : (
        <p>Logout complete!</p>
      )}
    </div>
  );
};

export default Logout;
