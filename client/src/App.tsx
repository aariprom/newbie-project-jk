import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import React, { useEffect, useState } from 'react';
import Header from './pages/components/header';
import api from './utils/api';
import NotFound from './pages/404';
import Logout from './pages/logout';
import Dashboard from './pages/dashboard';
import Signup from './pages/signup';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // This effect runs once on mount to check if user is authenticated
  useEffect(() => {
    const fetchAuthCheck = async () => {
      try {
        const response = await api.get('/auth/authCheck');
        if (response.data) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        setErrorMsg('Error while fetching authentication info.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthCheck();
  }, []); // Only run once on mount


  const handleLogout = async () => {
    try {
      const response = await api.post('/auth/logout');
      if (response.status === 201) {
        setIsAuthenticated(false); // Immediately reflect logout state
        alert('Logout successful.');
      } else {
        alert('Logout failed.');
      }
    } catch (error) {
      console.error('Logout failed.');
      alert('Logout failed.');
    }
  };

  return (
    <Router>
      <div>
        {/* Pass `isAuthenticated` and `handleLogout` as props to Header */}
        <Header isAuthenticated={isAuthenticated} loading={loading} handleLogout={handleLogout} />
        <Routes>
          {/* Pass `isAuthenticated` as prop to Home */}
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
