# Gunakan image Node.js versi LTS terbaru
FROM node:22

# Install dependensi sistem yang diperlukan untuk Electron
RUN apt-get update && apt-get install -y --no-install-recommends \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libdrm2 libgbm1 xvfb libva-drm2 libva-x11-2 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Tambahkan user non-root untuk menjalankan aplikasi
RUN useradd -m -d /custom-app custom-app
WORKDIR /custom-app

# Salin seluruh file aplikasi ke dalam container
COPY . .

# Konfigurasikan cache npm agar berada di lokasi yang dapat diakses
RUN npm config set cache /tmp/npm-cache

# Atur environment variables untuk Electron
ENV ELECTRON_RUN_AS_NODE=false
ENV ELECTRON_IS_DEV=false
ENV DISPLAY=:99

# Set izin untuk direktori kerja dan dependensi
RUN mkdir -p /custom-app/node_modules \
    && chown -R custom-app:custom-app /custom-app

# Install dependensi dengan user non-root
USER custom-app
RUN npm install --unsafe-perm

# Lakukan instalasi global Electron untuk menghindari konflik
USER root
RUN npm install -g electron --unsafe-perm \
    && chown -R custom-app:custom-app /usr/local/lib/node_modules/electron

# Set izin spesifik untuk Chrome sandbox
RUN chmod 4755 /custom-app/node_modules/electron/dist/chrome-sandbox

# Ganti kembali ke user non-root
USER custom-app

# Buka port 3000
EXPOSE 3000

# Jalankan aplikasi menggunakan Xvfb
CMD bash -c "Xvfb :99 -screen 0 1024x768x16 & npm run start"