import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      <span className="font-medium">Error:</span> {message}
    </div>
  );
} 