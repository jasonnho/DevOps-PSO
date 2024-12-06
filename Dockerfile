# Build Stage
FROM node:18-slim

# Set working directory
WORKDIR /app

COPY package*.json ./
# Copy source code
COPY . .

RUN npm --version

# Install dependencies for Electron
RUN apt-get update && apt-get install -y \
    libgtk-3-0 libnotify4 libnss3 libxss1 libasound2 \ 
    libxtst6 libx11-xcb-dev libdrm2 libgbm1 xvfb xauth \ 
    wine64 \
    ca-certificates \ 
    && apt-get clean && rm -rf /var/lib/apt/lists/*


# Install dependencies and build production
RUN npm install --legacy-peer-deps

RUN npm run postinstall && npm run pre-electron-pack && npm run electron-pack

# Install Electron globally
RUN npm install -g electron

# Expose ports if necessary (optional)
EXPOSE 3000

RUN chown root /app/node_modules/electron/dist/chrome-sandbox
RUN chmod 4755 /app/node_modules/electron/dist/chrome-sandbox


# Run the application
CMD ["electron", "/app/dist/linux-unpacked/resources/app.asar", "--no-sandbox"]
