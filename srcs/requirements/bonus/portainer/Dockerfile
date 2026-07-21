FROM alpine:3.19

# Install dependencies needed to download and extract Portainer
RUN apk add --no-cache curl tar ca-certificates

WORKDIR /opt

# Download the official compiled Portainer binary for Linux x86_64
RUN curl -sSL https://github.com/portainer/portainer/releases/download/2.20.3/portainer-2.20.3-linux-amd64.tar.gz | tar -xz

WORKDIR /opt/portainer

EXPOSE 9000

# Run Portainer in standalone mode
ENTRYPOINT ["/opt/portainer/portainer"]
