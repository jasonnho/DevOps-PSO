FROM node:20-alpine3.18 as builder

WORKDIR /src
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm","run"]  