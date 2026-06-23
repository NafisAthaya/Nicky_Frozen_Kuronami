import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';

import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AppProvider>
  </StrictMode>
);