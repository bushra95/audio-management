export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface Transcription {
  id: string;
  sentencelocal: string;
  sentenceapi: string;
  sentenceuser: string;
  audioUrl: string;
}

export interface TranscriptionResponse {
  data: Transcription[];
  total: number;
}

export interface ErrorResponse {
  message: string;
} 