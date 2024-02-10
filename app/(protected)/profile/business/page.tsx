'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type UserProfile = {
  id: number;
  nickname: string;
  registration_date: string;
  // ... other fields
};

type Props = {};

const BusinessProfilePage = (props: Props) => {
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mercadolibre');
        console.log(response.data);

        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Business Profile Page</h1>
      {userData ? (
        <div>
          {/* Display user profile information here */}
          <p>ID: {userData.id}</p>
          <p>Nickname: {userData.nickname}</p>
          <p>Registration Date: {userData.registration_date}</p>
          {/* ... other fields */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default BusinessProfilePage;
