# Stage 1: Build the frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build static assets
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev && npm install -g tsx

# Copy the server, data, and built frontend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/data ./data
COPY --from=builder /app/src/types.ts ./src/types.ts

# Set environment to production
ENV NODE_ENV=production

# The application runs on port 3000
EXPOSE 3000

# Start the server
CMD ["tsx", "server.ts"]
