#!/bin/sh
npx prisma db push --accept-data-loss
npx prisma db seed
npm start 