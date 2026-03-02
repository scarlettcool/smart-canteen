FROM node:20-alpine
WORKDIR /app

# Copy package files and install ALL dependencies (including dev for nest build)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npx nest build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3038

# Start the app
CMD ["node", "dist/main"]
