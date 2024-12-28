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
import { useForm, } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Transcription } from '../services/transcription.service';
import { TranscriptionResponse } from '../services/transcription.service';

const transcriptionService = TranscriptionService.getInstance();
const ITEMS_PER_PAGE = 5;

interface TranscriptionForm {
  transcriptions: {
    id: string;
    sentenceuser: string;
  }[];
}

export function TranscriptionList() {
  const { t }: { t: TFunction } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const formSchema = z.object({
    transcriptions: z.array(
      z.object({
        id: z.string(),
        sentenceuser: z.string().min(1, t('transcriptions.validation.required'))
      })
    )
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['transcriptions', page],
    queryFn: () => transcriptionService.getTranscriptions(page),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const form = useForm<TranscriptionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transcriptions: []
    }
  });

  

  useEffect(() => {
    if (data) {
      const formValues = data.data.map((t: Transcription) => ({
        id: t.id,
        sentenceuser: t.sentenceuser || t.sentencelocal || ''
      }));
      form.reset({ transcriptions: formValues });
    }
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: ({ id, sentenceuser }: { id: string; sentenceuser: string }) =>
      transcriptionService.updateTranscription(id, sentenceuser),
    onMutate: async ({ id, sentenceuser }) => {
      await queryClient.cancelQueries({ queryKey: ['transcriptions'] });
      const previousData = queryClient.getQueryData(['transcriptions', page]);

      // Optimistically update
      queryClient.setQueryData<TranscriptionResponse>(['transcriptions', page], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(item => 
            item.id === id ? { ...item, sentenceuser } : item
          )
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      showToast(t('transcriptions.updateSuccess'), 'success');
      queryClient.invalidateQueries({ 
        queryKey: ['transcriptions'],
        exact: false,
        type: 'all'
      });
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : t('errors.saving'), 'error');
    }
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

  const hasNextPage = data?.data.length === ITEMS_PER_PAGE && data.total > page * ITEMS_PER_PAGE;

  const onSubmit = (id: string) => {
    const transcription = form.getValues().transcriptions.find(t => t.id === id);
    if (transcription && transcription.sentenceuser.trim()) {
      updateMutation.mutate({
        id,
        sentenceuser: transcription.sentenceuser
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={t('errors.loading')} />;
  if (!data?.data.length) return <div>{t('transcriptions.noData')}</div>;

  const start = (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(page * ITEMS_PER_PAGE, data.total);
  const totalPages = Math.ceil(data.total / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="container mx-auto px-4 py-6 space-y-4">
          {data.data.map((transcription: Transcription, index: number) => (
            <form key={transcription.id} onSubmit={form.handleSubmit(() => onSubmit(transcription.id))}>
              <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100/50">
                    <h3 className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2 flex items-center">
                      <span className="bg-white/80 px-3 py-1 rounded-md shadow-sm">Audio Recording</span>
                    </h3>
                    <audio controls className="w-full h-8">
                      <source src={transcription.audioUrl} type="audio/mpeg" />
                    </audio>
                  </div>

                  <div>
                    <h3 className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2 flex items-center">
                      <span className="bg-blue-50 px-3 py-1 rounded-md shadow-sm">{t('transcriptions.original')}</span>
                    </h3>
                    <div className="text-sm p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50/30 text-gray-700 border border-blue-100/50 shadow-sm">
                      {transcription.sentencelocal}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2 flex items-center">
                      <span className="bg-blue-50 px-3 py-1 rounded-md shadow-sm">{t('transcriptions.api')}</span>
                    </h3>
                    <div className="text-sm p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50/30 text-gray-700 border border-blue-100/50 shadow-sm">
                      {transcription.sentenceapi}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2 flex items-center">
                      <span className="bg-blue-50 px-3 py-1 rounded-md shadow-sm">{t('transcriptions.user')}</span>
                    </h3>
                    <textarea
                      {...form.register(`transcriptions.${index}.sentenceuser`)}
                      className="w-full text-sm p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="submit" 
                      disabled={updateMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                    >
                      {t('save')}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setDeleteId(transcription.id)}
                      disabled={deleteMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="px-4 py-2 bg-indigo-50 rounded-lg text-indigo-700 font-semibold">
                {start}-{end}
              </div>
              <span className="text-gray-500">of</span>
              <div className="px-4 py-2 bg-indigo-50 rounded-lg text-indigo-700 font-semibold">
                {data.total}
              </div>
              <span className="text-gray-500">items</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="hidden sm:flex w-10 h-10 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              >
                ⟪
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              >
                ←
              </Button>

              <div className="flex items-center gap-1.5 mx-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNumber = idx + 1;
                  const isCurrentPage = pageNumber === page;
                  const isNearCurrentPage = Math.abs(pageNumber - page) <= 1;
                  const isEndPage = pageNumber === 1 || pageNumber === totalPages;
                  
                  if (isNearCurrentPage || isEndPage) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={isCurrentPage ? "default" : "outline"}
                        onClick={() => setPage(pageNumber)}
                        className={`w-10 h-10 font-medium transition-all duration-200 ${
                          isCurrentPage 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                            : 'border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  } else if (
                    (pageNumber === page - 2 && page > 3) ||
                    (pageNumber === page + 2 && page < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNumber} className="w-10 text-center text-gray-400">
                        •••
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
                className="w-10 h-10 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              >
                →
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="hidden sm:flex w-10 h-10 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              >
                ⟫
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
