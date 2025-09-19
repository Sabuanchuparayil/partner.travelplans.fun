import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const toastTypeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg animate-toast-in ${toastTypeClasses[type]}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;