# Base image
FROM node:20-alpine3.18 as builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:20-alpine3.18
WORKDIR /app
COPY --from=builder /app/dist ./dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]