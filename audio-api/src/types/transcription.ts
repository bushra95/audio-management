export interface Transcription {
  id: string;
  sentencelocal: string;
  sentenceapi: string;
  sentenceuser?: string | null;
  audioUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TranscriptionResponse {
  data: Transcription[];
  total: number;
}

export interface ErrorResponse {
  message: string;
} 