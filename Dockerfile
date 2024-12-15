# Base image
FROM node:20-alpine3.18 as builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build project
RUN npm run build

# Final image
FROM node:20-alpine3.18
WORKDIR /app

# Copy build output and source files for testing
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/vitest.config.js ./vitest.config.js

# Install dependencies (production + testing)
RUN npm install --legacy-peer-deps

# Install serve globally
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]