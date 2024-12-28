import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = async ({ email, password }: LoginForm) => {
    try {
      await login(email, password);
      // Navigation is handled in AuthContext
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('Login')}
          </h2>
          <p className="text-gray-500">
            Sign in to manage your transcriptions
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')}
            </label>
            <input
              {...register('email')}
              type="email"
              defaultValue="test@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('password')}
            </label>
            <input
              {...register('password')}
              type="password"
              defaultValue="password123"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-colors duration-200"
          >
            {t('auth.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
