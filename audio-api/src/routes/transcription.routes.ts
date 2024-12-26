import { Router } from 'express';
import { TranscriptionController } from '../controllers/transcription.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  getTranscriptionsSchema,
  updateTranscriptionSchema,
  deleteTranscriptionSchema,
} from '../schemas/transcription.schema';

const router = Router();
const transcriptionController = TranscriptionController.getInstance();

router.get('/',
  requireAuth,
  validate(getTranscriptionsSchema),
  async (req, res) => {
    await transcriptionController.getTranscriptions(req, res);
  }
);

router.put('/:id',
  requireAuth,
  validate(updateTranscriptionSchema),
  async (req, res) => {
    await transcriptionController.updateTranscription(req, res);
  }
);

router.delete('/:id',
  requireAuth,
  validate(deleteTranscriptionSchema),
  async (req, res) => {
    await transcriptionController.deleteTranscription(req, res);
  }
);

export const transcriptionRoutes = router; 