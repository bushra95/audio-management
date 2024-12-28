import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './contexts/ToastContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </I18nextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
