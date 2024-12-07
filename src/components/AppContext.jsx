import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../features/utils/axiosInstance.js';
import { useLocation } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null); // Add socket state
  const [messageChanged, setMessageChanged] = useState(null);
  const savedSession = JSON.parse(sessionStorage.getItem('userSession'));
  const { pathname } = useLocation();

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

  useEffect(() => {
    if (!user) return;

    const socketInstance = io(
      import.meta.env.VITE_API_SOCKET_URL ||
        'https://imconnect-api.onrender.com',
      {
        withCredentials: true,
      }
    );

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      socketInstance.emit('userConnected', user._id); // Ensure user._id is valid
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketInstance.on('newMessage', (message) => {
      setMessages((prevMessages) => [
        { ...message, timestamp: new Date().toISOString() },
        ...prevMessages,
      ]);
      setMessageChanged(message);
    });

    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const usePageTitle = (title) => {
    useEffect(() => {
      document.title = title || 'IMConnect';
    }, [title]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLogged,
        setIsLogged,
        isLoading,
        usePageTitle,
        messages,
        setMessages,
        messageChanged,
        socket, // Expose socket in context
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
