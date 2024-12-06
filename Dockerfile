# Gunakan image Node.js versi LTS terbaru
FROM node:22

# Install dependencies untuk Electron dan alat tambahan
RUN apt-get update && apt-get install -yq --no-install-recommends \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 \
    libxss1 libasound2 libdrm2 libgbm1 xvfb wine \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Tambahkan user non-root
RUN useradd -m -d /custom-app custom-app
WORKDIR /custom-app

# Salin aplikasi ke dalam container
COPY . .
COPY package.json package-lock.json ./ 

# Konfigurasi npm cache dan direktori global untuk mencegah masalah izin
RUN npm config set cache /tmp/npm-cache
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Environment variables untuk Electron
ENV ELECTRON_RUN_AS_NODE=false
ENV ELECTRON_IS_DEV=false

# Instal dependensi sebagai user root
USER root
RUN npm install -g npm@latest && npm cache clean --force
RUN chown -R custom-app:custom-app /custom-app

# Instal dependensi aplikasi sebagai user non-root
USER custom-app
RUN npm install && npm run postinstall || echo "Postinstall script failed, continuing..."

# Electron-specific permissions
USER root
RUN chown root /custom-app/node_modules/electron/dist/chrome-sandbox && \
    chmod 4755 /custom-app/node_modules/electron/dist/chrome-sandbox
USER custom-app

# Expose port aplikasi
EXPOSE 3000

# Start aplikasi menggunakan xvfb untuk mendukung GUI di lingkungan headless
CMD bash -c "Xvfb :99 -screen 0 1024x768x16 & export DISPLAY=:99 && npm run start"