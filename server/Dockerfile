# --- Stage 1: Build Dependencies ---
# This stage installs all dependencies and then discards the dev ones.
FROM node:22-alpine AS dependencies

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install both production and development dependencies
# We do this here to leverage Docker's caching layer
RUN npm install

# --- Stage 2: Production Image ---
# This stage creates the final, lean production image.
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the production dependencies from the 'dependencies' stage
COPY --from=dependencies /app/package*.json ./
RUN npm install --omit=dev

# Copy your application source code from the host machine
COPY . .

# Set the environment variable to production
ENV NODE_ENV=production

# Expose the port your application listens on
EXPOSE 3000

# Specify the command to run your application
# Use the start script defined in your package.json
CMD ["npm", "run", "start"]