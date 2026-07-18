FROM alpine:3.23

RUN apk update && apk add --no-cache nodejs npm

WORKDIR /app

# Copy dependency files first to leverage Docker caching layers
COPY package*.json ./
RUN npm install

# Copy the rest of your portfolio source code
COPY . .

# Compile the production assets during image creation
RUN npx vite build --base=/portfolio/

# Build and preview using Vite's built-in engine.
# We pass the --base flag directly here so you don't have to change your vite.config.ts!
EXPOSE 5173

# Ultra-simple runtime command: Just serve the pre-built files
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173", "--base=/portfolio/"]