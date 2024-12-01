import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get dietId from URL
import AxiosInstance from '../../utils/AxiosInstance'; // Adjust import as necessary
import './DietInfo.css';
import axios, { AxiosError } from 'axios';

interface DietResDto {
  id: number;
  userId: string;
  type: string; // Adjust based on your DietType enum
  date: Date;
  foods?: number[];
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDietInfo = async () => {
      try {
        // Fetch diet information
        const response = await AxiosInstance.get(`/diet/${dietId}`);
        setDietInfo(response.data); // Assuming response.data matches DietResDto structure

        // Fetch diet statistics and counts
        const statsResponse = await AxiosInstance.get(`/diet/${dietId}/stat`);
        setDietStats(statsResponse.data.stat); // Assuming statsResponse.data.stat matches StatDto structure
        setDietCount(statsResponse.data.count); // Assuming statsResponse.data.count matches Count structure
        setDietDiff(statsResponse.data.diff); // Assuming statsResponse.data.diff matches Diff structure
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
                {dietInfo.foods.map(foodId => (
                  <li key={foodId}>Food ID: {foodId}</li> // Replace with actual food name if available
                ))}
              </ul>
            </div>
          )}
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

      {dietCount && (
        <div className="diet-count">
          <h2>Nutrient Evaluation</h2>

          {/* Calories Evaluation */}
          {(dietCount.cal.deficient || dietCount.cal.exceeded) && (
            <div>
              <h3>Calories</h3>
              {dietCount.cal.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.cal.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

          {/* Carbohydrates Evaluation */}
          {(dietCount.carbohydrates.deficient || dietCount.carbohydrates.exceeded) && (
            <div>
              <h3>Carbohydrates</h3>
              {dietCount.carbohydrates.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.carbohydrates.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

          {/* Protein Evaluation */}
          {(dietCount.protein.deficient || dietCount.protein.exceeded) && (
            <div>
              <h3>Protein</h3>
              {dietCount.protein.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.protein.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

          {/* Fat Evaluation */}
          {(dietCount.fat.deficient || dietCount.fat.exceeded) && (
            <div>
              <h3>Fat</h3>
              {dietCount.fat.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.fat.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

          {/* Sodium Evaluation */}
          {(dietCount.sodium.deficient || dietCount.sodium.exceeded) && (
            <div>
              <h3>Sodium</h3>
              {dietCount.sodium.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.sodium.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}

          {/* Sugars Evaluation */}
          {(dietCount.sugars.deficient || dietCount.sugars.exceeded) && (
            <div>
              <h3>Sugars</h3>
              {dietCount.sugars.deficient === 1 && <p><strong>Status:</strong> Deficient</p>}
              {dietCount.sugars.exceeded === 1 && <p><strong>Status:</strong> Exceeded</p>}
            </div>
          )}
        </div>
      )}

      {/* Displaying Diff Values */}
      {dietDiff && (
        <div className="nutrient-diff">
          <h2>Nutrient Differences</h2>

          {/* Calories Difference */}
          {dietDiff.cal !== undefined && (
            <>
              {dietDiff.cal > 0 ? (
                <p><strong>Calories Exceeded by:</strong> {Math.abs(dietDiff.cal)} kcal</p>
              ) : dietDiff.cal < 0 ? (
                <p><strong>Calories Deficient by:</strong> {Math.abs(dietDiff.cal)} kcal</p>
              ) : null}
            </>
          )}

          {/* Carbohydrates Difference */}
          {dietDiff.carb !== undefined && (
            <>
              {dietDiff.carb > 0 ? (
                <p><strong>Carbohydrates Exceeded by:</strong> {Math.abs(dietDiff.carb)} g</p>
              ) : dietDiff.carb < 0 ? (
                <p><strong>Carbohydrates Deficient by:</strong> {Math.abs(dietDiff.carb)} g</p>
              ) : null}
            </>
          )}

          {/* Protein Difference */}
          {dietDiff.protein !== undefined && (
            <>
              {dietDiff.protein > 0 ? (
                <p><strong>Protein Exceeded by:</strong> {Math.abs(dietDiff.protein)} g</p>
              ) : dietDiff.protein < 0 ? (
                <p><strong>Protein Deficient by:</strong> {Math.abs(dietDiff.protein)} g</p>
              ) : null}
            </>
          )}

          {/* Fat Difference */}
          {dietDiff.fat !== undefined && (
            <>
              {dietDiff.fat > 0 ? (
                <p><strong>Fat Exceeded by:</strong> {Math.abs(dietDiff.fat)} g</p>
              ) : dietDiff.fat < 0 ? (
                <p><strong>Fat Deficient by:</strong> {Math.abs(dietDiff.fat)} g</p>
              ) : null}
            </>
          )}

          {/* Sodium Difference */}
          {dietDiff.sodium !== undefined && (
            <>
              {dietDiff.sodium > 0 ? (
                <p><strong>Sodium Exceeded by:</strong> {Math.abs(dietDiff.sodium)} mg</p>
              ) : dietDiff.sodium < 0 ? (
                <p><strong>Sodium Deficient by:</strong> {Math.abs(dietDiff.sodium)} mg</p>
              ) : null}
            </>
          )}

          {/* Sugars Difference */}
          {dietDiff.sugars !== undefined && (
            <>
              {dietDiff.sugars > 0 ? (
                <p><strong>Sugars Exceeded by:</strong> {Math.abs(dietDiff.sugars)} g</p>
              ) : dietDiff.sugars < 0 ? (
                <p><strong>Sugars Deficient by:</strong> {Math.abs(dietDiff.sugars)} g</p>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DietInfo;
