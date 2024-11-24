import React, { useEffect } from 'react';
import './ErrorToast.css'; // You can create a separate CSS file for the toast styling

const ErrorToast = ({ message, clearError }) => {
  useEffect(() => {
    // Set a timeout to clear the error message after 5 seconds
    const timer = setTimeout(() => {
      clearError();
    }, 5000);

    // Cleanup the timer when the component is unmounted or the error changes
    return () => clearTimeout(timer);
  }, [message, clearError]);

  if (!message) return null; // If there's no message, don't render the component

  return (
    <div className="error_toast">
      {message}
    </div>
  );
};

export default ErrorToast;
