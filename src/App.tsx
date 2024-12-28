import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthProvider>
                <Login />
              </AuthProvider>
            }
          />
          <Route
            path="/"
            element={
              <AuthProvider>
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              </AuthProvider>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
