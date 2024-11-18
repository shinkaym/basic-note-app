/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  
  const auth = getAuth();
  
  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged((user) => {
      if (user?.uid) {
        setUser(user);
        if(user.accessToken !== localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', user.accessToken);
          window.location.reload();
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setUser({});
      localStorage.clear()
      navigate('/login')
    });

    return () => unsubcribed(); // Clean up the subscription when the component unmounts
  }, [auth]);

  return <AuthContext.Provider value={{ user, setUser }}>{isLoading ? <CircularProgress /> : children}</AuthContext.Provider>;
}
