// src/pages/EditPost.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import './EditPost.css';

interface Post {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  url?: string;
}

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/post/${postId}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setIsPublic(response.data.isPublic);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post data.');
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/post/${postId}`, {
        title,
        content,
        isPublic
      });
      setSuccess('Post updated successfully.');

      if (image) {
        const formData = new FormData();
        formData.append('files', image);
        await axiosInstance.post(`/post/${postId}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess('Post and image updated successfully.');
      }

      // Navigate back to the post view after a short delay
      setTimeout(() => navigate(`/post/${postId}`), 2000);
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!post) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
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
        <div>
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {post.url && (
          <div>
            <p>Current Image:</p>
            <img src={post.url} alt="Current post image" style={{maxWidth: '200px'}} />
          </div>
        )}
        <button type="submit">Update Post</button>
      </form>
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default EditPost;