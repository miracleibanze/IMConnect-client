import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ userId, children }) => {
  const socket = useRef(null);

  useEffect(() => {
    if (userId) {
      if (!socket.current) {
        socket.current = io('http://localhost:4000', {
          query: { userId },
          reconnection: true, // Enable automatic reconnection
          reconnectionAttempts: 5, // Number of reconnection attempts
          reconnectionDelay: 2000, // Delay between reconnections
          transports: ['websocket'], // Ensure WebSocket is used
        });

        console.log('Socket connected:', socket.current.id);

        // Handle events
        socket.current.on('disconnect', (reason) => {
          console.warn(`Socket disconnected: ${reason}`);
        });

        socket.current.on('connect', () => {
          console.log('Socket reconnected:', socket.current.id);
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
