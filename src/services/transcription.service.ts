import { apiClient } from '../lib/api-client';
import { Transcription, TranscriptionResponse } from '../types/transcription';

export class TranscriptionService {
  private static instance: TranscriptionService;

  private constructor() {}

  static getInstance(): TranscriptionService {
    if (!TranscriptionService.instance) {
      TranscriptionService.instance = new TranscriptionService();
    }
    return TranscriptionService.instance;
  }

  async getTranscriptions(
    page: number = 1,
    search: string = '',
    sortField: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<TranscriptionResponse> {
    const response = await apiClient.get<TranscriptionResponse>('/transcriptions', {
      params: { page, search, sortField, sortOrder }
    });
    return response.data;
  }

  async updateTranscription(id: string, sentenceuser: string): Promise<Transcription> {
    const response = await apiClient.put<Transcription>(`/transcriptions/${id}`, {
      sentenceuser
    });
    return response.data;
  }

  async deleteTranscription(id: string): Promise<void> {
    await apiClient.delete(`/transcriptions/${id}`);
  }
} 