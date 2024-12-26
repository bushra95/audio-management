import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword
    }
  });

  // Create test transcriptions
  await prisma.transcription.createMany({
    data: [
      {
        sentencelocal: 'Test sentence 1',
        sentenceapi: 'API transcription 1',
        sentenceuser: 'User transcription 1',
        audioUrl: 'https://example.com/audio1.mp3'
      },
      {
        sentencelocal: 'Test sentence 2',
        sentenceapi: 'API transcription 2',
        sentenceuser: 'User transcription 2',
        audioUrl: 'https://example.com/audio2.mp3'
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