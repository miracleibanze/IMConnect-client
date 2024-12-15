import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notice = ({ message, onClose = () => {}, duration = 3000, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose(); // Call only if onClose is provided
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    (message !== '' || message !== null || message !== undefined) && (
      <div
        className={`fixed flex flex-col bottom-5 right-0 bg-neutral-900/80 text-white z-[9999] px-4 py-2 rounded-lg shadow-md transition-transform min-h-[6rem] shadow-slate-50 duration-500 ease-in-out transform ${
          message ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={onClick}
      >
        <span>{message}</span>
        {onClick && (
          <span className="w-full text-end text-sm">Click to view</span>
        )}
      </div>
    )
  );
};

export default Notice;
