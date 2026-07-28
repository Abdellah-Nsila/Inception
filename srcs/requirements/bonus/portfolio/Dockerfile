FROM alpine:3.23

RUN apk add --no-cache nodejs npm

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies including vite
RUN npm ci

# Copy source code
COPY . .

# Build production assets for the /portfolio/ subpath
RUN npx vite build --base=/portfolio/

EXPOSE 5173

# Serve static preview directly
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173", "--base=/portfolio/"]