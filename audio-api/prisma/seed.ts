import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user if doesn't exist
  const testEmail = 'test@example.com';
  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword
      }
    });
  }

  // Delete existing transcriptions
  await prisma.transcription.deleteMany();

  // Create 10 test transcriptions
  await prisma.transcription.createMany({
    data: [
      {
        sentencelocal: "The quick brown fox jumps over the lazy dog.",
        sentenceapi: "The quick brown fox jumped over the lazy dog.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio1.mp3"
      },
      {
        sentencelocal: "She sells seashells by the seashore.",
        sentenceapi: "She sells sea shells by the sea shore.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio2.mp3"
      },
      {
        sentencelocal: "How much wood would a woodchuck chuck?",
        sentenceapi: "How much wood would a wood chuck chuck?",
        sentenceuser: null,
        audioUrl: "https://example.com/audio3.mp3"
      },
      {
        sentencelocal: "Peter Piper picked a peck of pickled peppers.",
        sentenceapi: "Peter Piper picked a pack of pickled peppers.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio4.mp3"
      },
      {
        sentencelocal: "I scream, you scream, we all scream for ice cream.",
        sentenceapi: "I scream you scream we all scream for ice cream.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio5.mp3"
      },
      {
        sentencelocal: "A journey of a thousand miles begins with a single step.",
        sentenceapi: "A journey of a thousand miles begins with one step.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio6.mp3"
      },
      {
        sentencelocal: "All that glitters is not gold.",
        sentenceapi: "All that glitters isn't gold.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio7.mp3"
      },
      {
        sentencelocal: "Actions speak louder than words.",
        sentenceapi: "Actions speak louder than words.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio8.mp3"
      },
      {
        sentencelocal: "Better late than never, but never late is better.",
        sentenceapi: "Better late than never but never late is better.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio9.mp3"
      },
      {
        sentencelocal: "Every cloud has a silver lining.",
        sentenceapi: "Every cloud has a silver lining.",
        sentenceuser: null,
        audioUrl: "https://example.com/audio10.mp3"
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 