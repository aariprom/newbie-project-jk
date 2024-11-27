import { useEffect, useState } from 'react';
import api from '../utils/api'; // Ensure this points to your API instance
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch user data after login
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/profile'); // Replace with your backend endpoint
        setUserData(response.data);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) {
            console.log(error.response.data);
            if (error.response.status === 400) {
              alert('Please login first to see dashboard.');
            } else {
              alert('Error occurred, please try again.');
            }
          }
        } else {
          console.error('Error while fetching user data', error);
          alert('Error while fetching user data, please try again.');
        }
        navigate('/login'); // Redirect to login if there's an error or not authenticated
      } finally {
        setLoading(false);
      }
    };
    if (loading) {
      fetchUserData();
    }
  }, [loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <div>
          <p>Welcome back, {userData.id}!</p>
          <p>Email: {userData.email}</p>
          <p>Modify Profile<Link to='/profile'></Link></p>
          {/* todo: show calendar + diet, shortcut to create diet, monthly status */}
          {/* Add more user-specific data here */}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Dashboard;
