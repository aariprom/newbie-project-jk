import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Logout from './pages/logout/Logout';
import './App.css';
import AxiosInstance from './utils/AxiosInstance';
import Header from './components/header/Header';
import NotFound from './pages/notfound/NotFound';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import SearchFood from './pages/food/SearchFood';
import DietInfo from './pages/diet/DietInfo';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await AxiosInstance.get('/auth/check'); // Adjust endpoint as needed
        console.log('Auth check response:', response.data); // Debugging log
        setIsAuthenticated(response.data.isAuthenticated); // Adjust according to your API response structure
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false); // Not authenticated if error occurs
      } finally {
        setLoading(false); // Set loading to false after check
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await AxiosInstance.post('/auth/logout'); // Call logout endpoint on server
      setIsAuthenticated(false); // Update auth state to logged out
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header isAuthenticated={isAuthenticated} loading={loading} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
          <Route path="/profile"
            element={<Profile isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/diet/:dietID" element={<DietInfo />} />
          <Route path="/search-food" element={<SearchFood />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;