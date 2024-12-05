import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io('http://localhost:4000', {
      reconnection: true,
      transports: ['websocket'],
      query: { userId },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      if (userId) {
        socket.emit('register', userId);
        console.log('User registering on ID:', userId);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error(
      'Socket.io not initialized! Call connectSocket(userId) first.'
    );
  }
  return socket;
};

/**
 * Sends a message to the server.
 * @param {object} messageData - The message object containing senderId, receiverId, and message.
 */
export const sendMessage = (messageData) => {
  if (socket) {
    socket.emit('sendMessage', messageData);
  } else {
    console.error('Socket not connected! Unable to send message.');
  }
};

/**
 * Disconnects the current Socket.io instance and clears it.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected:', socket.id);
    socket = null;
  }
};
