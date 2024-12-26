import { prisma } from '../lib/prisma';
import { Transcription } from '../types/transcription';

export class TranscriptionService {
  private static instance: TranscriptionService;

  private constructor() {}

  static getInstance(): TranscriptionService {
    if (!TranscriptionService.instance) {
      TranscriptionService.instance = new TranscriptionService();
    }
    return TranscriptionService.instance;
  }

  async getTranscriptions(page: number = 1): Promise<{ data: Transcription[]; total: number }> {
    try {
      const take = 5;
      const skip = (page - 1) * take;

      const [data, total] = await Promise.all([
        prisma.transcription.findMany({
          skip,
          take,
          orderBy: { id: 'asc' },
        }),
        prisma.transcription.count()
      ]);

      return { data, total };
    } catch (error) {
      console.error('Error in getTranscriptions:', error);
      throw error;
    }
  }

  async updateTranscription(id: string, sentenceuser: string): Promise<Transcription> {
    return prisma.transcription.update({
      where: { id },
      data: { sentenceuser }
    });
  }

  async deleteTranscription(id: string): Promise<void> {
    await prisma.transcription.delete({
      where: { id }
    });
  }
} 