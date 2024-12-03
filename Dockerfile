FROM node:22

# Install dependencies for Electron
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libdrm2 libgbm1 xvfb \
    -yq --no-install-suggests --no-install-recommends \
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

ENV ELECTRON_ENABLE_LOGGING=true
ENV ELECTRON_RUN_AS_NODE=true

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

# Start the application with xvfb
CMD bash -c "Xvfb :99 -screen 0 1024x768x16 & export DISPLAY=:99 && npm run start"
