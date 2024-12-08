FROM node:22 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm","run", "start"] 