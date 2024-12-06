# Build Stage
FROM node:18-slim AS build-stage

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

RUN npm --version

# Install dependencies and build production
RUN npm install
RUN npm run dev

# Production Stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy built files from build stage
COPY --from=build-stage /app/dist/linux-unpacked/resources /app

# Install dependencies for Electron
# Install dependencies for Electron
RUN apt-get update && apt-get install -y \
    libgtk-3-0 libnotify4 libnss3 libxss1 libasound2 \
    libxtst6 libx11-xcb-dev libdrm2 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


# Install Electron globally
RUN npm install -g electron

# Expose ports if necessary (optional)
EXPOSE 3000

# Run the application
CMD ["electron", "/app/app.asar"]
