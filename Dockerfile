FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application (including compiled JS)
COPY . .

# Expose port (Railway will use this)
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]