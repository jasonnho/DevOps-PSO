FROM node:18-slim

WORKDIR /src
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm","run"]