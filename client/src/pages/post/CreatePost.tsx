import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import './CreatePost.css';
import AxiosInstance from '../../utils/AxiosInstance';

interface DietInfo {
  type: string;
  date: string;
  totalCalories: number;
  foods: string[];
}

const CreatePost: React.FC = () => {
  const { dietId } = useParams<{ dietId: string }>();
  const navigate = useNavigate();
  const [dietInfo, setDietInfo] = useState<DietInfo | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDietInfo = async () => {
      try {
        const response = await axiosInstance.get(`/diet/${dietId}`);
        const statsResponse = await AxiosInstance.get(`/diet/${dietId}/stat`);
        console.log(response.data);
        setDietInfo({
          type: response.data.type,
          date: response.data.date,
          totalCalories: statsResponse.data.stat.calories,
          foods: response.data.foods.map((food: any) => food.food.name)
        });
      } catch (err) {
        console.error('Error fetching diet info:', err);
        setError('Failed to fetch diet information.');
      }
    };

    fetchDietInfo();
  }, [dietId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/post/${dietId}`, {
        title,
        content,
        isPublic
      });
      console.log(response.data);
      const postId = response.data.id;
      navigate(`/post/${postId}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  if (!dietInfo) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="create-post-container">
      <h2>Create Post for Diet</h2>
      <div className="diet-info">
        <p>Diet Type: {dietInfo.type}</p>
        <p>Date: {dietInfo.date}</p>
        <p>Total Calories: {dietInfo.totalCalories} kcal</p>
        <p>Foods: {dietInfo.foods.join(', ')}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make this post public
          </label>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
