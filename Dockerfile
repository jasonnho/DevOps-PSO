FROM node:18-slim

# Install dependencies needed for Electron
RUN apt-get update && apt-get install -yq \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libdrm2 libgbm1 xvfb xauth \
    --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Add a non-root user
WORKDIR /app
COPY . .
RUN chown -R node /app

USER node
RUN npm install --legacy-peer-deps

# Electron-specific permissions
USER root
RUN chown root /app/node_modules/electron/dist/chrome-sandbox
RUN chmod 4755 /app/node_modules/electron/dist/chrome-sandbox

# Switch back to the non-root user
USER node
CMD ["xvfb-run", "--server-args=-screen 0 1024x768x24", "npm", "run", "dev"]
