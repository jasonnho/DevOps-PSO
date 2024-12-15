# Base image
FROM node:20-alpine3.18 as builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build project
RUN npm run build

# Final image
FROM node:20-alpine3.18
WORKDIR /app

# Copy only the necessary files
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install production dependencies (optional if needed)
RUN npm install --legacy-peer-deps --omit=dev

# Install serve globally
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
