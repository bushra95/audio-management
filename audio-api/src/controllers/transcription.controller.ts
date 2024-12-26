import { Request, Response } from 'express';
import { TranscriptionService } from '../services/transcription.service';
import { z } from 'zod';

const updateSchema = z.object({
  sentenceuser: z.string()
});

export class TranscriptionController {
  private static instance: TranscriptionController;
  private transcriptionService: TranscriptionService;

  private constructor() {
    this.transcriptionService = TranscriptionService.getInstance();
  }

  static getInstance(): TranscriptionController {
    if (!TranscriptionController.instance) {
      TranscriptionController.instance = new TranscriptionController();
    }
    return TranscriptionController.instance;
  }

  async getTranscriptions(req: Request, res: Response): Promise<void> {
    try {
      const { page } = req.query;
      const result = await this.transcriptionService.getTranscriptions(
        Number(page) || 1
      );
      res.json(result);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ message: 'Failed to fetch transcriptions' });
    }
  }

  async updateTranscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { sentenceuser } = updateSchema.parse(req.body);
      const transcription = await this.transcriptionService.updateTranscription(id, sentenceuser);
      res.json(transcription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteTranscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.transcriptionService.deleteTranscription(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 