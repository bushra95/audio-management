import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  console.log('Login component rendering');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log('Submitting login:', data);
      await AuthService.getInstance().login(data);
      navigate({ to: '/' });
    } catch (error) {
      console.error('Login error:', error);
      showToast(error instanceof Error ? error.message : t('auth.invalidCredentials'), 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">{t('auth.login')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              {t('auth.email')}
            </label>
            <input
              {...register('email')}
              type="email"
              defaultValue="test@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              {t('auth.password')}
            </label>
            <input
              {...register('password')}
              type="password"
              defaultValue="password123"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t('auth.submitting') : t('auth.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
