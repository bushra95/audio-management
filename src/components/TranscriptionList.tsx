import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { TranscriptionService } from '../services/transcription.service';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './ui/button';

const transcriptionService = TranscriptionService.getInstance();
const ITEMS_PER_PAGE = 5;

export function TranscriptionList() {
  const { t }: { t: TFunction } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['transcriptions', page],
    queryFn: () => transcriptionService.getTranscriptions(page)
  });

  useEffect(() => {
    if (data) {
      const initialValues: Record<string, string> = {};
      data.data.forEach(t => {
        initialValues[t.id] = t.sentenceuser || t.sentencelocal;
      });
      setEditValues(initialValues);
    }
  }, [data]);

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

  const handleEdit = (id: string, value: string) => {
    setEditValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = (id: string) => {
    const newValue = editValues[id];
    if (newValue !== undefined) {
      updateMutation.mutate({ id, sentenceuser: newValue });
    }
  };

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

  const hasNextPage = data?.data.length === ITEMS_PER_PAGE && data.total > page * ITEMS_PER_PAGE;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={t('errors.loading')} />;
  if (!data?.data.length) return <div>{t('transcriptions.noData')}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-20">
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
              <div className="mb-4">
                <h3 className="font-medium text-gray-600">{t('transcriptions.user')}</h3>
                <textarea
                  className="w-full p-2 border rounded text-gray-700"
                  value={editValues[transcription.id] || transcription.sentenceuser || transcription.sentencelocal}
                  onChange={(e) => handleEdit(transcription.id, e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSave(transcription.id)}
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
              <audio controls className="mt-4 w-full">
                <source src={transcription.audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Displaying {data.data.length} records of {data.total} total
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t('pagination.previous')}
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Page {page}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
              >
                {t('pagination.next')}
              </Button>
            </div>
          </div>
        </div>
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