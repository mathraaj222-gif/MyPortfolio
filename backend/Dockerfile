FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine

WORKDIR /app

# We only need package.json for starting the app (if relying on npm start)
COPY package*.json ./

# Copy compiled source code and Prisma client/modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose port (Cloud Run sets PORT env var automatically)
ENV PORT=5000
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
