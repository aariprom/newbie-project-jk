import React, { useState } from 'react';
import AxiosInstance from '../../utils/AxiosInstance'; // Adjust import as necessary
import './SearchFood.css';

interface FoodItem {
  id: number; // Assuming each food item has an ID
  name: string;
  type: string; // Adjust based on your FoodType enum
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugars: number;
  sodium: number;
}

const SearchFood: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [type, setType] = useState<string>(''); // Adjust based on your FoodType enum
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [minCalories, setMinCalories] = useState<number | undefined>(undefined);
  const [maxCalories, setMaxCalories] = useState<number | undefined>(undefined);
  const [minProtein, setMinProtein] = useState<number | undefined>(undefined);
  const [maxProtein, setMaxProtein] = useState<number | undefined>(undefined);
  const [minCarbohydrates, setMinCarbohydrates] = useState<number | undefined>(undefined);
  const [maxCarbohydrates, setMaxCarbohydrates] = useState<number | undefined>(undefined);
  const [minFat, setMinFat] = useState<number | undefined>(undefined);
  const [maxFat, setMaxFat] = useState<number | undefined>(undefined);
  const [minSugars, setMinSugars] = useState<number | undefined>(undefined);
  const [maxSugars, setMaxSugars] = useState<number | undefined>(undefined);
  const [minSodium, setMinSodium] = useState<number | undefined>(undefined);
  const [maxSodium, setMaxSodium] = useState<number | undefined>(undefined);

  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters
      const params: any = {
        name: query || undefined,
        type: type || undefined,
        category,
        minCalories,
        maxCalories,
        minProtein,
        maxProtein,
        minCarbohydrates,
        maxCarbohydrates,
        minFat,
        maxFat,
        minSugars,
        maxSugars,
        minSodium,
        maxSodium,
      };

      // Filter out undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      // Make API call to search for food
      const response = await AxiosInstance.get('/food/search', { params });
      setResults(response.data); // Assuming response.data is an array of FoodItem
    } catch (err) {
      console.error('Error searching for food:', err);
      setError('Failed to fetch food items.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-food-container">
      <h2>Search for Food</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Name:</label>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label>Type:</label>
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <div>
          <label>Category:</label>
          <input type="number" value={category} onChange={(e) => setCategory(Number(e.target.value))} />
        </div>

        {/* Min and Max Calories */}
        <div>
          <label>Min Calories:</label>
          <input type="number" value={minCalories} onChange={(e) => setMinCalories(Number(e.target.value))} />
        </div>
        <div>
          <label>Max Calories:</label>
          <input type="number" value={maxCalories} onChange={(e) => setMaxCalories(Number(e.target.value))} />
        </div>

        {/* Min and Max Protein */}
        <div>
          <label>Min Protein:</label>
          <input type="number" value={minProtein} onChange={(e) => setMinProtein(Number(e.target.value))} />
        </div>
        <div>
          <label>Max Protein:</label>
          <input type="number" value={maxProtein} onChange={(e) => setMaxProtein(Number(e.target.value))} />
        </div>

        {/* Min and Max Carbohydrates */}
        <div>
          <label>Min Carbohydrates:</label>
          <input type="number" value={minCarbohydrates} onChange={(e) => setMinCarbohydrates(Number(e.target.value))} />
        </div>
        <div>
          <label>Max Carbohydrates:</label>
          <input type="number" value={maxCarbohydrates} onChange={(e) => setMaxCarbohydrates(Number(e.target.value))} />
        </div>

        {/* Min and Max Fat */}
        <div>
          <label>Min Fat:</label>
          <input type="number" value={minFat} onChange={(e) => setMinFat(Number(e.target.value))} />
        </div>
        <div>
          <label>Max Fat:</label>
          <input type="number" value={maxFat} onChange={(e) => setMaxFat(Number(e.target.value))} />
        </div>

        {/* Min and Max Sugars */}
        <div>
          <label>Min Sugars:</label>
          <input type="number" value={minSugars} onChange={(e) => setMinSugars(Number(e.target.value))} />
        </div>
        <div>
          <label>Max Sugars:</label>
          <input type="number" value={maxSugars} onChange={(e) => setMaxSugars(Number(e.target.value))} />
        </div>

        {/* Min and Max Sodium */}
        <div>
          <label>Min Sodium:</label>
          <input type="number" value={minSodium} onChange={(e) => setMinSodium(Number(e.target.value))} />
        </div>
        <div>
          <label>Max Sodium:</label>
          <input type="number" value={maxSodium} onChange={(e) => setMaxSodium(Number(e.target.value))} />
        </div>

        {/* Search Button */}
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {results.length > 0 && (
        <div className="search-results">
          <h3>Search Results:</h3>
          <ul>
            {results.map(food => (
              <li key={food.id}>
                <strong>{food.name}</strong> - {food.calories} kcal
                {/* Display other relevant information about the food item */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchFood;