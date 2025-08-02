# --- Stage 1: Build Dependencies and Transpile TypeScript ---
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the build tools necessary for compiling native dependencies
# This is the key change to fix the installation of packages like @google-cloud/vision
RUN apk add --no-cache python3 g++ make

# Install both production and development dependencies, needed for 'tsc'
RUN npm install

# Copy all source files
COPY . .

# Run the TypeScript build to create the 'dist' directory
RUN npm run build

# --- Stage 2: Production Image ---
# This stage creates the final, lean production image.
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built TypeScript files from the 'dist' folder
COPY --from=build /app/dist ./dist

# Set the environment variable to production
ENV NODE_ENV=production

# Expose the port your application listens on
EXPOSE 3000

# Specify the command to run your application
# The start script now correctly points to the built JS file
CMD ["npm", "run", "start"]