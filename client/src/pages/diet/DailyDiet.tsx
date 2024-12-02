// src/pages/DailyDiet.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import './DailyDiet.css';
import axios, { isAxiosError } from 'axios';
import CreateDiet from './CreateDiet';

interface Diet {
  id: number;
  type: string;
}

const DailyDiet: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyDiets = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/diet/daily/${date}`);
      setDiets(response.data);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error fetching daily diets:', await (err.response.data.message));
        setError('Failed to fetch diet information: '+ await (err.response.data.message));
      }
      setError('Failed to fetch diet information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchDailyDiets();
    }
  }, [date]);

  const handleDietCreated = () => {
    fetchDailyDiets(); // Refresh the diet list after creating a new diet
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="daily-diet-container">
      <h2>Diets for {date}</h2>
      {diets.length === 0 ? (
        <p>No diets recorded for this date.</p>
      ) : (
        diets.map((diet) => (
          <div key={diet.id} className="diet-item">
            <h3>Diet Type: {diet.type}</h3>
            <Link to={`/diet/${diet.id}`} className="view-details-link">
              View Details
            </Link>
          </div>
        ))
      )}
      <CreateDiet date={date || ''} onDietCreated={handleDietCreated} />
    </div>
  );
};

export default DailyDiet;