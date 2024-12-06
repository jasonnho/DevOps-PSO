# Build Stage
FROM node:18-slim

# Set working directory
WORKDIR /app

COPY package*.json ./
# Copy source code
COPY . .

RUN npm --version

# Install dependencies for Electron
RUN apt-get update && apt-get install \ git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libgbm1 \ -yq --no-install-suggests --no-install-recommends \ && apt-get clean && rm -rf /var/lib/apt/lists/*


# Install dependencies and build production
RUN npm install --legacy-peer-deps

RUN npm run postinstall && npm run pre-electron-pack && npm run electron-pack

# Install Electron globally
RUN npm install -g electron

# Expose ports if necessary (optional)
EXPOSE 3000

# Run the application
CMD ["electron", "/app/dist/linux-unpacked/resources/app.asar"]
