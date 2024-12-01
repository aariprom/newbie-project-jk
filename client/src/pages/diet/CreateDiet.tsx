// src/components/CreateDiet.tsx
import React, { useState } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import './CreateDiet.css';

interface CreateDietProps {
  date: string;
  onDietCreated: () => void;
}

const CreateDiet: React.FC<CreateDietProps> = ({ date, onDietCreated }) => {
  const [type, setType] = useState<string>('');
  const [foods, setFoods] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/diet/create', {
        foods,
        type,
        date,
      });
      onDietCreated(); // Callback to refresh the diet list
      setType('');
      setFoods([]);
      setError(null);
    } catch (err) {
      console.error('Error creating diet:', err);
      setError('Failed to create diet. Please try again.');
    }
  };

  return (
    <div className="create-diet-form">
      <h3>Create New Diet</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dietType">Diet Type:</label>
          <select
            id="dietType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="OTHERS">Others</option>
          </select>
        </div>
        <div>
          <label>Foods:</label>
          <p>Food search functionality to be implemented</p>
          {/* Placeholder for food search and selection */}
        </div>
        <button type="submit">Create Diet</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateDiet;