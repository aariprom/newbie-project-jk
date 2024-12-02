// src/pages/AllPosts.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import './AllPosts.css';

interface Post {
  id: number;
  title: string;
  userId: string;
  createdDate: string;
}

const AllPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('/post');
        setPosts(response.data);
        console.log(response.data);
        console.log(posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="all-posts-container">
      <h1>All Posts</h1>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <h3>Posted by: {post.userId}</h3>
            <p>Created: {new Date(post.createdDate).toLocaleDateString()}</p>
            <Link to={`/post/${post.id}`}>View Post</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;