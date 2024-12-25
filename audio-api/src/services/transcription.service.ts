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

  async getTranscriptions(page: number = 1, limit: number = 10): Promise<{ data: Transcription[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.$queryRaw<Transcription[]>`
        SELECT * FROM "transcription"
        ORDER BY "createdAt" DESC
        LIMIT ${limit}
        OFFSET ${skip}
      `,
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "transcription"
      `.then(result => Number(result[0].count))
    ]);

    return { data, total };
  }

  async updateTranscription(id: string, sentenceuser: string): Promise<Transcription> {
    return prisma.$queryRaw<Transcription>`
      UPDATE "transcription"
      SET "sentenceuser" = ${sentenceuser}
      WHERE id = ${id}
      RETURNING *
    `;
  }

  async deleteTranscription(id: string): Promise<void> {
    await prisma.$executeRaw`
      DELETE FROM "transcription"
      WHERE id = ${id}
    `;
  }
} 