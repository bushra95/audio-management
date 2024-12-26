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
          select: {
            id: true,
            sentencelocal: true,
            sentenceapi: true,
            sentenceuser: true,
            audioUrl: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: [
            { updatedAt: 'desc' },
            { id: 'asc' }
          ],
        }),
        prisma.transcription.count()
      ]);

      const formattedData = data.map(item => ({
        ...item,
        sentenceuser: item.sentenceuser || ''
      }));

      return { data: formattedData, total };
    } catch (error) {
      console.error('Error in getTranscriptions:', error);
      throw error;
    }
  }

  async updateTranscription(id: string, sentenceuser: string): Promise<Transcription> {
    try {
      return await prisma.transcription.update({
        where: { id },
        data: { sentenceuser },
      });
    } catch (error) {
      console.error('Error in updateTranscription:', error);
      throw error;
    }
  }

  async deleteTranscription(id: string): Promise<void> {
    try {
      await prisma.transcription.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error in deleteTranscription:', error);
      throw error;
    }
  }
}
