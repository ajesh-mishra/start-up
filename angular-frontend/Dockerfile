# --- Stage 1: Build Stage ---
FROM node:22 AS build

WORKDIR /workspace

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production


# --- Stage 2: Runtime Stage (Nginx) ---
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /workspace/dist/app/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]