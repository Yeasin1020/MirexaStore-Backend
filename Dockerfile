# 1️⃣ Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev for TypeScript build)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# 2️⃣ Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start server
CMD ["node", "./dist/server.js"]
