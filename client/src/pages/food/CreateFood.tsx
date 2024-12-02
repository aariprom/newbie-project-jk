import React, { useRef, useState } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import './CreateFood.css';

interface CreateFoodDto {
  name: string;
  type: 'P' | 'D';
  category?: number;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  sugars?: number;
  sodium?: number;
}

const CreateFood: React.FC = () => {
  const [foodData, setFoodData] = useState<CreateFoodDto>({
    name: '',
    type: 'P',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/food/upload-xlsx', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess(`Successfully created ${response.data.createdCount} foods.`);
      setUploadError(null);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadError('Failed to upload and process the file. Please try again.');
      setUploadSuccess(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFoodData(prev => ({
      ...prev,
      [name]: name === 'category' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/food', foodData);
      setSuccess('Food created successfully!');
      setError(null);
      // Reset form
      setFoodData({ name: '', type: 'P' });
    } catch (err) {
      console.log(err);
      setError('Failed to create food. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="create-food-container">
      <h2>Create New Food</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={foodData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={foodData.type}
            onChange={handleInputChange}
            required
          >
            <option value="P">Product</option>
            <option value="D">Dish</option>
          </select>
        </div>
        <div>
          <label htmlFor="category">Category (1-29):</label>
          <input
            type="number"
            id="category"
            name="category"
            value={foodData.category || ''}
            onChange={handleInputChange}
            min="1"
            max="29"
          />
        </div>
        <div>
          <label htmlFor="calories">Calories:</label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={foodData.calories || ''}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="protein">Protein (g):</label>
          <input
            type="number"
            id="protein"
            name="protein"
            value={foodData.protein || ''}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="carbohydrates">Carbohydrates (g):</label>
          <input
            type="number"
            id="carbohydrates"
            name="carbohydrates"
            value={foodData.carbohydrates || ''}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="fat">Fat (g):</label>
          <input
            type="number"
            id="fat"
            name="fat"
            value={foodData.fat || ''}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="sugars">Sugars (g):</label>
          <input
            type="number"
            id="sugars"
            name="sugars"
            value={foodData.sugars || ''}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="sodium">Sodium (mg):</label>
          <input
            type="number"
            id="sodium"
            name="sodium"
            value={foodData.sodium || ''}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <button type="submit">Create Food</button>
      </form>
      <h2>Create Foods with XLSX File</h2>
      <form onSubmit={handleFileUpload} className="file-upload-form">
        <div>
          <label htmlFor="xlsx-file">Upload XLSX File:</label>
          <input
            type="file"
            id="xlsx-file"
            accept=".xlsx"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
        <button type="submit">Upload and Create Foods</button>
      </form>
      {uploadError && <p className="error-message">{uploadError}</p>}
      {uploadSuccess && <p className="success-message">{uploadSuccess}</p>}
    </div>
  );
};

export default CreateFood;