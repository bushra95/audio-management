import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranscriptionService } from '../services/transcription.service';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';

interface TranscriptionForm {
  sentenceuser: string;
}

const transcriptionService = TranscriptionService.getInstance();
const ITEMS_PER_PAGE = 5;

export function TranscriptionList() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { register, handleSubmit } = useForm<TranscriptionForm>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['transcriptions', page],
    queryFn: () => transcriptionService.getTranscriptions(page)
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

  const onSubmit = (id: string) => handleSubmit((data) => {
    updateMutation.mutate({ id, sentenceuser: data.sentenceuser });
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={t('errors.loading')} />;
  if (!data?.data.length) return <div>{t('transcriptions.noData')}</div>;

  return (
    <div className="space-y-6">
      {data.data.map((transcription) => (
        <div key={transcription.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h3 className="font-medium text-gray-600">{t('transcriptions.original')}</h3>
            <div className="w-full p-2 border rounded bg-gray-50">
              {transcription.sentencelocal}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-medium text-gray-600">{t('transcriptions.api')}</h3>
            <div className="w-full p-2 border rounded bg-gray-50">
              {transcription.sentenceapi}
            </div>
          </div>
          <form onSubmit={onSubmit(transcription.id)} className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-600">{t('transcriptions.user')}</h3>
              <textarea
                {...register('sentenceuser')}
                defaultValue={transcription.sentencelocal}
                className="w-full p-2 border rounded text-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {t('actions.save')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteId(transcription.id)}
                disabled={deleteMutation.isPending}
              >
                {t('actions.delete')}
              </Button>
            </div>
          </form>
          <audio controls className="mt-4 w-full">
            <source src={transcription.audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {t('pagination.previous')}
        </Button>
        <span className="flex items-center text-gray-600">
          {t('pagination.page')} {page}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.data.length || data.data.length < ITEMS_PER_PAGE}
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