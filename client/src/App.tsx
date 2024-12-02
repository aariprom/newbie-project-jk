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
import DietInfo from './pages/diet/DietInfo';
import DailyDiet from './pages/diet/DailyDiet';
import CreatePost from './pages/post/CreatePost';
import EditPost from './pages/post/EditPost';
import PostView from './pages/post/PostView';
import FoodSearch from './pages/food/FoodSearch';
import AllPosts from './pages/post/AllPosts';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await AxiosInstance.get('/auth/check'); // Adjust endpoint as needed
        console.log('Auth check response:', response.data); // Debugging log
        setIsAuthenticated(!!response.data.id); // Adjust according to your API response structure
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
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
          <Route path="/profile"
            element={<Profile isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/post/:postId" element={<PostView />} />
          <Route path="/post/:postId/edit" element={<EditPost />} />
          <Route path="/diet/:dietId/create-post" element={<CreatePost />} />
          <Route path="/diet/daily/:date" element={<DailyDiet />} />
          <Route path="/diet/:dietId" element={<DietInfo />} />
          <Route path="/search-food" element={<FoodSearch />} />
          <Route path="/all-posts" element={<AllPosts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;