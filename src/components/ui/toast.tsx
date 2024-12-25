import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const toastVariants = cva(
  'fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-opacity duration-300',
  {
    variants: {
      type: {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  }
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
}

export function Toast({ message, type }: ToastProps) {
  return (
    <div className={cn(toastVariants({ type }))}>
      {message}
    </div>
  );
} 