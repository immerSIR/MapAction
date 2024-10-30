# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application (if needed)
# RUN npm run build

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 