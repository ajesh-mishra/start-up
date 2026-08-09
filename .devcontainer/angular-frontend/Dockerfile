FROM mcr.microsoft.com/devcontainers/typescript-node:24-bullseye

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*
    
ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    NODE_OPTIONS=--max-old-space-size=4096
    
WORKDIR /workspace

EXPOSE 4200