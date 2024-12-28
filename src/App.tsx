import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <ToastProvider>
        <Login />
      </ToastProvider>
    )
  },
  {
    path: '/',
    element: (
      <ToastProvider>
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      </ToastProvider>
    )
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
