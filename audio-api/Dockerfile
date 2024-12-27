FROM node:18-alpine

WORKDIR /app

# Install build dependencies including OpenSSL
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy tsconfig
COPY tsconfig.json ./

# Copy source code
COPY src ./src

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 5001

# Start the server
CMD ["npm", "start"] 