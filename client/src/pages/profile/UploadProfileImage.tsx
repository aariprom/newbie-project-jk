// src/pages/ProfileImageUpload.tsx
import React, { useState } from 'react';
import axiosInstance from '../../utils/AxiosInstance'; // Adjust import as necessary
import "./UploadProfileImage.css"

const ProfileImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set the preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile); // Append the image file to FormData

    try {
      const response = await axiosInstance.post('/user/profile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Image uploaded successfully!');
      console.log(response.data); // Handle success response as needed
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="profile-image-upload-container">
      <h2>Upload Profile Image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default ProfileImageUpload;