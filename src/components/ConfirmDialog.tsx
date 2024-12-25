import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">{message}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('dialogs.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t('dialogs.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 