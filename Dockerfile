FROM node:20-alpine3.18 as builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Run tests
RUN npm run test

# Build the application if tests pass
RUN npm run build

FROM node:20-alpine3.18
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Install serve globally for serving the built application
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]