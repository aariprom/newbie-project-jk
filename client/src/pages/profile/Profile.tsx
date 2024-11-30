import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../utils/AxiosInstance'; // Adjust import as necessary
import EditProfile from './EditProfile'; // Import EditProfile component
import './EditProfile.css';

export interface UserProfile {
  id: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  sex?: string; // Adjust type based on your Sex enum
  level?: number;
  createdDate: Date;
  profilePicUrl?: string;
  privateProfile: boolean;
}

interface ProfileProps {
  isAuthenticated: boolean; // Accept isAuthenticated as a prop
  setIsAuthenticated: (isAuth: boolean) => void; // Accept setIsAuthenticated as a prop
}

const Profile: React.FC<ProfileProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false); // State to toggle editing mode
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please login first.');
      navigate('/login'); // Redirect to login if not authenticated
      return; // Exit early
    }

    const fetchUserProfile = async () => {
      try {
        const response = await AxiosInstance.get('/user/profile');
        setUserProfile(response.data); // Assuming response.data matches UserProfile structure
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch user profile.');
        setIsAuthenticated(false); // Optionally update authentication state on error
        navigate('/login'); // Redirect to login if there's an error (e.g., not authenticated)
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, navigate, setIsAuthenticated]);

  const handleEditToggle = () => {
    setEditing(!editing); // Toggle editing mode
  };

  const handleUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile); // Update local state with new profile data
    setEditing(false); // Exit editing mode after successful update
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading state
  }

  if (error) {
    return <p>{error}</p>; // Show error message if any
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {userProfile && (
        <>
          <img src={userProfile.profilePicUrl || 'default-profile-pic.png'} alt="Profile" />
          <p><strong>ID:</strong> {userProfile.id}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>

          {editing ? (
            <EditProfile userProfile={userProfile} onUpdate={handleUpdate} />
          ) : (
            <>
              {userProfile.age && <p><strong>Age:</strong> {userProfile.age}</p>}
              {userProfile.height && <p><strong>Height:</strong> {userProfile.height} cm</p>}
              {userProfile.weight && <p><strong>Weight:</strong> {userProfile.weight} kg</p>}
              {userProfile.sex && <p><strong>Sex:</strong> {userProfile.sex}</p>}
              {userProfile.level && <p><strong>Level:</strong> {userProfile.level}</p>}
              <button onClick={handleEditToggle}>Edit Profile</button>
            </>
          )}

          <p><strong>Created Date:</strong> {new Date(userProfile.createdDate).toLocaleDateString()}</p>
        </>
      )}
    </div>
  );
};

export default Profile;
