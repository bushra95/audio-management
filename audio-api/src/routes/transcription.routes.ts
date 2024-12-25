import { Router } from 'express';
import { TranscriptionController } from '../controllers/transcription.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
const transcriptionController = TranscriptionController.getInstance();

router.get('/', 
  requireAuth,
  async (req, res) => {
    await transcriptionController.getTranscriptions(req, res);
  }
);

router.put('/:id', 
  requireAuth,
  async (req, res) => {
    await transcriptionController.updateTranscription(req, res);
  }
);

router.delete('/:id', 
  requireAuth,
  async (req, res) => {
    await transcriptionController.deleteTranscription(req, res);
  }
);

export const transcriptionRoutes = router; 