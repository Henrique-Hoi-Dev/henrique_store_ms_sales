FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3002

# Set environment variables
ENV NODE_ENV=production
ENV TZ="America/Sao_Paulo"

# Start the application
CMD ["node", "server.js"]
