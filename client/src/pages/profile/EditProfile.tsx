import React, { useState } from 'react';
import AxiosInstance from '../../utils/AxiosInstance'; // Adjust import as necessary
import { UserProfile } from './Profile';

interface EditProfileProps {
  userProfile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void; // Callback to update the profile in parent
}

const EditProfile: React.FC<EditProfileProps> = ({ userProfile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let input = e.target as HTMLInputElement;

    // Handle checkbox separately
    if (input.type === 'checkbox') {
      setFormData({ ...formData, [input.name]: input.checked }); // Use e.target.checked for checkbox inputs
    } else {
      setFormData({ ...formData, [input.name]: input.value }); // Use value for other inputs
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.patch('/user/profile/edit', formData); // Send updated data to server
      alert('Profile updated successfully!'); // Notify user of success
      onUpdate(response.data); // Call the onUpdate prop with the new data
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age || ''}
          onChange={handleInputChange}
          placeholder="Age"
        />
      </div>
      <div>
        <label>Height:</label>
        <input
          type="number"
          name="height"
          value={formData.height || ''}
          onChange={handleInputChange}
          placeholder="Height in cm"
        />
      </div>
      <div>
        <label>Weight:</label>
        <input
          type="number"
          name="weight"
          value={formData.weight || ''}
          onChange={handleInputChange}
          placeholder="Weight in kg"
        />
      </div>
      <div>
        <label>Sex:</label>
        <select name="sex" value={formData.sex || ''} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          {/* Add other options as necessary */}
        </select>
      </div>
      <div>
        <label>Level:</label>
        <input
          type="number"
          name="level"
          value={formData.level || ''}
          onChange={handleInputChange}
          placeholder="Level"
        />
      </div>
      <div>
        <label>Private Profile:</label>
        <input
          type="checkbox"
          name="privateProfile"
          checked={formData.privateProfile}
          onChange={handleInputChange} // No need to change this line
        />
      </div>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditProfile;