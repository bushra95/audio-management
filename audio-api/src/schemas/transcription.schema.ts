import { z } from 'zod';

export const updateTranscriptionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    sentenceuser: z.string().min(1),
  }),
});

export const getTranscriptionsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number).pipe(z.number().min(1)),
    search: z.string().optional(),
  }),
});

export const deleteTranscriptionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
}); 