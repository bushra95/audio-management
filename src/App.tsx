import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    ),
  },
  {
    path: '/',
    element: (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    ),
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
