import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../../utils/AxiosInstance'; // Ensure this points to your API instance
import './Dashboard.css'
import Calendar from '../../components/calendar/Calendar';

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
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        {userData ? (
          <div>
            {/* todo: show calendar + diet, shortcut to create diet, monthly status */}
            <Calendar />
            {/* Add more user-specific data here */}
          </div>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
