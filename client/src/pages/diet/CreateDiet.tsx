// src/components/CreateDiet.tsx
import React, { useState } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import './CreateDiet.css';
import SearchFood from '../../components/searchfood/SearchFood';

export interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugars: number;
  sodium: number;
}

interface CreateDietProps {
  date: string;
  onDietCreated: () => void;
}

const CreateDiet: React.FC<CreateDietProps> = ({ date, onDietCreated }) => {
  const [type, setType] = useState<string>('');
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFoodSelect = (food: Food) => {
    setSelectedFoods(prev => [...prev, food]);
  };

  const handleRemoveFood = (foodId: number) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/diet', {
        foods: selectedFoods.map(food => food.id),
        type,
        date,
      });
      onDietCreated();
      setType('');
      setSelectedFoods([]);
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
          <h4>Selected Foods:</h4>
          {selectedFoods.map(food => (
            <div key={food.id}>
              {food.name} - {food.calories} calories
              <button type="button" onClick={() => handleRemoveFood(food.id)}>Remove</button>
            </div>
          ))}
        </div>
        <button type="submit">Create Diet</button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <h4>Search and Add Foods:</h4>
      <SearchFood onFoodSelect={handleFoodSelect} />
    </div>
  );
};

export default CreateDiet;