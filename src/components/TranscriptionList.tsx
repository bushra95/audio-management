import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranscriptionService } from '../services/transcription.service';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './ui/button';

const transcriptionService = TranscriptionService.getInstance();

export function TranscriptionList() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['transcriptions', page],
    queryFn: () => transcriptionService.getTranscriptions(page),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, sentenceuser }: { id: string; sentenceuser: string }) => 
      transcriptionService.updateTranscription(id, sentenceuser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
      showToast(t('transcriptions.updateSuccess'), 'success');
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : t('errors.saving'), 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: transcriptionService.deleteTranscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
      showToast(t('transcriptions.deleteSuccess'), 'success');
      setDeleteId(null);
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : t('errors.deleting'), 'error');
    },
  });

  const debouncedUpdate = useDebounce(
    (id: string, sentenceuser: string) => updateMutation.mutate({ id, sentenceuser }),
    500
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={t('errors.loading')} />;
  if (!data?.data.length) return <div>{t('transcriptions.noData')}</div>;

  return (
    <div className="space-y-6">
      {data.data.map((transcription) => (
        <div key={transcription.id} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('transcriptions.original')}
            </label>
            <div className="bg-gray-50 p-2 rounded">
              {transcription.sentencelocal}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('transcriptions.api')}
            </label>
            <div className="bg-gray-50 p-2 rounded">
              {transcription.sentenceapi}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('transcriptions.user')}
            </label>
            <textarea
              className="w-full p-2 border rounded disabled:bg-gray-100"
              defaultValue={transcription.sentenceuser}
              disabled={updateMutation.isPending}
              onChange={(e) => debouncedUpdate(transcription.id, e.target.value)}
            />
          </div>

          <audio controls className="w-full">
            <source src={transcription.audioUrl} type="audio/mpeg" />
          </audio>

          <Button
            variant="destructive"
            onClick={() => setDeleteId(transcription.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? t('actions.deleting') : t('actions.delete')}
          </Button>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {t('pagination.previous')}
        </Button>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.data.length}
        >
          {t('pagination.next')}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title={t('dialogs.deleteTitle')}
        message={t('dialogs.deleteMessage')}
      />
    </div>
  );
} 