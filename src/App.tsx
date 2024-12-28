import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <ToastProvider>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ToastProvider>
    ),
  },
  {
    path: '/',
    element: (
      <ToastProvider>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </ToastProvider>
    ),
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
