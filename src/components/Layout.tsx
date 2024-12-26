import { Header } from './Header';
import { useLocation } from '@tanstack/react-router';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isLoginPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 