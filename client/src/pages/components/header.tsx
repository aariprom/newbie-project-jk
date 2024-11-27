import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = ({
                  isAuthenticated,
                  loading,
                  handleLogout,
                }: {
  isAuthenticated: boolean;
  loading: boolean;
  handleLogout: () => void;
}) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <header className="header">
      <div className="logo">
        <h1><Link to="/">newbie-project-jk</Link></h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            <li>
              <a href="#" onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                handleLogout(); // Call logout function when clicked
              }}>Logout</a>
            </li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
