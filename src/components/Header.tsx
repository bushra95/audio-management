import { useNavigate } from '@tanstack/react-router';
import { AuthService } from '@/services/auth.service';
import { useTranslation } from 'react-i18next';

const authService = AuthService.getInstance();

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">
            {t('app.title')}
          </h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            {t('auth.logout')}
          </button>
        </div>
      </div>
    </header>
  );
} 