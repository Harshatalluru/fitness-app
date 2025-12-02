import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in`}>
      <span className="text-lg font-bold">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-lg font-bold hover:opacity-75">
        ×
      </button>
    </div>
  );
};