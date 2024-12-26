import { prisma } from '../lib/prisma';
import { Transcription } from '../types/transcription';
import { Prisma } from '@prisma/client';

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
    search: string = ''
  ): Promise<{ data: Transcription[]; total: number }> {
    try {
      const skip = (page - 1) * 10;
      const where: Prisma.transcriptionWhereInput = search
        ? {
            OR: [
              { sentencelocal: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { sentenceapi: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { sentenceuser: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {};

      const [data, total] = await Promise.all([
        prisma.transcription.findMany({
          where,
          skip,
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.transcription.count({ where }),
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