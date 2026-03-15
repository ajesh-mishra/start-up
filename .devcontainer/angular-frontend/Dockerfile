FROM mcr.microsoft.com/devcontainers/typescript-node:22-bullseye

RUN npm install -g @angular/cli@21 \
    && npm cache clean --force

WORKDIR /workspace

ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    NODE_OPTIONS=--max-old-space-size=4096

EXPOSE 4200