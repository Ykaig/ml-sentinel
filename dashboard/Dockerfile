# dashboard/Dockerfile

# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the final, small production image
FROM node:20-alpine
WORKDIR /app

# Copy the standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
# Copy the static assets
COPY --from=builder /app/.next/static ./.next/static
# Copy the public assets
COPY --from=builder /app/public ./public

# Expose port 3000 (default for Next.js)
EXPOSE 3000

ENV PORT=3000

# Command to start the Node.js server
CMD ["node", "server.js"]