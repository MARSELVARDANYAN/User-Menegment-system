import { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile.jsx';
import { getUserById } from '../api/users.api.js';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await getUserById(userId);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    
    fetchUser();
  }, []);


  return (
    <UserProfile 
      user={user} 
    />
  );
};

export default UserProfilePage;