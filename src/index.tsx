import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { ChakraProvider } from '@chakra-ui/react';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ChakraProvider>
          <ToastProvider>
            <AuthProvider>
              <DataProvider>
                <App />
              </DataProvider>
            </AuthProvider>
          </ToastProvider>
        </ChakraProvider>
      </Router>
    </React.StrictMode>
  );
}
