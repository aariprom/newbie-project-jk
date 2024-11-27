import api from '../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Food {
  id: number;
  name: string;
  type: string;
  category: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  sugars: number;
  sodium: number;
  userId?: string;
}

const Food = () => {
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [name, setName] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [minCalories, setMinCalories] = useState<number | undefined>(undefined);
  const [maxCalories, setMaxCalories] = useState<number | undefined>(undefined);
  const [minProtein, setMinProtein] = useState<number | undefined>(undefined);
  const [maxProtein, setMaxProtein] = useState<number | undefined>(undefined);
  const [minFat, setMinFat] = useState<number | undefined>(undefined);
  const [maxFat, setMaxFat] = useState<number | undefined>(undefined);
  const [minCarbohydrates, setMinCarbohydrates] = useState<number | undefined>(undefined);
  const [maxCarbohydrates, setMaxCarbohydrates] = useState<number | undefined>(undefined);
  const [minSugars, setMinSugars] = useState<number | undefined>(undefined);
  const [maxSugars, setMaxSugars] = useState<number | undefined>(undefined);
  const [minSodium, setMinSodium] = useState<number | undefined>(undefined);
  const [maxSodium, setMaxSodium] = useState<number | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams: Record<string, string> = {
      ...(name && { name }),
      ...(type && { type }),
      ...(category !== undefined && { category: String(category) }),
      ...(minCalories !== undefined && { minCalories: String(minCalories) }),
      ...(maxCalories !== undefined && { maxCalories: String(maxCalories) }),
      ...(minProtein !== undefined && { minProtein: String(minProtein) }),
      ...(maxProtein !== undefined && { maxProtein: String(maxProtein) }),
      ...(minFat !== undefined && { minFat: String(minFat) }),
      ...(maxFat !== undefined && { maxFat: String(maxFat) }),
      ...(minCarbohydrates !== undefined && { minCarbohydrates: String(minCarbohydrates) }),
      ...(maxCarbohydrates !== undefined && { maxCarbohydrates: String(maxCarbohydrates) }),
      ...(minSodium !== undefined && { minSodium : String(minSodium) }),
      ...(maxSodium !== undefined && { maxSodium: String(maxSodium) }),
      ...(userId !== undefined && { userId }),
    };

    setSearchParams(queryParams); // Updates the URL without reloading
  }, [name, type, category, minCalories, maxCalories, minProtein, maxProtein, minFat, maxFat, minCarbohydrates,
      maxCarbohydrates, minSodium, maxSodium, userId, setSearchParams]);

  // Trigger a search when the query parameters in the URL change
  useEffect(() => {
    const performSearch = async () => {
      const nameParam = searchParams.get('name') || '';
      const typeParam = searchParams.get('type') || '';
      const categoryParam = searchParams.get('category');
      const minCaloriesParam = searchParams.get('minCalories');
      const maxCaloriesParam = searchParams.get('maxCalories');

      const foodList: Food[] = await api.get(`/food/search?${searchParams}`)
    };

    performSearch();
  }, [searchParams]);

  return (
    <div>
      <h1>Food Search</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Calories"
          value={minCalories || ''}
          onChange={(e) => setMinCalories(Number(e.target.value) || undefined)}
        />
        <input
          type="number"
          placeholder="Max Calories"
          value={maxCalories || ''}
          onChange={(e) => setMaxCalories(Number(e.target.value) || undefined)}
        />
        <button onClick={() => setCategory(1)}>Set Category</button>
      </div>
      <ul>
        {foodList.map((food: Food) => (
          <li key={food.id}>
            {food.name} - {food.calories} kcal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Food;