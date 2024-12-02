import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams to get dietId from URL
import AxiosInstance from '../../utils/AxiosInstance'; // Adjust import as necessary
import './DietInfo.css';
import axios from 'axios';
import { Food } from './CreateDiet';
import SearchFood from '../../components/searchfood/SearchFood';

interface DietResDto {
  id: number;
  userId: string;
  type: string; // Adjust based on your DietType enum
  date: Date;
  foods?: Food[];
}

interface StatDto {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  sugars: number;
  sodium: number;
}

interface Count {
  cal: {
    deficient: number; // Indicates if calories are deficient (1 or 0)
    exceeded: number; // Indicates if calories are exceeded (1 or 0)
  };
  carbohydrates: {
    deficient: number; // Indicates if carbohydrates are deficient (1 or 0)
    exceeded: number; // Indicates if carbohydrates are exceeded (1 or 0)
  };
  protein: {
    deficient: number; // Indicates if protein is deficient (1 or 0)
    exceeded: number; // Indicates if protein is exceeded (1 or 0)
  };
  fat: {
    deficient: number; // Indicates if fat is deficient (1 or 0)
    exceeded: number; // Indicates if fat is exceeded (1 or 0)
  };
  sodium: {
    deficient: number; // Indicates if sodium is deficient (1 or 0)
    exceeded: number; // Indicates if sodium is exceeded (1 or 0)
  };
  sugars: {
    deficient: number; // Indicates if sugars are deficient (1 or 0)
    exceeded: number; // Indicates if sugars are exceeded (1 or 0)
  };
}

interface Diff {
  cal: number;
  carb: number;
  protein: number;
  fat: number;
  sugars: number;
  sodium: number;
}


const DietInfo: React.FC = () => {
  const { dietId } = useParams<{ dietId: string }>(); // Get dietId from URL parameters
  const [dietInfo, setDietInfo] = useState<DietResDto | null>(null);
  const [dietStats, setDietStats] = useState<StatDto | null>(null);
  const [dietCount, setDietCount] = useState<Count | null>(null);
  const [dietDiff, setDietDiff] = useState<Diff | null>(null); // State for diff data
  const [recommendedFoods, setRecommendedFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [postExists, setPostExists] = useState<boolean | null>(null);
  const [postId, setPostId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFoods, setEditedFoods] = useState<Food[]>([]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedFoods(dietInfo?.foods || []);
  };

  const handleAddFood = (food: Food) => {
    setEditedFoods(prev => [...prev, food]);
  };

  const handleRemoveFood = (foodId: number) => {
    setEditedFoods(prev => prev.filter(food => food.id !== foodId));
  };

  const handleSaveEdit = async () => {
    try {
      await AxiosInstance.patch(`/diet/${dietId}`, {
        foods: editedFoods.map(food => food.id)
      });
      setDietInfo(prev => ({ ...prev!, foods: editedFoods }));
      setIsEditing(false);
      // Refetch diet info to get updated stats
      fetchDietInfo();
    } catch (error) {
      console.error('Error saving diet:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const fetchDietInfo = async () => {
    try {
      // Fetch diet information
      const postCheckResponse = await AxiosInstance.get(`/diet/${dietId}/check`);
      console.log(postCheckResponse);
      setPostExists(postCheckResponse.data.exists);
      if (postCheckResponse.data.exists) {
        setPostId(postCheckResponse.data.postId);
      }

      const response = await AxiosInstance.get(`/diet/${dietId}`);
      console.log(response.data);

      const data = response.data
      data.foods = response.data.foods.map((food: { food: Food; }) => food.food);

      setDietInfo(data); // Assuming response.data matches DietResDto structure

      // Fetch diet statistics and counts
      const statsResponse = await AxiosInstance.get(`/diet/${dietId}/stat`);
      setDietStats(statsResponse.data.stat); // Assuming statsResponse.data.stat matches StatDto structure
      setDietCount(statsResponse.data.count); // Assuming statsResponse.data.count matches Count structure
      setDietDiff(statsResponse.data.diff); // Assuming statsResponse.data.diff matches Diff structure
      setRecommendedFoods(statsResponse.data.recommended);
    } catch (err) {
      if (axios.isAxiosError(error) && error.response) {
        setError('Error code: '+error.response.status+', '+error.message);
      } else {
        console.error('An unexpected error occurred.');
      }
      setError('Failed to fetch diet information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietInfo();
  }, [dietId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="diet-info-container">
      {dietInfo && (
        <div className="diet-info">
          <h2>Diet Information</h2>
          <p><strong>ID:</strong> {dietInfo.id}</p>
          <p><strong>User ID:</strong> {dietInfo.userId}</p>
          <p><strong>Type:</strong> {dietInfo.type}</p>
          <p><strong>Date:</strong> {new Date(dietInfo.date).toLocaleDateString()}</p>
          {dietInfo.foods && (
            <div>
              <strong>Foods:</strong>
              <ul>
                {dietInfo.foods.map(food => (
                  <li key={food.name}>{food.name}</li> // Replace with actual food name if available
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!isEditing ? (
        <button onClick={handleEditClick} className="edit-button">Edit Foods</button>
      ) : (
        <div className="edit-foods-section">
          <h3>Edit Foods</h3>
          <SearchFood onFoodSelect={handleAddFood} />
          <div className="selected-foods">
            <h4>Selected Foods:</h4>
            {editedFoods.map(food => (
              <div key={food.id} className="selected-food-item">
                <span>{food.name}</span>
                <button onClick={() => handleRemoveFood(food.id)}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={handleSaveEdit} className="save-button">Save Changes</button>
          <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
        </div>
      )}

      {dietStats && (
        <div className="diet-stats">
          <h2>Diet Statistics</h2>
          <p><strong>Calories:</strong> {dietStats.calories}</p>
          <p><strong>Carbohydrates:</strong> {dietStats.carbohydrates} g</p>
          <p><strong>Fat:</strong> {dietStats.fat} g</p>
          <p><strong>Protein:</strong> {dietStats.protein} g</p>
          <p><strong>Sugars:</strong> {dietStats.sugars} g</p>
          <p><strong>Sodium:</strong> {dietStats.sodium} mg</p>
        </div>
      )}

      {/*{dietCount && (
        <div className="diet-count">
          <h2>Nutrient Evaluation</h2>

           Calories Evaluation
          {(dietCount.cal.deficient || dietCount.cal.exceeded) && (
            <div>
              <h3>Calories</h3>
              {dietCount.cal.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.cal.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

           Carbohydrates Evaluation
          {(dietCount.carbohydrates.deficient || dietCount.carbohydrates.exceeded) && (
            <div>
              <h3>Carbohydrates</h3>
              {dietCount.carbohydrates.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.carbohydrates.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

           Protein Evaluation
          {(dietCount.protein.deficient || dietCount.protein.exceeded) && (
            <div>
              <h3>Protein</h3>
              {dietCount.protein.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.protein.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

           Fat Evaluation
          {(dietCount.fat.deficient || dietCount.fat.exceeded) && (
            <div>
              <h3>Fat</h3>
              {dietCount.fat.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.fat.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

           Sodium Evaluation
          {(dietCount.sodium.deficient || dietCount.sodium.exceeded) && (
            <div>
              <h3>Sodium</h3>
              {dietCount.sodium.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.sodium.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

           Sugars Evaluation
          {(dietCount.sugars.deficient || dietCount.sugars.exceeded) && (
            <div>
              <h3>Sugars</h3>
              {dietCount.sugars.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.sugars.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}
        </div>
      )}*/}

      {/* Displaying Diff Values */}
      {dietDiff && (
        <>
          <div className="nutrient-diff">
            <h2>Nutrient Evaluation</h2>

            {/* Calories Difference */}
            {dietDiff.cal !== undefined && (
              <>
                {dietDiff.cal > 0 ? (
                  <p className="nutrient-diff-exceeded"><strong>Calories Exceeded
                    by:</strong> {Math.abs(dietDiff.cal).toFixed(2)} kcal</p>
                ) : dietDiff.cal < 0 ? (
                  <p className="nutrient-diff-deficient"><strong>Calories Deficient
                    by:</strong> {Math.abs(dietDiff.cal).toFixed(2)} kcal</p>
                ) : null}
              </>
            )}

            {/* Carbohydrates Difference */}
            {dietDiff.carb !== undefined && (
              <>
                {dietDiff.carb > 0 ? (
                  <p className="nutrient-diff-exceeded"><strong>Carbohydrates Exceeded
                    by:</strong> {Math.abs(dietDiff.carb).toFixed(2)} g</p>
                ) : dietDiff.carb < 0 ? (
                  <p className="nutrient-diff-deficient"><strong>Carbohydrates Deficient
                    by:</strong> {Math.abs(dietDiff.carb).toFixed(2)} g</p>
                ) : null}
              </>
            )}

            {/* Protein Difference */}
            {dietDiff.protein !== undefined && (
              <>
                {dietDiff.protein > 0 ? (
                  <p className="nutrient-diff-exceeded"><strong>Protein Exceeded
                    by:</strong> {Math.abs(dietDiff.protein).toFixed(2)} g</p>
                ) : dietDiff.protein < 0 ? (
                  <p className="nutrient-diff-deficient"><strong>Protein Deficient
                    by:</strong> {Math.abs(dietDiff.protein).toFixed(2)} g</p>
                ) : null}
              </>
            )}

            {/* Fat Difference */}
            {dietDiff.fat !== undefined && (
              <>
                {dietDiff.fat > 0 ? (
                  <p className="nutrient-diff-exceeded"><strong>Fat Exceeded
                    by:</strong> {Math.abs(dietDiff.fat).toFixed(2)} g</p>
                ) : dietDiff.fat < 0 ? (
                  <p className="nutrient-diff-deficient"><strong>Fat Deficient
                    by:</strong> {Math.abs(dietDiff.fat).toFixed(2)} g</p>
                ) : null}
              </>
            )}

            {/* Sodium Difference */}
            {dietDiff.sodium !== undefined && (
              <>
                {dietDiff.sodium > 0 ? (
                  <p className="nutrient-diff-exceeded"><strong>Sodium Exceeded
                    by:</strong> {Math.abs(dietDiff.sodium).toFixed(2)} mg</p>
                ) : dietDiff.sodium < 0 ? (
                  <p className="nutrient-diff-deficient"><strong>Sodium Deficient
                    by:</strong> {Math.abs(dietDiff.sodium).toFixed(2)} mg</p>
                ) : null}
              </>
            )}

            {/* Sugars Difference */}
            {dietDiff.sugars !== undefined && (
              <>
                {dietDiff.sugars > 0 ? (
                  <p className="nutrient-diff-exceeded"><strong>Sugars Exceeded
                    by:</strong> {Math.abs(dietDiff.sugars).toFixed(2)} g</p>
                ) : dietDiff.sugars < 0 ? (
                  <p className="nutrient-diff-deficient"><strong>Sugars Deficient
                    by:</strong> {Math.abs(dietDiff.sugars).toFixed(2)} g</p>
                ) : null}
              </>
            )}
          </div>
        </>
      )}

      <div className="recommended-foods">
        <h3>Recommended Foods</h3>
        {recommendedFoods.length > 0 ? (
          <ul>
            {recommendedFoods.map((food, index) => (
              <li key={index}>
                {food.name} - {food.reason}
              </li>
            ))}
          </ul>
        ) : (
          <p>No specific food recommendations at this time.</p>
        )}
      </div>

      {postExists === false && (
        <Link to={`/diet/${dietId}/create-post`} className="create-post-link">
          Create Post for This Diet
        </Link>
      )}

      {postExists === true && postId && (
        <Link to={`/post/${postId}`} className="view-post-link">
          View Post for This Diet
        </Link>
      )}
    </div>
  );
};

export default DietInfo;
