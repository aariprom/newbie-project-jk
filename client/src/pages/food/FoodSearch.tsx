// src/pages/FoodSearch.tsx
import React, { useState } from 'react';
import SearchFood from '../../components/searchfood/SearchFood';
import './FoodSearch.css';

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugars: number;
  sodium: number;
}

const FoodSearch: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
  };

  return (
    <div className="food-search-page">
      <h1>Food Search</h1>
      <SearchFood onFoodSelect={handleFoodSelect} />
      {selectedFood && (
        <div className="selected-food">
          <h2>Selected Food Details</h2>
          <p>Name: {selectedFood.name}</p>
          <p>Calories: {selectedFood.calories}</p>
          <p>Protein: {selectedFood.protein}g</p>
          <p>Carbohydrates: {selectedFood.carbohydrates}g</p>
          <p>Fat: {selectedFood.fat}g</p>
          <p>Sugars: {selectedFood.sugars}g</p>
          <p>Sodium: {selectedFood.sodium}mg</p>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;