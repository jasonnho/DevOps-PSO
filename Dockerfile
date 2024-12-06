FROM node:22

# Install dependencies for Electron
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libdrm2 libgbm1 \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Add a non-root user
RUN useradd -m -d /custom-app custom-app
WORKDIR /custom-app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./ 

# Debug to check if package.json is copied
RUN ls -la

# Copy the rest of the application
COPY . .

# Install npm dependencies
RUN npm install

# Debug to ensure other files are copied
RUN ls -la

# Fix permissions for Electron chrome-sandbox binary AFTER npm install
USER root
RUN chown root:root /custom-app/node_modules/electron/dist/chrome-sandbox && \
    chmod 4755 /custom-app/node_modules/electron/dist/chrome-sandbox

# Set npm cache location
RUN npm config set cache /tmp/npm-cache

# Set npm global directory to avoid permission issues
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Set ownership of the working directory and node_modules
RUN mkdir -p /custom-app/node_modules && chown -R custom-app:custom-app /custom-app

# Switch back to the non-root user
USER custom-app

# Expose port for the application
EXPOSE 3000

# Start the application
CMD npm run start