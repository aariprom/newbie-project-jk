import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css'

const Logout: React.FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await handleLogout(); // Call logout function passed as prop
      navigate('/login'); // Redirect to login after successful logout
    };

    performLogout();
  }, [handleLogout, navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
      <p>Please wait...</p>
    </div>
  );
};

export default Logout;
