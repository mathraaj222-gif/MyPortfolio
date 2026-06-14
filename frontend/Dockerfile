FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build the Vite React app
COPY . .
# Note: For Vite, you must inject environment variables like VITE_API_BASE_URL during the build process
RUN npm run build

# Stage 2: Serve the app
FROM node:22-alpine

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist

# Cloud Run automatically assigns the PORT environment variable
ENV PORT=8080
EXPOSE $PORT

# Start serving the static files on the assigned port
CMD serve -s dist -l $PORT
