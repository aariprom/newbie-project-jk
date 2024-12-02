import React, { useState } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import './SearchFood.css';

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

interface FoodSearchProps {
  onFoodSelect: (food: Food) => void;
}

const SearchFood: React.FC<FoodSearchProps> = ({ onFoodSelect }) => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    type: '',
    category: '',
    minCalories: '',
    maxCalories: '',
    minProtein: '',
    maxProtein: '',
    minCarbohydrates: '',
    maxCarbohydrates: '',
    minFat: '',
    maxFat: '',
    minSugars: '',
    maxSugars: '',
    minSodium: '',
    maxSodium: '',
  });
  const [searchResults, setSearchResults] = useState<Food[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = Object.entries(searchParams).reduce((acc, [key, value]) => {
        if (value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await axiosInstance.get('/food/search', { params });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching foods:', error);
    }
  };

  return (
    <div className="food-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="name"
          value={searchParams.name}
          onChange={handleInputChange}
          placeholder="Food name"
        />
        <select name="type" value={searchParams.type} onChange={handleInputChange}>
          <option value="">Select food type</option>
          <option value="P">Product</option>
          <option value="D">Dish</option>
        </select>
        <input
          type="number"
          name="category"
          value={searchParams.category}
          onChange={handleInputChange}
          placeholder="Category (1-29)"
          min="1"
          max="29"
        />
        <input
          type="number"
          name="minCalories"
          value={searchParams.minCalories}
          onChange={handleInputChange}
          placeholder="Min calories"
        />
        <input
          type="number"
          name="maxCalories"
          value={searchParams.maxCalories}
          onChange={handleInputChange}
          placeholder="Max calories"
        />
        <input
          type="number"
          name="minProtein"
          value={searchParams.minProtein}
          onChange={handleInputChange}
          placeholder="Min protein (g)"
        />
        <input
          type="number"
          name="maxProtein"
          value={searchParams.maxProtein}
          onChange={handleInputChange}
          placeholder="Max protein (g)"
        />
        <input
          type="number"
          name="minCarbohydrates"
          value={searchParams.minCarbohydrates}
          onChange={handleInputChange}
          placeholder="Min carbohydrates (g)"
        />
        <input
          type="number"
          name="maxCarbohydrates"
          value={searchParams.maxCarbohydrates}
          onChange={handleInputChange}
          placeholder="Max carbohydrates (g)"
        />
        <input
          type="number"
          name="minFat"
          value={searchParams.minFat}
          onChange={handleInputChange}
          placeholder="Min fat (g)"
        />
        <input
          type="number"
          name="maxFat"
          value={searchParams.maxFat}
          onChange={handleInputChange}
          placeholder="Max fat (g)"
        />
        <input
          type="number"
          name="minSugars"
          value={searchParams.minSugars}
          onChange={handleInputChange}
          placeholder="Min sugars (g)"
        />
        <input
          type="number"
          name="maxSugars"
          value={searchParams.maxSugars}
          onChange={handleInputChange}
          placeholder="Max sugars (g)"
        />
        <input
          type="number"
          name="minSodium"
          value={searchParams.minSodium}
          onChange={handleInputChange}
          placeholder="Min sodium (mg)"
        />
        <input
          type="number"
          name="maxSodium"
          value={searchParams.maxSodium}
          onChange={handleInputChange}
          placeholder="Max sodium (mg)"
        />
        <button type="submit">Search</button>
      </form>

      <div className="search-results">
        {searchResults.length > 0 && (
          <table className="food-table">
            <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Calories (kcal)</th>
              <th>Protein (g)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
              <th>Sugars (g)</th>
              <th>Sodium (mg)</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {searchResults.map(food => (
              <tr key={food.id}>
                <td>{food.name}</td>
                <td>{food.id}</td>
                <td>{food.calories}</td>
                <td>{food.protein}</td>
                <td>{food.carbohydrates}</td>
                <td>{food.fat}</td>
                <td>{food.sugars}</td>
                <td>{food.sodium}</td>
                <td>
                  <button onClick={() => onFoodSelect(food)}>Select</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SearchFood;