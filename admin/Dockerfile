FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Accept the API URL and Admin JWT Token as build arguments
ARG VITE_API_URL
ARG VITE_ADMIN_TOKEN

# Inject them as environment variables for the Vite build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ADMIN_TOKEN=$VITE_ADMIN_TOKEN

# Copy source code and build the Vite React admin app
COPY . .
RUN npm run build

# Stage 2: Serve the app with a lightweight production server
FROM node:22-alpine

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy compiled production assets from builder stage
COPY --from=builder /app/dist ./dist

# Define default PORT (3001 for admin dashboard)
ENV PORT=3001

EXPOSE $PORT

# Start serving static files with SPA routing fallback (-s)
CMD serve -s dist -l $PORT
