FROM node:22-alpine

WORKDIR /app

# Install build dependencies if needed (pdf-parse might require some dependencies)
# Running npm install
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose server port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
