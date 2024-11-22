import React, { useEffect } from 'react';

const Notice = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-5 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform translate-x-full ${
        message ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {message}
    </div>
  );
};

export default Notice;
