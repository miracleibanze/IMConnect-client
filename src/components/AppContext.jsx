import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../features/utils/axiosInstance.js';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const savedSession = JSON.parse(sessionStorage.getItem('userSession'));

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        setIsLoading(true);

        if (savedSession) {
          const response = await axiosInstance.get(`/auth/${savedSession}`);
          if (response?.data) {
            setUser(response.data);
            setIsLogged(true);
          } else {
            sessionStorage.removeItem('userSession');
            setIsLogged(false);
          }
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        sessionStorage.removeItem('userSession');
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
    };

    authenticateUser();
  }, [savedSession]);

  return (
    <AppContext.Provider
      value={{ user, setUser, isLogged, setIsLogged, isLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
