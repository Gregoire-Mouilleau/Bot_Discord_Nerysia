FROM node:18-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install --production

# Start the application
CMD ["npm", "start"]