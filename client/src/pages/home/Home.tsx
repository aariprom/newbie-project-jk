import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Diet Tracker</h1>
      <p>Track your daily diet and stay healthy!</p>
      <div className="home-links">
        <Link to="/login" className="home-button">Login</Link>
        <Link to="/signup" className="home-button">Sign Up</Link>
      </div>
    </div>
  );
};

export default Home;