// src/context/NotificationContext.js
import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, severity = 'info') => {
    setNotification({ message, severity });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const value = {
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {notification && (
          <Alert onClose={hideNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </NotificationContext.Provider>
  );
};