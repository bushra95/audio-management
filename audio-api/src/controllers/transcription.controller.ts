import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class TranscriptionController {
  constructor() {
    this.getTranscriptions = this.getTranscriptions.bind(this);
    this.createTranscription = this.createTranscription.bind(this);
    this.updateTranscription = this.updateTranscription.bind(this);
    this.deleteTranscription = this.deleteTranscription.bind(this);
  }

  async getTranscriptions(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = 5; // 5 items per page
      const skip = (page - 1) * limit;

      const [transcriptions, total] = await Promise.all([
        prisma.transcription.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.transcription.count()
      ]);

      res.json({
        data: transcriptions,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error('Get transcriptions error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch transcriptions',
        data: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }
  }

  async createTranscription(req: Request, res: Response) {
    try {
      const transcription = await prisma.transcription.create({
        data: {
          sentencelocal: req.body.sentencelocal,
          sentenceapi: req.body.sentenceapi,
          sentenceuser: req.body.sentenceuser || null,
          audioUrl: req.body.audioUrl
        }
      });
      res.status(201).json(transcription);
    } catch (error) {
      console.error('Create transcription error:', error);
      res.status(500).json({ error: 'Failed to create transcription' });
    }
  }

  async updateTranscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('Updating transcription:', { id, body: req.body });

      const existing = await prisma.transcription.findUnique({
        where: { id }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Transcription not found' });
      }

      const transcription = await prisma.transcription.update({
        where: { id },
        data: {
          sentenceuser: req.body.sentenceuser
        }
      });

      console.log('Updated transcription:', transcription);
      res.json(transcription);
    } catch (error) {
      console.error('Update transcription error:', error);
      res.status(500).json({ error: 'Failed to update transcription' });
    }
  }

  async deleteTranscription(req: Request, res: Response) {
    try {
      await prisma.transcription.delete({
        where: { id: req.params.id }
      });
      res.status(200).json({ message: 'Transcription deleted' });
    } catch (error) {
      console.error('Delete transcription error:', error);
      res.status(500).json({ error: 'Failed to delete transcription' });
    }
  }
} 