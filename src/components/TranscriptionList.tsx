import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';

interface Transcription {
  id: string;
  sentencelocal: string;
  sentenceapi: string;
  sentenceuser: string | null;
  audioUrl: string;
  createdAt: string;
}

export function TranscriptionList() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const { data } = await apiClient.get('/transcriptions');
        setTranscriptions(data.data || []);
      } catch (error) {
        console.error('Failed to fetch transcriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscriptions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transcriptions</h1>
      <div className="space-y-4">
        {transcriptions.map((transcription) => (
          <div key={transcription.id} className="border p-4 rounded-lg">
            <p>Local: {transcription.sentencelocal}</p>
            <p>API: {transcription.sentenceapi}</p>
            <p>User: {transcription.sentenceuser || 'Not edited'}</p>
            <audio src={transcription.audioUrl} controls className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
