FROM node:18-alpine

WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies with npm install instead of npm ci
RUN npm install --production

# Copy the rest of the application
COPY . .

# Start the application
CMD ["npm", "start"]