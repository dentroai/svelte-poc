# ---- Builder Stage ----
# Use the official Bun image
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb (Bun's lockfile)
COPY package.json bun.lockb* ./

# Install all dependencies using Bun (includes devDependencies)
# --frozen-lockfile ensures we use the exact versions from the lockfile
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate SvelteKit types and sync config files
RUN bunx svelte-kit sync

# Allow ANTHROPIC_API_KEY to be passed as a build argument
ARG ANTHROPIC_API_KEY_ARG

# Set the environment variable during the build phase
ENV ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY_ARG

# Build the SvelteKit application using Bun
# Your build script is "vite build" according to package.json
# The build process requires static private env vars to be present
RUN bun run build

# ---- Production Stage ----
# Use a slim Bun image for the final stage
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /app

# Copy essential files from the builder stage:
# - The built application (usually in 'build' directory)
# - Production node_modules (installed below)
# - package.json (needed for bun install --production and by the node adapter)
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb* ./bun.lockb

# Install ONLY production dependencies using Bun
RUN bun install --production --frozen-lockfile

# Expose the port the SvelteKit app runs on (default is 3000, change if needed)
# The runtime PORT environment variable will be used by adapter-node
ENV PORT=3000
EXPOSE 3000

# The command to run the application
# SvelteKit adapter-node outputs a standard Node server entrypoint in the build directory
# We use 'bun run' to execute the Node.js entrypoint
# The ANTHROPIC_API_KEY environment variable needs to be provided at runtime here
CMD ["bun", "run", "build/index.js"]