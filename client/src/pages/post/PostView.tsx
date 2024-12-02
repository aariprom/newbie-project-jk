import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import './PostView.css';

interface Food {
  id: number;
  name: string;
}

interface Diet {
  id: number;
  type: string;
  foods: { food: Food } [];
}

interface Post {
  id: number;
  title: string;
  content: string;
  isPublic: boolean;
  pictures: { url: string }[];
  diet: Diet;
}

const PostView: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/post/${postId}`);
        console.log(response.data);
        if (!response.data) {
          setError('Post not found.');
        }
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  console.log(post);
  console.log(post?.diet.foods);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post data available.</div>;

  return (
    <div className="post-view-container">
      <h2>{post.title}</h2>
      <p className="post-content">{post.content}</p>
      {post.pictures[0] && <img src={post.pictures[0].url} alt="Post image" className="post-image" />}
      <p className="post-visibility">Public: {post.isPublic ? 'Yes' : 'No'}</p>

      <div className="diet-info">
        <h3>Connected Diet</h3>
        <p>Diet Type: {post.diet.type}</p>
        <h4>Foods:</h4>
        <ul className="food-list">
          {post.diet.foods.map((food) => (
            <li>{food.food.name}</li>
          ))}
        </ul>
      </div>

      <Link to={`/post/${post.id}/edit`} className="edit-post-link">Edit Post</Link>
    </div>
  );
};

export default PostView;