import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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

  // Create 10 test transcriptions with real audio URLs
  const transcriptions = [
    {
      sentencelocal: "The weather is beautiful today",
      sentenceapi: "The weather is beautiful today",
      sentenceuser: "The weather is very beautiful today",
      audioUrl: "https://audio-samples.github.io/samples/mp3/amazing_grace.mp3"
    },
    {
      sentencelocal: "I need to go to the grocery store",
      sentenceapi: "I need to go to the grocery store",
      sentenceuser: "I have to go to the grocery store",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
    },
    {
      sentencelocal: "The meeting starts at 9 AM",
      sentenceapi: "The meeting starts at nine AM",
      sentenceuser: "The meeting begins at 9 AM",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav"
    },
    {
      sentencelocal: "Please remember to lock the door",
      sentenceapi: "Please remember to lock the door",
      sentenceuser: "Don't forget to lock the door",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav"
    },
    {
      sentencelocal: "The train arrives in 10 minutes",
      sentenceapi: "The train arrives in ten minutes",
      sentenceuser: "The train comes in 10 minutes",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther60.wav"
    },
    {
      sentencelocal: "Can you help me with this task?",
      sentenceapi: "Can you help me with this task",
      sentenceuser: "Could you help me with this task?",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav"
    },
    {
      sentencelocal: "The restaurant opens at noon",
      sentenceapi: "The restaurant opens at 12 PM",
      sentenceuser: "The restaurant opens at midday",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav"
    },
    {
      sentencelocal: "Don't forget your umbrella",
      sentenceapi: "Do not forget your umbrella",
      sentenceuser: "Remember to take your umbrella",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav"
    },
    {
      sentencelocal: "The movie starts in 5 minutes",
      sentenceapi: "The movie starts in five minutes",
      sentenceuser: "The film begins in 5 minutes",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/taunt.wav"
    },
    {
      sentencelocal: "Please turn off your phone",
      sentenceapi: "Please turn off your phone",
      sentenceuser: "Please switch off your phone",
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/spacemusic.wav"
    }
  ];

  for (const transcription of transcriptions) {
    await prisma.transcription.create({ data: transcription });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 