import { useNavigate } from '@tanstack/react-router';
import { AuthService } from '@/services/auth.service';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';

const authService = AuthService.getInstance();

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            
            <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>{t('auth.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
} 