import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../../utils/AxiosInstance';
import './Dashboard.css'
import Calendar from '../../components/calendar/Calendar';

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
    deficient: number,
    exceeded: number,
  },
  carbohydrates: {
    deficient: number,
    exceeded: number,
  },
  protein: {
    deficient: number,
    exceeded: number,
  },
  fat: {
    deficient: number,
    exceeded: number,
  },
  sodium: {
    deficient: number,
    exceeded: number,
  },
  sugars: {
    deficient: number,
    exceeded: number,
  }
}

interface AggregatedStatDto {
  stats: StatDto;
  count: Count;
}

const MonthlyStats: React.FC<{ stats: AggregatedStatDto }> = ({ stats }) => {
  return (
    <div className="monthly-stats">
      <h2>Monthly Nutrition Statistics</h2>
      <div className="stats-grid">
        <div>
          <h3>Averages</h3>
          <p>Calories: {stats.stats.calories.toFixed(2)}</p>
          <p>Carbohydrates: {stats.stats.carbohydrates.toFixed(2)}g</p>
          <p>Fat: {stats.stats.fat.toFixed(2)}g</p>
          <p>Protein: {stats.stats.protein.toFixed(2)}g</p>
          <p>Sugars: {stats.stats.sugars.toFixed(2)}g</p>
          <p>Sodium: {stats.stats.sodium.toFixed(2)}mg</p>
        </div>
        <div>
          <h3>Deficiencies/Excesses</h3>
          {Object.entries(stats.count).map(([nutrient, count]) => (
            <p key={nutrient}>
              {nutrient}: {count.deficient} deficient, {count.exceeded} exceeded
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<AggregatedStatDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchMonthlyStats = async (year: number, month: number) => {
    try {
      const response = await api.get<AggregatedStatDto>(`/diet/monthly/${year}/${month}/stat`);
      setMonthlyStats(response.data);
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      // Handle error (e.g., show an alert)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get('/user/profile');
        setUserData(userResponse.data);

        const currentDate = new Date();
        await fetchMonthlyStats(currentDate.getFullYear(), currentDate.getMonth() + 1);
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
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      fetchData();
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
            <Calendar />
            {monthlyStats && <MonthlyStats stats={monthlyStats} />}
          </div>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;