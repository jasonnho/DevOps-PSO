FROM node:22

# Install dependencies needed for Electron
RUN apt-get update && apt-get install -yq --no-install-suggests --no-install-recommends \
    git \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxtst6 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxss1 \
    libasound2 \
    libdrm2 \
    libgbm1 \
    xvfb \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Add a non-root user
RUN useradd -m -d /custom-app custom-app
WORKDIR /custom-app
COPY . .

# Configure npm cache location
RUN npm config set cache /tmp/npm-cache

# Set npm global directory to avoid permission issues
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Install dependencies as root
USER root
RUN npm cache clean --force

# Set ownership of the working directory and node_modules
RUN mkdir -p /custom-app/node_modules && chown -R custom-app:custom-app /custom-app

# Install npm dependencies as the non-root user
USER custom-app
RUN npm install

# Electron-specific permissions
USER root
RUN chown root /custom-app/node_modules/electron/dist/chrome-sandbox
RUN chmod 4755 /custom-app/node_modules/electron/dist/chrome-sandbox

# Switch back to the non-root user
USER custom-app

EXPOSE 3000

# Use xvfb-run to run the Electron application in a headless environment
CMD xvfb-run --server-args="-screen 0 1024x768x24" npm run start